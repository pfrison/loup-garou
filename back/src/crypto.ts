import { createHash, randomBytes } from "crypto";

export function hash(thing: string): string {
    return createHash('sha256').update(thing).digest('hex');
}

export function randHex(size: number): string {
    return randomBytes(size / 2).toString("hex");
}
