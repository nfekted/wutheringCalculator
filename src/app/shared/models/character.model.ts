import { Aalto } from "./aalto.model";
import { Baizhi } from "./baizhi.model";
import { Calcharo } from "./calcharo.model";
import { Changli } from "./changli.model";
import { Chixia } from "./chixia.model";
import { Danjin } from "./danjin.model";
import { Encore } from "./encore.model";
import { Jianxin } from "./jianxin.model";
import { Jinhsi } from "./jinhsi.model";
import { Jiyan } from "./jiyan.model";
import { Lingyang } from "./lingyang.model";
import { Mortefi } from "./mortefi.model";
import { Rover } from "./rover.model";
import { RoverHavoc } from "./roverh.model";
import { Sanhua } from "./sanhua.model";
import { Taoqi } from "./taoqi.model";
import { Verina } from "./verina.model";
import { XiangliYao } from "./xiangliyao.model";
import { Yangyang } from "./yangyang.model";
import { Yinlin } from "./yinlin.model";
import { Yuanwu } from "./yuanwu.model";
import { Zhezhi } from "./zhezhi.model";

export class Character {
    index: number;
    character:
        Aalto | Baizhi | Calcharo | Changli |
        Chixia | Danjin | Encore
    //  |  | Jianxin
    // | Jinhsi | Jiyan | Lingyang | Mortefi
    // | RoverHavoc | Rover | Sanhua | Taoqi
    // | Verina | XiangliYao | Yinlin | Yangyang
    // | Yuanwu | Zhezhi;
    healType: boolean = false;
    hpType: boolean = false;
    defType: boolean = false;

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
    introSecondDmg: number[] = [];
    introCommonDmg: string[] = [];
    introResDmg: string[] = [];
    //----------------------------------------

    //----------------------------------------
    outroDmg: number[] = [];
    outroSecondDmg: number[] = [];
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
    //Healing sums
    sumHealingSkill: number[] = [];
    sumHealingLiberation: number[] = [];
    sumHealingIntro: number[] = [];
    sumHealingOutro: number[] = [];

    public calculate() {
        this.resetCharacter();
        this.character.calculateBasic(this);
    }

    private jinhsiForteBonus(skill: string) {
        switch (skill) {
            case 'Crescent Divinity': case 'Illuminous Epiphany: Solar Flare': case 'Illuminous Epiphany: Stella Glamor': return this.skillBonus;
            case 'Incarnation Heavy Atk': return this.heavyBonus;
            default: return this.basicBonus;
        }
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

    constructor(index: number, character: any, load?: any) {
        this.index = index;
        this.character = character;

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
            this.character.name = load.character.name;
            this.calculate();
        }
    }
}