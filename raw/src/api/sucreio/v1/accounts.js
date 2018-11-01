"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sucreio_1 = require("../../../classes/Sucreio");
var request_1 = require("../../../utils/request");
var remap_1 = require("../../../utils/remap");
var accounts_x_1 = require("./accounts.x");
var fetch = request_1.createFetchWrapper(2 /* SUCREIO */, 0 /* V1 */, request_1.processJSON);
var preCreateAsync = function (data) { return accounts_x_1.accountSchema.parse(data); };
var postCreate = remap_1.createRemapper({
    type: null
});
exports.default = {
    create: request_1.wrapSucreioRequest(Sucreio_1.default.AccountCreation, preCreateAsync, postCreate, function (postParams) {
        return fetch('/api/v1/accounts', postParams);
    }),
    authenticate: request_1.wrapSucreioRequest(Sucreio_1.default.AccountCreation, preCreateAsync, postCreate, function (postParams) {
        return fetch('/api/v1/authenticate', postParams);
    }),
    getAccount: function (id, token) {
        if (token === void 0) { token = ''; }
        return fetch("/api/v1/accounts/" + id, request_1.headerTemplate('GET', token));
    },
};
//# sourceMappingURL=accounts.js.map