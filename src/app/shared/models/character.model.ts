import { Encore } from "./encore.model";
import { Jinhsi } from "./jinhsi.model";
import { Sanhua } from "./sanhua.model";

export class Character {
    index: number;
    character: Encore | Sanhua | Jinhsi;
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

    //----------------------------------------
    basicDmg: number[] = [];
    basicSecondDmg: number[] = [];
    basicThirdDmg: number[] = [];
    basicCommonDmg: string[] = [];
    basicResDmg: string[] = [];
    //
    basicSum: number[] = [];
    basicCommonSum: string[] = [];
    basicResSum: string[] = [];
    //----------------------------------------

    //----------------------------------------
    skillDmg: number[] = [];
    skillSecondDmg: number[] = [];
    skillThirdDmg: number[] = [];
    skillCommonDmg: string[] = [];
    skillResDmg: string[] = [];
    //----------------------------------------

    //----------------------------------------
    introDmg: number[] = [];
    introSecondDmg: number[] = [];
    introCommonDmg: string[] = [];
    introResDmg: string[] = [];
    //----------------------------------------

    //----------------------------------------
    outroDmg: number[] = [];
    outroCommonDmg: string[] = [];
    outroResDmg: string[] = [];
    //----------------------------------------

    //----------------------------------------
    forteDmg: number[] = [];
    forteSecondDmg: number[] = [];
    forteThirdDmg: number[] = [];
    forteCommonDmg: string[] = [];
    forteResDmg: string[] = [];
    //----------------------------------------


    constructor(index: number, character: any) {
        this.index = index;
        this.character = character;
    }
}