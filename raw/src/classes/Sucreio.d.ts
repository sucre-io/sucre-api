export interface IScureioClass {
    prepareForAPI(): Promise<any>;
}
export interface IScureioClassConstructor {
    new (hashMap: any): IScureioClass;
}
declare const _default: {
    AccountCreation: IScureioClassConstructor;
    PostCreation: IScureioClassConstructor;
};
export default _default;
