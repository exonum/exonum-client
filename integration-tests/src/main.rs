// Copyright 2018 The Exonum Team
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! Rocket-powered web service implementing CRUD operations on a `ProofMapIndex`.

#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate exonum_derive;
#[macro_use]
extern crate failure;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate serde_derive;

use exonum::{
    crypto::{gen_keypair_from_seed, Hash, PublicKey, Seed},
    storage::{Database, MapProof, MemoryDB, ProofMapIndex},
};
use failure::Error;
use rand::{seq::SliceRandom, RngCore, SeedableRng};
use rocket::{
    config::{Config, Environment},
    http::RawStr,
    request::{Form, FromParam},
    response::status::BadRequest,
    State,
};
use rocket_contrib::json::Json;
use uuid::Uuid;
use rand::prelude::StdRng;

pub mod proto;

const INDEX_NAME: &str = "wallets";

#[derive(Serialize, Deserialize, Clone, Debug, ProtobufConvert)]
#[exonum(pb = "proto::Wallet")]
pub struct Wallet {
    /// Public key of the wallet owner.
    pub pub_key: PublicKey,
    /// Name of the wallet owner.
    pub name: String,
    /// Current balance.
    pub balance: u64,
    /// Unique ID
    pub uniq_id: String,
}

impl Wallet {
    fn new(pub_key: &PublicKey, name: &str, balance: u64, uniq_id: Uuid) -> Self {
        Self {
            pub_key: *pub_key,
            name: name.to_owned(),
            balance,
            uniq_id: uniq_id.to_string(),
        }
    }
}

#[derive(Debug, Serialize)]
struct WalletProof {
    proof: MapProof<PublicKey, Wallet>,
    trusted_root: Hash,
}

#[derive(Debug, Serialize)]
struct IndexInfo {
    size: usize,
}

#[derive(Debug)]
struct PublicKeyParam(PublicKey);

impl<'r> FromParam<'r> for PublicKeyParam {
    type Error = Error;

    fn from_param(param: &'r RawStr) -> Result<Self, Self::Error> {
        PublicKey::from_slice(&hex::decode(param).unwrap())
            .map(PublicKeyParam)
            .ok_or_else(|| format_err!("Couldn't create PublicKey"))
    }
}

#[derive(Debug)]
struct PublicKeyList(Vec<PublicKey>);

impl<'r> FromParam<'r> for PublicKeyList {
    type Error = Error;

    fn from_param(param: &'r RawStr) -> Result<Self, Self::Error> {
        if param.is_empty() {
            return Ok(PublicKeyList(vec![]));
        }

        let mut keys = Vec::new();
        for part in param.split(',') {
            keys.push(
                PublicKey::from_slice(&hex::decode(part).map_err(|e| format_err!("{}", e))?)
                    .ok_or_else(|| format_err!("Couldn't create PublicKey"))?,
            );
        }
        Ok(PublicKeyList(keys))
    }
}

#[get("/<pubkey>")]
fn get_wallet(db: State<MemoryDB>, pubkey: PublicKeyParam) -> Json<WalletProof> {
    let index = ProofMapIndex::new(INDEX_NAME, db.snapshot());

    Json(WalletProof {
        proof: index.get_proof(pubkey.0),
        trusted_root: index.merkle_root(),
    })
}

#[get("/batch/<pubkeys>")]
fn get_wallets(db: State<MemoryDB>, pubkeys: PublicKeyList) -> Json<WalletProof> {
    let index = ProofMapIndex::new(INDEX_NAME, db.snapshot());

    Json(WalletProof {
        proof: index.get_multiproof(pubkeys.0),
        trusted_root: index.merkle_root(),
    })
}

#[post("/", format = "application/json", data = "<wallet>")]
fn create_wallet(db: State<MemoryDB>, wallet: Json<Wallet>) -> Json<IndexInfo> {
    let mut fork = db.fork();
    let info = {
        let mut index = ProofMapIndex::new(INDEX_NAME, &mut fork);
        let pub_key = wallet.pub_key;
        index.put(&pub_key, wallet.into_inner());
        let size = index.iter().count();
        IndexInfo { size }
    };
    db.merge(fork.into_patch()).unwrap();
    Json(info)
}

#[put("/", format = "application/json", data = "<wallets>")]
fn create_wallets(db: State<MemoryDB>, wallets: Json<Vec<Wallet>>) -> Json<IndexInfo> {
    let mut fork = db.fork();
    let info = {
        let mut index = ProofMapIndex::new(INDEX_NAME, &mut fork);
        for wallet in wallets.into_inner() {
            let pub_key = wallet.pub_key;
            index.put(&pub_key, wallet);
        }
        let size = index.iter().count();
        IndexInfo { size }
    };
    db.merge(fork.into_patch()).unwrap();
    Json(info)
}
//
#[delete("/")]
fn reset(db: State<MemoryDB>) {
    let mut fork = db.fork();
    {
        let mut index: ProofMapIndex<_, PublicKey, Wallet> =
            ProofMapIndex::new(INDEX_NAME, &mut fork);
        index.clear();
    }
    db.merge(fork.into_patch()).unwrap();
}

#[derive(Debug, FromForm)]
struct RandomParams {
    seed: u64,
    wallets: usize,
    wallets_in_proof: Option<usize>,
    missing_keys: Option<usize>,
}

#[get("/random?<params..>")]
fn generate_proof(params: Form<RandomParams>) -> Result<Json<WalletProof>, BadRequest<String>> {
    let wallets_in_proof = params
        .wallets_in_proof
        .unwrap_or_else(|| params.wallets / 4);
    if wallets_in_proof > params.wallets {
        return Err(BadRequest(Some(
            "more wallets in proof than wallets".to_string(),
        )));
    }
    let missing_keys = params.missing_keys.unwrap_or(wallets_in_proof);
    let mut rng: StdRng = SeedableRng::seed_from_u64(params.seed);
    let db = MemoryDB::new();
    let mut fork = db.fork();
    let mut index: ProofMapIndex<_, PublicKey, Wallet> = ProofMapIndex::new(INDEX_NAME, &mut fork);

    let wallets = (0..params.wallets)
        .map(|_| {
            let mut seed = [0u8; 32];
            rng.fill_bytes(&mut seed);
            let (pub_key, _) = gen_keypair_from_seed(&Seed::new(seed));
            let uuid = Uuid::new_v4();
            Wallet::new(&pub_key, &pub_key.to_string()[..8], rng.next_u64(), uuid)
        })
        .collect::<Vec<_>>();

    let mut wallet_keys = wallets
        .choose_multiple(&mut rng, wallets_in_proof)
        .into_iter()
        .map(|wallet| wallet.pub_key)
        .collect::<Vec<_>>();
    let missing_keys = (0..missing_keys).map(|_| {
        let mut seed = [0u8; 32];
        rng.fill_bytes(&mut seed);
        gen_keypair_from_seed(&Seed::new(seed)).0
    });
    wallet_keys.extend(missing_keys);

    for wallet in wallets {
        let key = wallet.pub_key;
        index.put(&key, wallet);
    }

    Ok(Json(WalletProof {
        proof: index.get_multiproof(wallet_keys),
        trusted_root: index.merkle_root(),
    }))
}

fn config() -> Config {
    Config::build(Environment::Development)
        .address("127.0.0.1")
        .port(8000)
        .unwrap()
}

fn main() {
    rocket::custom(config())
        .mount(
            "/",
            routes![
                generate_proof,
                get_wallets,
                get_wallet,
                create_wallet,
                create_wallets,
                reset,
            ],
        )
        .manage(MemoryDB::new())
        .launch();
}
