
const ALPHA_NUM: RegExp = /^[a-zA-Z0-9]+$/;
const ID_MAX_LENGTH = 256;

export function assertId(text: string): boolean {
    return (ALPHA_NUM.test(text)) && (text.length <= ID_MAX_LENGTH);
}