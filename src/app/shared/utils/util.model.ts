export abstract class Util {
    static coockieName: string = 'WuteringCalculator-save';

    static load() {
        return JSON.parse(window.localStorage.getItem(this.coockieName));
    }

    static save(object) {
        window.localStorage.setItem(this.coockieName, JSON.stringify(object));
    }

    static clear() {
        window.localStorage.clear();
        window.location.reload();
    }
}