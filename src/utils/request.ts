import { IHash, IKeyPair } from '../../interfaces';
import { ITransactionClassConstructor } from '../classes/Transactions';
import { IScureioClassConstructor } from '../classes/Sucreio';

import WavesRequestError from '../errors/WavesRequestError';

import fetch from '../libs/fetch';
import config from '../config';


export type TTransactionRequest = (data: IHash<any>, keyPair: IKeyPair) => Promise<any>;
export type TSucreioRequest = (data: IHash<any>, token: string) => Promise<any>;

export interface IFetchWrapper<T> {
  (path: string, options?: IHash<any>): Promise<T>;
}


export const enum PRODUCTS { NODE, MATCHER, SUCREIO }
export const enum VERSIONS { V1 }


export const POST_TEMPLATE = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  }
};

export function headerTemplate(mtd, token='') {
  let headerBody = {
    method: mtd,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  if(token){
    headerBody.headers['authorization'] = `Bearer ${token}`;
  }
  return headerBody;
}

const key = (product, version) => {
  return `${product}/${version}`;
};

const hostResolvers: IHash<() => string> = {
  [key(PRODUCTS.NODE, VERSIONS.V1)]: () => config.getNodeAddress(),
  [key(PRODUCTS.SUCREIO, VERSIONS.V1)]: () => config.getSucreioAddress(),
  [key(PRODUCTS.MATCHER, VERSIONS.V1)]: () => config.getMatcherAddress()
};


export function normalizeHost(host): string {
  return host.replace(/\/+$/, '');
}

export function normalizePath(path): string {
  return `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
}

export function processJSON(res) {
  if (res.ok) {
    return res.json();
  } else {
    return res.json().then(Promise.reject.bind(Promise));
  }
}


function handleError(url, data) {
  throw new WavesRequestError(url, data);
}


export function createFetchWrapper(product: PRODUCTS, version: VERSIONS, pipe?: Function): IFetchWrapper<any> {

  const resolveHost = hostResolvers[key(product, version)];

  return function(path: string, options?: IHash<any>): Promise<any> {
    const url = resolveHost() + normalizePath(path);
    const request = fetch(url, options);

    if (pipe) {
      return request.then(pipe).catch((data) => handleError(url, data));
    } else {
      return request.catch((data) => handleError(url, data));
    }

  };

}

export function wrapTransactionRequest(TransactionConstructor: ITransactionClassConstructor,
  preRemapAsync: (data: IHash<any>) => Promise<IHash<any>>,
  postRemap: (data: IHash<any>) => IHash<any>,
  callback: (postParams: IHash<any>) => Promise<any>) {

  return function(data: IHash<any>, keyPair: IKeyPair): Promise<any> {

    return preRemapAsync({

      // The order is required for `senderPublicKey` must be rewritten if it exists in `data`
      ...data,
      senderPublicKey: keyPair.publicKey

    }).then((validatedData) => {

      const transaction = new TransactionConstructor(validatedData);

      return transaction.prepareForAPI(keyPair.privateKey)
        .then(postRemap)
        .then((tx) => {
          return callback({
            ...POST_TEMPLATE,
            body: JSON.stringify(tx)
          });
        });

    });

  };

}

export function wrapSucreioRequest(ScureioConstructor: IScureioClassConstructor,
  preRemapAsync: (data: IHash<any>) => Promise<IHash<any>>,
  postRemap: (data: IHash<any>) => IHash<any>,
  callback: (postParams: IHash<any>) => Promise<any>) {

  return function(data: IHash<any>, token: string): Promise<any> {

    return preRemapAsync({
      ...data
    }).then((validatedData) => {

      const sucreio = new ScureioConstructor(validatedData);

      return sucreio.prepareForAPI()
        .then(postRemap)
        .then((tx) => {
          return callback({
            ...headerTemplate("POST", token),
            body: JSON.stringify(tx)
          });
        });

    });

  };

}
