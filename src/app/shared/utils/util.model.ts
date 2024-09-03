import { Character } from "../models/character.model";
import { Settings } from "../models/settings.model";

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
}