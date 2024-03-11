"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("./crypto");
const sanitize_1 = require("./sanitize");
const DATABASE = "./database/";
const LOGIN_SAVE = DATABASE + "logins/";
const SESSION_SAVE = DATABASE + "sessions/";
const DB_EXT = ".db";
/**
 * This component add endpoints to create logins and session.
 * As well as a middle ware to check if the user is authenticated on all other pages.
 * Use the function isAuth to check if the user is authenticated before doing anything.
 */
function install(app) {
    app.post("/login", (req, res, next) => {
        var _a, _b;
        const username = (_a = req.body) === null || _a === void 0 ? void 0 : _a.username;
        const password = (_b = req.body) === null || _b === void 0 ? void 0 : _b.password;
        // Sanitize
        if (!(0, sanitize_1.assertId)(username) || !(0, sanitize_1.assertId)(password)) {
            console.warn("USER_ERR on /register : username or password not sanitized (" + username + ", " + (password.length > 0 ? "***" : "undefined") + ")");
            res.statusCode = 400;
            res.end();
            next();
            return;
        }
        // Check if password is good
        const realPassord = getLogin(username);
        if (!realPassord || (0, crypto_1.hash)(password) !== realPassord) {
            console.warn("USER_ERR on /login : password doesn't match");
            res.statusCode = 403;
            res.end();
            next();
            return;
        }
        // Create session and send its id
        const session = createSession(username);
        res.statusCode = 200;
        res.end(session);
        next();
    });
    app.post("/register", (req, res, next) => {
        var _a, _b;
        const username = (_a = req.body) === null || _a === void 0 ? void 0 : _a.username;
        const password = (_b = req.body) === null || _b === void 0 ? void 0 : _b.password;
        // Sanitize
        if (!(0, sanitize_1.assertId)(username) || !(0, sanitize_1.assertId)(password)) {
            console.warn("USER_ERR on /register : username or password not sanitized (" + username + ", " + (password.length > 0 ? "***" : "undefined") + ")");
            res.statusCode = 400;
            res.end();
            next();
            return;
        }
        // Check if login exist
        if (getLogin(username)) {
            console.warn("USER_ERR on /register : username exist : " + username);
            res.statusCode = 403;
            res.end();
            next();
            return;
        }
        // Create login
        createLogin(username, password);
        res.statusCode = 201;
        res.end();
        next();
    });
    // Check session middle ware
    app.all("*", (req, res, next) => {
        if (!res.writableEnded) {
            req.body.isAuth = false;
            const username = req.get("auth.username");
            const session = req.get("auth.session");
            // Sanitize
            if (!username || !session || !(0, sanitize_1.assertId)(username) || !(0, sanitize_1.assertId)(session)) {
                console.warn("USER_ERR on authentification : username or session not sanitized (" + username + ", " + (!(session === null || session === void 0 ? void 0 : session.length) ? "undefined" : session.length > 0 ? "***" : "undefined") + ")");
                res.statusCode = 400;
                res.end();
                next("auth Error");
                return;
            }
            // Check session
            const realSession = getSession(username);
            if (!realSession || session !== realSession) {
                console.warn("USER_ERR on authentification : session doesn't match");
                res.statusCode = 403;
                res.end();
                next("auth Error");
                return;
            }
            req.body.isAuth = true;
            req.body.username = username;
        }
        next();
    });
    app.get("/disconnect", (req, res, next) => {
        const username = req.body.username;
        clearSession(username);
        res.statusCode = 200;
        res.end();
        next();
    });
    app.get("/isAuth", (req, res, next) => {
        res.statusCode = 200;
        res.end("You are authenticated as " + req.body.username);
        next();
    });
}
exports.install = install;
function getLogin(username) {
    if (!fs_1.default.existsSync(LOGIN_SAVE))
        fs_1.default.mkdirSync(LOGIN_SAVE, { recursive: true });
    if (fs_1.default.readdirSync(LOGIN_SAVE).indexOf(username + DB_EXT) < 0)
        return undefined;
    return fs_1.default.readFileSync(LOGIN_SAVE + username + DB_EXT, "utf8");
}
function createLogin(username, password) {
    if (!fs_1.default.existsSync(LOGIN_SAVE))
        fs_1.default.mkdirSync(LOGIN_SAVE, { recursive: true });
    fs_1.default.writeFileSync(LOGIN_SAVE + username + DB_EXT, (0, crypto_1.hash)(password), "utf8");
}
function createSession(username) {
    const session = (0, crypto_1.randHex)(32);
    if (!fs_1.default.existsSync(SESSION_SAVE))
        fs_1.default.mkdirSync(SESSION_SAVE, { recursive: true });
    fs_1.default.writeFileSync(SESSION_SAVE + username + DB_EXT, session, "utf8");
    return session;
}
function getSession(username) {
    if (!fs_1.default.existsSync(SESSION_SAVE))
        fs_1.default.mkdirSync(SESSION_SAVE, { recursive: true });
    if (fs_1.default.readdirSync(SESSION_SAVE).indexOf(username + DB_EXT) < 0)
        return undefined;
    return fs_1.default.readFileSync(SESSION_SAVE + username + DB_EXT, "utf8");
}
function clearSession(username) {
    if (fs_1.default.existsSync(SESSION_SAVE + username + DB_EXT))
        fs_1.default.rmSync(SESSION_SAVE + username + DB_EXT);
}
