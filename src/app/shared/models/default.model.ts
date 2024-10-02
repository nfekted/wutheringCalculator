import { Character } from "./character.model";

export class Default {
    name: string = ''
    icon: string = '';
    wiki: string = '';
    type: string = '';
    weapon: string = '';
    //Basic Attacks
    basicNames: string[] = [];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [];
    basicMultiplier: number[] = [];
    basicEnds: number = 0;

    basicSecondDmg: Array<Array<number>> = []
    basicSecondMultiplier: number[] = [];

    basicThirdDmg: Array<Array<number>> = []
    basicThirdMultiplier: number[] = [];

    //Skill
    skillNames: string[] = [];
    skillCurrent: number = 1;
    skillHeal: boolean[] = [];
    skillDMGType: string[] = [];
    skill: Array<Array<number>> = []
    skillMultiplier: number[] = [];

    skillSecondDmg: Array<Array<number>> = [];
    skillSecondMultiplier: number[] = [];

    skillThirdDmg: Array<Array<number>> = [];
    skillThirdMultiplier: number[] = [];

    //Liberation
    liberationNames: string[] = [];
    liberationCurrent: number = 1;
    liberationHeal: boolean[] = [];
    liberationDMGType: string[] = [];
    liberation: Array<Array<number>> = [];
    liberationMultiplier: number[] = [1];

    liberationSecondDmg: Array<Array<number>> = []
    liberationSecondMultiplier: number[] = [1];

    //Intro Skill
    introName: string[] = [];
    introCurrent: number = 1;
    introHeal: boolean[] = [];
    introDMGType: string[] = [];
    intro: Array<Array<number>> = [];
    introMultiplier: number[] = [1];

    introSecondDmg: Array<Array<number>> = [];
    introSecondMultiplier: number[] = [1]

    //Outro Skill
    outroName: string[] = [];
    outroHeal: boolean[] = [];
    outroDMGType: string[] = [];
    outro: Array<Array<number>> = [];
    outroMultiplier: number[] = [];

    outroSecondDmg: Array<Array<number>> = [];
    outroSecondMultiplier: number[] = [];

    //Forte Skill
    forteName: string[] = [];
    forteHeal: boolean[] = [];
    forteDMGType: string[] = [];
    forteCurrent: number = 1;
    forte: Array<Array<number>> = [

    ];
    forteMultiplier: number[] = [];

    forteSecondDmg: Array<Array<number>> = [

    ];
    forteSecondMultiplier: number[] = [];

    forteThirdDmg: Array<Array<number>> = [

    ];
    forteThirdMultiplier: number[] = [];

    rotation: Array<Array<string | number>> = [];
    rotationName: Array<string> = [];

    calculateBasic(character: Character) {
        const heavyIndex = character.character.icon == 'changli' ? this.basic.length - 2 : this.basic.length - 1;
        for (let i = 0; i < this.basic.length; i++) {
            //Get Expected Value
            const ex = this.getExpected(character.dmg, this.basic[i], this.basicCurrent - 1, character.elementalBonus, i >= heavyIndex ? character.heavyBonus : character.basicBonus);
            //Set expected as Base Damage
            character.basicDmg[i] = +ex.toFixed(0);
            let multiplier = this.basicMultiplier[i]
            character.sumBasicDmg[i] = character.basicDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false, character.cDmg);
            let resSum: number[] = this.getRangeDamage(ex, true, character.cDmg);
            character.basicCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            character.basicResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.basicMultiplier[i]);
            resSum = this.multArray(resSum, this.basicMultiplier[i]);

            let range: number[] = [];
            //Second Damages
            if (this.basicSecondDmg.length > 0) {
                character.basicSecondDmg[i] = +(this.getExpected(character.dmg, this.basicSecondDmg[i], this.basicCurrent - 1, character.elementalBonus, i >= heavyIndex ? character.heavyBonus : character.basicBonus)).toFixed(0);

                if (character.basicSecondDmg[i] > 0) {
                    multiplier = this.basicSecondMultiplier[i];

                    character.sumBasicDmg[i] += (character.basicSecondDmg[i] * multiplier);
                    range = this.getRangeDamage(character.basicSecondDmg[i], false, character.cDmg);
                    character.basicCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.basicSecondDmg[i], true, character.cDmg);
                    character.basicResDmg[i] += `<br/>+<br/>${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }
            //Third Damages
            if (this.basicThirdDmg.length > 0) {
                character.basicThirdDmg[i] = +(this.getExpected(character.dmg, this.basicThirdDmg[i], this.basicCurrent - 1, character.elementalBonus, i >= heavyIndex ? character.heavyBonus : character.basicBonus)).toFixed(0);

                if (character.basicThirdDmg[i] > 0) {
                    multiplier = this.basicThirdMultiplier[i];

                    character.sumBasicDmg[i] += (character.basicThirdDmg[i] * multiplier);
                    range = this.getRangeDamage(character.basicThirdDmg[i], false, character.cDmg);
                    character.basicCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.basicThirdDmg[i], true, character.cDmg);
                    character.basicResDmg[i] += `<br/>+<br/${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            character.sumCommonDmg[i] = this.getRangeString(commonSum);
            character.sumResDmg[i] = this.getRangeString(resSum);
        }

        this.calculateSkill(character);
    }

    private calculateSkill(character: Character) {
        for (let i = 0; i < this.skill.length; i++) {
            //Get Expected value
            const heal: boolean = this.skillHeal[i];
            const dmg: number = this.skillDMGType[i] == 'hp' ? character.hp : this.skillDMGType[i] == 'def' ? character.def : character.dmg;
            const bonus: number = heal ? character.healingBonus : character.skillBonus;
            const elemental: number = heal ? 0 : character.elementalBonus;
            const crit: number = character.cDmg
            const ex = this.getExpected(dmg, this.skill[i], this.skillCurrent - 1, elemental, bonus);

            //Set expected as Base Damage
            character.skillDmg[i] = +ex.toFixed(0);
            let multiplier = this.skillMultiplier[i];
            if (heal) character.sumHealingSkill[i] = character.skillDmg[i] * multiplier;

            character.sumSkillDmg[i] = character.skillDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false, crit);
            let resSum: number[] = this.getRangeDamage(ex, true, crit);
            character.skillCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            character.skillResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.skillMultiplier[i]);
            resSum = this.multArray(resSum, this.skillMultiplier[i]);

            let range: number[] = [];
            //Second Skill Damages
            if (this.skillSecondDmg.length > 0) {
                character.skillSecondDmg[i] = +(this.getExpected(dmg, this.skillSecondDmg[i], this.skillCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.skillSecondDmg[i] > 0) {
                    multiplier = this.skillSecondMultiplier[i];

                    if (heal) character.sumHealingSkill[i] += character.skillSecondDmg[i] * multiplier;

                    character.sumSkillDmg[i] += character.skillSecondDmg[i] * multiplier;

                    range = this.getRangeDamage(character.skillSecondDmg[i], false, crit);
                    character.skillCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.skillSecondDmg[i], true, crit);
                    character.skillResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Third Skill Damage
            if (this.skillThirdDmg.length > 0) {
                character.skillThirdDmg[i] = +(this.getExpected(dmg, this.skillThirdDmg[i], this.skillCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.skillThirdDmg[i] > 0) {
                    multiplier = this.skillThirdMultiplier[i];

                    if (heal) character.sumHealingSkill[i] += character.skillThirdDmg[i] * multiplier;

                    character.sumSkillDmg[i] += character.skillThirdDmg[i] * multiplier;

                    range = this.getRangeDamage(character.skillThirdDmg[i], false, crit);
                    character.skillCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.skillThirdDmg[i], true, crit);
                    character.skillResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            character.sumCommonSkillDmg[i] = this.getRangeString(commonSum);
            character.sumResSkillDmg[i] = this.getRangeString(resSum);
        }

        this.calculateLiberation(character);
    }

    private calculateLiberation(character: Character) {
        for (let i = 0; i < this.liberation.length; i++) {
            //Get Expected DMG
            const heal: boolean = this.liberationHeal[i];
            const dmg: number = this.liberationDMGType[i] == 'hp' ? character.hp : this.liberationDMGType[i] == 'def' ? character.def : character.dmg;
            const bonus: number = heal ? character.healingBonus : this.liberationBonus(character, i);
            const elemental: number = heal ? 0 : character.elementalBonus;
            const crit: number = character.cDmg
            const ex = this.getExpected(dmg, this.liberation[i], this.skillCurrent - 1, elemental, bonus);

            //Set expected as Base Damage
            character.liberationDmg[i] = +ex.toFixed(0);
            let multiplier = this.liberationMultiplier[i]

            if (heal) character.sumHealingLiberation[i] = character.liberationDmg[i] * multiplier;

            character.sumLiberationDmg[i] = character.liberationDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false, crit);
            let resSum: number[] = this.getRangeDamage(ex, true, crit);
            character.liberationCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            character.liberationResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.liberationMultiplier[i]);
            resSum = this.multArray(resSum, this.liberationMultiplier[i]);

            let range: number[] = [];

            //Second Liberation Damages
            if (this.liberationSecondDmg.length > 0) {
                character.liberationSecondDmg[i] = +(this.getExpected(dmg, this.liberationSecondDmg[i], this.liberationCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.liberationSecondDmg[i] > 0) {
                    multiplier = this.liberationSecondMultiplier[i];

                    if (heal) character.sumHealingLiberation[i] += character.liberationSecondDmg[i] * multiplier;

                    character.sumLiberationDmg[i] += character.liberationSecondDmg[i] * multiplier;

                    range = this.getRangeDamage(character.liberationSecondDmg[i], false, crit);
                    character.liberationCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.liberationSecondDmg[i], true, crit);
                    character.liberationResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            character.sumCommonLibDmg[i] = this.getRangeString(commonSum);
            character.sumResLibDmg[i] = this.getRangeString(resSum);
        }

        this.calculateIntro(character);
    }

    liberationBonus(character: Character, index: number): number {
        switch (character.character.icon) {
            case 'calcharo':
                return index > 7 ? character.heavyBonus : index > 1 && index <= 6 ? character.basicBonus : character.liberationBonus;
            case 'encore':
                return index < 5 ? character.basicBonus : index == 5 ? character.skillBonus : character.heavyBonus;
            default:
                return character.liberationBonus;
        }
    }

    private calculateIntro(character: Character) {
        for (let i = 0; i < this.intro.length; i++) {
            //Get Expected DMG
            const heal: boolean = this.introHeal[i];
            const dmg: number = this.introDMGType[i] == 'hp' ? character.hp : this.introDMGType[i] == 'def' ? character.def : character.dmg;
            const bonus: number = heal ? character.healingBonus : 1;
            const elemental: number = heal ? 0 : character.elementalBonus;
            const crit: number = character.cDmg
            const ex = this.getExpected(dmg, this.intro[i], this.introCurrent - 1, elemental, bonus);

            //Set expected as Base Damage
            character.introDmg[i] = +ex.toFixed(0);
            let multiplier = this.introMultiplier[i]

            if (heal) character.sumHealingIntro[i] = character.introDmg[i] * multiplier;

            character.sumIntroDmg[i] = character.introDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false, crit);
            let resSum: number[] = this.getRangeDamage(ex, true, crit);
            character.introCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            character.introResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.introMultiplier[i]);
            resSum = this.multArray(resSum, this.introMultiplier[i]);

            let range: number[] = [];

            //Second Intro Damages
            if (this.introSecondDmg.length > 0) {
                character.introSecondDmg[i] = +(this.getExpected(dmg, this.introSecondDmg[i], this.introCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.introSecondDmg[i] > 0) {
                    multiplier = this.introSecondMultiplier[i];

                    if (heal) character.sumHealingIntro[i] += character.introSecondDmg[i] * multiplier;

                    character.sumIntroDmg[i] += character.introSecondDmg[i] * multiplier;

                    range = this.getRangeDamage(character.introSecondDmg[i], false, crit);
                    character.introCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.introSecondDmg[i], true, crit);
                    character.introResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Intro summed damage
            character.sumCommonIntroDmg[i] = this.getRangeString(commonSum);
            character.sumResIntroDmg[i] = this.getRangeString(resSum);
        }

        this.calculateOutro(character);
    }

    private calculateOutro(character: Character) {
        for (let i = 0; i < this.outro.length; i++) {
            const heal: boolean = this.outroHeal[i];
            const dmg: number = this.outroDMGType[i] == 'hp' ? character.hp : this.outroDMGType[i] == 'def' ? character.def : character.dmg;
            const bonus: number = heal ? character.healingBonus : 1;
            const elemental: number = heal ? 0 : character.elementalBonus;
            const crit: number = character.cDmg
            //Get Expected DMG
            const ex = this.getExpected(dmg, this.outro[i], 0, elemental, bonus);


            //Set expected as Base Damage
            character.outroDmg[i] = +ex.toFixed(0);
            let multiplier = this.outroMultiplier[i];

            if (heal) {
                character.sumHealingOutro[i] = character.outroDmg[i] * multiplier;
            }
            character.sumOutroDmg[i] = character.outroDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false, crit);
            let resSum: number[] = this.getRangeDamage(ex, true, crit);
            character.outroCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            character.outroResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.outroMultiplier[i]);
            resSum = this.multArray(resSum, this.outroMultiplier[i]);

            let range: number[] = [];

            //Second Outro Damages
            if (this.outroSecondDmg.length > 0) {
                character.outroSecondDmg[i] = +(this.getExpected(dmg, this.outroSecondDmg[i], this.introCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.outroSecondDmg[i] > 0) {
                    multiplier = this.outroSecondMultiplier[i];

                    if (heal) character.sumHealingOutro[i] += character.outroSecondDmg[i] * multiplier;

                    character.sumOutroDmg[i] += character.outroSecondDmg[i] * multiplier;

                    range = this.getRangeDamage(character.outroSecondDmg[i], false, crit);
                    character.outroCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.outroSecondDmg[i], true, crit);
                    character.outroResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Outro summed damage
            character.sumCommonOutroDmg[i] = this.getRangeString(commonSum);
            character.sumResOutroDmg[i] = this.getRangeString(resSum);
        }

        this.calculateForte(character);
    }

    private calculateForte(character: Character) {
        for (let i = 0; i < this.forte.length; i++) {
            const dmg: number = this.forteDMGType[i] == 'hp' ? character.hp : this.forteDMGType[i] == 'def' ? character.def : character.dmg;
            const bonus: number = this.forteHeal[i] ? character.healingBonus : this.forteBonus(character, i);
            const elemental: number = this.forteHeal[i] ? 0 : character.elementalBonus;
            const crit: number = character.cDmg
            //Get Expected DMG
            const ex = this.getExpected(dmg, this.forte[i], this.forteCurrent - 1, elemental, bonus);

            //Set expected as Base Damage
            character.forteDmg[i] = +ex.toFixed(0);
            let multiplier = this.forteMultiplier[i];
            character.sumForteDmg[i] = character.forteDmg[i] * multiplier;

            //Get expected Range value on enemy DEF
            let commonSum: number[] = this.getRangeDamage(ex, false, crit);
            let resSum: number[] = this.getRangeDamage(ex, true, crit);
            character.forteCommonDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(commonSum);
            character.forteResDmg[i] = (multiplier > 1 ? `<small>${multiplier}x </small>` : '') + this.getRangeString(resSum);

            commonSum = this.multArray(commonSum, this.forteMultiplier[i]);
            resSum = this.multArray(resSum, this.forteMultiplier[i]);

            let range: number[] = [];

            if (this.forteSecondDmg.length > 0) {
                character.forteSecondDmg[i] = +(this.getExpected(dmg, this.forteSecondDmg[i], this.forteCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.forteSecondDmg[i] > 0) {
                    multiplier = this.forteSecondMultiplier[i];

                    character.sumForteDmg[i] += character.forteSecondDmg[i] * multiplier;
                    range = this.getRangeDamage(character.forteSecondDmg[i], false, crit);
                    character.forteCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.forteSecondDmg[i], true, crit);
                    character.forteResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            if (this.forteThirdDmg.length > 0) {
                character.forteThirdDmg[i] = +(this.getExpected(dmg, this.forteThirdDmg[i], this.forteCurrent - 1, elemental, bonus)).toFixed(0);

                if (character.forteThirdDmg[i] > 0) {
                    multiplier = this.forteThirdMultiplier[i];

                    character.sumForteDmg[i] += character.forteThirdDmg[i] * multiplier;
                    range = this.getRangeDamage(character.forteThirdDmg[i], false, crit);
                    character.forteCommonDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`
                    commonSum = this.sumArray(commonSum, this.multArray(range, multiplier));

                    range = this.getRangeDamage(character.forteThirdDmg[i], true, crit);
                    character.forteResDmg[i] += `<br/>+<br/>${multiplier > 1 ? `<small>${multiplier}x </small>` : ''}${this.getRangeString(range)}`;
                    resSum = this.sumArray(resSum, this.multArray(range, multiplier));
                }
            }

            //Range Sums
            character.sumCommonForteDmg[i] = this.getRangeString(commonSum);
            character.sumResForteDmg[i] = this.getRangeString(resSum);
        }
    }

    forteBonus(character: Character, index: number): number {
        switch (character.character.icon) {
            case 'calcharo':
                return index == 0 ? character.heavyBonus : character.liberationBonus;
            case 'changli':
                return character.skillBonus;
            case 'chixia':
                return index == 2 ? character.basicBonus : character.skillBonus;
            case 'danjin':
                return character.heavyBonus;
            case 'encore':
                return character.liberationBonus;
            default:
                return 1;
        }
    }

    private getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
        const bonus = 100 + elementalBonus + damageBonus;
        return (multiplierRange[upgradeLevel] < 0 ? multiplierRange[upgradeLevel] * -1 : this.getHit(dmg, multiplierRange, upgradeLevel)) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
    }

    private getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
        return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
    }

    /**
 * 
 * @returns [min,max,min Crit,max Crit]
 */
    private getRangeDamage(ex: number, resistance: boolean, critChance: number): number[] {
        const res: number = resistance ? 0.33 : 0.49;
        const minValue: number = +(ex * 0.93 * res).toFixed(0);
        const maxValue: number = +(ex * 1.065 * res).toFixed(0);
        const crit = critChance / 100;

        return [minValue, maxValue, +(minValue * crit).toFixed(0), +(maxValue * crit).toFixed(0)];
    }

    private getRangeString(damages: number[]): string {
        return `${damages[0]} ~ ${damages[1]} (<b>${damages[2]} ~ ${damages[3]}</b>)`;
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
}