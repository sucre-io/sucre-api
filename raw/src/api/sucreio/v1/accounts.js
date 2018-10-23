"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../../utils/request");
var fetch = request_1.createFetchWrapper(2 /* SUCREIO */, 0 /* V1 */, request_1.processJSON);
exports.default = {
    create: function (data) {
        return fetch("/signup").then(function (res) {
            return res;
        });
    },
};
//# sourceMappingURL=accounts.js.map