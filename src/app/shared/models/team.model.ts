import { RotationStep } from "../../data/character-data.model";
import { Character } from "./character.model";

export interface Team {
    id: number;
    name: string;
    /** Members A, B and C, as the `index` of the character; null is an empty slot (e.g. the character was removed) */
    members: (number | null)[];
    /** How many times the rotation is played (1 or 2); in the second one, A also does the Intro */
    rotations?: number;
    /** Copy of the hits between the Intro and the Outro of each member, edited only in the team; null until copied from the character */
    steps?: (RotationStep[] | null)[];
}

/** Hits between the Intro and the Outro of a character: the edited ones, or the default of the JSON */
export function characterSteps(character: Character): RotationStep[] {
    return character.rotationBuild ?? character.data.rotationBuild ?? [];
}

/** A character can join a team only with at least one hit between the Intro and the Outro (edited or default rotation) */
export function canJoinTeam(character: Character): boolean {
    return characterSteps(character).length > 0;
}
