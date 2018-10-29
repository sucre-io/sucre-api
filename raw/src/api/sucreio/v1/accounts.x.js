"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
exports.accountSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: false,
    content: {
        email: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        first_name: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        last_name: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        phone: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        company_name: {
            type: ts_api_validator_1.StringPart,
            required: false
        },
        password: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        registration_ip_address: {
            type: ts_api_validator_1.StringPart,
            required: false
        }
    }
});
//# sourceMappingURL=accounts.x.js.map