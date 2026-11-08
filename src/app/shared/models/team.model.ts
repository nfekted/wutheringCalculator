import { Character } from "./character.model";

export interface Team {
    id: number;
    name: string;
    /** Members A, B and C, as the `index` of the character; null is an empty slot (e.g. the character was removed) */
    members: (number | null)[];
}

/** A character can join a team only with at least one hit between the Intro and the Outro (edited or default rotation) */
export function canJoinTeam(character: Character): boolean {
    return (character.rotationBuild ?? character.data.rotationBuild ?? []).length > 0;
}
