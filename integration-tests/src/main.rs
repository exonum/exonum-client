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

use exonum::crypto::{gen_keypair_from_seed, Hash, PublicKey, Seed, HASH_SIZE};
use exonum_derive::*;
use exonum_merkledb::{
    Database, ListProof, MapProof, ObjectHash, ProofListIndex, ProofMapIndex, TemporaryDB,
};
use failure::{format_err, Error};
use rand::{seq::SliceRandom, Rng, RngCore, SeedableRng};
use rand_chacha::ChaChaRng;
use rocket::{
    config::{Config, Environment},
    http::RawStr,
    request::{Form, FromParam},
    response::status::BadRequest,
    State,
};
use rocket_codegen::*;
use rocket_contrib::json::Json;
use serde_derive::*;
use uuid::{Builder as UuidBuilder, Uuid};

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
fn get_wallet(db: State<TemporaryDB>, pubkey: PublicKeyParam) -> Json<WalletProof> {
    let snapshot = db.snapshot();
    let index = ProofMapIndex::new(INDEX_NAME, &snapshot);
    Json(WalletProof {
        proof: index.get_proof(pubkey.0),
        trusted_root: index.object_hash(),
    })
}

#[get("/batch/<pubkeys>")]
fn get_wallets(db: State<TemporaryDB>, pubkeys: PublicKeyList) -> Json<WalletProof> {
    let snapshot = db.snapshot();
    let index = ProofMapIndex::new(INDEX_NAME, &snapshot);
    Json(WalletProof {
        proof: index.get_multiproof(pubkeys.0),
        trusted_root: index.object_hash(),
    })
}

#[post("/", format = "application/json", data = "<wallet>")]
fn create_wallet(db: State<TemporaryDB>, wallet: Json<Wallet>) -> Json<IndexInfo> {
    let fork = db.fork();
    let info = {
        let mut index = ProofMapIndex::new(INDEX_NAME, &fork);
        let pub_key = wallet.pub_key;
        index.put(&pub_key, wallet.into_inner());
        let size = index.iter().count();
        IndexInfo { size }
    };
    db.merge(fork.into_patch()).unwrap();
    Json(info)
}

#[put("/", format = "application/json", data = "<wallets>")]
fn create_wallets(db: State<TemporaryDB>, wallets: Json<Vec<Wallet>>) -> Json<IndexInfo> {
    let fork = db.fork();
    let info = {
        let mut index = ProofMapIndex::new(INDEX_NAME, &fork);
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

#[delete("/")]
fn reset(db: State<TemporaryDB>) {
    let fork = db.fork();
    {
        let mut index: ProofMapIndex<_, PublicKey, Wallet> = ProofMapIndex::new(INDEX_NAME, &fork);
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
    let mut rng = ChaChaRng::seed_from_u64(params.seed);
    let db = TemporaryDB::new();
    let fork = db.fork();
    let wallet_keys = {
        let mut index: ProofMapIndex<_, PublicKey, Wallet> = ProofMapIndex::new(INDEX_NAME, &fork);

        let wallets = (0..params.wallets)
            .map(|_| {
                let mut seed = [0u8; 32];
                rng.fill_bytes(&mut seed);
                let (pub_key, _) = gen_keypair_from_seed(&Seed::new(seed));
                let uuid = UuidBuilder::from_bytes(rng.gen()).build();
                Wallet::new(
                    &pub_key,
                    &pub_key.to_string()[..8],
                    u64::from(rng.next_u32()),
                    uuid,
                )
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
        wallet_keys
    };

    db.merge(fork.into_patch()).unwrap();
    let snapshot = db.snapshot();
    let index: ProofMapIndex<_, PublicKey, Wallet> = ProofMapIndex::new(INDEX_NAME, &snapshot);
    Ok(Json(WalletProof {
        proof: index.get_multiproof(wallet_keys),
        trusted_root: index.object_hash(),
    }))
}

#[derive(Debug, FromForm)]
struct RandomListParams {
    seed: u64,
    count: u64,
    start: Option<u64>,
    end: Option<u64>,
}

#[derive(Debug, Serialize)]
struct HashListProof {
    proof: ListProof<Hash>,
    trusted_root: Hash,
}

#[get("/random?<params..>")]
fn generate_list_proof(
    params: Form<RandomListParams>,
) -> Result<Json<HashListProof>, BadRequest<String>> {
    let start_index = params.start.unwrap_or_default();
    if start_index >= params.count {
        return Err(BadRequest(Some(
            "start index exceeds list length".to_string(),
        )));
    }
    let end_index = params.end.unwrap_or(params.count);
    if end_index <= start_index {
        return Err(BadRequest(Some(
            "end index is greater than start index".to_string(),
        )));
    }

    let mut rng = ChaChaRng::seed_from_u64(params.seed);
    let db = TemporaryDB::new();
    let fork = db.fork();
    {
        let mut index: ProofListIndex<_, Hash> = ProofListIndex::new(INDEX_NAME, &fork);
        index.extend((0..params.count).map(|_| {
            let mut bytes = [0; HASH_SIZE];
            rng.fill_bytes(&mut bytes[..]);
            Hash::new(bytes)
        }));
    }

    db.merge(fork.into_patch()).unwrap();
    let snapshot = db.snapshot();
    let index: ProofListIndex<_, Hash> = ProofListIndex::new(INDEX_NAME, &snapshot);
    Ok(Json(HashListProof {
        proof: index.get_range_proof(start_index..end_index),
        trusted_root: index.object_hash(),
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
            "/wallets",
            routes![
                generate_proof,
                get_wallets,
                get_wallet,
                create_wallet,
                create_wallets,
                reset,
            ],
        )
        .mount("/hash-list", routes![generate_list_proof])
        .manage(TemporaryDB::new())
        .launch();
}
