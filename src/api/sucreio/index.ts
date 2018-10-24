import v1Accounts from './v1/accounts';

export interface ISucreioAPIv1 {
    accounts: {
        create(data: string): Promise<any>;
    },

}

export const v1: ISucreioAPIv1 = {
    accounts: v1Accounts
};
