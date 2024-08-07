import { Encore } from "./encore.model";
import { Sanhua } from "./sanhua.model";

export class Character {
    index: number;
    character: Encore | Sanhua;
    atk: boolean = false;
    hp: boolean = false;
    def: boolean = false;

    dmg: number = 0;
    cChance: number = 5;
    cDmg: number = 150;
    elementalBonus: number = 0;
    basicBonus: number = 0;
    heavyBonus: number = 0;
    skillBonus: number = 0;
    liberationBonus: number = 0;

    basicDmg: number[] = [];
    basicCommonDmg: string[] = [];
    basicResDmg: string[] = [];

    skillDmg: number[] = [];
    skillCommonDmg: string[] = [];
    skillResDmg: string[] = [];

    introDmg: number[] = [];
    introCommonDmg: string[] = [];
    introResDmg: string[] = [];


    constructor(index: number, character: any) {
        this.index = index;
        this.character = character;
    }
}