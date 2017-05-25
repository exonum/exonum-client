var expect = require('chai').expect;
var Exonum = require('../lib/index');

describe('Serialize data into array of 8-bit integers', function() {

    it('should serialize data of newType type and return array of 8-bit integers', function() {
        var Wallet = Exonum.newType({
            size: 80,
            fields: {
                pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                name: {type: Exonum.String, size: 8, from: 32, to: 40},
                balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
            }
        });
        var walletData = {
            pub_key: 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36',
            name: 'Smart wallet',
            balance: 359120,
            history_hash: '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030'
        };

        var buffer = Wallet.serialize(walletData);

        expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116]);
    });

    it('should serialize data of complicated non-fixed newType type and return array of 8-bit integers', function() {
        var User = Exonum.newType({
            size: 16,
            fields: {
                name: {type: Exonum.String, size: 8, from: 0, to: 8},
                surname: {type: Exonum.String, size: 8, from: 8, to: 16}
            }
        });
        var Transaction = Exonum.newType({
            size: 40,
            fields: {
                from: {type: User, size: 16, from: 0, to: 16},
                to: {type: User, size: 16, from: 16, to: 32},
                sum: {type: Exonum.Uint64, size: 8, from: 32, to: 40}
            }
        });
        var transactionData = {
            from: {
                name: 'John',
                surname: 'Doe'
            },
            to: {
                name: 'Steven',
                surname: 'Black'
            },
            sum: 200
        };

        var buffer = Transaction.serialize(transactionData);

        expect(buffer).to.deep.equal([40, 0, 0, 0, 4, 0, 0, 0, 44, 0, 0, 0, 3, 0, 0, 0, 47, 0, 0, 0, 6, 0, 0, 0, 53, 0, 0, 0, 5, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 74, 111, 104, 110, 68, 111, 101, 83, 116, 101, 118, 101, 110, 66, 108, 97, 99, 107]);
    });

    it('should serialize data of complicated fixed newType type and return array of 8-bit integers', function() {
        var Wallet = Exonum.newType({
            size: 16,
            fields: {
                id: {type: Exonum.Uint64, size: 8, from: 0, to: 8},
                balance: {type: Exonum.Uint64, size: 8, from: 8, to: 16}
            }
        });
        var Transaction = Exonum.newType({
            size: 40,
            fields: {
                from: {type: Wallet, size: 16, from: 0, to: 16},
                to: {type: Wallet, size: 16, from: 16, to: 32},
                sum: {type: Exonum.Uint64, size: 8, from: 32, to: 40}
            }
        });
        var transactionData = {
            from: {
                id: 57,
                balance: 500
            },
            to: {
                id: 921,
                balance: 0
            },
            sum: 200
        };

        var buffer = Transaction.serialize(transactionData);

        expect(buffer).to.deep.equal([57, 0, 0, 0, 0, 0, 0, 0, 244, 1, 0, 0, 0, 0, 0, 0, 153, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('should serialize data (with inherited properties that should be ignored) of newType type and return array of 8-bit integers', function() {
        var Wallet = Exonum.newType({
            size: 80,
            fields: {
                pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                name: {type: Exonum.String, size: 8, from: 32, to: 40},
                balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
            }
        });

        function Data() {
            this.pub_key = 'f5864ab6a5a2190666b47c676bcf15a1f2f07703c5bcafb5749aa735ce8b7c36';
            this.name = 'Smart wallet';
            this.balance = 359120;
            this.history_hash = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030';
            return this;
        }

        function DataAncestor() {
            return this;
        }

        DataAncestor.prototype.someMethod = function() {
            return this;
        };

        Data.prototype = Object.create(DataAncestor.prototype);

        var walletData = new Data();

        var buffer = Wallet.serialize(walletData);

        expect(buffer).to.deep.equal([245, 134, 74, 182, 165, 162, 25, 6, 102, 180, 124, 103, 107, 207, 21, 161, 242, 240, 119, 3, 197, 188, 175, 181, 116, 154, 167, 53, 206, 139, 124, 54, 80, 0, 0, 0, 12, 0, 0, 0, 208, 122, 5, 0, 0, 0, 0, 0, 103, 82, 190, 136, 35, 20, 245, 187, 188, 154, 106, 242, 174, 99, 79, 192, 112, 56, 88, 74, 74, 119, 81, 14, 165, 236, 237, 69, 245, 77, 192, 48, 83, 109, 97, 114, 116, 32, 119, 97, 108, 108, 101, 116]);
    });

    it('should return undefined when some data parameters are missed', function() {
        var Wallet = Exonum.newType({
            size: 80,
            fields: {
                pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                name: {type: Exonum.String, size: 8, from: 32, to: 40},
                balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
            }
        });
        var walletData = {fake: 123};
        var buffer = Wallet.serialize(walletData);

        expect(buffer).to.equal(undefined);
    });

});
