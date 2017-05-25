var expect = require('chai').expect;
var Exonum = require('../lib/index');
var fs = require('fs');

describe('Check cryptocurrency functions', function() {

    describe('Check wallet', function() {

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-1.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-2.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-3.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-raw-1.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-raw-2.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data contained utf-8 name, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-utf8-and-raw.json');
            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

    });

    describe('Check transactions', function() {

        it('should create Create Wallet Transaction of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/create-wallet-with-raw.json');
            var TxCreateWallet = Exonum.newMessage({
                size: 40,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40}
                }
            });

            expect(TxCreateWallet.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxCreateWallet)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxCreateWallet, data.transaction.signature, data.transaction.body.pub_key)).to.equal(true);
        });

        it('should create Create Wallet Transaction of class newMessage with UTF-8 encoded name of wallet, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/create-wallet-with-utf8-and-raw.json');
            var TxCreateWallet = Exonum.newMessage({
                size: 40,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40}
                }
            });

            expect(TxCreateWallet.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxCreateWallet)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxCreateWallet, data.transaction.signature, data.transaction.body.pub_key)).to.equal(true);
        });

        it('should create Add Funds Transaction #1 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/charge-with-raw-1.json');
            var TxIssue = Exonum.newMessage({
                size: 48,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                    seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
                }
            });

            expect(TxIssue.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxIssue)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxIssue, data.transaction.signature, data.transaction.body.wallet)).to.equal(true);
        });

        it('should create Add Funds Transaction #2 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/charge-with-raw-2.json');
            var TxIssue = Exonum.newMessage({
                size: 48,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                    seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
                }
            });

            expect(TxIssue.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxIssue)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxIssue, data.transaction.signature, data.transaction.body.wallet)).to.equal(true);
        });

        it('should create Transfer Transaction #1 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/transfer-with-raw-1.json');
            var TxTransfer = Exonum.newMessage({
                size: 80,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                    amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                    seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
                }
            });

            expect(TxTransfer.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxTransfer)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxTransfer, data.transaction.signature, data.transaction.body.from)).to.equal(true);
        });

        it('should create Transfer Transaction #2 of class newMessage, check equality of its serialization and hash, and verify its signature', function() {
            var data = require('./common_data/cryptocurrency-transaction/transfer-with-raw-2.json');
            var TxTransfer = Exonum.newMessage({
                size: 80,
                service_id: 128,
                message_id: data.transaction.message_id,
                signature: data.transaction.signature,
                fields: {
                    from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                    amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                    seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
                }
            });

            expect(TxTransfer.serialize(data.transaction.body)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.transaction.body, TxTransfer)).to.equal(data.hash);

            expect(Exonum.verifySignature(data.transaction.body, TxTransfer, data.transaction.signature, data.transaction.body.from)).to.equal(true);
        });

    });

    describe('Check wallet query', function() {

        var validators = [
            "8db92e93847f66f62f7c0f9f6516ede8c466bf316d78cea23481857c0706823c",
            "9bf83e5fc18432ea36aa222674677f38da1fcf72fc8a5111d382a8b9bc318b6f",
            "b60daa6973aa0f1992d669ed3b7a0c17d6fc315c711f4c8bbe250d5ae1f09f33",
            "2ac0bf3cf5c6a27b0e9705f7890b2f50bc8ad8c304a468f04427aca2086db480"
        ];

        function getTransactionType(transaction) {
            switch (transaction.message_id) {
                case 128:
                    return Exonum.newMessage({
                        size: 80,
                        service_id: 128,
                        message_id: 128,
                        signature: transaction.signature,
                        fields: {
                            from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                            to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                            amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                            seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
                        }
                    });
                    break;
                case 129:
                    return Exonum.newMessage({
                        size: 48,
                        service_id: 128,
                        message_id: 129,
                        signature: transaction.signature,
                        fields: {
                            wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                            amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                            seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
                        }
                    });
                case 130:
                    return Exonum.newMessage({
                        size: 40,
                        service_id: 128,
                        message_id: 130,
                        signature: transaction.signature,
                        fields: {
                            pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                            name: {type: Exonum.String, size: 8, from: 32, to: 40}
                        }
                    });
                    break;
            }
        }

        function getTransationPublicKey(transaction) {
            switch (transaction.message_id) {
                case 128:
                    return transaction.body.from;
                    break;
                case 129:
                    return transaction.body.wallet;
                    break;
                case 130:
                    return transaction.body.pub_key;
                    break;
            }
        }

        function verifyTransaction(transaction, hash) {
            var Type = getTransactionType(transaction);
            var publicKey = getTransationPublicKey(transaction);

            if (Exonum.hash(transaction.body, Type) !== hash) {
                console.error('Wrong transaction hash.');
                return false;
            } else if (!Exonum.verifySignature(transaction.body, Type, transaction.signature, publicKey)) {
                console.error('Wrong transaction signature.');
                return false;
            }

            return true;
        }

        function getObjectLength(obj) {
            var l = 0;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    l++;
                }
            }
            return l;
        }

        function getWallet(query, publicKey) {
            if (!Exonum.verifyBlock(query.block_info, validators)) {
                return undefined;
            }

            var TableKey = Exonum.newType({
                size: 4,
                fields: {
                    service_id: {type: Exonum.Uint16, size: 2, from: 0, to: 2},
                    table_index: {type: Exonum.Uint16, size: 2, from: 2, to: 4}
                }
            });
            var walletsTableData = {
                service_id: 128,
                table_index: 0
            };
            var walletsTableKey = Exonum.hash(walletsTableData, TableKey);
            var walletsTableRootHash = Exonum.merklePatriciaProof(query.block_info.block.state_hash, query.wallet.mpt_proof, walletsTableKey);

            if (walletsTableRootHash === null) {
                console.error('Wallets can not exist.');
                return undefined;
            }

            var Wallet = Exonum.newType({
                size: 88,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_len: {type: Exonum.Uint64, size: 8, from: 48, to: 56},
                    history_hash: {type: Exonum.Hash, size: 32, from: 56, to: 88}
                }
            });

            var wallet = Exonum.merklePatriciaProof(walletsTableRootHash, query.wallet.value, publicKey, Wallet);

            if (wallet === null) {
                // wallet not found
                return null;
            }

            var HashesOftransactions = Exonum.merkleProof(wallet.history_hash, wallet.history_len, query.wallet_history.mt_proof, [0, wallet.history_len]);
            var transactions = query.wallet_history.values;

            if (getObjectLength(transactions) !== getObjectLength(HashesOftransactions)) {
                console.error('Number of transaction hashes is not equal to transactions number.');
                return undefined;
            }

            for (var i in HashesOftransactions) {
                if (!HashesOftransactions.hasOwnProperty(i)) {
                    continue;
                } if (!verifyTransaction(transactions[i], HashesOftransactions[i])) {
                    return undefined;
                }
            }

            return {
                wallet: wallet,
                transactions: transactions
            }
        }

        it('should return null when wallets table is empty', function() {
            var data = require('./common_data/wallet-query/empty-table.json');
            var publicKey = '8f115f2a0d78f1eb102976e62dc8aa3ca7f64329f19331ed346c3d817e51fe52';

            expect(getWallet(data, publicKey)).to.equal(null);
        });

        it('should return null wallet is not found', function() {
            var data = require('./common_data/wallet-query/not-found.json');
            var publicKey = '8f115f2a0d78f1eb102976e62dc8aa3ca7f64329f19331ed346c3d817e51fe52';

            expect(getWallet(data, publicKey)).to.equal(null);
        });

        it('should return object with wallet info and transactions list', function() {
            var data = require('./common_data/wallet-query/found.json');
            var publicKey = 'd51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3';

            expect(getWallet(data, publicKey)).to.deep.equal({
                wallet: {
                    "balance": "4000",
                    "history_hash": "bb3b712721225155810f142f017c42039529b84911f4f08cb61fce2f9063d3ba",
                    "history_len": "4",
                    "name": "Василий Васильевич",
                    "pub_key": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                },
                transactions: [
                    {
                        "body": {
                            "name": "Василий Васильевич",
                            "pub_key": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                        },
                        "message_id": 130,
                        "service_id": 128,
                        "signature": "ddc71ec1d77c49722d4a289a5e44b416607995ed69a94361f2a0522cbfabfbd0800249d49332605d7046274388a0d419a7d57c056f581d2eca183c4c02344408"
                    },
                    {
                        "body": {
                            "amount": "6000",
                            "seed": "15776710045565509997",
                            "wallet": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                        },
                        "message_id": 129,
                        "service_id": 128,
                        "signature": "cb7bb326432d7e4224e30449f0c44e8e7d9a9630d59bdade0a4fb744f1136609cda56ed4c88001941c49f800156f0f4308e7ae2efef203c6aeb160c755828909"
                    },
                    {
                        "body": {
                            "amount": "3000",
                            "from": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3",
                            "seed": "14077233761219583473",
                            "to": "a2cbbf9a067ed4c5bc73f3dc8417bc4cfdf46aaae79548d5b797efe578f56bb4"
                        },
                        "message_id": 128,
                        "service_id": 128,
                        "signature": "6465366bedbf52abd89706fbde85075938c211a664112fe1d3dc728a41184887fb8f2c4cf5d4ce7496fb874c9d54e90fd7799c1f0a9d227ecffcd8ead81bc404"
                    },
                    {
                        "body": {
                            "amount": "1000",
                            "from": "a2cbbf9a067ed4c5bc73f3dc8417bc4cfdf46aaae79548d5b797efe578f56bb4",
                            "seed": "6951267718330218840",
                            "to": "d51a7976869da2b397580b8a709dba0f23e6333960143b022d947a6f09ba56a3"
                        },
                        "message_id": 128,
                        "service_id": 128,
                        "signature": "bf66f40cf041011e7dd53259578dfa3849c1eb62d45191ef96571ccf753750af66c6ebc3fadc88b9943477daeedb022e0012df4716223af68f26f8c064075d04"
                    }
                ]
            });
        });

    });

});
