import { CharacterResults, Levels, Stats, calculateResults, emptyResults } from "../../core/damage-engine";
import { CharacterData, RotationStep } from "../../data/character-data.model";
import { CharacterSave } from "./character-save.model";

export class Character implements Stats {
    index: number;
    data: CharacterData;
    name: string;

    damageHealer: boolean;
    healType: boolean;
    canHeal: boolean;
    hpScale: boolean;
    defScale: boolean;

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

    levels: Levels = { basic: 1, skill: 1, liberation: 1, intro: 1, forte: 1 };
    results: CharacterResults = emptyResults();

    constructor(index: number, data: CharacterData, load?: CharacterSave) {
        this.index = index;
        this.data = data;
        this.name = data.name;
        this.damageHealer = data.damageHealer;
        this.healType = data.healType;
        this.canHeal = data.canHeal;
        this.hpScale = data.hpScale;
        this.defScale = data.defScale;

        if (load) {
            this.dmg = load.dmg;
            this.def = load.def;
            this.hp = load.hp;
            this.cChance = load.cChance;
            this.cDmg = load.cDmg;
            this.skillBonus = load.skillBonus;
            this.basicBonus = load.basicBonus;
            this.heavyBonus = load.heavyBonus;
            this.liberationBonus = load.liberationBonus;
            this.elementalBonus = load.elementalBonus;
            this.healingBonus = load.healingBonus;
            this.name = load.name;
            this.calculate();
        }
    }

    calculate() {
        this.results = calculateResults(this.data, this, this.levels);
    }

    /** Total damage (or healing) of a rotation step; steps without valid data count as 0 */
    rotationValue(step: RotationStep): number {
        const result = this.results[step.section];
        const value = (step.healing ? result.healing : result.sum)[step.index];
        return Number.isFinite(value) ? value : 0;
    }

    clone(): Character {
        return Object.assign(new Character(this.index, this.data), this);
    }
}
