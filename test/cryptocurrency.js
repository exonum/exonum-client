/* eslint-env node, mocha */

var expect = require('chai').expect;
var Exonum = require('..');

describe('Check cryptocurrency functions', function() {

    describe('Check wallet', function() {

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

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-1.json');

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-2.json');

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-3.json');

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-raw-1.json');

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-raw-2.json');

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data contained utf-8 name, compare its serialized array and compare its hash', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-with-utf8-and-raw.json');

            expect(Wallet.serialize(data.wallet)).to.deep.equal(data.raw);

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

        it('should serialize wallets data and compare its hash with passed', function() {
            var data = require('./common_data/cryptocurrency-wallet/valid-wallet-1.json');

            expect(Exonum.hash(data.wallet, Wallet)).to.equal(data.hash);
        });

    });

    describe('Check wallet query', function() {

        var validators = [
            '79669c80800ca0162ffe76ee793147adbf7128dc6e75c1b94b4b02d7e4d8a441',
            '3d8578be65c4e78e01a0a8270f10ba1e809b4d562a17f7803f20da5928ef1db9',
            '700c733bd8dfd0f3f40f5811bfd681f23e0caada46abb1719fa48d658efa6ef6',
            'd858eaad05d8036dbd679535880eb408c943a34ee006cfa9ab7bd97fade6b200'
        ];
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
        var AddFundsTransactionParams = {
            size: 48,
            service_id: 128,
            message_id: 129,
            fields: {
                wallet: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                amount: {type: Exonum.Int64, size: 8, from: 32, to: 40},
                seed: {type: Exonum.Uint64, size: 8, from: 40, to: 48}
            }
        };
        var CreateWalletTransactionParams = {
            size: 40,
            service_id: 128,
            message_id: 130,
            fields: {
                pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                name: {type: Exonum.String, size: 8, from: 32, to: 40}
            }
        };
        var TransferTransactionParams = {
            size: 80,
            service_id: 128,
            message_id: 128,
            fields: {
                from: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                to: {type: Exonum.PublicKey, size: 32, from: 32, to: 64},
                amount: {type: Exonum.Int64, size: 8, from: 64, to: 72},
                seed: {type: Exonum.Uint64, size: 8, from: 72, to: 80}
            }
        };

        function getTransactionTypeParams(id) {
            switch (id) {
            case 128:
                return new Exonum.newMessage(TransferTransactionParams);
            case 129:
                return new Exonum.newMessage(AddFundsTransactionParams);
            case 130:
                return new Exonum.newMessage(CreateWalletTransactionParams);
            }
        }

        function getWallet(publicKey, data) {
            function getPublicKeyOfTransaction(id, transaction) {
                switch (id) {
                case 128:
                    return transaction.from;
                case 129:
                    return transaction.wallet;
                case 130:
                    return transaction.pub_key;
                }
            }

            // validate block
            if (!Exonum.verifyBlock(data.block_info, validators)) {
                return;
            }

            var block = data.block_info.block;

            // find root hash of table with wallets in the tree of all tables
            var TableKey = Exonum.newType({
                size: 4,
                fields: {
                    service_id: {type: Exonum.Uint16, size: 2, from: 0, to: 2},
                    table_index: {type: Exonum.Uint16, size: 2, from: 2, to: 4}
                }
            });
            var tableKeyData = {
                service_id: 128,
                table_index: 0
            };
            var tableKey = TableKey.hash(tableKeyData);
            var walletsHash = Exonum.merklePatriciaProof(block.state_hash, data.wallet.mpt_proof, tableKey);
            if (walletsHash === null) {
                return;
            }

            // find wallet in the tree of all wallets
            var wallet = Exonum.merklePatriciaProof(walletsHash, data.wallet.value, publicKey, Wallet);
            if (wallet === null) {
                return null;
            }

            // find hashes of all transactions
            var TransactionHash = Exonum.newType({
                size: 33,
                fields: {
                    tx_hash: {type: Exonum.Hash, size: 32, from: 0, to: 32},
                    execution_status: {type: Exonum.Bool, size: 1, from: 32, to: 33}
                }
            });
            var hashes = Exonum.merkleProof(wallet.history_hash, wallet.history_len, data.wallet_history.mt_proof, [0, wallet.history_len], TransactionHash);

            if (data.wallet_history.values.length !== hashes.length) {
                console.error('Number of transaction hashes is not equal to transactions number.');
                return;
            }

            // validate each transaction
            var transactions = [];
            for (var i = 0; i < data.wallet_history.values.length; i++) {
                var transaction = data.wallet_history.values[i];
                var type = getTransactionTypeParams(transaction.message_id);
                var publicKeyOfTransaction = getPublicKeyOfTransaction(transaction.message_id, transaction.body);

                type.signature = transaction.signature;
                transaction.hash = type.hash(transaction.body);
                transaction.status = hashes[i].execution_status;

                if (transaction.hash !== hashes[i].tx_hash) {
                    console.error('Wrong transaction hash.');
                    return;
                } else if (!type.verifySignature(transaction.signature, publicKeyOfTransaction, transaction.body)) {
                    console.error('Wrong transaction signature.');
                    return;
                }

                transactions.push(transaction);
            }

            return {
                wallet: wallet,
                transactions: transactions
            }
        }

        it('should return null if wallet is not found', function() {
            var data = require('./data/cryprocurrency/wallet-query/not-found.json');
            var publicKey = '72a3466b65ed9b5deb868120fc5424312dadf4bfb6258a6be32b051b47604064';

            expect(getWallet(publicKey, data)).to.be.null;
        });

        it('should return wallet info and list of transactions if wallet with single transaction is found', function() {
            var data = require('./data/cryprocurrency/wallet-query/found-empty-wallet.json');
            var publicKey = '72a3466b65ed9b5deb868120fc5424312dadf4bfb6258a6be32b051b47604068';
            var walletData = getWallet(publicKey, data);

            expect(walletData.wallet).to.deep.equal({
                'balance': '0',
                'history_hash': '9d998689eeeee43869b1704942bb21656fc1a15de91c69363f55c680e9e7b888',
                'history_len': '1',
                'name': 'Tina',
                'pub_key': '72a3466b65ed9b5deb868120fc5424312dadf4bfb6258a6be32b051b47604068'
            });
        });

        it('should return wallet info and list of transactions if wallet with multiple transactions is found', function() {
            var data = require('./data/cryprocurrency/wallet-query/found-wallet-multiple-transactions.json');
            var publicKey = '72a3466b65ed9b5deb868120fc5424312dadf4bfb6258a6be32b051b47604068';
            var walletData = getWallet(publicKey, data);

            expect(walletData.wallet).to.deep.equal({
                'balance': '10',
                'history_hash': 'b03f01be436eb85684e23214f7819e766eb6981006664b2d01fe8b7093c09103',
                'history_len': '2',
                'name': 'Tina',
                'pub_key': '72a3466b65ed9b5deb868120fc5424312dadf4bfb6258a6be32b051b47604068'
            });
        });

    });

    describe('Check transaction meta', function() {

        it('should check serialization and calculating of hash', function() {
            var data = require('./common_data/cryptocurrency-tx-meta/sample-1.json');
            var Type = Exonum.newType({
                size: 33,
                fields: {
                    tx_hash: {type: Exonum.Hash, size: 32, from: 0, to: 32},
                    execution_status: {type: Exonum.Bool, size: 1, from: 32, to: 33}
                }
            });

            expect(Type.serialize(data.json)).to.deep.equal(data.raw);

            expect(Type.hash(data.json)).to.equal(data.hash);
        });

        it('should check serialization and calculating of hash', function() {
            var data = require('./common_data/cryptocurrency-tx-meta/sample-2.json');
            var Type = Exonum.newType({
                size: 33,
                fields: {
                    tx_hash: {type: Exonum.Hash, size: 32, from: 0, to: 32},
                    execution_status: {type: Exonum.Bool, size: 1, from: 32, to: 33}
                }
            });

            expect(Type.serialize(data.json)).to.deep.equal(data.raw);

            expect(Type.hash(data.json)).to.equal(data.hash);
        });

    });

});
