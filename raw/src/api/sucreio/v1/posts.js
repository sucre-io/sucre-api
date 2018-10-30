"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sucreio_1 = require("../../../classes/Sucreio");
var request_1 = require("../../../utils/request");
var remap_1 = require("../../../utils/remap");
var posts_x_1 = require("./posts.x");
var fetch = request_1.createFetchWrapper(2 /* SUCREIO */, 0 /* V1 */, request_1.processJSON);
var preCreateAsync = function (data) { return posts_x_1.postSchema.parse(data); };
var postCreate = remap_1.createRemapper({
    type: null,
    method: 'POST'
});
exports.default = {
    createPost: request_1.wrapSucreioRequest(Sucreio_1.default.PostCreation, preCreateAsync, postCreate, function (postParams) {
        return fetch('/api/v1/post', postParams);
    }),
    getAllPost: function (token) {
        return fetch('/api/v1/posts', request_1.headerTemplate('GET', token));
    },
};
//# sourceMappingURL=posts.js.map