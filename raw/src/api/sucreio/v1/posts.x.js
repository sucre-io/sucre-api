"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
exports.postSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: false,
    content: {
        created_at: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        updated_at: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        postheadline: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        postbody: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        shares: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        message_tags: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        promotion_status: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        privacy: {
            type: ts_api_validator_1.StringPart,
            required: false
        }
    }
});
//# sourceMappingURL=posts.x.js.map