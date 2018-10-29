import { IHash, IKeyPair } from '../../../interfaces';

import v1Accounts from './v1/accounts';

export interface ISucreioAPIv1 {
    accounts: {
        create(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
        authenticate(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
    },

}

export const v1: ISucreioAPIv1 = {
    accounts: v1Accounts
};
