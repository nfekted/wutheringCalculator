import { Character } from "./character.model";

export class CharacterSave {
    index: number;
    icon: string;
    name: string;

    dmg: number = 0;
    hp: number = 0;
    def: number = 0;
    cChance: number = 5;
    cDmg: number = 150;
    elementalBonus: number = 0;
    basicBonus: number = 0;
    heavyBonus: number = 0;
    skillBonus: number = 0;
    liberationBonus: number = 0;
    healingBonus: number = 0;
    echoBonus: number = 0;
    energyRegen: number = 100;
    mode: number = 0;

    constructor(char: Character) {
        this.index = char.index;
        this.icon = char.data.icon;
        this.name = char.name;
        this.dmg = char.dmg;
        this.hp = char.hp;
        this.def = char.def;
        this.cChance = char.cChance;
        this.cDmg = char.cDmg;
        this.elementalBonus = char.elementalBonus;
        this.basicBonus = char.basicBonus;
        this.heavyBonus = char.heavyBonus;
        this.skillBonus = char.skillBonus;
        this.liberationBonus = char.liberationBonus;
        this.healingBonus = char.healingBonus;
        this.echoBonus = char.echoBonus;
        this.energyRegen = char.energyRegen;
        this.mode = char.mode;
    }
}