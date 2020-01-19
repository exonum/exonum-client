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

use actix_web::{
    error::ErrorBadRequest, http::Method, server, App, Json, Path, Query, Result as ApiResult,
    State,
};
use exonum::{
    crypto::{gen_keypair_from_seed, Hash, PublicKey, Seed, HASH_SIZE},
    merkledb::{access::AccessExt, Database, ListProof, MapProof, ObjectHash, TemporaryDB},
};
use exonum_derive::*;
use exonum_proto::ProtobufConvert;
use rand::{seq::SliceRandom, Rng, RngCore, SeedableRng};
use rand_chacha::ChaChaRng;
use serde_derive::*;
use uuid::{Builder as UuidBuilder, Uuid};

use std::sync::Arc;

pub mod proto;

const INDEX_NAME: &str = "wallets";

#[derive(Serialize, Deserialize, Clone, Debug, BinaryValue, ObjectHash, ProtobufConvert)]
#[protobuf_convert(source = "proto::Wallet")]
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

fn get_wallet(
    db: State<Arc<TemporaryDB>>,
    public_key: Path<PublicKey>,
) -> ApiResult<Json<WalletProof>> {
    let snapshot = db.snapshot();
    let index = snapshot.get_proof_map::<_, PublicKey, Wallet>(INDEX_NAME);
    Ok(Json(WalletProof {
        proof: index.get_proof(public_key.into_inner()),
        trusted_root: index.object_hash(),
    }))
}

fn keys_from_param(param: &str) -> ApiResult<Vec<PublicKey>> {
    if param.is_empty() {
        return Ok(vec![]);
    }

    let mut keys = vec![];
    for part in param.split(',') {
        let bytes = hex::decode(part).map_err(ErrorBadRequest)?;
        let key = PublicKey::from_slice(&bytes)
            .ok_or_else(|| ErrorBadRequest("Couldn't create PublicKey"))?;
        keys.push(key);
    }
    Ok(keys)
}

fn get_wallets(db: State<Arc<TemporaryDB>>, keys: Path<String>) -> ApiResult<Json<WalletProof>> {
    let keys = keys_from_param(&keys.into_inner())?;
    let snapshot = db.snapshot();
    let index = snapshot.get_proof_map::<_, PublicKey, Wallet>(INDEX_NAME);
    Ok(Json(WalletProof {
        proof: index.get_multiproof(keys),
        trusted_root: index.object_hash(),
    }))
}

fn create_wallet(db: State<Arc<TemporaryDB>>, wallet: Json<Wallet>) -> ApiResult<Json<IndexInfo>> {
    let fork = db.fork();
    let info = {
        let mut index = fork.get_proof_map(INDEX_NAME);
        let pub_key = wallet.pub_key;
        index.put(&pub_key, wallet.into_inner());
        let size = index.iter().count();
        IndexInfo { size }
    };
    db.merge(fork.into_patch()).unwrap();
    Ok(Json(info))
}

fn create_wallets(
    db: State<Arc<TemporaryDB>>,
    wallets: Json<Vec<Wallet>>,
) -> ApiResult<Json<IndexInfo>> {
    let fork = db.fork();
    let info = {
        let mut index = fork.get_proof_map(INDEX_NAME);
        for wallet in wallets.into_inner() {
            let pub_key = wallet.pub_key;
            index.put(&pub_key, wallet);
        }
        let size = index.iter().count();
        IndexInfo { size }
    };
    db.merge(fork.into_patch()).unwrap();
    Ok(Json(info))
}

fn reset(db: State<Arc<TemporaryDB>>) -> ApiResult<Json<()>> {
    let fork = db.fork();
    fork.get_proof_map::<_, PublicKey, Wallet>(INDEX_NAME)
        .clear();
    db.merge(fork.into_patch()).unwrap();
    Ok(Json(()))
}

#[derive(Debug, Deserialize)]
struct RandomParams {
    seed: u64,
    wallets: usize,
    #[serde(default)]
    wallets_in_proof: Option<usize>,
    #[serde(default)]
    missing_keys: Option<usize>,
}

fn generate_proof(params: Query<RandomParams>) -> ApiResult<Json<WalletProof>> {
    let wallets_in_proof = params
        .wallets_in_proof
        .unwrap_or_else(|| params.wallets / 4);
    if wallets_in_proof > params.wallets {
        return Err(ErrorBadRequest("more wallets in proof than total wallets"));
    }
    let missing_keys = params.missing_keys.unwrap_or(wallets_in_proof);
    let mut rng = ChaChaRng::seed_from_u64(params.seed);
    let db = TemporaryDB::new();
    let fork = db.fork();
    let wallet_keys = {
        let mut index = fork.get_proof_map::<_, PublicKey, Wallet>(INDEX_NAME);

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
    let index = snapshot.get_proof_map::<_, PublicKey, Wallet>(INDEX_NAME);
    Ok(Json(WalletProof {
        proof: index.get_multiproof(wallet_keys),
        trusted_root: index.object_hash(),
    }))
}

#[derive(Debug, Deserialize)]
struct RandomListParams {
    seed: u64,
    count: u64,
    #[serde(default)]
    start: Option<u64>,
    #[serde(default)]
    end: Option<u64>,
}

#[derive(Debug, Serialize)]
struct HashListProof {
    proof: ListProof<Hash>,
    trusted_root: Hash,
}

fn generate_list_proof(params: Query<RandomListParams>) -> ApiResult<Json<HashListProof>> {
    let start_index = params.start.unwrap_or_default();
    if start_index >= params.count {
        return Err(ErrorBadRequest("start index exceeds list length"));
    }
    let end_index = params.end.unwrap_or(params.count);
    if end_index <= start_index {
        return Err(ErrorBadRequest("end index is greater than start index"));
    }

    let mut rng = ChaChaRng::seed_from_u64(params.seed);
    let db = TemporaryDB::new();
    let fork = db.fork();
    {
        let mut index = fork.get_proof_list::<_, Hash>(INDEX_NAME);
        index.extend((0..params.count).map(|_| {
            let mut bytes = [0; HASH_SIZE];
            rng.fill_bytes(&mut bytes[..]);
            Hash::new(bytes)
        }));
    }

    db.merge(fork.into_patch()).unwrap();
    let snapshot = db.snapshot();
    let index = snapshot.get_proof_list::<_, Hash>(INDEX_NAME);
    Ok(Json(HashListProof {
        proof: index.get_range_proof(start_index..end_index),
        trusted_root: index.object_hash(),
    }))
}

fn create_app(db: Arc<TemporaryDB>) -> App<Arc<TemporaryDB>> {
    App::with_state(db)
        .route("/wallets", Method::POST, create_wallet)
        .route("/wallets", Method::PUT, create_wallets)
        .route("/wallets", Method::DELETE, reset)
        .route("/wallets/random", Method::GET, generate_proof)
        .route("/wallets/{public_key}", Method::GET, get_wallet)
        .route("/wallets/batch/{keys}", Method::GET, get_wallets)
        .route("/hash-list/random", Method::GET, generate_list_proof)
}

fn main() {
    let db = Arc::new(TemporaryDB::new());
    server::new(move || create_app(Arc::clone(&db)))
        .bind("127.0.0.1:8000")
        .unwrap()
        .run();
}
