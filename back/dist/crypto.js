"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randHex = exports.hash = void 0;
const crypto_1 = require("crypto");
function hash(thing) {
    return (0, crypto_1.createHash)('sha256').update(thing).digest('hex');
}
exports.hash = hash;
function randHex(size) {
    return (0, crypto_1.randomBytes)(size / 2).toString("hex");
}
exports.randHex = randHex;
