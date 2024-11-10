import { CharacterSave } from "../models/character-save.model";
import { Character } from "../models/character.model";

export abstract class Util {
    static coockieName: string = 'wuteringcalculator-lang';
    static characters: Array<Character> = new Array<Character>();

    static load(name?: string) {
        return JSON.parse(window.localStorage.getItem(name ? name : this.coockieName));
    }

    static save(object: any, name?: string) {
        window.localStorage.setItem((name ? name : this.coockieName), JSON.stringify(object));
    }

    static clear() {
        window.localStorage.clear();
        window.location.reload();
    }

    static saveCharacters() {
        const save: Array<CharacterSave> = [];
        for (const c of this.characters) {
            save.push(new CharacterSave(c));
        }
        // if (this.characters.length > 0) {
        //     this.characters.map((c) => save.push(new CharacterSave(c)))

        this.save(save, 'wuteringcalculator-chars');
        // }
    }
}