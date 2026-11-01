import { CharacterResults, Levels, Stats, calculateResults, emptyResults } from "../../core/damage-engine";
import { CharacterData, RotationStep } from "../../data/character-data.model";
import { EchoSlot } from "../../data/echos/echo-data.model";
import { getEcho } from "../../data/echos";
import { echoModifier, finalStats, sumModifiers } from "../../core/stat-engine";
import { CharacterSave } from "./character-save.model";

export class Character implements Stats {
    index: number;
    data: CharacterData;
    name: string;

    /** Healing or damage view of the echo comparator */
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

    /** Hits chosen for the Rotation build between the intro and the outro; null until edited (the default of `data.rotationBuild` applies) */
    rotationBuild: RotationStep[] | null = null;

    /** The 5 Echo slots, the first is the main one; null is an empty slot */
    echoSet: (EchoSlot | null)[] = [null, null, null, null, null];

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
            this.rotationBuild = load.rotationBuild ?? null;
            // Saves from before the levels were stored keep every level at 1; invalid values are clamped to 1-10
            for (const key of Object.keys(this.levels) as (keyof Levels)[]) {
                const level = Math.round(Number(load.levels?.[key]));
                this.levels[key] = Number.isFinite(level) ? Math.min(Math.max(level, 1), 10) : 1;
            }
            // A slot whose Echo, or whose Sonata on that Echo, no longer exists comes back empty
            this.echoSet = this.echoSet.map((_, i) => {
                const slot = load.echoSet?.[i];
                return slot && getEcho(slot.echo)?.sonatas.includes(slot.sonata) ? slot : null;
            });
            this.name = load.name;
        }
        this.applyEchoSet();
        this.calculate();
    }

    /** With the base known, the attributes the Echos change come from the base and the Echo Set; the others keep the typed value */
    applyEchoSet() {
        if (!this.hasBase) return;
        const modifiers = this.echoSet.filter(slot => !!slot).map(slot => echoModifier(slot, this.data.type));
        Object.assign(this, finalStats(this.data.base, sumModifiers(modifiers), this));
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

    /** Whether the base attributes are known, so the attributes can come from the Echos; DEF is not checked, it can really be 0 */
    get hasBase(): boolean {
        return this.data.base.hp > 0 && this.data.base.atk > 0;
    }

    /** Steps of the Rotation build: the intro, the chosen hits (or the default ones) and the outro */
    rotationSteps(): RotationStep[] {
        const all = (section: 'intro' | 'outro') => this.data[section].hits.map((_, index): RotationStep => ({ section, index }));
        return [...all('intro'), ...(this.rotationBuild ?? this.data.rotationBuild ?? []), ...all('outro')];
    }

    /**
     * What a rotation step is worth: the expected value against a common enemy, mixing the hits without and with a crit by the crit rate.
     * Healing and shield hits are not mitigated and never crit. Steps without valid data count as 0
     */
    rotationHit(step: RotationStep): { value: number; type: 'damage' | 'heal' | 'shield' } {
        const hit = this.data[step.section].hits[step.index];
        const result = this.results[step.section][step.index];
        const kind = this.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
        const type = kind === 'heal' || kind === 'shield' ? kind : 'damage';
        if (!result) return { value: 0, type };

        let value = result.sum;
        if (type === 'damage') {
            const range = result.commonSum;
            const chance = Math.min(this.cChance, 100) / 100;
            value = (range.min + range.max) / 2 * (1 - chance) + (range.critMin + range.critMax) / 2 * chance;
        }
        return { value: Number.isFinite(value) ? value : 0, type };
    }

    clone(): Character {
        const copy = Object.assign(new Character(this.index, this.data), this);
        copy.echoSet = this.echoSet.map(slot => slot && structuredClone(slot));
        return copy;
    }
}
