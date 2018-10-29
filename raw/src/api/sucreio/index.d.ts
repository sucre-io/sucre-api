import { IHash, IKeyPair } from '../../../interfaces';
export interface ISucreioAPIv1 {
    accounts: {
        create(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
    };
}
export declare const v1: ISucreioAPIv1;
