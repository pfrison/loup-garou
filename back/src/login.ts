import { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import { hash, randHex } from "./crypto";
import { assertId } from "./sanitize";
import { DATABASE, DB_EXT } from "./consts";

const LOGIN_SAVE = DATABASE + "logins/";
const SESSION_SAVE = DATABASE + "sessions/";

/**
 * This component add endpoints to create logins and session.
 * As well as a middle ware to check if the user is authenticated on all other pages.
 * Use the function isAuth to check if the user is authenticated before doing anything.
 */

export function install(app: Express): void {
    app.post("/login", (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body?.username;
        const password: string = req.body?.password;
        // Sanitize
        if ( !assertId(username) || !assertId(password) ) {
            console.warn("USER_ERR on /register : username or password not sanitized (" + username + ", " + (password.length > 0 ? "***" : "undefined") + ")");
            res.statusCode = 400;
            res.end();
            next();
            return;
        }
        // Check if password is good
        const realPassord: string | undefined = getLogin(username);
        if ( ! realPassord || hash(password) !== realPassord  ) {
            console.warn("USER_ERR on /login : username or password doesn't match (" + username + ", " + (password.length > 0 ? "***" : "undefined") + ")");
            res.statusCode = 403;
            res.end();
            next();
            return;
        }
        // Create session and send its id
        const session: string = createSession(username);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ sessionId: session }));
        next();
    });

    app.post("/register", (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body?.username;
        const password: string = req.body?.password;
        // Sanitize
        if ( !assertId(username) || !assertId(password) ) {
            console.warn("USER_ERR on /register : username or password not sanitized (" + username + ", " + (password.length > 0 ? "***" : "undefined") + ")");
            res.statusCode = 400;
            res.end();
            next();
            return;
        }
        // Check if login exist
        if ( getLogin(username) ) {
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
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        if ( ! res.writableEnded ) {
            req.body.isAuth = false;
            const username: string | undefined = req.get("auth.username");
            const session: string | undefined = req.get("auth.session");
            // Sanitize
            if ( !username || !session || !assertId(username) || !assertId(session) ) {
                console.warn("USER_ERR on authentification : username or session not sanitized (" + username + ", " + (!session?.length ? "undefined" : session.length > 0 ? "***" : "undefined") + ")");
                res.statusCode = 400;
                res.end();
                next("auth Error");
                return;
            }
            // Check session
            const realSession: string | undefined = getSession(username);
            if ( ! realSession || session !== realSession ) {
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

    app.get("/disconnect", (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username;
        clearSession(username);
        res.statusCode = 200;
        res.end();
        next();
    });

    app.get("/isAuth", (req: Request, res: Response, next: NextFunction) => {
        res.statusCode = 200;
        res.end();
        next();
    });
}

function getLogin(username: string): string | undefined {
    if ( ! fs.existsSync(LOGIN_SAVE) )
        fs.mkdirSync(LOGIN_SAVE, {recursive: true});
    if ( fs.readdirSync(LOGIN_SAVE).indexOf(username + DB_EXT) < 0 )
        return undefined;
    return fs.readFileSync(LOGIN_SAVE + username + DB_EXT, "utf8");
}

function createLogin(username: string, password: string): void {
    if ( ! fs.existsSync(LOGIN_SAVE) )
        fs.mkdirSync(LOGIN_SAVE, {recursive: true});
    fs.writeFileSync(LOGIN_SAVE + username + DB_EXT, hash(password), "utf8");
}

function createSession(username: string): string {
    const session = randHex(32);
    if ( ! fs.existsSync(SESSION_SAVE) )
        fs.mkdirSync(SESSION_SAVE, {recursive: true});
    fs.writeFileSync(SESSION_SAVE + username + DB_EXT, session, "utf8");
    return session;
}

function getSession(username: string): string | undefined {
    if ( ! fs.existsSync(SESSION_SAVE) )
        fs.mkdirSync(SESSION_SAVE, {recursive: true});
    if ( fs.readdirSync(SESSION_SAVE).indexOf(username + DB_EXT) < 0 )
        return undefined;
    return fs.readFileSync(SESSION_SAVE + username + DB_EXT, "utf8");
}

function clearSession(username: string): void {
    if ( fs.existsSync(SESSION_SAVE + username + DB_EXT) )
        fs.rmSync(SESSION_SAVE + username + DB_EXT);
}
