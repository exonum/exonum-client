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

extern crate exonum_build;

use exonum_build::{get_exonum_protobuf_files_path, protobuf_generate};

fn main() {
    let exonum_protos = get_exonum_protobuf_files_path();
    protobuf_generate(
        "src/proto",
        &["src/proto", &exonum_protos],
        "protobuf_mod.rs",
    );
}