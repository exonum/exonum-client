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

#![feature(plugin, custom_derive, nll)]
#![plugin(rocket_codegen)]

#[macro_use]
extern crate exonum;
extern crate rand;
extern crate rocket;
extern crate rocket_contrib;
extern crate serde;
#[macro_use]
extern crate serde_derive;

use exonum::{crypto::{self, Hash, PublicKey, Seed},
             storage::{Database, MapProof, MemoryDB, ProofMapIndex}};
use rand::{Rng, SeedableRng, XorShiftRng, seq::sample_slice_ref};
use rocket::{State, config::{Config, Environment}, http::RawStr, request::FromParam,
             response::status::BadRequest};
use rocket_contrib::Json;

use std::str::FromStr;

const INDEX_NAME: &str = "wallets";

encoding_struct! {
    struct Wallet {
        pub_key: &PublicKey,
        name: &str,
        balance: u64,
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
    type Error = <PublicKey as FromStr>::Err;

    fn from_param(param: &'r RawStr) -> Result<Self, Self::Error> {
        <PublicKey as FromStr>::from_str(param).map(PublicKeyParam)
    }
}

#[derive(Debug)]
struct PublicKeyList(Vec<PublicKey>);

impl<'r> FromParam<'r> for PublicKeyList {
    type Error = <PublicKey as FromStr>::Err;

    fn from_param(param: &'r RawStr) -> Result<Self, Self::Error> {
        if param.is_empty() {
            return Ok(PublicKeyList(vec![]));
        }

        let mut keys: Vec<PublicKey> = Vec::new();
        for part in param.split(',') {
            keys.push(PublicKey::from_str(part)?);
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
        let pubkey = wallet.pub_key().clone();
        index.put(&pubkey, wallet.into_inner());

        IndexInfo {
            size: index.iter().count(),
        }
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
            let pubkey = wallet.pub_key().clone();
            index.put(&pubkey, wallet);
        }

        IndexInfo {
            size: index.iter().count(),
        }
    };
    db.merge(fork.into_patch()).unwrap();
    Json(info)
}

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

#[get("/random?<params>")]
fn generate_proof(params: RandomParams) -> Result<Json<WalletProof>, BadRequest<String>> {
    let wallets_in_proof = params
        .wallets_in_proof
        .unwrap_or_else(|| params.wallets / 4);
    if wallets_in_proof > params.wallets {
        return Err(BadRequest(Some(
            "more wallets in proof than wallets".to_string(),
        )));
    }
    let missing_keys = params.missing_keys.unwrap_or(wallets_in_proof);

    let mut rng = XorShiftRng::from_seed([params.seed as u32, (params.seed >> 32) as u32, 0, 0]);
    let db = MemoryDB::new();
    let mut fork = db.fork();
    let mut index: ProofMapIndex<_, PublicKey, Wallet> = ProofMapIndex::new(INDEX_NAME, &mut fork);

    let wallets: Vec<_> = (0..params.wallets)
        .map(|_| {
            let mut seed = [0u8; 32];
            rng.fill_bytes(&mut seed);
            let pubkey = crypto::gen_keypair_from_seed(&Seed::new(seed)).0;

            Wallet::new(&pubkey, &pubkey.to_string()[..8], rng.next_u64())
        })
        .collect();

    let mut wallet_keys: Vec<_> = sample_slice_ref(&mut rng, &wallets, wallets_in_proof)
        .iter()
        .map(|wallet| wallet.pub_key())
        .cloned()
        .collect();
    let missing_keys = (0..missing_keys).map(|_| {
        let mut seed = [0u8; 32];
        rng.fill_bytes(&mut seed);
        crypto::gen_keypair_from_seed(&Seed::new(seed)).0
    });
    wallet_keys.extend(missing_keys);

    for wallet in wallets {
        let key = *wallet.pub_key();
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
    rocket::custom(config(), false)
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
