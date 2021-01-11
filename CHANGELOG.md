# Changelog

## 0.18.4 (January 11, 2021)

* Update outdated dependencies

## 0.18.3 (February 7, 2020)

* Support of Exonum core 1.0.0

## 0.18.1 (January 24, 2020)

* Support of Exonum core 0.13
* Support of `CallerAddress`
* Support unhashed `MapProof` keys

## 0.16.9 (June 5, 2019)

* Fix axios security alert.
* Fix js-yaml security alert.

## 0.16.6 (Jan 11, 2019)

* Fix links to Exonum documentation. ([#152][pr-152])

## 0.16.5 (Jan 9, 2019)

* Export compiled protobuf stubs as `protocol`. ([#151][pr-151])

## 0.16.4 (Dec 13, 2018)

* Re-build [package-lock.json](package-lock.json) file. ([#146][pr-146])

## 0.16.3 (Dec 13, 2018)

* Fix issue with serialization of empty strings and zero-valued numbers. ([#145][pr-145])

## 0.16.2 (Dec 12, 2018)

* Add proto stubs into npm package. ([#143][pr-143])

## 0.16.1 (Dec 12, 2018)

* Hot fix for broken package install through npm. ([#142][pr-142])

## 0.16.0 (Dec 12, 2018)

* Use protobuf serialization format instead of Exonum serialization format. ([#141][pr-141])
* Rework `newType` method syntax. ([#141][pr-141])
* Rework `newTransaction` method syntax. ([#141][pr-141])
* Rework `verifyBlock` method syntax to return Promise. ([#140][pr-140])

## 0.15.0 (Oct 9, 2018)

* Remove `cutSignature` field from `serialize` method. ([#139][pr-139])
* Rename `newMessage` method into `newTransaction`. ([#139][pr-139])
* Rename `isInstanceofOfNewMessage` method into `isTransaction`. ([#139][pr-139])
* Rename `isInstanceofOfNewArray` method into `isNewArray`. ([#139][pr-139])

## 0.14.0 (Oct 9, 2018)

* Update `Message` and `Precommit` serialization format. Change `newMessage` method syntax. ([#136][pr-136])
Serialization format is changed in next release of the Exonum core.
* Change `send` and `sendQueue` methods syntax. ([#136][pr-136])

## 0.13.0 (Oct 5, 2018)

* Add a new `verifyTable` method to verify table existence in the root tree. ([#138][pr-138])

## 0.12.5 (Oct 5, 2018)

* Change package used to replace library version via Grunt. ([#137][pr-137])

## 0.12.4 (Aug 22, 2018)

* Fix `send` method when `attempts` to be `0`. ([#133][pr-133])

## 0.12.3 (Jul 31, 2018)

* Fix broken `MapProof` in Internet Explorer. ([#126][pr-126])

## 0.12.2 (Jul 25, 2018)

* Rework `send` method to ignore wrong and error responses from blockchain node.
Swap `timeout` and `attempts` parameters int the `send` method.
Allow `attempts` to be `0`. ([#122][pr-122])

## 0.12.1 (Jul 20, 2018)

* Add `timeout` and `attempts` parameters to the `send` method. ([#116][pr-116])

## 0.11.1 (Jul 10, 2018)

* Updated explorer API. ([#114][pr-114])
New web API based on `actix-web` implemented in Exonum core [0.9][release-0.9].

## 0.11.0 (Jul 9, 2018)

* Remove field `schema_version` from `Block` structure. ([#115][pr-115])
Field is removed in Exonum core [0.9][release-0.9].

## 0.10.2 (Jun 29, 2018)

* Rework version import to fix library babelify using webpack. ([#112][pr-112])

## 0.10.1 (Jun 25, 2018)

* Fix serialization of custom data types of 2 and more nesting level. ([#110][pr-110])

## 0.10.0 (Jun 20, 2018)

* Add serialization support of decimal type (`Decimal`). ([#108][pr-108])
Decimal type is added into Exonum core in [0.8][release-0.8].

## 0.9.0 (Jun 18, 2018)

* Add support of `UUID` serialization. ([#97][pr-97])

## 0.8.2 (May 23, 2018)

* Refactor `send` method to remove dependency onto service response format during pushing the transaction. ([#103][pr-103])

## 0.8.1 (May 21, 2018)

* Add a new `version` property to check library version. ([#101][pr-101])
* Cover the case when the blockchain explorer down or return the unexpected response. ([#102][pr-102])

## 0.8.0 (May 15, 2018)

* Add a new `send` method to send transaction to the blockchain. ([#98][pr-98])
* Add a new `sendQueue` method to send multiple transactions to the blockchain. ([#98][pr-98])

## 0.7.3 (Apr 30, 2018)

* Update third-party dependencies to fix potential security vulnerabilities. ([#96][pr-96])

## 0.7.2 (Apr 11, 2018)

* Add static `hash` method to `Exonum.Hash` primitive type. ([#94][pr-94])

## 0.7.1 (Apr 11, 2018)

* Fix missed `MapProof` method. ([#93][pr-93])

## 0.7.0 (Apr 11, 2018)

* Proofs of existence in Merkle Patricia tree have been replaced with Map proof. ([#85][pr-85])
Method is replaced in Exonum core in [0.7][release-0.7].
* `network_id` attribute has been removed from custom data types, transactions and proofs. ([#90][pr-90])
Attribute is removed in Exonum core in [0.7][release-0.7].

## 0.6.1 (Apr 4, 2018)

* Add Uint8Array to Binary String convertor (`uint8ArrayToBinaryString` method). ([#88][pr-88])

## 0.6.0 (Mar 24, 2018)

* Custom data type and transaction no longer require manual `size`, `from` and `to` specification.
This feature is added into Exonum core in [0.5][release-0.5]. ([#84][pr-84])

## 0.5.0 (Mar 6, 2018)

* Add serialization support of floating point types (`Float32` and `Float64`). ([#83][pr-83])
Floating point types are added into Exonum core in [0.5][release-0.5].
* Add [package-lock.json](package-lock.json). ([#81][pr-81])

## 0.4.1 (Feb 23, 2018)

* Fix issue with converting of Binary String to Uint8Array (`binaryStringToUint8Array` method).
This problem also affected the validation of the Merkle Patricia tree. ([#80][pr-80])

## 0.4.0 (Feb 9, 2018)

* Change order of bytes and bits in the `DBKey` keys of Merkle Patricia. ([#78][pr-78])
Order is changed in Exonum core in [0.5][release-0.5].
* Extend usage examples and move them into separate files. ([#77][pr-77])
* Improve tests readability. ([#75][pr-75]) ([#76][pr-76])

## 0.3.0 (Nov 20, 2017)

* Remove `FixedBuffer` type because it is not supported by core by default. ([#71][pr-71])

## 0.2.3 (Sep 27, 2017)

* Fix issue with serialization of transactions. ([#70][pr-70])

## 0.2.2 (Sep 26, 2017)

* Fix issue with serialization of transactions. ([#69][pr-69])

## 0.2.1 (Sep 20, 2017)

* Add serialization support of array type (`newArray`). ([#63][pr-63])
* Change the way of `Array` and `String` serialization. ([#58][pr-58])
* Use `standard` lint rules. ([#64][pr-64]) ([#65][pr-65])

## 0.2.0 (Aug 1, 2017)

* Fix issue with Merkle Patricia Tree processing (`merklePatriciaProof` method). ([#53][pr-53])

## 0.1.1 (Jul 21, 2017)

* Add automatic publishing of new releases into npm via Travis CI. ([#54][pr-54])

## 0.1.0 (Jul 18, 2017)

The first release of JavaScript client for Exonum blockchain,
matching [release 0.1][release-0.1] of the Exonum core repository.

[release-0.9]: https://github.com/exonum/exonum/blob/master/CHANGELOG.md#090---2018-07-19
[release-0.8]: https://github.com/exonum/exonum/blob/master/CHANGELOG.md#08---2018-05-31
[release-0.7]: https://github.com/exonum/exonum/blob/master/CHANGELOG.md#07---2018-04-11
[release-0.5]: https://github.com/exonum/exonum/blob/master/CHANGELOG.md#05---2018-01-30
[release-0.1]: https://github.com/exonum/exonum/releases/tag/v0.1
[pr-152]: https://github.com/exonum/exonum-client/pull/152
[pr-151]: https://github.com/exonum/exonum-client/pull/151
[pr-146]: https://github.com/exonum/exonum-client/pull/146
[pr-145]: https://github.com/exonum/exonum-client/pull/145
[pr-143]: https://github.com/exonum/exonum-client/pull/143
[pr-142]: https://github.com/exonum/exonum-client/pull/142
[pr-141]: https://github.com/exonum/exonum-client/pull/141
[pr-140]: https://github.com/exonum/exonum-client/pull/140
[pr-139]: https://github.com/exonum/exonum-client/pull/139
[pr-138]: https://github.com/exonum/exonum-client/pull/138
[pr-137]: https://github.com/exonum/exonum-client/pull/137
[pr-136]: https://github.com/exonum/exonum-client/pull/136
[pr-133]: https://github.com/exonum/exonum-client/pull/133
[pr-126]: https://github.com/exonum/exonum-client/pull/126
[pr-122]: https://github.com/exonum/exonum-client/pull/122
[pr-116]: https://github.com/exonum/exonum-client/pull/116
[pr-115]: https://github.com/exonum/exonum-client/pull/115
[pr-114]: https://github.com/exonum/exonum-client/pull/114
[pr-112]: https://github.com/exonum/exonum-client/pull/112
[pr-110]: https://github.com/exonum/exonum-client/pull/110
[pr-108]: https://github.com/exonum/exonum-client/pull/108
[pr-103]: https://github.com/exonum/exonum-client/pull/103
[pr-102]: https://github.com/exonum/exonum-client/pull/102
[pr-101]: https://github.com/exonum/exonum-client/pull/101
[pr-98]: https://github.com/exonum/exonum-client/pull/98
[pr-97]: https://github.com/exonum/exonum-client/pull/97
[pr-96]: https://github.com/exonum/exonum-client/pull/96
[pr-94]: https://github.com/exonum/exonum-client/pull/94
[pr-93]: https://github.com/exonum/exonum-client/pull/93
[pr-90]: https://github.com/exonum/exonum-client/pull/90
[pr-88]: https://github.com/exonum/exonum-client/pull/88
[pr-85]: https://github.com/exonum/exonum-client/pull/85
[pr-84]: https://github.com/exonum/exonum-client/pull/84
[pr-83]: https://github.com/exonum/exonum-client/pull/83
[pr-81]: https://github.com/exonum/exonum-client/pull/81
[pr-80]: https://github.com/exonum/exonum-client/pull/80
[pr-78]: https://github.com/exonum/exonum-client/pull/78
[pr-77]: https://github.com/exonum/exonum-client/pull/77
[pr-76]: https://github.com/exonum/exonum-client/pull/76
[pr-75]: https://github.com/exonum/exonum-client/pull/75
[pr-71]: https://github.com/exonum/exonum-client/pull/71
[pr-70]: https://github.com/exonum/exonum-client/pull/70
[pr-69]: https://github.com/exonum/exonum-client/pull/69
[pr-65]: https://github.com/exonum/exonum-client/pull/65
[pr-64]: https://github.com/exonum/exonum-client/pull/64
[pr-63]: https://github.com/exonum/exonum-client/pull/63
[pr-58]: https://github.com/exonum/exonum-client/pull/58
[pr-54]: https://github.com/exonum/exonum-client/pull/54
[pr-53]: https://github.com/exonum/exonum-client/pull/53
