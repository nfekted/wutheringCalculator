import { CharacterResults, Levels, Stats, calculateResults, emptyResults } from "../../core/damage-engine";
import { CharacterData, RotationStep } from "../../data/character-data.model";
import { CharacterSave } from "./character-save.model";

export class Character implements Stats {
    index: number;
    data: CharacterData;
    name: string;

    /** Healing or damage view of the enhancer and the echo comparator */
    showHealing: boolean;
    hpScale: boolean;
    defScale: boolean;
    erScale: boolean;

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
    echoBonus: number = 0;
    healingBonus: number = 0;
    energyRegen: number = 100;

    /** Active way of playing, as an index in `data.modes` */
    mode: number = 0;

    levels: Levels = { basic: 1, skill: 1, liberation: 1, intro: 1, forte: 1 };
    results: CharacterResults = emptyResults();

    constructor(index: number, data: CharacterData, load?: CharacterSave) {
        this.index = index;
        this.data = data;
        this.name = data.name;
        this.showHealing = data.hasHealing && !data.primaryDamage;
        this.hpScale = data.hpScale;
        this.defScale = data.defScale;
        this.erScale = data.erScale ?? false;

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
            this.echoBonus = load.echoBonus ?? 0;
            this.energyRegen = load.energyRegen ?? 100;
            this.mode = load.mode ?? 0;
            this.name = load.name;
            this.calculate();
        }
    }

    calculate() {
        this.results = calculateResults(this.data, this, this.levels, this.mode);
    }

    /** Whether the active mode is the one with Echo damage */
    get isEchoMode(): boolean {
        return this.data.modes?.[this.mode] === 'echo';
    }

    /** Whether Echo damage can happen: the Echo mode is active, or some hit is always Echo damage */
    get usesEcho(): boolean {
        return this.isEchoMode || (['basic', 'skill', 'liberation', 'intro', 'outro', 'forte'] as const)
            .some(section => this.data[section].hits.some(hit => hit.kind === 'echo'));
    }

    /** Total damage (or healing) of a rotation step; steps without valid data count as 0 */
    rotationValue(step: RotationStep): number {
        const value = this.results[step.section][step.index]?.sum;
        return Number.isFinite(value) ? value : 0;
    }

    /** Whether a rotation step is a healing hit */
    isHealStep(step: RotationStep): boolean {
        return this.data[step.section].hits[step.index]?.kind === 'heal';
    }

    clone(): Character {
        return Object.assign(new Character(this.index, this.data), this);
    }
}
