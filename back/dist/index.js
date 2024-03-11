"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Login = __importStar(require("./login"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Log request start
app.all("*", (req, res, next) => {
    console.log("Request " + req.method + " on " + req.url + " called");
    next();
});
// up test
app.get("/", (req, res, next) => {
    res.write("Server is running");
    res.statusCode = 200;
    res.end();
    next();
});
// loging page
Login.install(app);
// Log request end and/or 404
app.use((err, req, res, next) => {
    console.log("Request " + req.method + " on " + req.url + " ended with " + res.statusCode);
});
app.use((req, res, next) => {
    if (!res.writableEnded) {
        res.statusCode = 404;
        res.end();
    }
    console.log("Request " + req.method + " on " + req.url + " ended with " + res.statusCode);
});
app.listen(8080, () => console.log("Server running on 8080"));
