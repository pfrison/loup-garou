import { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import { DATABASE, DB_EXT } from "./consts";

const GAMES_SAVE = DATABASE + "games/";

enum State {
    CREATED,
    IN_PROGRESS,
    ENDED
}

type Game = {
    id: string,
    public: boolean,
    players: string[],
    maxPlayers: number,
    state: State
}

export function install(app: Express): void {
    app.get("/listPublicGames", (req: Request, res: Response, next: NextFunction) => {
        const games: Game[] = getAllGames()
            .filter(game => 
                game.public
                && game.state === State.CREATED
                && game.players.length < game.maxPlayers
                && !game.players.includes(req.body.username)
            );
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(games));
        next();
    });

    app.post("/createGame", (req: Request, res: Response, next: NextFunction) => {
        if ( ! req.body.isPublic || typeof req.body.isPublic !== "boolean" ) {
            res.statusCode = 400;
            res.end("isPublic is required");
            next();
            return;
        }
        if ( ! req.body.maxPlayers || typeof req.body.maxPlayers !== "string" ) {
            res.statusCode = 400;
            res.end("maxPlayers is required");
            next();
            return;
        }
        const game: Game = {
            id: createId(),
            public: req.body.isPublic,
            players: [req.body.username],
            maxPlayers: req.body.maxPlayers,
            state: State.CREATED
        };
        saveGame(game);
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({gameId: game.id}));
        next();
    });

    app.get("/joinGame", (req: Request, res: Response, next: NextFunction) => {
        if ( ! req.query.gameId || typeof req.query.gameId !== "string" ) {
            res.statusCode = 400;
            res.end("gameId is required");
            next();
            return;
        }
        const game: Game | undefined = getGame(req.query.gameId);
        if ( ! game || game.players.includes(req.body.username) ) {
            res.statusCode = 404;
            res.end("game doesn't exist or player is already in it");
            next();
            return;
        }
        game.players.push(req.body.username);
        saveGame(game);
        res.statusCode = 204;
        res.end();
        next();
    });

    app.get("/leaveGame", (req: Request, res: Response, next: NextFunction) => {
        if ( ! req.query.gameId || typeof req.query.gameId !== "string" ) {
            res.statusCode = 400;
            res.end("gameId is required");
            next();
            return;
        }
        const game: Game | undefined = getGame(req.query.gameId);
        if ( ! game || ! game.players.includes(req.body.username) ) {
            res.statusCode = 404;
            res.end("game doesn't exist or player not in it");
            next();
            return;
        }
        game.players = game.players.filter(a => a !== req.body.username);
        if ( game.players.length <= 0 )
            deleteGame(game.id);
        else
            saveGame(game);
        res.statusCode = 204;
        res.end();
        next();
    });

    app.get("/gameInfo", (req: Request, res: Response, next: NextFunction) => {
        if ( ! req.query.gameId || typeof req.query.gameId !== "string" ) {
            res.statusCode = 400;
            res.end("gameId is required");
            next();
            return;
        }
        const game: Game | undefined = getGame(req.query.gameId);
        if ( ! game ) {
            res.statusCode = 400;
            res.end("game doesn't exist");
            next();
            return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(game));
        next();
    });

    app.get("/playerGames", (req: Request, res: Response, next: NextFunction) => {
        const games: string[] = getAllGames()
            .filter(game => game.players.includes(req.body.username))
            .map(game => game.id);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(games));
        next();
    });
}

function getGame(gameId: string): Game | undefined {
    if ( ! fs.existsSync(GAMES_SAVE) )
        fs.mkdirSync(GAMES_SAVE, {recursive: true});
    if ( fs.readdirSync(GAMES_SAVE).indexOf(gameId + DB_EXT) < 0 )
        return undefined;
    return JSON.parse(fs.readFileSync(GAMES_SAVE + gameId + DB_EXT, "utf8"));
}

function getAllGames(): Game[] {
    if ( ! fs.existsSync(GAMES_SAVE) )
        fs.mkdirSync(GAMES_SAVE, {recursive: true});
    return fs.readdirSync(GAMES_SAVE)
        .map(file => file.substring(0, file.length - 3))
        .map(getGame)
        .filter(game => game)
        .map(game => game as Game)
}

function createId(): string {
    if ( ! fs.existsSync(GAMES_SAVE) )
        fs.mkdirSync(GAMES_SAVE, {recursive: true});
    let newId = "";
    do {
        newId = (Math.random()).toString(36).substring(2, 5) + "-" + (Math.random()).toString(36).substring(2, 6) + "-" + (Math.random()).toString(36).substring(2, 5);
    } while ( fs.existsSync(GAMES_SAVE + newId + DB_EXT) );
    return newId;
}

function saveGame(game: Game): void {
    if ( ! fs.existsSync(GAMES_SAVE) )
        fs.mkdirSync(GAMES_SAVE, {recursive: true});
    fs.writeFileSync(GAMES_SAVE + game.id + DB_EXT, JSON.stringify(game), "utf8");
}

function deleteGame(gameId: string): void {
    if ( ! fs.existsSync(GAMES_SAVE) )
        fs.mkdirSync(GAMES_SAVE, {recursive: true});
    fs.rmSync(GAMES_SAVE + gameId + DB_EXT);
}
