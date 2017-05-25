var expect = require('chai').expect;
var Exonum = require('../lib/index');

describe('Check cryptography', function() {

    describe('Get SHA256 hash', function() {

        it('should return hash of data of newType type', function() {
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
            var hash = Exonum.hash(walletData, Wallet);

            expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974');
        });

        it('should return hash of data of newType type using built-in method', function() {
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
            var hash = Wallet.hash(walletData);

            expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974');
        });

        it('should return hash of data of newMessage type', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 17,
                status: true
            };
            var hash = Exonum.hash(messageData, CustomMessage);

            expect(hash).to.equal('21fea5e2dbd068fc51efb7ac26ad9a84b6bdd91e80c104e58e93af1ea39fc5d7');
        });

        it('should return hash of data of newMessage type using built-in method', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 17,
                status: true
            };
            var hash = CustomMessage.hash(messageData);

            expect(hash).to.equal('21fea5e2dbd068fc51efb7ac26ad9a84b6bdd91e80c104e58e93af1ea39fc5d7');
        });

        it('should return hash of the array of 8-bit integers', function() {
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
            var hash = Exonum.hash(buffer);

            expect(hash).to.equal('86b47510fbcbc83f9926d8898a57c53662518c97502625a6d131842f2003f974');
        });

        it('should return undefined when data of invalid NewType type', function() {
            var Wallet = Exonum.newType({
                size: 80,
                fields: {
                    pub_key: {type: Exonum.PublicKey, size: 32, from: 0, to: 32},
                    name: {type: Exonum.String, size: 8, from: 32, to: 40},
                    balance: {type: Exonum.Uint64, size: 8, from: 40, to: 48},
                    history_hash: {type: Exonum.Hash, size: 32, from: 48, to: 80}
                }
            });
            var args = [undefined, false, 42, new Date(), []];

            function test(_hash) {
                var hash = Exonum.hash(_hash, Wallet);
                expect(hash).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i])
            }
        });

        it('should return undefined when data of invalid NewMessage type', function() {
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var args = [undefined, false, 42, new Date(), []];

            function test(_hash) {
                var hash = Exonum.hash(_hash, CustomMessage);
                expect(hash).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

    });

    describe('Get ED25519 signature', function() {

        it('should return signature of the data of NewType type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var signature = Exonum.sign(userData, User, secretKey);

            expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e');
        });

        it('should return signature of the data of NewType type using built-in method', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var signature = User.sign(userData, secretKey);

            expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e');
        });

        it('should return signature of the data of NewMessage type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };
            var signature = Exonum.sign(messageData, CustomMessage, secretKey);

            expect(signature).to.equal('4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09');
        });

        it('should return signature of the data of NewMessage type using built-in method', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };
            var signature = CustomMessage.sign(messageData, secretKey);

            expect(signature).to.equal('4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09');
        });

        it('should return signature of the array of 8-bit integers', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var signature = Exonum.sign(buffer, secretKey);

            expect(signature).to.equal('7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e');
        });

        it('should return undefined when the data parameter of wrong NewType type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                sum: 500,
                hash: 'Hello world'
            };
            var signature = Exonum.sign(userData, User, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the data parameter of wrong NewMessage type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var someData = {
                sum: 500,
                hash: 'Hello world'
            };
            var signature = Exonum.sign(someData, CustomMessage, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the type parameter of invalid type', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = {
                alpha: 5
            };
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var signature = Exonum.sign(userData, User, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the secretKey parameter of wrong length', function() {
            var secretKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var signature = Exonum.sign(buffer, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when wrong secretKey parameter', function() {
            var secretKey = '6752ZE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var signature = Exonum.sign(buffer, secretKey);

            expect(signature).to.equal(undefined);
        });

        it('should return undefined when the secretKey parameter of invalid type', function() {
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var args = [true, null, undefined, [], {}, 51, new Date()];

            function test(secretKey) {
                expect(Exonum.sign(buffer, secretKey)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

    });

    describe('Verify signature', function() {

        it('should verify signature of the data of NewType type and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };

            expect(Exonum.verifySignature(userData, User, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the data of NewType type using built-in method and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };

            expect(User.verifySignature(userData, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the data of NewMessage type and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };

            expect(Exonum.verifySignature(messageData, CustomMessage, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the data of NewMessage type using built-in method and return true', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '4006cef1884941850a6b97a64ed7f12d1e1053188618ef71b8c9f87438b943b1969e08011e45db8299bb738fec60c9dcd1936ab9ba44392cacc7f0385f18dd09';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var messageData = {
                name: 'John Doe',
                age: 34,
                balance: 173008,
                status: true
            };

            expect(CustomMessage.verifySignature(messageData, signature, publicKey)).to.equal(true);
        });

        it('should verify signature of the array of 8-bit integers', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '7ccad21d76359c8c3ed1161eb8231edd44a91d53ea468d23f8528e2985e5547f72f98ccc61d96ecad173bdc29627abbf6d46908807f6dd0a0d767ae3887d040e';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(true);
        });

        it('should return undefined when the data parameter is of wrong NewType type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                sum: 500,
                hash: 'Hello world'
            };

            expect(Exonum.verifySignature(userData, User, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the data parameter is of wrong NewMessage type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '24a5224702d670c95a78ef1f753c9e6e698da5b2a2c52dcc51b5bf9e556e717fb763b1a5e78bd39e5369a139ab68ae50dd19a129038e8da3af30985f09549500';
            var CustomMessage = Exonum.newMessage({
                size: 18,
                service_id: 1,
                message_id: 2,
                fields: {
                    name: {type: Exonum.String, size: 8, from: 0, to: 8},
                    age: {type: Exonum.Uint8, size: 1, from: 8, to: 9},
                    balance: {type: Exonum.Uint64, size: 8, from: 9, to: 17},
                    status: {type: Exonum.Bool, size: 1, from: 17, to: 18}
                }
            });
            var someData = {
                sum: 500,
                hash: 'Hello world'
            };

            expect(Exonum.verifySignature(someData, CustomMessage, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the type parameter is of wrong type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '9e0f0122c2963b76ba10842951cd1b67c8197b3f964c34f8b667aa655a7b4a8d844d567698d99de30590fc5002ddb4b9b5927ec05cd73572b972cb6b034cd40b';
            var User = {
                alpha: 3
            };
            var userData = {
                sum: 500,
                hash: 'Hello world'
            };

            expect(Exonum.verifySignature(userData, User, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the signature parameter is of wrong length', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the signature parameter is invalid', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7Z';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the signature parameter is of wrong type', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C36';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var args = [true, null, undefined, [], {}, 51, new Date()];

            function test(signature) {
                expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

        it('should return undefined when the publicKey parameter is of wrong length', function() {
            var publicKey = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the publicKey parameter is invalid', function() {
            var publicKey = 'F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C3Z';
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);

            expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
        });

        it('should return undefined when the publicKey parameter is of wrong type', function() {
            var signature = '6752BE882314F5BBBC9A6AF2AE634FC07038584A4A77510EA5ECED45F54DC030F5864AB6A5A2190666B47C676BCF15A1F2F07703C5BCAFB5749AA735CE8B7C';
            var User = Exonum.newType({
                size: 16,
                fields: {
                    firstName: {type: Exonum.String, size: 8, from: 0, to: 8},
                    lastName: {type: Exonum.String, size: 8, from: 8, to: 16}
                }
            });
            var userData = {
                firstName: 'John',
                lastName: 'Doe'
            };
            var buffer = User.serialize(userData);
            var args = [true, null, undefined, [], {}, 51, new Date()];

            function test(publicKey) {
                expect(Exonum.verifySignature(buffer, signature, publicKey)).to.equal(undefined);
            }

            for (var i in args) {
                test(args[i]);
            }
        });

    });

    describe('Generate key pair', function() {

        it('should generate random key pair of secret and public keys, serialize it and return serialized array', function() {
            var Type = Exonum.newType({
                size: 96,
                fields: {
                    publicKey: {type: Exonum.Hash, size: 32, from: 0, to: 32},
                    secretKey: {type: Exonum.Digest, size: 64, from: 32, to: 96}
                }
            });
            var data = Exonum.keyPair();
            var buffer = Type.serialize(data);

            expect(buffer.length).to.equal(96);
        });

    });

});
