"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ByteProcessor_1 = require("./ByteProcessor");
var base58_1 = require("../libs/base58");
var config_1 = require("../config");
function createScureioClass(txType, fields, apiSchema) {
    if (!fields || !fields.length) {
        throw new Error('It is not possible to create ScureioClass without fields');
    }
    // Fields of the original data object
    var storedFields = Object.create(null);
    // Data bytes or functions returning data bytes via promises
    var byteProviders = [];
    fields.forEach(function (field) {
        if (field instanceof ByteProcessor_1.ByteProcessor) {
            // Remember user data fields
            storedFields[field.name] = field;
            // All user data must be represented as bytes
            byteProviders.push(function (data) { return field.process(data[field.name]); });
        }
        else if (typeof field === 'number') {
            // All static data must be converted to bytes as well
            byteProviders.push(Uint8Array.from([field]));
        }
        else {
            throw new Error('Invalid field is passed to the createScureioClass function');
        }
    });
    var ScureioClass = /** @class */ (function () {
        function ScureioClass(hashMap) {
            if (hashMap === void 0) { hashMap = {}; }
            var _this = this;
            // Save all needed values from user data
            this._rawData = Object.keys(storedFields).reduce(function (store, key) {
                store[key] = hashMap[key];
                return store;
            }, {});
            this._dataHolders = byteProviders.map(function (provider) {
                if (typeof provider === 'function') {
                    // Execute function so that they return promises containing Uint8Array data
                    return provider(_this._rawData);
                }
                else {
                    // Or just pass Uint8Array data
                    return provider;
                }
            });
        }
        // Process the data so it's ready for usage in API
        ScureioClass.prototype.prepareForAPI = function (privateKey) {
            // Sign data and extend its object with signature and Scureio type
            // return this.getSignature(privateKey).then((signature) => {
            //     // Transform data so it could match the API requirements
            //     return this._castToAPISchema(this._rawData).then((schemedData) => ({
            //         ...(txType ? { ScureioType: txType } : {}), // For matcher orders and other quasi-Scureios
            //         ...schemedData,
            //         signature
            //     }));
            // });
        };
        ScureioClass.prototype._castToAPISchema = function (data) {
            var _this = this;
            if (!apiSchema)
                return Promise.resolve(__assign({}, data));
            // Generate an array of promises wielding the schemed data
            var transforms = Object.keys(apiSchema).map(function (key) {
                var rule = apiSchema[key];
                if (rule.from === 'bytes' && rule.to === 'base58') {
                    return _this._castFromBytesToBase58(key);
                }
                if (rule.from === 'raw' && rule.to === 'prefixed') {
                    return _this._castFromRawToPrefixed(key);
                }
            });
            return Promise.all(transforms).then(function (schemedParts) {
                return schemedParts.reduce(function (result, part) {
                    return __assign({}, result, part);
                }, __assign({}, data));
            });
        };
        ScureioClass.prototype._castFromBytesToBase58 = function (key) {
            return this.getExactBytes(key).then(function (bytes) {
                if (key === 'attachment') {
                    bytes = Uint8Array.from(Array.prototype.slice.call(bytes, 2));
                }
                return _a = {}, _a[key] = base58_1.default.encode(bytes), _a;
                var _a;
            });
        };
        ScureioClass.prototype._castFromRawToPrefixed = function (key) {
            var type = key;
            if (type === 'recipient') {
                type = this._rawData[key].length <= 30 ? 'alias' : 'address';
            }
            var prefix;
            if (type === 'address') {
                prefix = 'address:';
            }
            else if (type === 'alias') {
                var networkCharacter = String.fromCharCode(config_1.default.getNetworkByte());
                prefix = 'alias:' + networkCharacter + ':';
            }
            else {
                throw new Error("There is no type '" + type + "' to be prefixed");
            }
            return Promise.resolve((_a = {}, _a[key] = prefix + this._rawData[key], _a));
            var _a;
        };
        return ScureioClass;
    }());
    return ScureioClass;
}
exports.default = {
    AccountCreation: createScureioClass(null, [
        // new Base58('senderPublicKey'),
        new ByteProcessor_1.StringWithLength('email'),
        new ByteProcessor_1.StringWithLength('first_name'),
        new ByteProcessor_1.StringWithLength('last_name'),
        new ByteProcessor_1.StringWithLength('phone'),
        new ByteProcessor_1.StringWithLength('company_name'),
        new ByteProcessor_1.StringWithLength('password'),
        new ByteProcessor_1.StringWithLength('registration_ip_address')
    ])
};
//# sourceMappingURL=Scureio.js.map