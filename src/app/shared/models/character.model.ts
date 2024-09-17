import { Aalto } from "./aalto.model";
import { Baizhi } from "./baizhi.model";
import { Calcharo } from "./calcharo.model";
import { Changli } from "./changli.model";
import { Chixia } from "./chixia.model";
import { Encore } from "./encore.model";
import { Jinhsi } from "./jinhsi.model";
import { Sanhua } from "./sanhua.model";

export class Character {
    index: number;
    character: Aalto | Baizhi | Calcharo | Changli | Chixia | Encore | Sanhua | Jinhsi;
    atk: boolean = false;
    heal: boolean = false;
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
    //----------------------------------------

    //----------------------------------------
    skillDmg: number[] = [];
    skillSecondDmg: number[] = [];
    skillThirdDmg: number[] = [];
    skillCommonDmg: string[] = [];
    skillResDmg: string[] = [];
    //----------------------------------------

    //----------------------------------------
    liberationDmg: number[] = [];
    liberationSecondDmg: number[] = [];
    liberationThirdDmg: number[] = [];
    liberationCommonDmg: string[] = [];
    liberationResDmg: string[] = [];
    //----------------------------------------

    //----------------------------------------
    introDmg: number[] = [];
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
    //Basic Sums
    sumBasicDmg: number[] = [];
    sumCommonDmg: string[] = [];
    sumResDmg: string[] = [];
    //Skill Sums
    sumSkillDmg: number[] = [];
    sumCommonSkillDmg: string[] = [];
    sumResSkillDmg: string[] = [];
    //Liberation Sums
    sumLiberationDmg: number[] = [];
    sumCommonLibDmg: string[] = [];
    sumResLibDmg: string[] = [];
    //Intro sums
    sumIntroDmg: number[] = [];
    sumCommonIntroDmg: string[] = [];
    sumResIntroDmg: string[] = [];
    //Outro sums
    sumOutroDmg: number[] = [];
    sumCommonOutroDmg: string[] = [];
    sumResOutroDmg: string[] = [];
    //Forte sums
    sumForteDmg: number[] = [];
    sumCommonForteDmg: string[] = [];
    sumResForteDmg: string[] = [];

    public calculate() {
        this.resetCharacter();
        this.calculateBasic();
    }

    private calculateBasic() {
        for (let i = 0; i < this.character.basic.length; i++) {
            //Get Expected Value
            const ex = this.getExpected(this.dmg, this.character.basic[i], this.character.basicCurrent - 1, this.elementalBonus, i == this.character.basic.length - 1 ? this.heavyBonus : this.basicBonus);
            //Set expected as Base Damage
            this.basicDmg[i] = +ex.toFixed(0);
            let multiplier = this.character.basicMultiplier[i]
            this.sumBasicDmg[i] = this.basicDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false);
            let resSum: number[] = this.getRangeDamage(ex, true);
            this.basicCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            this.basicResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.character.basicMultiplier[i]);
            resSum = this.multArray(resSum, this.character.basicMultiplier[i]);

            let range: number[] = [];
            //Second Damages
            if (this.character['basicSecondDmg']) {
                this.basicSecondDmg[i] = +(this.getExpected(this.dmg, this.character['basicSecondDmg'][i], this.character.basicCurrent - 1, this.elementalBonus, i == this.character.basic.length - 1 ? this.heavyBonus : this.basicBonus)).toFixed(0);

                if (this.basicSecondDmg[i] > 0) {
                    multiplier = this.character['basicSecondMultiplier'][i]

                    this.sumBasicDmg[i] += (this.basicSecondDmg[i] * multiplier);
                    range = this.getRangeDamage(this.basicSecondDmg[i], false);
                    this.basicCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.basicSecondDmg[i], true);
                    this.basicResDmg[i] += `<br/>+<br/>${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }
            //Third Damages
            if (this.character['basicThirdDmg']) {
                this.basicThirdDmg[i] = +(this.getExpected(this.dmg, this.character['basicThirdDmg'][i], this.character.basicCurrent - 1, this.elementalBonus, i == this.character.basic.length - 1 ? this.heavyBonus : this.basicBonus)).toFixed(0);

                if (this.basicThirdDmg[i] > 0) {
                    multiplier = this.character['basicThirdMultiplier'][i]

                    this.sumBasicDmg[i] += (this.basicThirdDmg[i] * multiplier);
                    range = this.getRangeDamage(this.basicThirdDmg[i], false);
                    this.basicCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.basicThirdDmg[i], true);
                    this.basicResDmg[i] += `<br/>+<br/${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            this.sumCommonDmg[i] = this.getRangeString(commonSum);
            this.sumResDmg[i] = this.getRangeString(resSum);
        }

        this.calculateSkill();
    }

    public calculateSkill() {
        for (let i = 0; i < this.character.skill.length; i++) {
            //Get Expected value
            const ex = this.getExpected(this.dmg, this.character.skill[i], this.character.skillCurrent - 1, this.elementalBonus, this.skillBonus);

            //Set expected as Base Damage
            this.skillDmg[i] = +ex.toFixed(0);
            let multiplier = this.character.skillMultiplier[i];
            this.sumSkillDmg[i] = this.skillDmg[i] * multiplier

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false);
            let resSum: number[] = this.getRangeDamage(ex, true);
            this.skillCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            this.skillResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.character.skillMultiplier[i]);
            resSum = this.multArray(resSum, this.character.skillMultiplier[i]);

            let range: number[] = [];
            //Second Skill Damages
            if (this.character['skillSecondDmg']) {
                this.skillSecondDmg[i] = +(this.getExpected(this.dmg, this.character['skillSecondDmg'][i], this.character.skillCurrent - 1, this.elementalBonus, this.skillBonus)).toFixed(0);

                if (this.skillSecondDmg[i] > 0) {
                    multiplier = this.character['skillSecondMultiplier'][i];

                    this.sumSkillDmg[i] += this.skillSecondDmg[i] * multiplier;
                    range = this.getRangeDamage(this.skillSecondDmg[i], false);
                    this.skillCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.skillSecondDmg[i], true);
                    this.skillResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Third Skill Damage
            if (this.character['skillThirdDmg']) {
                this.skillThirdDmg[i] = +(this.getExpected(this.dmg, this.character['skillThirdDmg'][i], this.character.skillCurrent - 1, this.elementalBonus, this.skillBonus)).toFixed(0);

                if (this.skillThirdDmg[i] > 0) {
                    multiplier = this.character['skillThirdMultiplier'][i];

                    this.sumSkillDmg[i] += this.skillThirdDmg[i] * multiplier;
                    range = this.getRangeDamage(this.skillThirdDmg[i], false);
                    this.skillCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.skillThirdDmg[i], true);
                    this.skillResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            this.sumCommonSkillDmg[i] = this.getRangeString(commonSum);
            this.sumResSkillDmg[i] = this.getRangeString(resSum);
        }

        this.calculateLiberation();
    }

    private calculateLiberation() {
        for (let i = 0; i < this.character.liberation.length; i++) {
            //Get Expected DMG
            const ex = this.getExpected(this.dmg, this.character.liberation[i], this.character.liberationCurrent - 1, this.elementalBonus, (this.character.icon == 'encore' ? (i == this.character.liberation.length - 1 ? this.heavyBonus : this.basicBonus) : this.liberationBonus));

            //Set expected as Base Damage
            this.liberationDmg[i] = +ex.toFixed(0);
            let multiplier = this.character.liberationMultiplier[i]

            this.sumLiberationDmg[i] = this.liberationDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false);
            let resSum: number[] = this.getRangeDamage(ex, true);
            this.liberationCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            this.liberationResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.character.liberationMultiplier[i]);
            resSum = this.multArray(resSum, this.character.liberationMultiplier[i]);

            let range: number[] = [];

            //Second Skill Damages
            if (this.character['liberationSecondDmg']) {
                this.liberationSecondDmg[i] = +(this.getExpected(this.dmg, this.character['liberationSecondDmg'][i], this.character.liberationCurrent - 1, this.elementalBonus, this.skillBonus)).toFixed(0);

                if (this.liberationSecondDmg[i] > 0) {
                    multiplier = this.character['liberationSecondMultiplier'][i];

                    this.sumLiberationDmg[i] += this.liberationSecondDmg[i] * multiplier;
                    range = this.getRangeDamage(this.liberationSecondDmg[i], false);
                    this.liberationCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.liberationSecondDmg[i], true);
                    this.liberationResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Third Skill Damage
            if (this.character['liberationThirdDmg']) {
                this.liberationThirdDmg[i] = +(this.getExpected(this.dmg, this.character['liberationThirdDmg'][i], this.character.liberationCurrent - 1, this.elementalBonus, this.skillBonus)).toFixed(0);

                if (this.liberationThirdDmg[i] > 0) {
                    multiplier = this.character['liberationThirdMultiplier'][i];

                    this.sumLiberationDmg[i] += this.liberationThirdDmg[i] * multiplier;
                    range = this.getRangeDamage(this.liberationThirdDmg[i], false);
                    this.liberationCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.liberationThirdDmg[i], true);
                    this.liberationResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            this.sumCommonLibDmg[i] = this.getRangeString(commonSum);
            this.sumResLibDmg[i] = this.getRangeString(resSum);
        }

        this.calculateIntro();
    }

    private calculateIntro() {
        for (let i = 0; i < this.character.intro.length; i++) {
            //Get Expected DMG
            const ex = this.getExpected(this.dmg, this.character.intro[i], this.character.introCurrent - 1, this.elementalBonus, 1);

            //Set expected as Base Damage
            this.introDmg[i] = +ex.toFixed(0);
            let multiplier = this.character.introMultiplier[i]

            this.sumIntroDmg[i] = this.introDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false);
            let resSum: number[] = this.getRangeDamage(ex, true);
            this.introCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            this.introResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            // commonSum = this.multArray(commonSum, this.character.introMultiplier[i]);
            // resSum = this.multArray(resSum, this.character.introMultiplier[i]);

            //Intro summed damage
        }

        this.calculateOutro();
    }

    private calculateOutro() {
        for (let i = 0; i < this.character.outro.length; i++) {
            //Get Expected DMG
            const ex = this.getExpected(this.dmg, this.character.outro[i], 0, this.elementalBonus, 1);

            //Set expected as Base Damage
            this.outroDmg[i] = +ex.toFixed(0);
            let multiplier = this.character.outroMultiplier[i];

            this.sumOutroDmg[i] = this.outroDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false);
            let resSum: number[] = this.getRangeDamage(ex, true);
            this.outroCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            this.outroResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            // commonSum = this.multArray(commonSum, this.character.outroMultiplier[i]);
            // resSum = this.multArray(resSum, this.character.outroMultiplier[i]);

            //Outro summed damage
        }

        this.calculateForte();
    }

    private calculateForte() {
        for (let i = 0; i < this.character.forte.length; i++) {
            //Get Expected DMG
            const ex = this.getExpected(this.dmg, this.character.forte[i], this.character.forteCurrent - 1, this.elementalBonus, (this.character.icon != 'jinhsi' ? 1 : this.jinhsiForteBonus(this.character.forteName[i])));

            //Set expected as Base Damage
            this.forteDmg[i] = +ex.toFixed(0);
            let multiplier = this.character.forteMultiplier[i];
            this.sumForteDmg[i] = this.forteDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false);
            let resSum: number[] = this.getRangeDamage(ex, true);
            this.forteCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            this.forteResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.character.forteMultiplier[i]);
            resSum = this.multArray(resSum, this.character.forteMultiplier[i]);

            let range: number[] = [];

            if (this.character['forteSecondDmg']) {
                this.forteSecondDmg[i] = +(this.getExpected(this.dmg, this.character['forteSecondDmg'][i], this.character.forteCurrent - 1, this.elementalBonus, 1)).toFixed(0);

                if (this.forteSecondDmg[i] > 0) {
                    multiplier = this.character['forteSecondMultiplier'][i];

                    this.sumForteDmg[i] += this.forteSecondDmg[i] * multiplier;
                    range = this.getRangeDamage(this.forteSecondDmg[i], false);
                    this.forteCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.forteSecondDmg[i], true);
                    this.forteResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            if (this.character['forteThirdDmg']) {
                this.forteThirdDmg[i] = +(this.getExpected(this.dmg, this.character['forteThirdDmg'][i], this.character.forteCurrent - 1, this.elementalBonus, 1)).toFixed(0);

                if (this.forteThirdDmg[i] > 0) {
                    multiplier = this.character['forteThirdMultiplier'][i];

                    this.sumForteDmg[i] += this.forteThirdDmg[i] * multiplier;
                    range = this.getRangeDamage(this.forteThirdDmg[i], false);
                    this.forteCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(this.forteThirdDmg[i], true);
                    this.forteResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            this.sumCommonForteDmg[i] = this.getRangeString(commonSum);
            this.sumResForteDmg[i] = this.getRangeString(resSum);
        }
    }

    private jinhsiForteBonus(skill: string) {
        switch (skill) {
            case 'Crescent Divinity': case 'Illuminous Epiphany: Solar Flare': case 'Illuminous Epiphany: Stella Glamor': return this.skillBonus;
            case 'Incarnation Heavy Atk': return this.heavyBonus;
            default: return this.basicBonus;
        }
    }

    private sumArray(array1: number[], array2: number[]) {
        return array1.map(function (num, index) {
            return num + array2[index];
        });
    }

    private multArray(array1: number[], value: number) {
        return array1.map(function (num, index) {
            return +(num * value).toFixed(0);
        });
    }

    public getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
        const bonus = 100 + elementalBonus + damageBonus;
        return this.getHit(dmg, multiplierRange, upgradeLevel) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
    }

    private getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
        return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
    }

    /**
     * 
     * @returns [min,max,min Crit,max Crit]
     */
    private getRangeDamage(ex: number, resistance: boolean): number[] {
        const res: number = resistance ? 0.33 : 0.49;
        const minValue: number = +(ex * 0.93 * res).toFixed(0);
        const maxValue: number = +(ex * 1.065 * res).toFixed(0);
        const crit = this.cDmg / 100;

        return [minValue, maxValue, +(minValue * crit).toFixed(0), +(maxValue * crit).toFixed(0)];
    }

    private getRangeString(damages: number[]): string {
        return `${damages[0]} ~ ${damages[1]} (<b>${damages[2]} ~ ${damages[3]}</b>)`;
    }

    resetCharacter() {
        this.basicDmg = [];
        this.basicSecondDmg = [];
        this.basicThirdDmg = [];
        this.basicCommonDmg = [];
        this.basicResDmg = [];
        this.skillDmg = [];
        this.skillSecondDmg = [];
        this.skillThirdDmg = [];
        this.skillCommonDmg = [];
        this.skillResDmg = [];
        this.liberationDmg = [];
        this.liberationSecondDmg = [];
        this.liberationThirdDmg = [];
        this.liberationCommonDmg = [];
        this.liberationResDmg = [];
        this.introDmg = [];
        this.introCommonDmg = [];
        this.introResDmg = [];
        this.outroDmg = [];
        this.outroCommonDmg = [];
        this.outroResDmg = [];
        this.forteDmg = [];
        this.forteSecondDmg = [];
        this.forteThirdDmg = [];
        this.forteCommonDmg = [];
        this.forteResDmg = [];
        this.sumBasicDmg = [];
        this.sumCommonDmg = [];
        this.sumResDmg = [];
        this.sumSkillDmg = [];
        this.sumCommonSkillDmg = [];
        this.sumResSkillDmg = [];
        this.sumLiberationDmg = [];
        this.sumCommonLibDmg = [];
        this.sumResLibDmg = [];
        this.sumIntroDmg = [];
        this.sumCommonIntroDmg = [];
        this.sumResIntroDmg = [];
        this.sumOutroDmg = [];
        this.sumCommonOutroDmg = [];
        this.sumResOutroDmg = [];
        this.sumForteDmg = [];
        this.sumCommonForteDmg = [];
        this.sumResForteDmg = [];
    }

    constructor(index: number, character: any) {
        this.index = index;
        this.character = character;
    }
}