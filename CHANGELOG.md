# Changelog

## 0.8.1 (May 21, 2018)

* Add a new `version` property to check library version. #101
* Cover the case when the blockchain explorer down or return the unexpected response. #102

## 0.8.0 (May 15, 2018)

* Add a new `send` method to send transaction to the blockchain. #98
* Add a new `sendQueue` method to send multiple transactions to the blockchain. #98

## 0.7.3 (Apr 30, 2018)

* Update third-party dependencies to fix potential security vulnerabilities. #96

## 0.7.2 (Apr 11, 2018)

* Add static `hash` method to `Exonum.Hash` primitive type. #94

## 0.7.1 (Apr 11, 2018)

* Fix missed `MapProof` method. #93

## 0.7.0 (Apr 11, 2018)

* Proofs of existence in Merkle Patricia tree have been reworked.
Method is changed in Exonum core in [0.7](https://github.com/exonum/exonum/blob/master/CHANGELOG.md#07---2018-04-11). #85
* `network_id` attribute has been removed from custom data types, transactions and proofs.
Attribute is removed in Exonum core in [0.7](https://github.com/exonum/exonum/blob/master/CHANGELOG.md#07---2018-04-11). #90

## 0.6.1 (Apr 4, 2018)

* Add Uint8Array to Binary String convertor (`uint8ArrayToBinaryString` method). #88

## 0.6.0 (Mar 24, 2018)

* Custom data type and transaction no longer require manual `size`, `from` and `to` specification.
This feature is added into Exonum core in [0.5](https://github.com/exonum/exonum/blob/master/CHANGELOG.md#05---2018-01-30). #84

## 0.5.0 (Mar 6, 2018)

* Add serialization support of floating point types (`Float32` and `Float64`).
Floating point types are added into Exonum core in [0.5](https://github.com/exonum/exonum/blob/master/CHANGELOG.md#05---2018-01-30). #83
* Add [package-lock.json](package-lock.json). #81

## 0.4.1 (Feb 23, 2018)

* Fix issue with converting of Binary String to Uint8Array (`binaryStringToUint8Array` method).
This problem also affected the validation of the Merkle Patricia tree. #80

## 0.4.0 (Feb 9, 2018)

**Light client become compatible with Exonum core starting with version [0.5](https://github.com/exonum/exonum/blob/master/CHANGELOG.md#05---2018-01-30)**.

* Change order of bytes and bits in the `DBKey` keys of Merkle Patricia.
Order is changed in Exonum core in [0.5](https://github.com/exonum/exonum/blob/master/CHANGELOG.md#05---2018-01-30). #78
* Extend usage examples and move them into separate files. #77
* Improve tests readability. #75 #76

## 0.3.0 (Nov 20, 2017)

* Remove `FixedBuffer` type because it is not supported by core by default. #71

## 0.2.3 (Sep 27, 2017)

* Fix issue with serialization of transactions. #70

## 0.2.2 (Sep 26, 2017)

* Fix issue with serialization of transactions. #69

## 0.2.1 (Sep 20, 2017)

* Add serialization support of array type (`newArray`). #63
* Change the way of `Array` and `String` serialization. #58
* Use `standard` lint rules. #64 #65

## 0.2.0 (Aug 1, 2017)

* Fix issue with Merkle Patricia Tree processing (`merklePatriciaProof` method). #53

## 0.1.1 (Jul 21, 2017)

* Add automatic publishing of new releases into npm via Travis CI. #54

## 0.1.0 (Jul 18, 2017)

The first release of JavaScript client for Exonum blockchain,
matching [release 0.1](https://github.com/exonum/exonum/releases/tag/v0.1) of the Exonum core repository.
