import { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import { DATABASE, DB_EXT } from "./consts";

const GAMES_SAVE = DATABASE + "games/";

enum GameState {
    CREATED,
    IN_PROGRESS,
    ENDED
}

type Game = {
    id: string,
    public: boolean,
    players: Player[],
    maxPlayers: number,
    state: GameState
}

enum PlayerRole {
    VILLAGER,
    WEREWOLF,
    WITCH,
    SEER
}

type Player = {
    name: string,
    alive: boolean,
    role: PlayerRole | undefined
}

export function install(app: Express): void {
    app.get("/listPublicGames", (req: Request, res: Response, next: NextFunction) => {
        const games: Game[] = getAllGames()
            .filter(game => 
                game.public
                && game.state === GameState.CREATED
                && game.players.length < game.maxPlayers
                && game.players.filter(player => player.name === req.body.username).length <= 0
            );
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(games));
        next();
    });

    app.post("/createGame", (req: Request, res: Response, next: NextFunction) => {
        if ( req.body.isPublic === undefined || typeof req.body.isPublic !== "boolean" ) {
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
            players: [{
                name: req.body.username,
                alive: true,
                role: undefined
            }],
            maxPlayers: req.body.maxPlayers,
            state: GameState.CREATED
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
        if ( ! game || game.players.filter(player => player.name === req.body.username).length > 0 ) {
            res.statusCode = 404;
            res.end("game doesn't exist or player is already in it");
            next();
            return;
        }
        game.players.push({
            name: req.body.username,
            alive: true,
            role: undefined
        });
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
        if ( ! game || game.players.filter(player => player.name === req.body.username).length <= 0 ) {
            res.statusCode = 404;
            res.end("game doesn't exist or player not in it");
            next();
            return;
        }
        game.players = game.players.filter(player => player.name !== req.body.username);
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
        // Mask roles to avoid cheating
        game.players = game.players.map(player => {
            player.role = undefined;
            return player;
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(game));
        next();
    });

    app.get("/playerGames", (req: Request, res: Response, next: NextFunction) => {
        const games: string[] = getAllGames()
            .filter(game => game.players.filter(player => player.name === req.body.username).length > 0)
            .map(game => game.id);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(games));
        next();
    });

    app.get("/startGame", (req: Request, res: Response, next: NextFunction) => {
        if ( ! req.query.gameId || typeof req.query.gameId !== "string" ) {
            res.statusCode = 400;
            res.end("gameId is required");
            next();
            return;
        }
        const game: Game | undefined = getGame(req.query.gameId);
        if ( ! game || ! game.players[0].name === req.body.username ) {
            res.statusCode = 404;
            res.end("game doesn't exist or player not the game admin");
            next();
            return;
        }
        game.state = GameState.IN_PROGRESS;
        attributeRoles(game);
        saveGame(game);
        res.statusCode = 204;
        res.end();
        next();
    });

    app.get("/playerRoles", (req: Request, res: Response, next: NextFunction) => {
        if ( ! req.query.gameId || typeof req.query.gameId !== "string" ) {
            res.statusCode = 400;
            res.end("gameId is required");
            next();
            return;
        }
        const game: Game | undefined = getGame(req.query.gameId);
        if ( ! game || game.players.filter(player => player.name === req.body.username).length <= 0 ) {
            res.statusCode = 404;
            res.end("game doesn't exist or player not in it");
            next();
            return;
        }
        let roles: Player[] = [];
        const player: Player = game.players.find(player => player.name === req.body.username) as Player;
        if ( player.role === PlayerRole.WEREWOLF ) {
            roles = game.players.filter(player => player.role === PlayerRole.WEREWOLF);
        } else {
            roles = [ player ];
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(roles));
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

function attributeRoles(game: Game) {
    const players: number = game.players.length;
    let werewolves: number;
    if ( players < 5 )
        werewolves = 1;
    else if ( players < 12 )
        werewolves = 2;
    else
        werewolves = 3;
    const villagers: number = players - werewolves;
    let remainingIndexes: number[] = Array.from(game.players.keys());
    for (let i = 0; i < werewolves; i++) {
        const rand = Math.floor(Math.random() * remainingIndexes.length);
        game.players[remainingIndexes[rand]].role = PlayerRole.WEREWOLF;
        remainingIndexes = remainingIndexes.filter(index => index !== remainingIndexes[rand]);
    }
    for (let i = 0; i < villagers; i++) {
        const rand = Math.floor(Math.random() * remainingIndexes.length);
        game.players[remainingIndexes[rand]].role = PlayerRole.VILLAGER;
        remainingIndexes = remainingIndexes.filter(index => index !== remainingIndexes[rand]);
    }
}
