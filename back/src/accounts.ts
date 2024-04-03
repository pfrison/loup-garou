import { Express, Request, Response, NextFunction } from "express";
import { DATABASE, DB_EXT } from "./consts";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";

const ACCOUNT_SAVE = DATABASE + "accounts/";
const PP_SAVE = ACCOUNT_SAVE + "profilePictures/";
const INFOS_SAVE = ACCOUNT_SAVE + "infos/";

type AccountInfo = {
    username: string,
    iconColorBg: string,
    iconColorFg: string
}

export function install(app: Express): void {
    app.post("/profilePicture", (req: Request, res: Response, next: NextFunction) => {
        if ( !req.files || Object.keys(req.files).length <= 0 ) {
            res.statusCode = 400;
            res.end("No file uploaded");
            next();
            return;
        }
        const file: UploadedFile = req.files.profilePicture as UploadedFile;
        saveProfilePicture(file, req.body.username);
        res.statusCode = 204;
        res.end();
        next();
    });

    app.get("/profilePicture", (req: Request, res: Response, next: NextFunction) => {
        let username: string = req.body.username;
        if ( req.query.user && typeof req.query.user === "string" )
            username = req.query.user;
        const profilePicture = profilePicturePath(username);
        if ( !profilePicture ) {
            res.statusCode = 404;
            res.end("Profile picture not found");
            next();
            return;
        }
        res.setHeader("Content-Type", "image/png");
        res.sendFile(profilePicture, { root: path.join(path.dirname(__dirname)) }, (err) => {
            if ( err ) {
                console.log("Unable to send file : " + err);
                res.statusCode = 500;
                res.end("Unable to send file");
                next();
                return;
            }
            res.statusCode = 200;
            res.end();
            next();
        });
    });

    app.get("/accountInfos", (req: Request, res: Response, next: NextFunction) => {
        let username: string = req.body.username;
        if ( req.query.user && typeof req.query.user === "string" )
            username = req.query.user;
        const infos: AccountInfo | undefined = getAccountInfo(username);
        if ( !infos ) {
            res.statusCode = 404;
            res.end("Unable to fetch account infos");
            next();
            return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(infos));
        next();
    });

    app.get("/accountsInfos", (req: Request, res: Response, next: NextFunction) => {
        if ( !req.query.users || typeof req.query.users !== "string" ) {
            res.statusCode = 400;
            res.end("users is required");
            next();
            return;
        }
        const users: string[] = req.query.users.split(",");
        const infos: AccountInfo[] = users.map(getAccountInfo).flatMap(i => i ? [i] : []);
        if ( infos.length <= 0 ) {
            res.statusCode = 404;
            res.end("Unable to fetch accounts infos");
            next();
            return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(infos));
        next();
    });
}

export function buildNewAccountInfo(username: string): void {
    const iconColorBg: number = Math.floor(Math.random() * 0xFFFFFF);
    const luminance: number =
              ((iconColorBg & 0xFF0000) >> 16) * 0.2126
            + ((iconColorBg & 0XFF00) >> 8) * 0.7152
            + (iconColorBg & 0XFF) * 0.0722;
    const iconColorFg: number = luminance > 0.5 ? 0x000000 : 0xFFFFFF;
    saveAccountInfo({
        username: username,
        iconColorBg: "#" + iconColorBg.toString(16),
        iconColorFg: "#" + iconColorFg.toString(16)
    });
}

function saveProfilePicture(file: UploadedFile, username: string): void {
    if ( !fs.existsSync(PP_SAVE) )
        fs.mkdirSync(PP_SAVE, { recursive: true });
    file.mv(PP_SAVE + username + ".png", (err) => {
        console.log("Could not save profile picture file : " + err);
    });
}

function profilePicturePath(username: string): string | undefined {
    return fs.existsSync(PP_SAVE + username + ".png") ? PP_SAVE + username + ".png" : undefined;
}

function saveAccountInfo(infos: AccountInfo): void {
    if ( !fs.existsSync(INFOS_SAVE) )
        fs.mkdirSync(INFOS_SAVE, { recursive: true });
    fs.writeFileSync(INFOS_SAVE + infos.username + DB_EXT, JSON.stringify(infos), "utf8");
}

function getAccountInfo(username: string): AccountInfo | undefined {
    if ( ! fs.existsSync(INFOS_SAVE) )
        fs.mkdirSync(INFOS_SAVE, {recursive: true});
    if ( fs.readdirSync(INFOS_SAVE).indexOf(username + DB_EXT) < 0 )
        return undefined;
    return JSON.parse(fs.readFileSync(INFOS_SAVE + username + DB_EXT, "utf8"));
}
