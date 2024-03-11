"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertId = void 0;
const ALPHA_NUM = /^[a-zA-Z0-9]+$/;
const ID_MAX_LENGTH = 256;
function assertId(text) {
    return (ALPHA_NUM.test(text)) || (text.length > ID_MAX_LENGTH);
}
exports.assertId = assertId;
