export type Theme = 'light' | 'dark';

export class Settings {

    language: string;
    theme: Theme = 'dark';
    coockie: boolean = false;
}
