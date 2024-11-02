import { Default } from "./default.model";

export class Chixia extends Default {

    constructor() {
        super();

        this.name = 'Chixia'
        this.icon = 'chixia';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Chixia';
        this.type = 'fusion';
        this.weapon = 'pistols';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'h', 'h'];
        this.basicName = 'POW POW'
        this.basicNames = ['POW POW: DMG 1', 'POW POW: DMG 2', 'POW POW: DMG 3', 'POW POW: DMG 4', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack DMG', 'Charged Heavy Attack DMG'];
        this.basicCurrent = 1;
        this.basic = [
            [33.30, 36.04, 38.77, 42.59, 45.32, 48.46, 52.83, 57.20, 61.57, 66.21],
            [24.30, 26.30, 28.29, 31.08, 33.07, 35.36, 38.55, 41.74, 44.93, 48.32],
            [16.88, 18.26, 19.65, 21.58, 22.97, 24.56, 26.77, 28.99, 31.20, 33.55],
            [117, 126.60, 136.19, 149.62, 159.22, 170.25, 185.60, 200.95, 216.30, 232.61],
            [16.20, 17.53, 18.86, 20.72, 22.05, 23.58, 25.70, 27.83, 29.95, 32.21],
            [171, 185.03, 199.05, 218.68, 232.70, 248.83, 271.26, 293.70, 316.13, 339.97],
            [18, 19.48, 20.96, 23.02, 24.50, 26.20, 28.56, 30.92, 33.28, 35.79],
            [40.50, 43.83, 47.15, 51.80, 55.12, 58.94, 64.25, 69.56, 74.88, 80.52]
        ];
        this.basicMultiplier = [1, 2, 4, 1, 1, 1, 1, 1];
        this.basicEnds = 3;

        //Skill
        this.skillBonusType = ['s'];
        this.skillName = 'Whizzing Fight Spirit'
        this.skillNames = [this.skillName];
        this.skillCurrent = 1;
        this.skill = [
            [16, 17.32, 18.63, 20.47, 21.78, 23.29, 25.39, 27.48, 29.58, 31.81]
        ]
        this.skillMultiplier = [8];

        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = 'Blazing Flames';
        this.liberationNames = [this.liberationName];
        this.liberationCurrent = 1;
        this.liberation = [
            [480, 519.36, 558.72, 613.83, 653.19, 698.45, 761.43, 824.40, 887.38, 954.29]
        ];
        this.liberationMultiplier = [1];

        this.liberationSecondDmg = [
            [29.10, 31.48, 33.87, 37.21, 39.59, 42.34, 46.15, 49.97, 53.79, 57.84]
        ];
        this.liberationSecondMultiplier = [11];

        //Intro Skill
        this.introName = 'Grand Entrance'
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [24.75, 26.78, 28.81, 31.66, 33.68, 36.02, 39.27, 42.51, 45.76, 49.21]
        ];
        this.introMultiplier = [2];

        this.introSecondDmg = [
            [12.38, 13.39, 14.41, 15.83, 16.84, 18.01, 19.64, 21.26, 22.88, 24.61]
        ];
        this.introSecondMultiplier = [4]

        //Outro Skill
        this.outroName = 'Leaping Flames';
        this.outroNames = [this.outroName];
        this.outro = [[530]];
        this.outroMultiplier = [1];

        //Forte Skill
        this.forteBonusType = ['s', 's', 's'];
        this.forteName = 'Heroic Bullets';
        this.forteNames = ['Thermobaric Bullets', 'Thermobaric Bullets x30', 'Boom Boom'];
        this.forteCurrent = 1;
        this.forte = [
            [10, 10.82, 11.64, 12.79, 13.61, 14.56, 15.87, 17.18, 18.49, 19.89],
            [10, 10.82, 11.64, 12.79, 13.61, 14.56, 15.87, 17.18, 18.49, 19.89],
            [220, 238.04, 256.08, 281.34, 299.38, 320.13, 348.99, 377.85, 406.72, 437.39]
        ];
        this.forteMultiplier = [1, 30, 1];

        this.rotationDesc = ['Intro', '3x Basic Attack', 'Resonance Skill', 'Resonance Liberation', 'Resonance Skill (x30 "Thermobaric Bullets")', 'Basic Attack (~30 bullets)', 'Resonance Skill (x30 "Thermobaric Bullets")', 'Basic Attack (~30 bullets)', 'Outro'];
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg', 'sumBasicDmg', 'sumForteDmg', 'sumOutroDmg'],
            [0, 0, 1, 2, 0, 0, 1, 2, 1, 2, 0]
        ];

        this.rotationColor = ['intro', 'basic', 'skill', 'liberation', 'skill', 'basic', 'skill', 'basic', 'outro'];
        this.rotationCommands = ['mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'r', 'cv', 'eh', 'cv', 'mb', 'cv', 'eh', 'cv', 'mb'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['FUSION DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'Skill %', 'ATK %', 'Liberation %'];
    }
}