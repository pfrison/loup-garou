
export enum GameState {
    CREATED,
    IN_PROGRESS,
    ENDED
}

export enum GameLogType {
    DAY,
    NIGTH,
    VOTE_WEREWOLVES,
    VOTE_EXECUTION,
    VOTE_MAYOR,
    WITCH_POTION
}

export type GameLog = {
    type: GameLogType,
    params: any[]
}

export type Game = {
    id: string,
    public: boolean,
    players: Player[],
    maxPlayers: number,
    state: GameState,
    logs: GameLog[],
    seerViewed: boolean
}

export enum PlayerRole {
    VILLAGER,
    WEREWOLF,
    WITCH,
    SEER
}

export const PlayerRoleText: Map<PlayerRole, string> = new Map([
    [PlayerRole.VILLAGER, "villager"],
    [PlayerRole.WEREWOLF, "werewolf"]
]);

export type Player = {
    name: string,
    alive: boolean,
    role: PlayerRole | undefined
}
export const gameIdPattern = /\w{3}\-\w{4}\-\w{3}/;
