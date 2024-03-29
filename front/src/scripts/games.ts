
export enum GameState {
    CREATED,
    IN_PROGRESS,
    ENDED
}

export type Game = {
    id: string,
    public: boolean,
    players: Player[],
    maxPlayers: number,
    state: GameState
}

export enum PlayerRole {
    VILLAGER,
    WEREWOLF
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
