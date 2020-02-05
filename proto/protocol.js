/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.exonum = (function() {
    
        /**
         * Namespace exonum.
         * @exports exonum
         * @namespace
         */
        var exonum = {};
    
        exonum.AdditionalHeaders = (function() {
    
            /**
             * Properties of an AdditionalHeaders.
             * @memberof exonum
             * @interface IAdditionalHeaders
             * @property {exonum.IKeyValueSequence|null} [headers] AdditionalHeaders headers
             */
    
            /**
             * Constructs a new AdditionalHeaders.
             * @memberof exonum
             * @classdesc Represents an AdditionalHeaders.
             * @implements IAdditionalHeaders
             * @constructor
             * @param {exonum.IAdditionalHeaders=} [properties] Properties to set
             */
            function AdditionalHeaders(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AdditionalHeaders headers.
             * @member {exonum.IKeyValueSequence|null|undefined} headers
             * @memberof exonum.AdditionalHeaders
             * @instance
             */
            AdditionalHeaders.prototype.headers = null;
    
            /**
             * Creates a new AdditionalHeaders instance using the specified properties.
             * @function create
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {exonum.IAdditionalHeaders=} [properties] Properties to set
             * @returns {exonum.AdditionalHeaders} AdditionalHeaders instance
             */
            AdditionalHeaders.create = function create(properties) {
                return new AdditionalHeaders(properties);
            };
    
            /**
             * Encodes the specified AdditionalHeaders message. Does not implicitly {@link exonum.AdditionalHeaders.verify|verify} messages.
             * @function encode
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {exonum.IAdditionalHeaders} message AdditionalHeaders message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AdditionalHeaders.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.headers != null && message.hasOwnProperty("headers"))
                    $root.exonum.KeyValueSequence.encode(message.headers, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified AdditionalHeaders message, length delimited. Does not implicitly {@link exonum.AdditionalHeaders.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {exonum.IAdditionalHeaders} message AdditionalHeaders message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AdditionalHeaders.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AdditionalHeaders message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.AdditionalHeaders} AdditionalHeaders
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AdditionalHeaders.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.AdditionalHeaders();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.headers = $root.exonum.KeyValueSequence.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AdditionalHeaders message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.AdditionalHeaders} AdditionalHeaders
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AdditionalHeaders.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AdditionalHeaders message.
             * @function verify
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AdditionalHeaders.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    var error = $root.exonum.KeyValueSequence.verify(message.headers);
                    if (error)
                        return "headers." + error;
                }
                return null;
            };
    
            /**
             * Creates an AdditionalHeaders message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.AdditionalHeaders} AdditionalHeaders
             */
            AdditionalHeaders.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.AdditionalHeaders)
                    return object;
                var message = new $root.exonum.AdditionalHeaders();
                if (object.headers != null) {
                    if (typeof object.headers !== "object")
                        throw TypeError(".exonum.AdditionalHeaders.headers: object expected");
                    message.headers = $root.exonum.KeyValueSequence.fromObject(object.headers);
                }
                return message;
            };
    
            /**
             * Creates a plain object from an AdditionalHeaders message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.AdditionalHeaders
             * @static
             * @param {exonum.AdditionalHeaders} message AdditionalHeaders
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AdditionalHeaders.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.headers = null;
                if (message.headers != null && message.hasOwnProperty("headers"))
                    object.headers = $root.exonum.KeyValueSequence.toObject(message.headers, options);
                return object;
            };
    
            /**
             * Converts this AdditionalHeaders to JSON.
             * @function toJSON
             * @memberof exonum.AdditionalHeaders
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AdditionalHeaders.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AdditionalHeaders;
        })();
    
        exonum.Block = (function() {
    
            /**
             * Properties of a Block.
             * @memberof exonum
             * @interface IBlock
             * @property {number|null} [proposer_id] Block proposer_id
             * @property {number|Long|null} [height] Block height
             * @property {number|null} [tx_count] Block tx_count
             * @property {exonum.crypto.IHash|null} [prev_hash] Block prev_hash
             * @property {exonum.crypto.IHash|null} [tx_hash] Block tx_hash
             * @property {exonum.crypto.IHash|null} [state_hash] Block state_hash
             * @property {exonum.crypto.IHash|null} [error_hash] Block error_hash
             * @property {exonum.IAdditionalHeaders|null} [additional_headers] Block additional_headers
             */
    
            /**
             * Constructs a new Block.
             * @memberof exonum
             * @classdesc Represents a Block.
             * @implements IBlock
             * @constructor
             * @param {exonum.IBlock=} [properties] Properties to set
             */
            function Block(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Block proposer_id.
             * @member {number} proposer_id
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.proposer_id = 0;
    
            /**
             * Block height.
             * @member {number|Long} height
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Block tx_count.
             * @member {number} tx_count
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.tx_count = 0;
    
            /**
             * Block prev_hash.
             * @member {exonum.crypto.IHash|null|undefined} prev_hash
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.prev_hash = null;
    
            /**
             * Block tx_hash.
             * @member {exonum.crypto.IHash|null|undefined} tx_hash
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.tx_hash = null;
    
            /**
             * Block state_hash.
             * @member {exonum.crypto.IHash|null|undefined} state_hash
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.state_hash = null;
    
            /**
             * Block error_hash.
             * @member {exonum.crypto.IHash|null|undefined} error_hash
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.error_hash = null;
    
            /**
             * Block additional_headers.
             * @member {exonum.IAdditionalHeaders|null|undefined} additional_headers
             * @memberof exonum.Block
             * @instance
             */
            Block.prototype.additional_headers = null;
    
            /**
             * Creates a new Block instance using the specified properties.
             * @function create
             * @memberof exonum.Block
             * @static
             * @param {exonum.IBlock=} [properties] Properties to set
             * @returns {exonum.Block} Block instance
             */
            Block.create = function create(properties) {
                return new Block(properties);
            };
    
            /**
             * Encodes the specified Block message. Does not implicitly {@link exonum.Block.verify|verify} messages.
             * @function encode
             * @memberof exonum.Block
             * @static
             * @param {exonum.IBlock} message Block message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Block.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.proposer_id != null && message.hasOwnProperty("proposer_id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.proposer_id);
                if (message.height != null && message.hasOwnProperty("height"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.height);
                if (message.tx_count != null && message.hasOwnProperty("tx_count"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.tx_count);
                if (message.prev_hash != null && message.hasOwnProperty("prev_hash"))
                    $root.exonum.crypto.Hash.encode(message.prev_hash, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.tx_hash != null && message.hasOwnProperty("tx_hash"))
                    $root.exonum.crypto.Hash.encode(message.tx_hash, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.state_hash != null && message.hasOwnProperty("state_hash"))
                    $root.exonum.crypto.Hash.encode(message.state_hash, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.error_hash != null && message.hasOwnProperty("error_hash"))
                    $root.exonum.crypto.Hash.encode(message.error_hash, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.additional_headers != null && message.hasOwnProperty("additional_headers"))
                    $root.exonum.AdditionalHeaders.encode(message.additional_headers, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified Block message, length delimited. Does not implicitly {@link exonum.Block.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.Block
             * @static
             * @param {exonum.IBlock} message Block message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Block.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Block message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.Block
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.Block} Block
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Block.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.Block();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.proposer_id = reader.uint32();
                        break;
                    case 2:
                        message.height = reader.uint64();
                        break;
                    case 3:
                        message.tx_count = reader.uint32();
                        break;
                    case 4:
                        message.prev_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.tx_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.state_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.error_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.additional_headers = $root.exonum.AdditionalHeaders.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Block message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.Block
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.Block} Block
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Block.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Block message.
             * @function verify
             * @memberof exonum.Block
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Block.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.proposer_id != null && message.hasOwnProperty("proposer_id"))
                    if (!$util.isInteger(message.proposer_id))
                        return "proposer_id: integer expected";
                if (message.height != null && message.hasOwnProperty("height"))
                    if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                        return "height: integer|Long expected";
                if (message.tx_count != null && message.hasOwnProperty("tx_count"))
                    if (!$util.isInteger(message.tx_count))
                        return "tx_count: integer expected";
                if (message.prev_hash != null && message.hasOwnProperty("prev_hash")) {
                    var error = $root.exonum.crypto.Hash.verify(message.prev_hash);
                    if (error)
                        return "prev_hash." + error;
                }
                if (message.tx_hash != null && message.hasOwnProperty("tx_hash")) {
                    var error = $root.exonum.crypto.Hash.verify(message.tx_hash);
                    if (error)
                        return "tx_hash." + error;
                }
                if (message.state_hash != null && message.hasOwnProperty("state_hash")) {
                    var error = $root.exonum.crypto.Hash.verify(message.state_hash);
                    if (error)
                        return "state_hash." + error;
                }
                if (message.error_hash != null && message.hasOwnProperty("error_hash")) {
                    var error = $root.exonum.crypto.Hash.verify(message.error_hash);
                    if (error)
                        return "error_hash." + error;
                }
                if (message.additional_headers != null && message.hasOwnProperty("additional_headers")) {
                    var error = $root.exonum.AdditionalHeaders.verify(message.additional_headers);
                    if (error)
                        return "additional_headers." + error;
                }
                return null;
            };
    
            /**
             * Creates a Block message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.Block
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.Block} Block
             */
            Block.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.Block)
                    return object;
                var message = new $root.exonum.Block();
                if (object.proposer_id != null)
                    message.proposer_id = object.proposer_id >>> 0;
                if (object.height != null)
                    if ($util.Long)
                        (message.height = $util.Long.fromValue(object.height)).unsigned = true;
                    else if (typeof object.height === "string")
                        message.height = parseInt(object.height, 10);
                    else if (typeof object.height === "number")
                        message.height = object.height;
                    else if (typeof object.height === "object")
                        message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber(true);
                if (object.tx_count != null)
                    message.tx_count = object.tx_count >>> 0;
                if (object.prev_hash != null) {
                    if (typeof object.prev_hash !== "object")
                        throw TypeError(".exonum.Block.prev_hash: object expected");
                    message.prev_hash = $root.exonum.crypto.Hash.fromObject(object.prev_hash);
                }
                if (object.tx_hash != null) {
                    if (typeof object.tx_hash !== "object")
                        throw TypeError(".exonum.Block.tx_hash: object expected");
                    message.tx_hash = $root.exonum.crypto.Hash.fromObject(object.tx_hash);
                }
                if (object.state_hash != null) {
                    if (typeof object.state_hash !== "object")
                        throw TypeError(".exonum.Block.state_hash: object expected");
                    message.state_hash = $root.exonum.crypto.Hash.fromObject(object.state_hash);
                }
                if (object.error_hash != null) {
                    if (typeof object.error_hash !== "object")
                        throw TypeError(".exonum.Block.error_hash: object expected");
                    message.error_hash = $root.exonum.crypto.Hash.fromObject(object.error_hash);
                }
                if (object.additional_headers != null) {
                    if (typeof object.additional_headers !== "object")
                        throw TypeError(".exonum.Block.additional_headers: object expected");
                    message.additional_headers = $root.exonum.AdditionalHeaders.fromObject(object.additional_headers);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a Block message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.Block
             * @static
             * @param {exonum.Block} message Block
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Block.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.proposer_id = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.height = options.longs === String ? "0" : 0;
                    object.tx_count = 0;
                    object.prev_hash = null;
                    object.tx_hash = null;
                    object.state_hash = null;
                    object.error_hash = null;
                    object.additional_headers = null;
                }
                if (message.proposer_id != null && message.hasOwnProperty("proposer_id"))
                    object.proposer_id = message.proposer_id;
                if (message.height != null && message.hasOwnProperty("height"))
                    if (typeof message.height === "number")
                        object.height = options.longs === String ? String(message.height) : message.height;
                    else
                        object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber(true) : message.height;
                if (message.tx_count != null && message.hasOwnProperty("tx_count"))
                    object.tx_count = message.tx_count;
                if (message.prev_hash != null && message.hasOwnProperty("prev_hash"))
                    object.prev_hash = $root.exonum.crypto.Hash.toObject(message.prev_hash, options);
                if (message.tx_hash != null && message.hasOwnProperty("tx_hash"))
                    object.tx_hash = $root.exonum.crypto.Hash.toObject(message.tx_hash, options);
                if (message.state_hash != null && message.hasOwnProperty("state_hash"))
                    object.state_hash = $root.exonum.crypto.Hash.toObject(message.state_hash, options);
                if (message.error_hash != null && message.hasOwnProperty("error_hash"))
                    object.error_hash = $root.exonum.crypto.Hash.toObject(message.error_hash, options);
                if (message.additional_headers != null && message.hasOwnProperty("additional_headers"))
                    object.additional_headers = $root.exonum.AdditionalHeaders.toObject(message.additional_headers, options);
                return object;
            };
    
            /**
             * Converts this Block to JSON.
             * @function toJSON
             * @memberof exonum.Block
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Block.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Block;
        })();
    
        exonum.TxLocation = (function() {
    
            /**
             * Properties of a TxLocation.
             * @memberof exonum
             * @interface ITxLocation
             * @property {number|Long|null} [block_height] TxLocation block_height
             * @property {number|null} [position_in_block] TxLocation position_in_block
             */
    
            /**
             * Constructs a new TxLocation.
             * @memberof exonum
             * @classdesc Represents a TxLocation.
             * @implements ITxLocation
             * @constructor
             * @param {exonum.ITxLocation=} [properties] Properties to set
             */
            function TxLocation(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TxLocation block_height.
             * @member {number|Long} block_height
             * @memberof exonum.TxLocation
             * @instance
             */
            TxLocation.prototype.block_height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * TxLocation position_in_block.
             * @member {number} position_in_block
             * @memberof exonum.TxLocation
             * @instance
             */
            TxLocation.prototype.position_in_block = 0;
    
            /**
             * Creates a new TxLocation instance using the specified properties.
             * @function create
             * @memberof exonum.TxLocation
             * @static
             * @param {exonum.ITxLocation=} [properties] Properties to set
             * @returns {exonum.TxLocation} TxLocation instance
             */
            TxLocation.create = function create(properties) {
                return new TxLocation(properties);
            };
    
            /**
             * Encodes the specified TxLocation message. Does not implicitly {@link exonum.TxLocation.verify|verify} messages.
             * @function encode
             * @memberof exonum.TxLocation
             * @static
             * @param {exonum.ITxLocation} message TxLocation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TxLocation.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.block_height != null && message.hasOwnProperty("block_height"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.block_height);
                if (message.position_in_block != null && message.hasOwnProperty("position_in_block"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.position_in_block);
                return writer;
            };
    
            /**
             * Encodes the specified TxLocation message, length delimited. Does not implicitly {@link exonum.TxLocation.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.TxLocation
             * @static
             * @param {exonum.ITxLocation} message TxLocation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TxLocation.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TxLocation message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.TxLocation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.TxLocation} TxLocation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TxLocation.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.TxLocation();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.block_height = reader.uint64();
                        break;
                    case 2:
                        message.position_in_block = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TxLocation message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.TxLocation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.TxLocation} TxLocation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TxLocation.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TxLocation message.
             * @function verify
             * @memberof exonum.TxLocation
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TxLocation.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.block_height != null && message.hasOwnProperty("block_height"))
                    if (!$util.isInteger(message.block_height) && !(message.block_height && $util.isInteger(message.block_height.low) && $util.isInteger(message.block_height.high)))
                        return "block_height: integer|Long expected";
                if (message.position_in_block != null && message.hasOwnProperty("position_in_block"))
                    if (!$util.isInteger(message.position_in_block))
                        return "position_in_block: integer expected";
                return null;
            };
    
            /**
             * Creates a TxLocation message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.TxLocation
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.TxLocation} TxLocation
             */
            TxLocation.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.TxLocation)
                    return object;
                var message = new $root.exonum.TxLocation();
                if (object.block_height != null)
                    if ($util.Long)
                        (message.block_height = $util.Long.fromValue(object.block_height)).unsigned = true;
                    else if (typeof object.block_height === "string")
                        message.block_height = parseInt(object.block_height, 10);
                    else if (typeof object.block_height === "number")
                        message.block_height = object.block_height;
                    else if (typeof object.block_height === "object")
                        message.block_height = new $util.LongBits(object.block_height.low >>> 0, object.block_height.high >>> 0).toNumber(true);
                if (object.position_in_block != null)
                    message.position_in_block = object.position_in_block >>> 0;
                return message;
            };
    
            /**
             * Creates a plain object from a TxLocation message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.TxLocation
             * @static
             * @param {exonum.TxLocation} message TxLocation
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TxLocation.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.block_height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.block_height = options.longs === String ? "0" : 0;
                    object.position_in_block = 0;
                }
                if (message.block_height != null && message.hasOwnProperty("block_height"))
                    if (typeof message.block_height === "number")
                        object.block_height = options.longs === String ? String(message.block_height) : message.block_height;
                    else
                        object.block_height = options.longs === String ? $util.Long.prototype.toString.call(message.block_height) : options.longs === Number ? new $util.LongBits(message.block_height.low >>> 0, message.block_height.high >>> 0).toNumber(true) : message.block_height;
                if (message.position_in_block != null && message.hasOwnProperty("position_in_block"))
                    object.position_in_block = message.position_in_block;
                return object;
            };
    
            /**
             * Converts this TxLocation to JSON.
             * @function toJSON
             * @memberof exonum.TxLocation
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TxLocation.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TxLocation;
        })();
    
        exonum.CallInBlock = (function() {
    
            /**
             * Properties of a CallInBlock.
             * @memberof exonum
             * @interface ICallInBlock
             * @property {number|null} [transaction] CallInBlock transaction
             * @property {number|null} [before_transactions] CallInBlock before_transactions
             * @property {number|null} [after_transactions] CallInBlock after_transactions
             */
    
            /**
             * Constructs a new CallInBlock.
             * @memberof exonum
             * @classdesc Represents a CallInBlock.
             * @implements ICallInBlock
             * @constructor
             * @param {exonum.ICallInBlock=} [properties] Properties to set
             */
            function CallInBlock(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CallInBlock transaction.
             * @member {number} transaction
             * @memberof exonum.CallInBlock
             * @instance
             */
            CallInBlock.prototype.transaction = 0;
    
            /**
             * CallInBlock before_transactions.
             * @member {number} before_transactions
             * @memberof exonum.CallInBlock
             * @instance
             */
            CallInBlock.prototype.before_transactions = 0;
    
            /**
             * CallInBlock after_transactions.
             * @member {number} after_transactions
             * @memberof exonum.CallInBlock
             * @instance
             */
            CallInBlock.prototype.after_transactions = 0;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * CallInBlock call.
             * @member {"transaction"|"before_transactions"|"after_transactions"|undefined} call
             * @memberof exonum.CallInBlock
             * @instance
             */
            Object.defineProperty(CallInBlock.prototype, "call", {
                get: $util.oneOfGetter($oneOfFields = ["transaction", "before_transactions", "after_transactions"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new CallInBlock instance using the specified properties.
             * @function create
             * @memberof exonum.CallInBlock
             * @static
             * @param {exonum.ICallInBlock=} [properties] Properties to set
             * @returns {exonum.CallInBlock} CallInBlock instance
             */
            CallInBlock.create = function create(properties) {
                return new CallInBlock(properties);
            };
    
            /**
             * Encodes the specified CallInBlock message. Does not implicitly {@link exonum.CallInBlock.verify|verify} messages.
             * @function encode
             * @memberof exonum.CallInBlock
             * @static
             * @param {exonum.ICallInBlock} message CallInBlock message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallInBlock.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.transaction != null && message.hasOwnProperty("transaction"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.transaction);
                if (message.before_transactions != null && message.hasOwnProperty("before_transactions"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.before_transactions);
                if (message.after_transactions != null && message.hasOwnProperty("after_transactions"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.after_transactions);
                return writer;
            };
    
            /**
             * Encodes the specified CallInBlock message, length delimited. Does not implicitly {@link exonum.CallInBlock.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.CallInBlock
             * @static
             * @param {exonum.ICallInBlock} message CallInBlock message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallInBlock.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CallInBlock message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.CallInBlock
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.CallInBlock} CallInBlock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallInBlock.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.CallInBlock();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.transaction = reader.uint32();
                        break;
                    case 2:
                        message.before_transactions = reader.uint32();
                        break;
                    case 3:
                        message.after_transactions = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CallInBlock message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.CallInBlock
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.CallInBlock} CallInBlock
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallInBlock.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CallInBlock message.
             * @function verify
             * @memberof exonum.CallInBlock
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallInBlock.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.transaction != null && message.hasOwnProperty("transaction")) {
                    properties.call = 1;
                    if (!$util.isInteger(message.transaction))
                        return "transaction: integer expected";
                }
                if (message.before_transactions != null && message.hasOwnProperty("before_transactions")) {
                    if (properties.call === 1)
                        return "call: multiple values";
                    properties.call = 1;
                    if (!$util.isInteger(message.before_transactions))
                        return "before_transactions: integer expected";
                }
                if (message.after_transactions != null && message.hasOwnProperty("after_transactions")) {
                    if (properties.call === 1)
                        return "call: multiple values";
                    properties.call = 1;
                    if (!$util.isInteger(message.after_transactions))
                        return "after_transactions: integer expected";
                }
                return null;
            };
    
            /**
             * Creates a CallInBlock message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.CallInBlock
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.CallInBlock} CallInBlock
             */
            CallInBlock.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.CallInBlock)
                    return object;
                var message = new $root.exonum.CallInBlock();
                if (object.transaction != null)
                    message.transaction = object.transaction >>> 0;
                if (object.before_transactions != null)
                    message.before_transactions = object.before_transactions >>> 0;
                if (object.after_transactions != null)
                    message.after_transactions = object.after_transactions >>> 0;
                return message;
            };
    
            /**
             * Creates a plain object from a CallInBlock message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.CallInBlock
             * @static
             * @param {exonum.CallInBlock} message CallInBlock
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallInBlock.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.transaction != null && message.hasOwnProperty("transaction")) {
                    object.transaction = message.transaction;
                    if (options.oneofs)
                        object.call = "transaction";
                }
                if (message.before_transactions != null && message.hasOwnProperty("before_transactions")) {
                    object.before_transactions = message.before_transactions;
                    if (options.oneofs)
                        object.call = "before_transactions";
                }
                if (message.after_transactions != null && message.hasOwnProperty("after_transactions")) {
                    object.after_transactions = message.after_transactions;
                    if (options.oneofs)
                        object.call = "after_transactions";
                }
                return object;
            };
    
            /**
             * Converts this CallInBlock to JSON.
             * @function toJSON
             * @memberof exonum.CallInBlock
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallInBlock.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return CallInBlock;
        })();
    
        exonum.ValidatorKeys = (function() {
    
            /**
             * Properties of a ValidatorKeys.
             * @memberof exonum
             * @interface IValidatorKeys
             * @property {exonum.crypto.IPublicKey|null} [consensus_key] ValidatorKeys consensus_key
             * @property {exonum.crypto.IPublicKey|null} [service_key] ValidatorKeys service_key
             */
    
            /**
             * Constructs a new ValidatorKeys.
             * @memberof exonum
             * @classdesc Represents a ValidatorKeys.
             * @implements IValidatorKeys
             * @constructor
             * @param {exonum.IValidatorKeys=} [properties] Properties to set
             */
            function ValidatorKeys(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ValidatorKeys consensus_key.
             * @member {exonum.crypto.IPublicKey|null|undefined} consensus_key
             * @memberof exonum.ValidatorKeys
             * @instance
             */
            ValidatorKeys.prototype.consensus_key = null;
    
            /**
             * ValidatorKeys service_key.
             * @member {exonum.crypto.IPublicKey|null|undefined} service_key
             * @memberof exonum.ValidatorKeys
             * @instance
             */
            ValidatorKeys.prototype.service_key = null;
    
            /**
             * Creates a new ValidatorKeys instance using the specified properties.
             * @function create
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {exonum.IValidatorKeys=} [properties] Properties to set
             * @returns {exonum.ValidatorKeys} ValidatorKeys instance
             */
            ValidatorKeys.create = function create(properties) {
                return new ValidatorKeys(properties);
            };
    
            /**
             * Encodes the specified ValidatorKeys message. Does not implicitly {@link exonum.ValidatorKeys.verify|verify} messages.
             * @function encode
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {exonum.IValidatorKeys} message ValidatorKeys message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValidatorKeys.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.consensus_key != null && message.hasOwnProperty("consensus_key"))
                    $root.exonum.crypto.PublicKey.encode(message.consensus_key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.service_key != null && message.hasOwnProperty("service_key"))
                    $root.exonum.crypto.PublicKey.encode(message.service_key, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified ValidatorKeys message, length delimited. Does not implicitly {@link exonum.ValidatorKeys.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {exonum.IValidatorKeys} message ValidatorKeys message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ValidatorKeys.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ValidatorKeys message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.ValidatorKeys} ValidatorKeys
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValidatorKeys.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.ValidatorKeys();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.consensus_key = $root.exonum.crypto.PublicKey.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.service_key = $root.exonum.crypto.PublicKey.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ValidatorKeys message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.ValidatorKeys} ValidatorKeys
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValidatorKeys.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ValidatorKeys message.
             * @function verify
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ValidatorKeys.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.consensus_key != null && message.hasOwnProperty("consensus_key")) {
                    var error = $root.exonum.crypto.PublicKey.verify(message.consensus_key);
                    if (error)
                        return "consensus_key." + error;
                }
                if (message.service_key != null && message.hasOwnProperty("service_key")) {
                    var error = $root.exonum.crypto.PublicKey.verify(message.service_key);
                    if (error)
                        return "service_key." + error;
                }
                return null;
            };
    
            /**
             * Creates a ValidatorKeys message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.ValidatorKeys} ValidatorKeys
             */
            ValidatorKeys.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.ValidatorKeys)
                    return object;
                var message = new $root.exonum.ValidatorKeys();
                if (object.consensus_key != null) {
                    if (typeof object.consensus_key !== "object")
                        throw TypeError(".exonum.ValidatorKeys.consensus_key: object expected");
                    message.consensus_key = $root.exonum.crypto.PublicKey.fromObject(object.consensus_key);
                }
                if (object.service_key != null) {
                    if (typeof object.service_key !== "object")
                        throw TypeError(".exonum.ValidatorKeys.service_key: object expected");
                    message.service_key = $root.exonum.crypto.PublicKey.fromObject(object.service_key);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a ValidatorKeys message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.ValidatorKeys
             * @static
             * @param {exonum.ValidatorKeys} message ValidatorKeys
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ValidatorKeys.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.consensus_key = null;
                    object.service_key = null;
                }
                if (message.consensus_key != null && message.hasOwnProperty("consensus_key"))
                    object.consensus_key = $root.exonum.crypto.PublicKey.toObject(message.consensus_key, options);
                if (message.service_key != null && message.hasOwnProperty("service_key"))
                    object.service_key = $root.exonum.crypto.PublicKey.toObject(message.service_key, options);
                return object;
            };
    
            /**
             * Converts this ValidatorKeys to JSON.
             * @function toJSON
             * @memberof exonum.ValidatorKeys
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ValidatorKeys.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ValidatorKeys;
        })();
    
        exonum.Config = (function() {
    
            /**
             * Properties of a Config.
             * @memberof exonum
             * @interface IConfig
             * @property {Array.<exonum.IValidatorKeys>|null} [validator_keys] Config validator_keys
             * @property {number|Long|null} [first_round_timeout] Config first_round_timeout
             * @property {number|Long|null} [status_timeout] Config status_timeout
             * @property {number|Long|null} [peers_timeout] Config peers_timeout
             * @property {number|null} [txs_block_limit] Config txs_block_limit
             * @property {number|null} [max_message_len] Config max_message_len
             * @property {number|Long|null} [min_propose_timeout] Config min_propose_timeout
             * @property {number|Long|null} [max_propose_timeout] Config max_propose_timeout
             * @property {number|null} [propose_timeout_threshold] Config propose_timeout_threshold
             */
    
            /**
             * Constructs a new Config.
             * @memberof exonum
             * @classdesc Represents a Config.
             * @implements IConfig
             * @constructor
             * @param {exonum.IConfig=} [properties] Properties to set
             */
            function Config(properties) {
                this.validator_keys = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Config validator_keys.
             * @member {Array.<exonum.IValidatorKeys>} validator_keys
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.validator_keys = $util.emptyArray;
    
            /**
             * Config first_round_timeout.
             * @member {number|Long} first_round_timeout
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.first_round_timeout = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Config status_timeout.
             * @member {number|Long} status_timeout
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.status_timeout = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Config peers_timeout.
             * @member {number|Long} peers_timeout
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.peers_timeout = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Config txs_block_limit.
             * @member {number} txs_block_limit
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.txs_block_limit = 0;
    
            /**
             * Config max_message_len.
             * @member {number} max_message_len
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.max_message_len = 0;
    
            /**
             * Config min_propose_timeout.
             * @member {number|Long} min_propose_timeout
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.min_propose_timeout = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Config max_propose_timeout.
             * @member {number|Long} max_propose_timeout
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.max_propose_timeout = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Config propose_timeout_threshold.
             * @member {number} propose_timeout_threshold
             * @memberof exonum.Config
             * @instance
             */
            Config.prototype.propose_timeout_threshold = 0;
    
            /**
             * Creates a new Config instance using the specified properties.
             * @function create
             * @memberof exonum.Config
             * @static
             * @param {exonum.IConfig=} [properties] Properties to set
             * @returns {exonum.Config} Config instance
             */
            Config.create = function create(properties) {
                return new Config(properties);
            };
    
            /**
             * Encodes the specified Config message. Does not implicitly {@link exonum.Config.verify|verify} messages.
             * @function encode
             * @memberof exonum.Config
             * @static
             * @param {exonum.IConfig} message Config message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Config.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.validator_keys != null && message.validator_keys.length)
                    for (var i = 0; i < message.validator_keys.length; ++i)
                        $root.exonum.ValidatorKeys.encode(message.validator_keys[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.first_round_timeout != null && message.hasOwnProperty("first_round_timeout"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.first_round_timeout);
                if (message.status_timeout != null && message.hasOwnProperty("status_timeout"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.status_timeout);
                if (message.peers_timeout != null && message.hasOwnProperty("peers_timeout"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.peers_timeout);
                if (message.txs_block_limit != null && message.hasOwnProperty("txs_block_limit"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.txs_block_limit);
                if (message.max_message_len != null && message.hasOwnProperty("max_message_len"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.max_message_len);
                if (message.min_propose_timeout != null && message.hasOwnProperty("min_propose_timeout"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.min_propose_timeout);
                if (message.max_propose_timeout != null && message.hasOwnProperty("max_propose_timeout"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.max_propose_timeout);
                if (message.propose_timeout_threshold != null && message.hasOwnProperty("propose_timeout_threshold"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.propose_timeout_threshold);
                return writer;
            };
    
            /**
             * Encodes the specified Config message, length delimited. Does not implicitly {@link exonum.Config.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.Config
             * @static
             * @param {exonum.IConfig} message Config message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Config.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Config message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.Config
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.Config} Config
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Config.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.Config();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.validator_keys && message.validator_keys.length))
                            message.validator_keys = [];
                        message.validator_keys.push($root.exonum.ValidatorKeys.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        message.first_round_timeout = reader.uint64();
                        break;
                    case 3:
                        message.status_timeout = reader.uint64();
                        break;
                    case 4:
                        message.peers_timeout = reader.uint64();
                        break;
                    case 5:
                        message.txs_block_limit = reader.uint32();
                        break;
                    case 6:
                        message.max_message_len = reader.uint32();
                        break;
                    case 7:
                        message.min_propose_timeout = reader.uint64();
                        break;
                    case 8:
                        message.max_propose_timeout = reader.uint64();
                        break;
                    case 9:
                        message.propose_timeout_threshold = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Config message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.Config
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.Config} Config
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Config.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Config message.
             * @function verify
             * @memberof exonum.Config
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Config.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.validator_keys != null && message.hasOwnProperty("validator_keys")) {
                    if (!Array.isArray(message.validator_keys))
                        return "validator_keys: array expected";
                    for (var i = 0; i < message.validator_keys.length; ++i) {
                        var error = $root.exonum.ValidatorKeys.verify(message.validator_keys[i]);
                        if (error)
                            return "validator_keys." + error;
                    }
                }
                if (message.first_round_timeout != null && message.hasOwnProperty("first_round_timeout"))
                    if (!$util.isInteger(message.first_round_timeout) && !(message.first_round_timeout && $util.isInteger(message.first_round_timeout.low) && $util.isInteger(message.first_round_timeout.high)))
                        return "first_round_timeout: integer|Long expected";
                if (message.status_timeout != null && message.hasOwnProperty("status_timeout"))
                    if (!$util.isInteger(message.status_timeout) && !(message.status_timeout && $util.isInteger(message.status_timeout.low) && $util.isInteger(message.status_timeout.high)))
                        return "status_timeout: integer|Long expected";
                if (message.peers_timeout != null && message.hasOwnProperty("peers_timeout"))
                    if (!$util.isInteger(message.peers_timeout) && !(message.peers_timeout && $util.isInteger(message.peers_timeout.low) && $util.isInteger(message.peers_timeout.high)))
                        return "peers_timeout: integer|Long expected";
                if (message.txs_block_limit != null && message.hasOwnProperty("txs_block_limit"))
                    if (!$util.isInteger(message.txs_block_limit))
                        return "txs_block_limit: integer expected";
                if (message.max_message_len != null && message.hasOwnProperty("max_message_len"))
                    if (!$util.isInteger(message.max_message_len))
                        return "max_message_len: integer expected";
                if (message.min_propose_timeout != null && message.hasOwnProperty("min_propose_timeout"))
                    if (!$util.isInteger(message.min_propose_timeout) && !(message.min_propose_timeout && $util.isInteger(message.min_propose_timeout.low) && $util.isInteger(message.min_propose_timeout.high)))
                        return "min_propose_timeout: integer|Long expected";
                if (message.max_propose_timeout != null && message.hasOwnProperty("max_propose_timeout"))
                    if (!$util.isInteger(message.max_propose_timeout) && !(message.max_propose_timeout && $util.isInteger(message.max_propose_timeout.low) && $util.isInteger(message.max_propose_timeout.high)))
                        return "max_propose_timeout: integer|Long expected";
                if (message.propose_timeout_threshold != null && message.hasOwnProperty("propose_timeout_threshold"))
                    if (!$util.isInteger(message.propose_timeout_threshold))
                        return "propose_timeout_threshold: integer expected";
                return null;
            };
    
            /**
             * Creates a Config message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.Config
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.Config} Config
             */
            Config.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.Config)
                    return object;
                var message = new $root.exonum.Config();
                if (object.validator_keys) {
                    if (!Array.isArray(object.validator_keys))
                        throw TypeError(".exonum.Config.validator_keys: array expected");
                    message.validator_keys = [];
                    for (var i = 0; i < object.validator_keys.length; ++i) {
                        if (typeof object.validator_keys[i] !== "object")
                            throw TypeError(".exonum.Config.validator_keys: object expected");
                        message.validator_keys[i] = $root.exonum.ValidatorKeys.fromObject(object.validator_keys[i]);
                    }
                }
                if (object.first_round_timeout != null)
                    if ($util.Long)
                        (message.first_round_timeout = $util.Long.fromValue(object.first_round_timeout)).unsigned = true;
                    else if (typeof object.first_round_timeout === "string")
                        message.first_round_timeout = parseInt(object.first_round_timeout, 10);
                    else if (typeof object.first_round_timeout === "number")
                        message.first_round_timeout = object.first_round_timeout;
                    else if (typeof object.first_round_timeout === "object")
                        message.first_round_timeout = new $util.LongBits(object.first_round_timeout.low >>> 0, object.first_round_timeout.high >>> 0).toNumber(true);
                if (object.status_timeout != null)
                    if ($util.Long)
                        (message.status_timeout = $util.Long.fromValue(object.status_timeout)).unsigned = true;
                    else if (typeof object.status_timeout === "string")
                        message.status_timeout = parseInt(object.status_timeout, 10);
                    else if (typeof object.status_timeout === "number")
                        message.status_timeout = object.status_timeout;
                    else if (typeof object.status_timeout === "object")
                        message.status_timeout = new $util.LongBits(object.status_timeout.low >>> 0, object.status_timeout.high >>> 0).toNumber(true);
                if (object.peers_timeout != null)
                    if ($util.Long)
                        (message.peers_timeout = $util.Long.fromValue(object.peers_timeout)).unsigned = true;
                    else if (typeof object.peers_timeout === "string")
                        message.peers_timeout = parseInt(object.peers_timeout, 10);
                    else if (typeof object.peers_timeout === "number")
                        message.peers_timeout = object.peers_timeout;
                    else if (typeof object.peers_timeout === "object")
                        message.peers_timeout = new $util.LongBits(object.peers_timeout.low >>> 0, object.peers_timeout.high >>> 0).toNumber(true);
                if (object.txs_block_limit != null)
                    message.txs_block_limit = object.txs_block_limit >>> 0;
                if (object.max_message_len != null)
                    message.max_message_len = object.max_message_len >>> 0;
                if (object.min_propose_timeout != null)
                    if ($util.Long)
                        (message.min_propose_timeout = $util.Long.fromValue(object.min_propose_timeout)).unsigned = true;
                    else if (typeof object.min_propose_timeout === "string")
                        message.min_propose_timeout = parseInt(object.min_propose_timeout, 10);
                    else if (typeof object.min_propose_timeout === "number")
                        message.min_propose_timeout = object.min_propose_timeout;
                    else if (typeof object.min_propose_timeout === "object")
                        message.min_propose_timeout = new $util.LongBits(object.min_propose_timeout.low >>> 0, object.min_propose_timeout.high >>> 0).toNumber(true);
                if (object.max_propose_timeout != null)
                    if ($util.Long)
                        (message.max_propose_timeout = $util.Long.fromValue(object.max_propose_timeout)).unsigned = true;
                    else if (typeof object.max_propose_timeout === "string")
                        message.max_propose_timeout = parseInt(object.max_propose_timeout, 10);
                    else if (typeof object.max_propose_timeout === "number")
                        message.max_propose_timeout = object.max_propose_timeout;
                    else if (typeof object.max_propose_timeout === "object")
                        message.max_propose_timeout = new $util.LongBits(object.max_propose_timeout.low >>> 0, object.max_propose_timeout.high >>> 0).toNumber(true);
                if (object.propose_timeout_threshold != null)
                    message.propose_timeout_threshold = object.propose_timeout_threshold >>> 0;
                return message;
            };
    
            /**
             * Creates a plain object from a Config message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.Config
             * @static
             * @param {exonum.Config} message Config
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Config.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.validator_keys = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.first_round_timeout = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.first_round_timeout = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.status_timeout = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.status_timeout = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.peers_timeout = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.peers_timeout = options.longs === String ? "0" : 0;
                    object.txs_block_limit = 0;
                    object.max_message_len = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.min_propose_timeout = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.min_propose_timeout = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_propose_timeout = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.max_propose_timeout = options.longs === String ? "0" : 0;
                    object.propose_timeout_threshold = 0;
                }
                if (message.validator_keys && message.validator_keys.length) {
                    object.validator_keys = [];
                    for (var j = 0; j < message.validator_keys.length; ++j)
                        object.validator_keys[j] = $root.exonum.ValidatorKeys.toObject(message.validator_keys[j], options);
                }
                if (message.first_round_timeout != null && message.hasOwnProperty("first_round_timeout"))
                    if (typeof message.first_round_timeout === "number")
                        object.first_round_timeout = options.longs === String ? String(message.first_round_timeout) : message.first_round_timeout;
                    else
                        object.first_round_timeout = options.longs === String ? $util.Long.prototype.toString.call(message.first_round_timeout) : options.longs === Number ? new $util.LongBits(message.first_round_timeout.low >>> 0, message.first_round_timeout.high >>> 0).toNumber(true) : message.first_round_timeout;
                if (message.status_timeout != null && message.hasOwnProperty("status_timeout"))
                    if (typeof message.status_timeout === "number")
                        object.status_timeout = options.longs === String ? String(message.status_timeout) : message.status_timeout;
                    else
                        object.status_timeout = options.longs === String ? $util.Long.prototype.toString.call(message.status_timeout) : options.longs === Number ? new $util.LongBits(message.status_timeout.low >>> 0, message.status_timeout.high >>> 0).toNumber(true) : message.status_timeout;
                if (message.peers_timeout != null && message.hasOwnProperty("peers_timeout"))
                    if (typeof message.peers_timeout === "number")
                        object.peers_timeout = options.longs === String ? String(message.peers_timeout) : message.peers_timeout;
                    else
                        object.peers_timeout = options.longs === String ? $util.Long.prototype.toString.call(message.peers_timeout) : options.longs === Number ? new $util.LongBits(message.peers_timeout.low >>> 0, message.peers_timeout.high >>> 0).toNumber(true) : message.peers_timeout;
                if (message.txs_block_limit != null && message.hasOwnProperty("txs_block_limit"))
                    object.txs_block_limit = message.txs_block_limit;
                if (message.max_message_len != null && message.hasOwnProperty("max_message_len"))
                    object.max_message_len = message.max_message_len;
                if (message.min_propose_timeout != null && message.hasOwnProperty("min_propose_timeout"))
                    if (typeof message.min_propose_timeout === "number")
                        object.min_propose_timeout = options.longs === String ? String(message.min_propose_timeout) : message.min_propose_timeout;
                    else
                        object.min_propose_timeout = options.longs === String ? $util.Long.prototype.toString.call(message.min_propose_timeout) : options.longs === Number ? new $util.LongBits(message.min_propose_timeout.low >>> 0, message.min_propose_timeout.high >>> 0).toNumber(true) : message.min_propose_timeout;
                if (message.max_propose_timeout != null && message.hasOwnProperty("max_propose_timeout"))
                    if (typeof message.max_propose_timeout === "number")
                        object.max_propose_timeout = options.longs === String ? String(message.max_propose_timeout) : message.max_propose_timeout;
                    else
                        object.max_propose_timeout = options.longs === String ? $util.Long.prototype.toString.call(message.max_propose_timeout) : options.longs === Number ? new $util.LongBits(message.max_propose_timeout.low >>> 0, message.max_propose_timeout.high >>> 0).toNumber(true) : message.max_propose_timeout;
                if (message.propose_timeout_threshold != null && message.hasOwnProperty("propose_timeout_threshold"))
                    object.propose_timeout_threshold = message.propose_timeout_threshold;
                return object;
            };
    
            /**
             * Converts this Config to JSON.
             * @function toJSON
             * @memberof exonum.Config
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Config.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Config;
        })();
    
        exonum.crypto = (function() {
    
            /**
             * Namespace crypto.
             * @memberof exonum
             * @namespace
             */
            var crypto = {};
    
            crypto.Hash = (function() {
    
                /**
                 * Properties of a Hash.
                 * @memberof exonum.crypto
                 * @interface IHash
                 * @property {Uint8Array|null} [data] Hash data
                 */
    
                /**
                 * Constructs a new Hash.
                 * @memberof exonum.crypto
                 * @classdesc Represents a Hash.
                 * @implements IHash
                 * @constructor
                 * @param {exonum.crypto.IHash=} [properties] Properties to set
                 */
                function Hash(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Hash data.
                 * @member {Uint8Array} data
                 * @memberof exonum.crypto.Hash
                 * @instance
                 */
                Hash.prototype.data = $util.newBuffer([]);
    
                /**
                 * Creates a new Hash instance using the specified properties.
                 * @function create
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.IHash=} [properties] Properties to set
                 * @returns {exonum.crypto.Hash} Hash instance
                 */
                Hash.create = function create(properties) {
                    return new Hash(properties);
                };
    
                /**
                 * Encodes the specified Hash message. Does not implicitly {@link exonum.crypto.Hash.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.IHash} message Hash message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Hash.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && message.hasOwnProperty("data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified Hash message, length delimited. Does not implicitly {@link exonum.crypto.Hash.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.IHash} message Hash message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Hash.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Hash message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.crypto.Hash} Hash
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Hash.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.crypto.Hash();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Hash message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.crypto.Hash} Hash
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Hash.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Hash message.
                 * @function verify
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Hash.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a Hash message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.crypto.Hash} Hash
                 */
                Hash.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.crypto.Hash)
                        return object;
                    var message = new $root.exonum.crypto.Hash();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Hash message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.crypto.Hash
                 * @static
                 * @param {exonum.crypto.Hash} message Hash
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Hash.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    return object;
                };
    
                /**
                 * Converts this Hash to JSON.
                 * @function toJSON
                 * @memberof exonum.crypto.Hash
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Hash.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Hash;
            })();
    
            crypto.PublicKey = (function() {
    
                /**
                 * Properties of a PublicKey.
                 * @memberof exonum.crypto
                 * @interface IPublicKey
                 * @property {Uint8Array|null} [data] PublicKey data
                 */
    
                /**
                 * Constructs a new PublicKey.
                 * @memberof exonum.crypto
                 * @classdesc Represents a PublicKey.
                 * @implements IPublicKey
                 * @constructor
                 * @param {exonum.crypto.IPublicKey=} [properties] Properties to set
                 */
                function PublicKey(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * PublicKey data.
                 * @member {Uint8Array} data
                 * @memberof exonum.crypto.PublicKey
                 * @instance
                 */
                PublicKey.prototype.data = $util.newBuffer([]);
    
                /**
                 * Creates a new PublicKey instance using the specified properties.
                 * @function create
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.IPublicKey=} [properties] Properties to set
                 * @returns {exonum.crypto.PublicKey} PublicKey instance
                 */
                PublicKey.create = function create(properties) {
                    return new PublicKey(properties);
                };
    
                /**
                 * Encodes the specified PublicKey message. Does not implicitly {@link exonum.crypto.PublicKey.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.IPublicKey} message PublicKey message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PublicKey.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && message.hasOwnProperty("data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link exonum.crypto.PublicKey.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.IPublicKey} message PublicKey message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PublicKey.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a PublicKey message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.crypto.PublicKey} PublicKey
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PublicKey.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.crypto.PublicKey();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a PublicKey message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.crypto.PublicKey} PublicKey
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PublicKey.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a PublicKey message.
                 * @function verify
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                PublicKey.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.crypto.PublicKey} PublicKey
                 */
                PublicKey.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.crypto.PublicKey)
                        return object;
                    var message = new $root.exonum.crypto.PublicKey();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    return message;
                };
    
                /**
                 * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.crypto.PublicKey
                 * @static
                 * @param {exonum.crypto.PublicKey} message PublicKey
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PublicKey.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    return object;
                };
    
                /**
                 * Converts this PublicKey to JSON.
                 * @function toJSON
                 * @memberof exonum.crypto.PublicKey
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                PublicKey.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return PublicKey;
            })();
    
            crypto.Signature = (function() {
    
                /**
                 * Properties of a Signature.
                 * @memberof exonum.crypto
                 * @interface ISignature
                 * @property {Uint8Array|null} [data] Signature data
                 */
    
                /**
                 * Constructs a new Signature.
                 * @memberof exonum.crypto
                 * @classdesc Represents a Signature.
                 * @implements ISignature
                 * @constructor
                 * @param {exonum.crypto.ISignature=} [properties] Properties to set
                 */
                function Signature(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Signature data.
                 * @member {Uint8Array} data
                 * @memberof exonum.crypto.Signature
                 * @instance
                 */
                Signature.prototype.data = $util.newBuffer([]);
    
                /**
                 * Creates a new Signature instance using the specified properties.
                 * @function create
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.ISignature=} [properties] Properties to set
                 * @returns {exonum.crypto.Signature} Signature instance
                 */
                Signature.create = function create(properties) {
                    return new Signature(properties);
                };
    
                /**
                 * Encodes the specified Signature message. Does not implicitly {@link exonum.crypto.Signature.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.ISignature} message Signature message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Signature.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && message.hasOwnProperty("data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    return writer;
                };
    
                /**
                 * Encodes the specified Signature message, length delimited. Does not implicitly {@link exonum.crypto.Signature.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.ISignature} message Signature message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Signature.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Signature message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.crypto.Signature} Signature
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Signature.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.crypto.Signature();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Signature message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.crypto.Signature} Signature
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Signature.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Signature message.
                 * @function verify
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Signature.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a Signature message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.crypto.Signature} Signature
                 */
                Signature.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.crypto.Signature)
                        return object;
                    var message = new $root.exonum.crypto.Signature();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Signature message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.crypto.Signature
                 * @static
                 * @param {exonum.crypto.Signature} message Signature
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Signature.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    return object;
                };
    
                /**
                 * Converts this Signature to JSON.
                 * @function toJSON
                 * @memberof exonum.crypto.Signature
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Signature.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Signature;
            })();
    
            return crypto;
        })();
    
        exonum.KeyValue = (function() {
    
            /**
             * Properties of a KeyValue.
             * @memberof exonum
             * @interface IKeyValue
             * @property {string|null} [key] KeyValue key
             * @property {Uint8Array|null} [value] KeyValue value
             */
    
            /**
             * Constructs a new KeyValue.
             * @memberof exonum
             * @classdesc Represents a KeyValue.
             * @implements IKeyValue
             * @constructor
             * @param {exonum.IKeyValue=} [properties] Properties to set
             */
            function KeyValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * KeyValue key.
             * @member {string} key
             * @memberof exonum.KeyValue
             * @instance
             */
            KeyValue.prototype.key = "";
    
            /**
             * KeyValue value.
             * @member {Uint8Array} value
             * @memberof exonum.KeyValue
             * @instance
             */
            KeyValue.prototype.value = $util.newBuffer([]);
    
            /**
             * Creates a new KeyValue instance using the specified properties.
             * @function create
             * @memberof exonum.KeyValue
             * @static
             * @param {exonum.IKeyValue=} [properties] Properties to set
             * @returns {exonum.KeyValue} KeyValue instance
             */
            KeyValue.create = function create(properties) {
                return new KeyValue(properties);
            };
    
            /**
             * Encodes the specified KeyValue message. Does not implicitly {@link exonum.KeyValue.verify|verify} messages.
             * @function encode
             * @memberof exonum.KeyValue
             * @static
             * @param {exonum.IKeyValue} message KeyValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.key != null && message.hasOwnProperty("key"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };
    
            /**
             * Encodes the specified KeyValue message, length delimited. Does not implicitly {@link exonum.KeyValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.KeyValue
             * @static
             * @param {exonum.IKeyValue} message KeyValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a KeyValue message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.KeyValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.KeyValue} KeyValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.KeyValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.key = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a KeyValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.KeyValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.KeyValue} KeyValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a KeyValue message.
             * @function verify
             * @memberof exonum.KeyValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.key != null && message.hasOwnProperty("key"))
                    if (!$util.isString(message.key))
                        return "key: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };
    
            /**
             * Creates a KeyValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.KeyValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.KeyValue} KeyValue
             */
            KeyValue.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.KeyValue)
                    return object;
                var message = new $root.exonum.KeyValue();
                if (object.key != null)
                    message.key = String(object.key);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };
    
            /**
             * Creates a plain object from a KeyValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.KeyValue
             * @static
             * @param {exonum.KeyValue} message KeyValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.key = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.key != null && message.hasOwnProperty("key"))
                    object.key = message.key;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };
    
            /**
             * Converts this KeyValue to JSON.
             * @function toJSON
             * @memberof exonum.KeyValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return KeyValue;
        })();
    
        exonum.KeyValueSequence = (function() {
    
            /**
             * Properties of a KeyValueSequence.
             * @memberof exonum
             * @interface IKeyValueSequence
             * @property {Array.<exonum.IKeyValue>|null} [entries] KeyValueSequence entries
             */
    
            /**
             * Constructs a new KeyValueSequence.
             * @memberof exonum
             * @classdesc Represents a KeyValueSequence.
             * @implements IKeyValueSequence
             * @constructor
             * @param {exonum.IKeyValueSequence=} [properties] Properties to set
             */
            function KeyValueSequence(properties) {
                this.entries = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * KeyValueSequence entries.
             * @member {Array.<exonum.IKeyValue>} entries
             * @memberof exonum.KeyValueSequence
             * @instance
             */
            KeyValueSequence.prototype.entries = $util.emptyArray;
    
            /**
             * Creates a new KeyValueSequence instance using the specified properties.
             * @function create
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {exonum.IKeyValueSequence=} [properties] Properties to set
             * @returns {exonum.KeyValueSequence} KeyValueSequence instance
             */
            KeyValueSequence.create = function create(properties) {
                return new KeyValueSequence(properties);
            };
    
            /**
             * Encodes the specified KeyValueSequence message. Does not implicitly {@link exonum.KeyValueSequence.verify|verify} messages.
             * @function encode
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {exonum.IKeyValueSequence} message KeyValueSequence message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyValueSequence.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.entries != null && message.entries.length)
                    for (var i = 0; i < message.entries.length; ++i)
                        $root.exonum.KeyValue.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified KeyValueSequence message, length delimited. Does not implicitly {@link exonum.KeyValueSequence.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {exonum.IKeyValueSequence} message KeyValueSequence message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyValueSequence.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a KeyValueSequence message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.KeyValueSequence} KeyValueSequence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyValueSequence.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.KeyValueSequence();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.entries && message.entries.length))
                            message.entries = [];
                        message.entries.push($root.exonum.KeyValue.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a KeyValueSequence message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.KeyValueSequence} KeyValueSequence
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyValueSequence.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a KeyValueSequence message.
             * @function verify
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyValueSequence.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.entries != null && message.hasOwnProperty("entries")) {
                    if (!Array.isArray(message.entries))
                        return "entries: array expected";
                    for (var i = 0; i < message.entries.length; ++i) {
                        var error = $root.exonum.KeyValue.verify(message.entries[i]);
                        if (error)
                            return "entries." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a KeyValueSequence message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.KeyValueSequence} KeyValueSequence
             */
            KeyValueSequence.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.KeyValueSequence)
                    return object;
                var message = new $root.exonum.KeyValueSequence();
                if (object.entries) {
                    if (!Array.isArray(object.entries))
                        throw TypeError(".exonum.KeyValueSequence.entries: array expected");
                    message.entries = [];
                    for (var i = 0; i < object.entries.length; ++i) {
                        if (typeof object.entries[i] !== "object")
                            throw TypeError(".exonum.KeyValueSequence.entries: object expected");
                        message.entries[i] = $root.exonum.KeyValue.fromObject(object.entries[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a KeyValueSequence message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.KeyValueSequence
             * @static
             * @param {exonum.KeyValueSequence} message KeyValueSequence
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyValueSequence.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.entries = [];
                if (message.entries && message.entries.length) {
                    object.entries = [];
                    for (var j = 0; j < message.entries.length; ++j)
                        object.entries[j] = $root.exonum.KeyValue.toObject(message.entries[j], options);
                }
                return object;
            };
    
            /**
             * Converts this KeyValueSequence to JSON.
             * @function toJSON
             * @memberof exonum.KeyValueSequence
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyValueSequence.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return KeyValueSequence;
        })();
    
        exonum.SignedMessage = (function() {
    
            /**
             * Properties of a SignedMessage.
             * @memberof exonum
             * @interface ISignedMessage
             * @property {Uint8Array|null} [payload] SignedMessage payload
             * @property {exonum.crypto.IPublicKey|null} [author] SignedMessage author
             * @property {exonum.crypto.ISignature|null} [signature] SignedMessage signature
             */
    
            /**
             * Constructs a new SignedMessage.
             * @memberof exonum
             * @classdesc Represents a SignedMessage.
             * @implements ISignedMessage
             * @constructor
             * @param {exonum.ISignedMessage=} [properties] Properties to set
             */
            function SignedMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SignedMessage payload.
             * @member {Uint8Array} payload
             * @memberof exonum.SignedMessage
             * @instance
             */
            SignedMessage.prototype.payload = $util.newBuffer([]);
    
            /**
             * SignedMessage author.
             * @member {exonum.crypto.IPublicKey|null|undefined} author
             * @memberof exonum.SignedMessage
             * @instance
             */
            SignedMessage.prototype.author = null;
    
            /**
             * SignedMessage signature.
             * @member {exonum.crypto.ISignature|null|undefined} signature
             * @memberof exonum.SignedMessage
             * @instance
             */
            SignedMessage.prototype.signature = null;
    
            /**
             * Creates a new SignedMessage instance using the specified properties.
             * @function create
             * @memberof exonum.SignedMessage
             * @static
             * @param {exonum.ISignedMessage=} [properties] Properties to set
             * @returns {exonum.SignedMessage} SignedMessage instance
             */
            SignedMessage.create = function create(properties) {
                return new SignedMessage(properties);
            };
    
            /**
             * Encodes the specified SignedMessage message. Does not implicitly {@link exonum.SignedMessage.verify|verify} messages.
             * @function encode
             * @memberof exonum.SignedMessage
             * @static
             * @param {exonum.ISignedMessage} message SignedMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignedMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.payload != null && message.hasOwnProperty("payload"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.payload);
                if (message.author != null && message.hasOwnProperty("author"))
                    $root.exonum.crypto.PublicKey.encode(message.author, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.signature != null && message.hasOwnProperty("signature"))
                    $root.exonum.crypto.Signature.encode(message.signature, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified SignedMessage message, length delimited. Does not implicitly {@link exonum.SignedMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.SignedMessage
             * @static
             * @param {exonum.ISignedMessage} message SignedMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignedMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SignedMessage message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.SignedMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.SignedMessage} SignedMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignedMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.SignedMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.payload = reader.bytes();
                        break;
                    case 2:
                        message.author = $root.exonum.crypto.PublicKey.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.signature = $root.exonum.crypto.Signature.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SignedMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.SignedMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.SignedMessage} SignedMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignedMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SignedMessage message.
             * @function verify
             * @memberof exonum.SignedMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SignedMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.payload != null && message.hasOwnProperty("payload"))
                    if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                        return "payload: buffer expected";
                if (message.author != null && message.hasOwnProperty("author")) {
                    var error = $root.exonum.crypto.PublicKey.verify(message.author);
                    if (error)
                        return "author." + error;
                }
                if (message.signature != null && message.hasOwnProperty("signature")) {
                    var error = $root.exonum.crypto.Signature.verify(message.signature);
                    if (error)
                        return "signature." + error;
                }
                return null;
            };
    
            /**
             * Creates a SignedMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.SignedMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.SignedMessage} SignedMessage
             */
            SignedMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.SignedMessage)
                    return object;
                var message = new $root.exonum.SignedMessage();
                if (object.payload != null)
                    if (typeof object.payload === "string")
                        $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                    else if (object.payload.length)
                        message.payload = object.payload;
                if (object.author != null) {
                    if (typeof object.author !== "object")
                        throw TypeError(".exonum.SignedMessage.author: object expected");
                    message.author = $root.exonum.crypto.PublicKey.fromObject(object.author);
                }
                if (object.signature != null) {
                    if (typeof object.signature !== "object")
                        throw TypeError(".exonum.SignedMessage.signature: object expected");
                    message.signature = $root.exonum.crypto.Signature.fromObject(object.signature);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a SignedMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.SignedMessage
             * @static
             * @param {exonum.SignedMessage} message SignedMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SignedMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.payload = "";
                    else {
                        object.payload = [];
                        if (options.bytes !== Array)
                            object.payload = $util.newBuffer(object.payload);
                    }
                    object.author = null;
                    object.signature = null;
                }
                if (message.payload != null && message.hasOwnProperty("payload"))
                    object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                if (message.author != null && message.hasOwnProperty("author"))
                    object.author = $root.exonum.crypto.PublicKey.toObject(message.author, options);
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = $root.exonum.crypto.Signature.toObject(message.signature, options);
                return object;
            };
    
            /**
             * Converts this SignedMessage to JSON.
             * @function toJSON
             * @memberof exonum.SignedMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SignedMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SignedMessage;
        })();
    
        exonum.CoreMessage = (function() {
    
            /**
             * Properties of a CoreMessage.
             * @memberof exonum
             * @interface ICoreMessage
             * @property {exonum.runtime.IAnyTx|null} [any_tx] CoreMessage any_tx
             * @property {exonum.IPrecommit|null} [precommit] CoreMessage precommit
             */
    
            /**
             * Constructs a new CoreMessage.
             * @memberof exonum
             * @classdesc Represents a CoreMessage.
             * @implements ICoreMessage
             * @constructor
             * @param {exonum.ICoreMessage=} [properties] Properties to set
             */
            function CoreMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CoreMessage any_tx.
             * @member {exonum.runtime.IAnyTx|null|undefined} any_tx
             * @memberof exonum.CoreMessage
             * @instance
             */
            CoreMessage.prototype.any_tx = null;
    
            /**
             * CoreMessage precommit.
             * @member {exonum.IPrecommit|null|undefined} precommit
             * @memberof exonum.CoreMessage
             * @instance
             */
            CoreMessage.prototype.precommit = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * CoreMessage kind.
             * @member {"any_tx"|"precommit"|undefined} kind
             * @memberof exonum.CoreMessage
             * @instance
             */
            Object.defineProperty(CoreMessage.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["any_tx", "precommit"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new CoreMessage instance using the specified properties.
             * @function create
             * @memberof exonum.CoreMessage
             * @static
             * @param {exonum.ICoreMessage=} [properties] Properties to set
             * @returns {exonum.CoreMessage} CoreMessage instance
             */
            CoreMessage.create = function create(properties) {
                return new CoreMessage(properties);
            };
    
            /**
             * Encodes the specified CoreMessage message. Does not implicitly {@link exonum.CoreMessage.verify|verify} messages.
             * @function encode
             * @memberof exonum.CoreMessage
             * @static
             * @param {exonum.ICoreMessage} message CoreMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CoreMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.any_tx != null && message.hasOwnProperty("any_tx"))
                    $root.exonum.runtime.AnyTx.encode(message.any_tx, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.precommit != null && message.hasOwnProperty("precommit"))
                    $root.exonum.Precommit.encode(message.precommit, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified CoreMessage message, length delimited. Does not implicitly {@link exonum.CoreMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.CoreMessage
             * @static
             * @param {exonum.ICoreMessage} message CoreMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CoreMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CoreMessage message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.CoreMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.CoreMessage} CoreMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CoreMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.CoreMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.any_tx = $root.exonum.runtime.AnyTx.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.precommit = $root.exonum.Precommit.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CoreMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.CoreMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.CoreMessage} CoreMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CoreMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CoreMessage message.
             * @function verify
             * @memberof exonum.CoreMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CoreMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.any_tx != null && message.hasOwnProperty("any_tx")) {
                    properties.kind = 1;
                    {
                        var error = $root.exonum.runtime.AnyTx.verify(message.any_tx);
                        if (error)
                            return "any_tx." + error;
                    }
                }
                if (message.precommit != null && message.hasOwnProperty("precommit")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.exonum.Precommit.verify(message.precommit);
                        if (error)
                            return "precommit." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a CoreMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.CoreMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.CoreMessage} CoreMessage
             */
            CoreMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.CoreMessage)
                    return object;
                var message = new $root.exonum.CoreMessage();
                if (object.any_tx != null) {
                    if (typeof object.any_tx !== "object")
                        throw TypeError(".exonum.CoreMessage.any_tx: object expected");
                    message.any_tx = $root.exonum.runtime.AnyTx.fromObject(object.any_tx);
                }
                if (object.precommit != null) {
                    if (typeof object.precommit !== "object")
                        throw TypeError(".exonum.CoreMessage.precommit: object expected");
                    message.precommit = $root.exonum.Precommit.fromObject(object.precommit);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a CoreMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.CoreMessage
             * @static
             * @param {exonum.CoreMessage} message CoreMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CoreMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.any_tx != null && message.hasOwnProperty("any_tx")) {
                    object.any_tx = $root.exonum.runtime.AnyTx.toObject(message.any_tx, options);
                    if (options.oneofs)
                        object.kind = "any_tx";
                }
                if (message.precommit != null && message.hasOwnProperty("precommit")) {
                    object.precommit = $root.exonum.Precommit.toObject(message.precommit, options);
                    if (options.oneofs)
                        object.kind = "precommit";
                }
                return object;
            };
    
            /**
             * Converts this CoreMessage to JSON.
             * @function toJSON
             * @memberof exonum.CoreMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CoreMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return CoreMessage;
        })();
    
        exonum.Precommit = (function() {
    
            /**
             * Properties of a Precommit.
             * @memberof exonum
             * @interface IPrecommit
             * @property {number|null} [validator] Precommit validator
             * @property {number|Long|null} [height] Precommit height
             * @property {number|null} [round] Precommit round
             * @property {exonum.crypto.IHash|null} [propose_hash] Precommit propose_hash
             * @property {exonum.crypto.IHash|null} [block_hash] Precommit block_hash
             * @property {google.protobuf.ITimestamp|null} [time] Precommit time
             */
    
            /**
             * Constructs a new Precommit.
             * @memberof exonum
             * @classdesc Represents a Precommit.
             * @implements IPrecommit
             * @constructor
             * @param {exonum.IPrecommit=} [properties] Properties to set
             */
            function Precommit(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Precommit validator.
             * @member {number} validator
             * @memberof exonum.Precommit
             * @instance
             */
            Precommit.prototype.validator = 0;
    
            /**
             * Precommit height.
             * @member {number|Long} height
             * @memberof exonum.Precommit
             * @instance
             */
            Precommit.prototype.height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * Precommit round.
             * @member {number} round
             * @memberof exonum.Precommit
             * @instance
             */
            Precommit.prototype.round = 0;
    
            /**
             * Precommit propose_hash.
             * @member {exonum.crypto.IHash|null|undefined} propose_hash
             * @memberof exonum.Precommit
             * @instance
             */
            Precommit.prototype.propose_hash = null;
    
            /**
             * Precommit block_hash.
             * @member {exonum.crypto.IHash|null|undefined} block_hash
             * @memberof exonum.Precommit
             * @instance
             */
            Precommit.prototype.block_hash = null;
    
            /**
             * Precommit time.
             * @member {google.protobuf.ITimestamp|null|undefined} time
             * @memberof exonum.Precommit
             * @instance
             */
            Precommit.prototype.time = null;
    
            /**
             * Creates a new Precommit instance using the specified properties.
             * @function create
             * @memberof exonum.Precommit
             * @static
             * @param {exonum.IPrecommit=} [properties] Properties to set
             * @returns {exonum.Precommit} Precommit instance
             */
            Precommit.create = function create(properties) {
                return new Precommit(properties);
            };
    
            /**
             * Encodes the specified Precommit message. Does not implicitly {@link exonum.Precommit.verify|verify} messages.
             * @function encode
             * @memberof exonum.Precommit
             * @static
             * @param {exonum.IPrecommit} message Precommit message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Precommit.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.validator != null && message.hasOwnProperty("validator"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.validator);
                if (message.height != null && message.hasOwnProperty("height"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.height);
                if (message.round != null && message.hasOwnProperty("round"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.round);
                if (message.propose_hash != null && message.hasOwnProperty("propose_hash"))
                    $root.exonum.crypto.Hash.encode(message.propose_hash, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.block_hash != null && message.hasOwnProperty("block_hash"))
                    $root.exonum.crypto.Hash.encode(message.block_hash, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.time != null && message.hasOwnProperty("time"))
                    $root.google.protobuf.Timestamp.encode(message.time, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified Precommit message, length delimited. Does not implicitly {@link exonum.Precommit.verify|verify} messages.
             * @function encodeDelimited
             * @memberof exonum.Precommit
             * @static
             * @param {exonum.IPrecommit} message Precommit message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Precommit.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Precommit message from the specified reader or buffer.
             * @function decode
             * @memberof exonum.Precommit
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {exonum.Precommit} Precommit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Precommit.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.Precommit();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.validator = reader.uint32();
                        break;
                    case 2:
                        message.height = reader.uint64();
                        break;
                    case 3:
                        message.round = reader.uint32();
                        break;
                    case 4:
                        message.propose_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.block_hash = $root.exonum.crypto.Hash.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.time = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Precommit message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof exonum.Precommit
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {exonum.Precommit} Precommit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Precommit.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Precommit message.
             * @function verify
             * @memberof exonum.Precommit
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Precommit.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.validator != null && message.hasOwnProperty("validator"))
                    if (!$util.isInteger(message.validator))
                        return "validator: integer expected";
                if (message.height != null && message.hasOwnProperty("height"))
                    if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                        return "height: integer|Long expected";
                if (message.round != null && message.hasOwnProperty("round"))
                    if (!$util.isInteger(message.round))
                        return "round: integer expected";
                if (message.propose_hash != null && message.hasOwnProperty("propose_hash")) {
                    var error = $root.exonum.crypto.Hash.verify(message.propose_hash);
                    if (error)
                        return "propose_hash." + error;
                }
                if (message.block_hash != null && message.hasOwnProperty("block_hash")) {
                    var error = $root.exonum.crypto.Hash.verify(message.block_hash);
                    if (error)
                        return "block_hash." + error;
                }
                if (message.time != null && message.hasOwnProperty("time")) {
                    var error = $root.google.protobuf.Timestamp.verify(message.time);
                    if (error)
                        return "time." + error;
                }
                return null;
            };
    
            /**
             * Creates a Precommit message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof exonum.Precommit
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {exonum.Precommit} Precommit
             */
            Precommit.fromObject = function fromObject(object) {
                if (object instanceof $root.exonum.Precommit)
                    return object;
                var message = new $root.exonum.Precommit();
                if (object.validator != null)
                    message.validator = object.validator >>> 0;
                if (object.height != null)
                    if ($util.Long)
                        (message.height = $util.Long.fromValue(object.height)).unsigned = true;
                    else if (typeof object.height === "string")
                        message.height = parseInt(object.height, 10);
                    else if (typeof object.height === "number")
                        message.height = object.height;
                    else if (typeof object.height === "object")
                        message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber(true);
                if (object.round != null)
                    message.round = object.round >>> 0;
                if (object.propose_hash != null) {
                    if (typeof object.propose_hash !== "object")
                        throw TypeError(".exonum.Precommit.propose_hash: object expected");
                    message.propose_hash = $root.exonum.crypto.Hash.fromObject(object.propose_hash);
                }
                if (object.block_hash != null) {
                    if (typeof object.block_hash !== "object")
                        throw TypeError(".exonum.Precommit.block_hash: object expected");
                    message.block_hash = $root.exonum.crypto.Hash.fromObject(object.block_hash);
                }
                if (object.time != null) {
                    if (typeof object.time !== "object")
                        throw TypeError(".exonum.Precommit.time: object expected");
                    message.time = $root.google.protobuf.Timestamp.fromObject(object.time);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a Precommit message. Also converts values to other types if specified.
             * @function toObject
             * @memberof exonum.Precommit
             * @static
             * @param {exonum.Precommit} message Precommit
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Precommit.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.validator = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.height = options.longs === String ? "0" : 0;
                    object.round = 0;
                    object.propose_hash = null;
                    object.block_hash = null;
                    object.time = null;
                }
                if (message.validator != null && message.hasOwnProperty("validator"))
                    object.validator = message.validator;
                if (message.height != null && message.hasOwnProperty("height"))
                    if (typeof message.height === "number")
                        object.height = options.longs === String ? String(message.height) : message.height;
                    else
                        object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber(true) : message.height;
                if (message.round != null && message.hasOwnProperty("round"))
                    object.round = message.round;
                if (message.propose_hash != null && message.hasOwnProperty("propose_hash"))
                    object.propose_hash = $root.exonum.crypto.Hash.toObject(message.propose_hash, options);
                if (message.block_hash != null && message.hasOwnProperty("block_hash"))
                    object.block_hash = $root.exonum.crypto.Hash.toObject(message.block_hash, options);
                if (message.time != null && message.hasOwnProperty("time"))
                    object.time = $root.google.protobuf.Timestamp.toObject(message.time, options);
                return object;
            };
    
            /**
             * Converts this Precommit to JSON.
             * @function toJSON
             * @memberof exonum.Precommit
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Precommit.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Precommit;
        })();
    
        exonum.runtime = (function() {
    
            /**
             * Namespace runtime.
             * @memberof exonum
             * @namespace
             */
            var runtime = {};
    
            runtime.CallInfo = (function() {
    
                /**
                 * Properties of a CallInfo.
                 * @memberof exonum.runtime
                 * @interface ICallInfo
                 * @property {number|null} [instance_id] CallInfo instance_id
                 * @property {number|null} [method_id] CallInfo method_id
                 */
    
                /**
                 * Constructs a new CallInfo.
                 * @memberof exonum.runtime
                 * @classdesc Represents a CallInfo.
                 * @implements ICallInfo
                 * @constructor
                 * @param {exonum.runtime.ICallInfo=} [properties] Properties to set
                 */
                function CallInfo(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * CallInfo instance_id.
                 * @member {number} instance_id
                 * @memberof exonum.runtime.CallInfo
                 * @instance
                 */
                CallInfo.prototype.instance_id = 0;
    
                /**
                 * CallInfo method_id.
                 * @member {number} method_id
                 * @memberof exonum.runtime.CallInfo
                 * @instance
                 */
                CallInfo.prototype.method_id = 0;
    
                /**
                 * Creates a new CallInfo instance using the specified properties.
                 * @function create
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {exonum.runtime.ICallInfo=} [properties] Properties to set
                 * @returns {exonum.runtime.CallInfo} CallInfo instance
                 */
                CallInfo.create = function create(properties) {
                    return new CallInfo(properties);
                };
    
                /**
                 * Encodes the specified CallInfo message. Does not implicitly {@link exonum.runtime.CallInfo.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {exonum.runtime.ICallInfo} message CallInfo message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CallInfo.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.instance_id != null && message.hasOwnProperty("instance_id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.instance_id);
                    if (message.method_id != null && message.hasOwnProperty("method_id"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.method_id);
                    return writer;
                };
    
                /**
                 * Encodes the specified CallInfo message, length delimited. Does not implicitly {@link exonum.runtime.CallInfo.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {exonum.runtime.ICallInfo} message CallInfo message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                CallInfo.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a CallInfo message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.runtime.CallInfo} CallInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CallInfo.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.runtime.CallInfo();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.instance_id = reader.uint32();
                            break;
                        case 2:
                            message.method_id = reader.uint32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a CallInfo message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.runtime.CallInfo} CallInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                CallInfo.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a CallInfo message.
                 * @function verify
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                CallInfo.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.instance_id != null && message.hasOwnProperty("instance_id"))
                        if (!$util.isInteger(message.instance_id))
                            return "instance_id: integer expected";
                    if (message.method_id != null && message.hasOwnProperty("method_id"))
                        if (!$util.isInteger(message.method_id))
                            return "method_id: integer expected";
                    return null;
                };
    
                /**
                 * Creates a CallInfo message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.runtime.CallInfo} CallInfo
                 */
                CallInfo.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.runtime.CallInfo)
                        return object;
                    var message = new $root.exonum.runtime.CallInfo();
                    if (object.instance_id != null)
                        message.instance_id = object.instance_id >>> 0;
                    if (object.method_id != null)
                        message.method_id = object.method_id >>> 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a CallInfo message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.runtime.CallInfo
                 * @static
                 * @param {exonum.runtime.CallInfo} message CallInfo
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                CallInfo.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.instance_id = 0;
                        object.method_id = 0;
                    }
                    if (message.instance_id != null && message.hasOwnProperty("instance_id"))
                        object.instance_id = message.instance_id;
                    if (message.method_id != null && message.hasOwnProperty("method_id"))
                        object.method_id = message.method_id;
                    return object;
                };
    
                /**
                 * Converts this CallInfo to JSON.
                 * @function toJSON
                 * @memberof exonum.runtime.CallInfo
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                CallInfo.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return CallInfo;
            })();
    
            runtime.AnyTx = (function() {
    
                /**
                 * Properties of an AnyTx.
                 * @memberof exonum.runtime
                 * @interface IAnyTx
                 * @property {exonum.runtime.ICallInfo|null} [call_info] AnyTx call_info
                 * @property {Uint8Array|null} ["arguments"] AnyTx arguments
                 */
    
                /**
                 * Constructs a new AnyTx.
                 * @memberof exonum.runtime
                 * @classdesc Represents an AnyTx.
                 * @implements IAnyTx
                 * @constructor
                 * @param {exonum.runtime.IAnyTx=} [properties] Properties to set
                 */
                function AnyTx(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * AnyTx call_info.
                 * @member {exonum.runtime.ICallInfo|null|undefined} call_info
                 * @memberof exonum.runtime.AnyTx
                 * @instance
                 */
                AnyTx.prototype.call_info = null;
    
                /**
                 * AnyTx arguments.
                 * @member {Uint8Array} arguments
                 * @memberof exonum.runtime.AnyTx
                 * @instance
                 */
                AnyTx.prototype["arguments"] = $util.newBuffer([]);
    
                /**
                 * Creates a new AnyTx instance using the specified properties.
                 * @function create
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {exonum.runtime.IAnyTx=} [properties] Properties to set
                 * @returns {exonum.runtime.AnyTx} AnyTx instance
                 */
                AnyTx.create = function create(properties) {
                    return new AnyTx(properties);
                };
    
                /**
                 * Encodes the specified AnyTx message. Does not implicitly {@link exonum.runtime.AnyTx.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {exonum.runtime.IAnyTx} message AnyTx message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AnyTx.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.call_info != null && message.hasOwnProperty("call_info"))
                        $root.exonum.runtime.CallInfo.encode(message.call_info, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message["arguments"] != null && message.hasOwnProperty("arguments"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message["arguments"]);
                    return writer;
                };
    
                /**
                 * Encodes the specified AnyTx message, length delimited. Does not implicitly {@link exonum.runtime.AnyTx.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {exonum.runtime.IAnyTx} message AnyTx message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AnyTx.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an AnyTx message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.runtime.AnyTx} AnyTx
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AnyTx.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.runtime.AnyTx();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.call_info = $root.exonum.runtime.CallInfo.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message["arguments"] = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an AnyTx message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.runtime.AnyTx} AnyTx
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AnyTx.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an AnyTx message.
                 * @function verify
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AnyTx.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.call_info != null && message.hasOwnProperty("call_info")) {
                        var error = $root.exonum.runtime.CallInfo.verify(message.call_info);
                        if (error)
                            return "call_info." + error;
                    }
                    if (message["arguments"] != null && message.hasOwnProperty("arguments"))
                        if (!(message["arguments"] && typeof message["arguments"].length === "number" || $util.isString(message["arguments"])))
                            return "arguments: buffer expected";
                    return null;
                };
    
                /**
                 * Creates an AnyTx message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.runtime.AnyTx} AnyTx
                 */
                AnyTx.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.runtime.AnyTx)
                        return object;
                    var message = new $root.exonum.runtime.AnyTx();
                    if (object.call_info != null) {
                        if (typeof object.call_info !== "object")
                            throw TypeError(".exonum.runtime.AnyTx.call_info: object expected");
                        message.call_info = $root.exonum.runtime.CallInfo.fromObject(object.call_info);
                    }
                    if (object["arguments"] != null)
                        if (typeof object["arguments"] === "string")
                            $util.base64.decode(object["arguments"], message["arguments"] = $util.newBuffer($util.base64.length(object["arguments"])), 0);
                        else if (object["arguments"].length)
                            message["arguments"] = object["arguments"];
                    return message;
                };
    
                /**
                 * Creates a plain object from an AnyTx message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.runtime.AnyTx
                 * @static
                 * @param {exonum.runtime.AnyTx} message AnyTx
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AnyTx.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.call_info = null;
                        if (options.bytes === String)
                            object["arguments"] = "";
                        else {
                            object["arguments"] = [];
                            if (options.bytes !== Array)
                                object["arguments"] = $util.newBuffer(object["arguments"]);
                        }
                    }
                    if (message.call_info != null && message.hasOwnProperty("call_info"))
                        object.call_info = $root.exonum.runtime.CallInfo.toObject(message.call_info, options);
                    if (message["arguments"] != null && message.hasOwnProperty("arguments"))
                        object["arguments"] = options.bytes === String ? $util.base64.encode(message["arguments"], 0, message["arguments"].length) : options.bytes === Array ? Array.prototype.slice.call(message["arguments"]) : message["arguments"];
                    return object;
                };
    
                /**
                 * Converts this AnyTx to JSON.
                 * @function toJSON
                 * @memberof exonum.runtime.AnyTx
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AnyTx.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return AnyTx;
            })();
    
            runtime.ArtifactId = (function() {
    
                /**
                 * Properties of an ArtifactId.
                 * @memberof exonum.runtime
                 * @interface IArtifactId
                 * @property {number|null} [runtime_id] ArtifactId runtime_id
                 * @property {string|null} [name] ArtifactId name
                 * @property {string|null} [version] ArtifactId version
                 */
    
                /**
                 * Constructs a new ArtifactId.
                 * @memberof exonum.runtime
                 * @classdesc Represents an ArtifactId.
                 * @implements IArtifactId
                 * @constructor
                 * @param {exonum.runtime.IArtifactId=} [properties] Properties to set
                 */
                function ArtifactId(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ArtifactId runtime_id.
                 * @member {number} runtime_id
                 * @memberof exonum.runtime.ArtifactId
                 * @instance
                 */
                ArtifactId.prototype.runtime_id = 0;
    
                /**
                 * ArtifactId name.
                 * @member {string} name
                 * @memberof exonum.runtime.ArtifactId
                 * @instance
                 */
                ArtifactId.prototype.name = "";
    
                /**
                 * ArtifactId version.
                 * @member {string} version
                 * @memberof exonum.runtime.ArtifactId
                 * @instance
                 */
                ArtifactId.prototype.version = "";
    
                /**
                 * Creates a new ArtifactId instance using the specified properties.
                 * @function create
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {exonum.runtime.IArtifactId=} [properties] Properties to set
                 * @returns {exonum.runtime.ArtifactId} ArtifactId instance
                 */
                ArtifactId.create = function create(properties) {
                    return new ArtifactId(properties);
                };
    
                /**
                 * Encodes the specified ArtifactId message. Does not implicitly {@link exonum.runtime.ArtifactId.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {exonum.runtime.IArtifactId} message ArtifactId message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ArtifactId.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.runtime_id != null && message.hasOwnProperty("runtime_id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.runtime_id);
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.version != null && message.hasOwnProperty("version"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
                    return writer;
                };
    
                /**
                 * Encodes the specified ArtifactId message, length delimited. Does not implicitly {@link exonum.runtime.ArtifactId.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {exonum.runtime.IArtifactId} message ArtifactId message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ArtifactId.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an ArtifactId message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.runtime.ArtifactId} ArtifactId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ArtifactId.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.runtime.ArtifactId();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.runtime_id = reader.uint32();
                            break;
                        case 2:
                            message.name = reader.string();
                            break;
                        case 3:
                            message.version = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an ArtifactId message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.runtime.ArtifactId} ArtifactId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ArtifactId.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an ArtifactId message.
                 * @function verify
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ArtifactId.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.runtime_id != null && message.hasOwnProperty("runtime_id"))
                        if (!$util.isInteger(message.runtime_id))
                            return "runtime_id: integer expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.version != null && message.hasOwnProperty("version"))
                        if (!$util.isString(message.version))
                            return "version: string expected";
                    return null;
                };
    
                /**
                 * Creates an ArtifactId message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.runtime.ArtifactId} ArtifactId
                 */
                ArtifactId.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.runtime.ArtifactId)
                        return object;
                    var message = new $root.exonum.runtime.ArtifactId();
                    if (object.runtime_id != null)
                        message.runtime_id = object.runtime_id >>> 0;
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.version != null)
                        message.version = String(object.version);
                    return message;
                };
    
                /**
                 * Creates a plain object from an ArtifactId message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.runtime.ArtifactId
                 * @static
                 * @param {exonum.runtime.ArtifactId} message ArtifactId
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ArtifactId.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.runtime_id = 0;
                        object.name = "";
                        object.version = "";
                    }
                    if (message.runtime_id != null && message.hasOwnProperty("runtime_id"))
                        object.runtime_id = message.runtime_id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.version != null && message.hasOwnProperty("version"))
                        object.version = message.version;
                    return object;
                };
    
                /**
                 * Converts this ArtifactId to JSON.
                 * @function toJSON
                 * @memberof exonum.runtime.ArtifactId
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ArtifactId.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ArtifactId;
            })();
    
            runtime.ArtifactSpec = (function() {
    
                /**
                 * Properties of an ArtifactSpec.
                 * @memberof exonum.runtime
                 * @interface IArtifactSpec
                 * @property {exonum.runtime.IArtifactId|null} [artifact] ArtifactSpec artifact
                 * @property {Uint8Array|null} [payload] ArtifactSpec payload
                 */
    
                /**
                 * Constructs a new ArtifactSpec.
                 * @memberof exonum.runtime
                 * @classdesc Represents an ArtifactSpec.
                 * @implements IArtifactSpec
                 * @constructor
                 * @param {exonum.runtime.IArtifactSpec=} [properties] Properties to set
                 */
                function ArtifactSpec(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ArtifactSpec artifact.
                 * @member {exonum.runtime.IArtifactId|null|undefined} artifact
                 * @memberof exonum.runtime.ArtifactSpec
                 * @instance
                 */
                ArtifactSpec.prototype.artifact = null;
    
                /**
                 * ArtifactSpec payload.
                 * @member {Uint8Array} payload
                 * @memberof exonum.runtime.ArtifactSpec
                 * @instance
                 */
                ArtifactSpec.prototype.payload = $util.newBuffer([]);
    
                /**
                 * Creates a new ArtifactSpec instance using the specified properties.
                 * @function create
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {exonum.runtime.IArtifactSpec=} [properties] Properties to set
                 * @returns {exonum.runtime.ArtifactSpec} ArtifactSpec instance
                 */
                ArtifactSpec.create = function create(properties) {
                    return new ArtifactSpec(properties);
                };
    
                /**
                 * Encodes the specified ArtifactSpec message. Does not implicitly {@link exonum.runtime.ArtifactSpec.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {exonum.runtime.IArtifactSpec} message ArtifactSpec message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ArtifactSpec.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.artifact != null && message.hasOwnProperty("artifact"))
                        $root.exonum.runtime.ArtifactId.encode(message.artifact, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.payload != null && message.hasOwnProperty("payload"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.payload);
                    return writer;
                };
    
                /**
                 * Encodes the specified ArtifactSpec message, length delimited. Does not implicitly {@link exonum.runtime.ArtifactSpec.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {exonum.runtime.IArtifactSpec} message ArtifactSpec message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ArtifactSpec.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an ArtifactSpec message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.runtime.ArtifactSpec} ArtifactSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ArtifactSpec.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.runtime.ArtifactSpec();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.artifact = $root.exonum.runtime.ArtifactId.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.payload = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an ArtifactSpec message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.runtime.ArtifactSpec} ArtifactSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ArtifactSpec.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an ArtifactSpec message.
                 * @function verify
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ArtifactSpec.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.artifact != null && message.hasOwnProperty("artifact")) {
                        var error = $root.exonum.runtime.ArtifactId.verify(message.artifact);
                        if (error)
                            return "artifact." + error;
                    }
                    if (message.payload != null && message.hasOwnProperty("payload"))
                        if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                            return "payload: buffer expected";
                    return null;
                };
    
                /**
                 * Creates an ArtifactSpec message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.runtime.ArtifactSpec} ArtifactSpec
                 */
                ArtifactSpec.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.runtime.ArtifactSpec)
                        return object;
                    var message = new $root.exonum.runtime.ArtifactSpec();
                    if (object.artifact != null) {
                        if (typeof object.artifact !== "object")
                            throw TypeError(".exonum.runtime.ArtifactSpec.artifact: object expected");
                        message.artifact = $root.exonum.runtime.ArtifactId.fromObject(object.artifact);
                    }
                    if (object.payload != null)
                        if (typeof object.payload === "string")
                            $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                        else if (object.payload.length)
                            message.payload = object.payload;
                    return message;
                };
    
                /**
                 * Creates a plain object from an ArtifactSpec message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.runtime.ArtifactSpec
                 * @static
                 * @param {exonum.runtime.ArtifactSpec} message ArtifactSpec
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ArtifactSpec.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.artifact = null;
                        if (options.bytes === String)
                            object.payload = "";
                        else {
                            object.payload = [];
                            if (options.bytes !== Array)
                                object.payload = $util.newBuffer(object.payload);
                        }
                    }
                    if (message.artifact != null && message.hasOwnProperty("artifact"))
                        object.artifact = $root.exonum.runtime.ArtifactId.toObject(message.artifact, options);
                    if (message.payload != null && message.hasOwnProperty("payload"))
                        object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                    return object;
                };
    
                /**
                 * Converts this ArtifactSpec to JSON.
                 * @function toJSON
                 * @memberof exonum.runtime.ArtifactSpec
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ArtifactSpec.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ArtifactSpec;
            })();
    
            runtime.InstanceSpec = (function() {
    
                /**
                 * Properties of an InstanceSpec.
                 * @memberof exonum.runtime
                 * @interface IInstanceSpec
                 * @property {number|null} [id] InstanceSpec id
                 * @property {string|null} [name] InstanceSpec name
                 * @property {exonum.runtime.IArtifactId|null} [artifact] InstanceSpec artifact
                 */
    
                /**
                 * Constructs a new InstanceSpec.
                 * @memberof exonum.runtime
                 * @classdesc Represents an InstanceSpec.
                 * @implements IInstanceSpec
                 * @constructor
                 * @param {exonum.runtime.IInstanceSpec=} [properties] Properties to set
                 */
                function InstanceSpec(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * InstanceSpec id.
                 * @member {number} id
                 * @memberof exonum.runtime.InstanceSpec
                 * @instance
                 */
                InstanceSpec.prototype.id = 0;
    
                /**
                 * InstanceSpec name.
                 * @member {string} name
                 * @memberof exonum.runtime.InstanceSpec
                 * @instance
                 */
                InstanceSpec.prototype.name = "";
    
                /**
                 * InstanceSpec artifact.
                 * @member {exonum.runtime.IArtifactId|null|undefined} artifact
                 * @memberof exonum.runtime.InstanceSpec
                 * @instance
                 */
                InstanceSpec.prototype.artifact = null;
    
                /**
                 * Creates a new InstanceSpec instance using the specified properties.
                 * @function create
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {exonum.runtime.IInstanceSpec=} [properties] Properties to set
                 * @returns {exonum.runtime.InstanceSpec} InstanceSpec instance
                 */
                InstanceSpec.create = function create(properties) {
                    return new InstanceSpec(properties);
                };
    
                /**
                 * Encodes the specified InstanceSpec message. Does not implicitly {@link exonum.runtime.InstanceSpec.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {exonum.runtime.IInstanceSpec} message InstanceSpec message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InstanceSpec.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && message.hasOwnProperty("id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.artifact != null && message.hasOwnProperty("artifact"))
                        $root.exonum.runtime.ArtifactId.encode(message.artifact, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified InstanceSpec message, length delimited. Does not implicitly {@link exonum.runtime.InstanceSpec.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {exonum.runtime.IInstanceSpec} message InstanceSpec message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InstanceSpec.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an InstanceSpec message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.runtime.InstanceSpec} InstanceSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InstanceSpec.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.runtime.InstanceSpec();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.uint32();
                            break;
                        case 2:
                            message.name = reader.string();
                            break;
                        case 3:
                            message.artifact = $root.exonum.runtime.ArtifactId.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an InstanceSpec message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.runtime.InstanceSpec} InstanceSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InstanceSpec.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an InstanceSpec message.
                 * @function verify
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                InstanceSpec.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id))
                            return "id: integer expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.artifact != null && message.hasOwnProperty("artifact")) {
                        var error = $root.exonum.runtime.ArtifactId.verify(message.artifact);
                        if (error)
                            return "artifact." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates an InstanceSpec message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.runtime.InstanceSpec} InstanceSpec
                 */
                InstanceSpec.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.runtime.InstanceSpec)
                        return object;
                    var message = new $root.exonum.runtime.InstanceSpec();
                    if (object.id != null)
                        message.id = object.id >>> 0;
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.artifact != null) {
                        if (typeof object.artifact !== "object")
                            throw TypeError(".exonum.runtime.InstanceSpec.artifact: object expected");
                        message.artifact = $root.exonum.runtime.ArtifactId.fromObject(object.artifact);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from an InstanceSpec message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.runtime.InstanceSpec
                 * @static
                 * @param {exonum.runtime.InstanceSpec} message InstanceSpec
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                InstanceSpec.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = 0;
                        object.name = "";
                        object.artifact = null;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.artifact != null && message.hasOwnProperty("artifact"))
                        object.artifact = $root.exonum.runtime.ArtifactId.toObject(message.artifact, options);
                    return object;
                };
    
                /**
                 * Converts this InstanceSpec to JSON.
                 * @function toJSON
                 * @memberof exonum.runtime.InstanceSpec
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                InstanceSpec.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return InstanceSpec;
            })();
    
            runtime.Caller = (function() {
    
                /**
                 * Properties of a Caller.
                 * @memberof exonum.runtime
                 * @interface ICaller
                 * @property {exonum.crypto.IPublicKey|null} [transaction_author] Caller transaction_author
                 * @property {number|null} [instance_id] Caller instance_id
                 * @property {google.protobuf.IEmpty|null} [blockchain] Caller blockchain
                 */
    
                /**
                 * Constructs a new Caller.
                 * @memberof exonum.runtime
                 * @classdesc Represents a Caller.
                 * @implements ICaller
                 * @constructor
                 * @param {exonum.runtime.ICaller=} [properties] Properties to set
                 */
                function Caller(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Caller transaction_author.
                 * @member {exonum.crypto.IPublicKey|null|undefined} transaction_author
                 * @memberof exonum.runtime.Caller
                 * @instance
                 */
                Caller.prototype.transaction_author = null;
    
                /**
                 * Caller instance_id.
                 * @member {number} instance_id
                 * @memberof exonum.runtime.Caller
                 * @instance
                 */
                Caller.prototype.instance_id = 0;
    
                /**
                 * Caller blockchain.
                 * @member {google.protobuf.IEmpty|null|undefined} blockchain
                 * @memberof exonum.runtime.Caller
                 * @instance
                 */
                Caller.prototype.blockchain = null;
    
                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;
    
                /**
                 * Caller caller.
                 * @member {"transaction_author"|"instance_id"|"blockchain"|undefined} caller
                 * @memberof exonum.runtime.Caller
                 * @instance
                 */
                Object.defineProperty(Caller.prototype, "caller", {
                    get: $util.oneOfGetter($oneOfFields = ["transaction_author", "instance_id", "blockchain"]),
                    set: $util.oneOfSetter($oneOfFields)
                });
    
                /**
                 * Creates a new Caller instance using the specified properties.
                 * @function create
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {exonum.runtime.ICaller=} [properties] Properties to set
                 * @returns {exonum.runtime.Caller} Caller instance
                 */
                Caller.create = function create(properties) {
                    return new Caller(properties);
                };
    
                /**
                 * Encodes the specified Caller message. Does not implicitly {@link exonum.runtime.Caller.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {exonum.runtime.ICaller} message Caller message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Caller.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.transaction_author != null && message.hasOwnProperty("transaction_author"))
                        $root.exonum.crypto.PublicKey.encode(message.transaction_author, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.instance_id != null && message.hasOwnProperty("instance_id"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.instance_id);
                    if (message.blockchain != null && message.hasOwnProperty("blockchain"))
                        $root.google.protobuf.Empty.encode(message.blockchain, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified Caller message, length delimited. Does not implicitly {@link exonum.runtime.Caller.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {exonum.runtime.ICaller} message Caller message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Caller.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Caller message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.runtime.Caller} Caller
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Caller.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.runtime.Caller();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.transaction_author = $root.exonum.crypto.PublicKey.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.instance_id = reader.uint32();
                            break;
                        case 3:
                            message.blockchain = $root.google.protobuf.Empty.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Caller message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.runtime.Caller} Caller
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Caller.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Caller message.
                 * @function verify
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Caller.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.transaction_author != null && message.hasOwnProperty("transaction_author")) {
                        properties.caller = 1;
                        {
                            var error = $root.exonum.crypto.PublicKey.verify(message.transaction_author);
                            if (error)
                                return "transaction_author." + error;
                        }
                    }
                    if (message.instance_id != null && message.hasOwnProperty("instance_id")) {
                        if (properties.caller === 1)
                            return "caller: multiple values";
                        properties.caller = 1;
                        if (!$util.isInteger(message.instance_id))
                            return "instance_id: integer expected";
                    }
                    if (message.blockchain != null && message.hasOwnProperty("blockchain")) {
                        if (properties.caller === 1)
                            return "caller: multiple values";
                        properties.caller = 1;
                        {
                            var error = $root.google.protobuf.Empty.verify(message.blockchain);
                            if (error)
                                return "blockchain." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a Caller message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.runtime.Caller} Caller
                 */
                Caller.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.runtime.Caller)
                        return object;
                    var message = new $root.exonum.runtime.Caller();
                    if (object.transaction_author != null) {
                        if (typeof object.transaction_author !== "object")
                            throw TypeError(".exonum.runtime.Caller.transaction_author: object expected");
                        message.transaction_author = $root.exonum.crypto.PublicKey.fromObject(object.transaction_author);
                    }
                    if (object.instance_id != null)
                        message.instance_id = object.instance_id >>> 0;
                    if (object.blockchain != null) {
                        if (typeof object.blockchain !== "object")
                            throw TypeError(".exonum.runtime.Caller.blockchain: object expected");
                        message.blockchain = $root.google.protobuf.Empty.fromObject(object.blockchain);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a Caller message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.runtime.Caller
                 * @static
                 * @param {exonum.runtime.Caller} message Caller
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Caller.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (message.transaction_author != null && message.hasOwnProperty("transaction_author")) {
                        object.transaction_author = $root.exonum.crypto.PublicKey.toObject(message.transaction_author, options);
                        if (options.oneofs)
                            object.caller = "transaction_author";
                    }
                    if (message.instance_id != null && message.hasOwnProperty("instance_id")) {
                        object.instance_id = message.instance_id;
                        if (options.oneofs)
                            object.caller = "instance_id";
                    }
                    if (message.blockchain != null && message.hasOwnProperty("blockchain")) {
                        object.blockchain = $root.google.protobuf.Empty.toObject(message.blockchain, options);
                        if (options.oneofs)
                            object.caller = "blockchain";
                    }
                    return object;
                };
    
                /**
                 * Converts this Caller to JSON.
                 * @function toJSON
                 * @memberof exonum.runtime.Caller
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Caller.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Caller;
            })();
    
            return runtime;
        })();
    
        exonum.common = (function() {
    
            /**
             * Namespace common.
             * @memberof exonum
             * @namespace
             */
            var common = {};
    
            common.BitVec = (function() {
    
                /**
                 * Properties of a BitVec.
                 * @memberof exonum.common
                 * @interface IBitVec
                 * @property {Uint8Array|null} [data] BitVec data
                 * @property {number|Long|null} [len] BitVec len
                 */
    
                /**
                 * Constructs a new BitVec.
                 * @memberof exonum.common
                 * @classdesc Represents a BitVec.
                 * @implements IBitVec
                 * @constructor
                 * @param {exonum.common.IBitVec=} [properties] Properties to set
                 */
                function BitVec(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * BitVec data.
                 * @member {Uint8Array} data
                 * @memberof exonum.common.BitVec
                 * @instance
                 */
                BitVec.prototype.data = $util.newBuffer([]);
    
                /**
                 * BitVec len.
                 * @member {number|Long} len
                 * @memberof exonum.common.BitVec
                 * @instance
                 */
                BitVec.prototype.len = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Creates a new BitVec instance using the specified properties.
                 * @function create
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {exonum.common.IBitVec=} [properties] Properties to set
                 * @returns {exonum.common.BitVec} BitVec instance
                 */
                BitVec.create = function create(properties) {
                    return new BitVec(properties);
                };
    
                /**
                 * Encodes the specified BitVec message. Does not implicitly {@link exonum.common.BitVec.verify|verify} messages.
                 * @function encode
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {exonum.common.IBitVec} message BitVec message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BitVec.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.data != null && message.hasOwnProperty("data"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                    if (message.len != null && message.hasOwnProperty("len"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.len);
                    return writer;
                };
    
                /**
                 * Encodes the specified BitVec message, length delimited. Does not implicitly {@link exonum.common.BitVec.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {exonum.common.IBitVec} message BitVec message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BitVec.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a BitVec message from the specified reader or buffer.
                 * @function decode
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {exonum.common.BitVec} BitVec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BitVec.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.exonum.common.BitVec();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.data = reader.bytes();
                            break;
                        case 2:
                            message.len = reader.uint64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a BitVec message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {exonum.common.BitVec} BitVec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BitVec.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a BitVec message.
                 * @function verify
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                BitVec.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.data != null && message.hasOwnProperty("data"))
                        if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                            return "data: buffer expected";
                    if (message.len != null && message.hasOwnProperty("len"))
                        if (!$util.isInteger(message.len) && !(message.len && $util.isInteger(message.len.low) && $util.isInteger(message.len.high)))
                            return "len: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a BitVec message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {exonum.common.BitVec} BitVec
                 */
                BitVec.fromObject = function fromObject(object) {
                    if (object instanceof $root.exonum.common.BitVec)
                        return object;
                    var message = new $root.exonum.common.BitVec();
                    if (object.data != null)
                        if (typeof object.data === "string")
                            $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                        else if (object.data.length)
                            message.data = object.data;
                    if (object.len != null)
                        if ($util.Long)
                            (message.len = $util.Long.fromValue(object.len)).unsigned = true;
                        else if (typeof object.len === "string")
                            message.len = parseInt(object.len, 10);
                        else if (typeof object.len === "number")
                            message.len = object.len;
                        else if (typeof object.len === "object")
                            message.len = new $util.LongBits(object.len.low >>> 0, object.len.high >>> 0).toNumber(true);
                    return message;
                };
    
                /**
                 * Creates a plain object from a BitVec message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof exonum.common.BitVec
                 * @static
                 * @param {exonum.common.BitVec} message BitVec
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                BitVec.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.data = "";
                        else {
                            object.data = [];
                            if (options.bytes !== Array)
                                object.data = $util.newBuffer(object.data);
                        }
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.len = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.len = options.longs === String ? "0" : 0;
                    }
                    if (message.data != null && message.hasOwnProperty("data"))
                        object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                    if (message.len != null && message.hasOwnProperty("len"))
                        if (typeof message.len === "number")
                            object.len = options.longs === String ? String(message.len) : message.len;
                        else
                            object.len = options.longs === String ? $util.Long.prototype.toString.call(message.len) : options.longs === Number ? new $util.LongBits(message.len.low >>> 0, message.len.high >>> 0).toNumber(true) : message.len;
                    return object;
                };
    
                /**
                 * Converts this BitVec to JSON.
                 * @function toJSON
                 * @memberof exonum.common.BitVec
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BitVec.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return BitVec;
            })();
    
            return common;
        })();
    
        return exonum;
    })();
    
    $root.google = (function() {
    
        /**
         * Namespace google.
         * @exports google
         * @namespace
         */
        var google = {};
    
        google.protobuf = (function() {
    
            /**
             * Namespace protobuf.
             * @memberof google
             * @namespace
             */
            var protobuf = {};
    
            protobuf.Timestamp = (function() {
    
                /**
                 * Properties of a Timestamp.
                 * @memberof google.protobuf
                 * @interface ITimestamp
                 * @property {number|Long|null} [seconds] Timestamp seconds
                 * @property {number|null} [nanos] Timestamp nanos
                 */
    
                /**
                 * Constructs a new Timestamp.
                 * @memberof google.protobuf
                 * @classdesc Represents a Timestamp.
                 * @implements ITimestamp
                 * @constructor
                 * @param {google.protobuf.ITimestamp=} [properties] Properties to set
                 */
                function Timestamp(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Timestamp seconds.
                 * @member {number|Long} seconds
                 * @memberof google.protobuf.Timestamp
                 * @instance
                 */
                Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Timestamp nanos.
                 * @member {number} nanos
                 * @memberof google.protobuf.Timestamp
                 * @instance
                 */
                Timestamp.prototype.nanos = 0;
    
                /**
                 * Creates a new Timestamp instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.ITimestamp=} [properties] Properties to set
                 * @returns {google.protobuf.Timestamp} Timestamp instance
                 */
                Timestamp.create = function create(properties) {
                    return new Timestamp(properties);
                };
    
                /**
                 * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Timestamp.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                    return writer;
                };
    
                /**
                 * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Timestamp message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Timestamp} Timestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Timestamp.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.seconds = reader.int64();
                            break;
                        case 2:
                            message.nanos = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Timestamp message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.Timestamp} Timestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Timestamp.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Timestamp message.
                 * @function verify
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Timestamp.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                            return "seconds: integer|Long expected";
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        if (!$util.isInteger(message.nanos))
                            return "nanos: integer expected";
                    return null;
                };
    
                /**
                 * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.Timestamp} Timestamp
                 */
                Timestamp.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.Timestamp)
                        return object;
                    var message = new $root.google.protobuf.Timestamp();
                    if (object.seconds != null)
                        if ($util.Long)
                            (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                        else if (typeof object.seconds === "string")
                            message.seconds = parseInt(object.seconds, 10);
                        else if (typeof object.seconds === "number")
                            message.seconds = object.seconds;
                        else if (typeof object.seconds === "object")
                            message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                    if (object.nanos != null)
                        message.nanos = object.nanos | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.Timestamp
                 * @static
                 * @param {google.protobuf.Timestamp} message Timestamp
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Timestamp.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.seconds = options.longs === String ? "0" : 0;
                        object.nanos = 0;
                    }
                    if (message.seconds != null && message.hasOwnProperty("seconds"))
                        if (typeof message.seconds === "number")
                            object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                        else
                            object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                    if (message.nanos != null && message.hasOwnProperty("nanos"))
                        object.nanos = message.nanos;
                    return object;
                };
    
                /**
                 * Converts this Timestamp to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.Timestamp
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Timestamp.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Timestamp;
            })();
    
            protobuf.Empty = (function() {
    
                /**
                 * Properties of an Empty.
                 * @memberof google.protobuf
                 * @interface IEmpty
                 */
    
                /**
                 * Constructs a new Empty.
                 * @memberof google.protobuf
                 * @classdesc Represents an Empty.
                 * @implements IEmpty
                 * @constructor
                 * @param {google.protobuf.IEmpty=} [properties] Properties to set
                 */
                function Empty(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Creates a new Empty instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {google.protobuf.IEmpty=} [properties] Properties to set
                 * @returns {google.protobuf.Empty} Empty instance
                 */
                Empty.create = function create(properties) {
                    return new Empty(properties);
                };
    
                /**
                 * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Empty.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };
    
                /**
                 * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Empty.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Empty message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Empty} Empty
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Empty.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Empty();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an Empty message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.Empty} Empty
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Empty.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Empty message.
                 * @function verify
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Empty.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    return null;
                };
    
                /**
                 * Creates an Empty message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.Empty} Empty
                 */
                Empty.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.Empty)
                        return object;
                    return new $root.google.protobuf.Empty();
                };
    
                /**
                 * Creates a plain object from an Empty message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.Empty
                 * @static
                 * @param {google.protobuf.Empty} message Empty
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Empty.toObject = function toObject() {
                    return {};
                };
    
                /**
                 * Converts this Empty to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.Empty
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Empty.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Empty;
            })();
    
            return protobuf;
        })();
    
        return google;
    })();

    return $root;
});
