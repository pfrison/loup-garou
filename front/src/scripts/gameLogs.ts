
export type Log = {
    logType: LogType,
    messagePattern: string,
    params: any[]
}

export enum LogType {
    PLAIN,
    GAME_START,
    SELF_ROLE_REVEAL,
    WEREWOLF_ROLE_REVEAL,
    SEER_ROLE_REVEAL,
    WITCH_POTION_USED,
    ALL_POTION_USED,
    EXECUTION_VOTE_SENT,
    EXECUTION_VOTE_RESULT,
    MAYOR_VOTE_SENT,
    MAYOR_VOTE_RESULT,
    WEREWOLF_VOTE_SENT,
    WEREWOLF_VOTE_RESULT
}

export type LogMessage = {
    type: LogType
    messagePattern: string
}

export const LOG_MESSAGES: LogMessage[] = [
    { type: LogType.PLAIN, messagePattern: "{0}" },
    { type: LogType.GAME_START, messagePattern: "The game has been started" },
    { type: LogType.SELF_ROLE_REVEAL, messagePattern: "Your role is {0}" },
    { type: LogType.WEREWOLF_ROLE_REVEAL, messagePattern: "{0} is also a werewolf" },
    { type: LogType.SEER_ROLE_REVEAL, messagePattern: "{0} is a {1}" },
    { type: LogType.WITCH_POTION_USED, messagePattern: "You used the potion of {0} on {1}" },
    { type: LogType.ALL_POTION_USED, messagePattern: "{0} used their potion of {0} on {1}" },
    { type: LogType.EXECUTION_VOTE_SENT, messagePattern: "You voted for {0} to be executed" },
    { type: LogType.EXECUTION_VOTE_RESULT, messagePattern: "{0} has been executed democratically" },
    { type: LogType.MAYOR_VOTE_SENT, messagePattern: "You voted for {0} for the mayor election" },
    { type: LogType.MAYOR_VOTE_RESULT, messagePattern: "{0} as been elected mayor" },
    { type: LogType.WEREWOLF_VOTE_SENT, messagePattern: "You voted to kill {0}" },
    { type: LogType.WEREWOLF_VOTE_RESULT, messagePattern: "{0} has been killed by the werewolves" }
]

// Simillar to String.format in java
export const format = (log: Log) => log.messagePattern.replace(/{(\d+)}/g, (match: string, number: number) => log.params[number] !== undefined ? log.params[number] : match);

export function buildNewLog(logType: LogType, params?: any[]): Log {
    return {
        logType: logType,
        messagePattern: LOG_MESSAGES.find(lm => lm.type === logType)?.messagePattern as string,
        params: params ? params : []
    }
}
