import { Express, NextFunction, Request, Response } from "express";
import { BACKFRONT_BASEURL, DATABASE, DB_EXT } from "./consts";
import axios, { AxiosError } from "axios";

export function install(app: Express): void {
    app.post("/login", (req: Request, res: Response, next: NextFunction) => {
        /*const username: string = req.body?.username;
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
        const expire = new Date();
        expire.setHours(expire.getHours() + 12);
        res.statusCode = 204;
        res.cookie("token", { username: username, session: session }, { httpOnly: true, expires: expire });
        res.end();
        next();*/

        axios.post(BACKFRONT_BASEURL + "/login", req.body)
                .then((ares) => {
                    const token: string = ares.data.token;
                    const expire = new Date();
                    expire.setHours(expire.getHours() + 12);
                    res.statusCode = 204;
                    res.cookie("token", token, { httpOnly: true, expires: expire });
                    res.end();
                    next();
                }).catch((error: Error | AxiosError) => {
                    res.statusCode = (axios.isAxiosError(error) && error.status) ? error.status : 500;
                    res.end();
                    next();
                });
    });

    app.post("/register", (req: Request, res: Response, next: NextFunction) => {
        /*const username: string = req.body?.username;
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
        // Create account info
        buildNewAccountInfo(username);
        res.statusCode = 201;
        res.end();
        next();*/

        axios.post(BACKFRONT_BASEURL + "/register", req.body)
                .then((ares) => {
                    res.statusCode = ares.status;
                    res.end();
                    next();
                }).catch((error: Error | AxiosError) => {
                    res.statusCode = (axios.isAxiosError(error) && error.status) ? error.status : 500;
                    res.end();
                    next();
                });
    });

    // Check session middle ware
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        if ( !res.writableEnded ) {
            /*const sessionCookie = req.cookies.token;
            if ( !sessionCookie ) {
                console.warn("USER_ERR on authentification : No session cookie provided)");
                res.statusCode = 403;
                res.end();
                next("auth Error");
                return;
            }
            const username: string | undefined = sessionCookie.username;
            const session: string | undefined = sessionCookie.session;
            // Sanitize
            if ( !username || !session || !assertId(username) || !assertId(session) ) {
                console.warn("USER_ERR on authentification : username or session not sanitized (" + username + ", " + (!session?.length ? "undefined" : session.length > 0 ? "***" : "undefined") + ")");
                res.statusCode = 403;
                res.end();
                next("auth Error");
                return;
            }
            // Check session
            const realSession: string | undefined = getSession(username);
            if ( !realSession || session !== realSession ) {
                console.warn("USER_ERR on authentification : session doesn't match");
                res.statusCode = 403;
                res.end();
                next("auth Error");
                return;
            }
            // Refresh session
            const expire = new Date();
            expire.setHours(expire.getHours() + 12);
            res.cookie("token", { username: username, session: session }, { httpOnly: true, expires: expire });
            // Set username from session for other middlewares
            req.body.username = username;*/

            axios.post(BACKFRONT_BASEURL + "/isTokenValid", req.cookies.token, {headers: {"Content-Type": "application/json"}})
                    .then((ares) => {
                        req.body.username = ares.data.username;
                        const expire = new Date();
                        expire.setHours(expire.getHours() + 12);
                        res.cookie("token", req.cookies.token, { httpOnly: true, expires: expire });
                        next();
                    }).catch((error: Error | AxiosError) => {
                        res.cookie("token", undefined);
                        res.statusCode = (axios.isAxiosError(error) && error.status) ? error.status : 500;
                        res.end();
                        next("auth error");
                    });
        } else {
            next();
        }
    });

    app.get("/disconnect", (req: Request, res: Response, next: NextFunction) => {
        res.cookie("token", undefined);
        res.statusCode = 204;
        res.end();
        next();
    });

    app.get("/isAuth", (req: Request, res: Response, next: NextFunction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ username: req.body.username }));
        next();
    });
}
