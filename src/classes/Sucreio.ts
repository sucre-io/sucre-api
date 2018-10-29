import { IHash } from '../../interfaces';

import { ByteProcessor, Alias, Base58, Bool, Byte, Long, StringWithLength, AssetId, Attachment, MandatoryAssetId, OrderType, Recipient } from './ByteProcessor';

import { concatUint8Arrays } from '../utils/concat';
import crypto from '../utils/crypto';
import base58 from '../libs/base58';

import * as constants from '../constants';
import config from '../config';


type TScureioFields = Array<ByteProcessor | number>;

interface IAPISchema {
    readonly from: 'bytes' | 'raw';
    readonly to: 'base58' | 'prefixed';
}

export interface IScureioClass {
    prepareForAPI(): Promise<any>;
}

export interface IScureioClassConstructor {
    new(hashMap: any): IScureioClass;
}


function createScureioClass(txType: string | null, fields: TScureioFields, apiSchema?: IHash<IAPISchema>) {

    if (!fields || !fields.length) {
        throw new Error('It is not possible to create ScureioClass without fields');
    }

    // Fields of the original data object
    const storedFields: object = Object.create(null);

    // Data bytes or functions returning data bytes via promises
    const byteProviders: Array<Function | Uint8Array> = [];

    fields.forEach((field) => {
        if (field instanceof ByteProcessor) {
            // Remember user data fields
            storedFields[field.name] = field;
            // All user data must be represented as bytes
            byteProviders.push((data) => field.process(data[field.name]));
        } else if (typeof field === 'number') {
            // All static data must be converted to bytes as well
            byteProviders.push(Uint8Array.from([field]));
        } else {
            throw new Error('Invalid field is passed to the createScureioClass function');
        }
    });

    class ScureioClass implements IScureioClass {

        // Request data provided by user
        private readonly _rawData: object;

        // Array of Uint8Array and promises which return Uint8Array
        private readonly _dataHolders: Array<Uint8Array | Promise<Uint8Array>>;

        constructor(hashMap: any = {}) {

            // Save all needed values from user data
            this._rawData = Object.keys(storedFields).reduce((store, key) => {
                store[key] = hashMap[key];
                return store;
            }, {});

            this._dataHolders = byteProviders.map((provider) => {
                if (typeof provider === 'function') {
                    // Execute function so that they return promises containing Uint8Array data
                    return provider(this._rawData);
                } else {
                    // Or just pass Uint8Array data
                    return provider;
                }
            });

        }

        // Process the data so it's ready for usage in API
        public prepareForAPI(): Promise<any> {
                return this._castToAPISchema(this._rawData).then((schemedData) => ({
                    ...(txType ? { ScureioType: txType } : {}), // For matcher orders and other quasi-Scureios
                    ...schemedData
                }));
        }

        private _castToAPISchema(data): Promise<object> {

            if (!apiSchema) return Promise.resolve({ ...data });

            // Generate an array of promises wielding the schemed data
            const transforms: Array<Promise<object>> = Object.keys(apiSchema).map((key) => {

                const rule = apiSchema[key];

                if (rule.from === 'raw' && rule.to === 'prefixed') {
                    return this._castFromRawToPrefixed(key);
                }

            });

            return Promise.all(transforms).then((schemedParts) => {
                return schemedParts.reduce((result, part) => {
                    return { ...result, ...part };
                }, { ...data });
            });

        }


        private _castFromRawToPrefixed(key): Promise<object> {

            let type = key;
            if (type === 'recipient') {
                type = this._rawData[key].length <= 30 ? 'alias' : 'address';
            }

            let prefix;
            if (type === 'address') {
                prefix = 'address:';
            } else if (type === 'alias') {
                const networkCharacter = String.fromCharCode(config.getNetworkByte());
                prefix = 'alias:' + networkCharacter + ':';
            } else {
                throw new Error(`There is no type '${type}' to be prefixed`);
            }

            return Promise.resolve({ [key]: prefix + this._rawData[key] });

        }

    }

    return ScureioClass as IScureioClassConstructor;

}


export default {

    AccountCreation: createScureioClass(null, [
        new StringWithLength('email'),
        new StringWithLength('first_name'),
        new StringWithLength('last_name'),
        new StringWithLength('phone'),
        new StringWithLength('company_name'),
        new StringWithLength('password'),
        new StringWithLength('registration_ip_address')
    ])

};
