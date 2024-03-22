
export enum State {
    CREATED,
    IN_PROGRESS,
    ENDED
}

export type Game = {
    id: string,
    public: boolean,
    players: string[],
    maxPlayers: number,
    state: State
}

export const gameIdPattern = /\w{3}\-\w{4}\-\w{3}/;
