import { Default } from "./default.model";

export class Yinlin extends Default {

    constructor() {
        super();

        this.name = 'Yinlin'
        this.icon = 'yinlin';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Yinlin';
        this.type = 'electro';
        this.weapon = 'rectifier';

        // Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicName = `Zapstring's Dance`;
        this.basicNames = [`Zapstring's Dance DMG 1`, `Zapstring's Dance DMG 2`, `Zapstring's Dance DMG 3`, `Zapstring's Dance DMG 4`, 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [14.49, 15.68, 16.87, 18.53, 19.72, 21.09, 22.99, 24.89, 26.79, 28.81],
            [17.01, 18.41, 19.8, 21.76, 23.15, 24.76, 26.99, 29.22, 31.45, 33.82],
            [7.04, 7.62, 8.19, 9, 9.58, 10.24, 11.16, 12.09, 13.01, 13.99],
            [37.8, 40.9, 44, 48.34, 51.44, 55.01, 59.97, 64.93, 69.89, 75.16],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [12.18, 13.18, 14.18, 15.58, 16.58, 17.72, 19.32, 20.92, 22.52, 24.22],
            [15, 16.23, 17.46, 19.19, 20.42, 21.83, 23.8, 25.77, 27.74, 29.83]
        ];
        this.basicMultiplier = [1, 2, 7, 1, 1, 7, 2];
        this.basicEnds = 3;

        //Skill
        this.skillBonusType = ['s', 's', 's'];
        this.skillName = 'Magnetic Roar'
        this.skillNames = [this.skillName, 'Lightning Execution', 'Electromagnetic Blast'];
        this.skillCurrent = 1;
        this.skill = [
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
            [45, 48.69, 52.38, 57.55, 61.24, 65.48, 71.39, 77.29, 83.2, 89.47],
            [10, 10.82, 11.64, 12.79, 13.61, 14.56, 15.87, 17.18, 18.49, 19.89]
        ];
        this.skillMultiplier = [3, 4, 1];

        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = 'Thundering Wrath';
        this.liberationNames = [this.liberationName];
        this.liberationCurrent = 1;
        this.liberation = [
            [58.63, 63.44, 68.25, 74.98, 79.79, 85.32, 93.01, 100.7, 108.39, 116.56]
        ];
        this.liberationMultiplier = [7];

        //Intro Skill
        this.introName = 'Raging Storm';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [7.2, 7.8, 8.39, 9.21, 9.8, 10.48, 11.43, 12.37, 13.32, 14.32]
        ];
        this.introMultiplier = [10];

        //Outro Skill
        this.outroName = 'Strategist';
        this.outroNames = [this.outroName];
        this.outro = [[0]];
        this.outroMultiplier = [0];

        //Forte Skill
        this.forteBonusType = ['h', 's'];
        this.forteName = 'Chameleon Cipher';
        this.forteNames = ['Chameleon Cipher', 'Judgment Strike'];
        this.forteCurrent = 1;
        this.forte = [
            [90, 97.38, 104.76, 115.1, 122.48, 130.96, 142.77, 154.58, 166.39, 178.93],
            [39.56, 42.8, 46.05, 50.59, 53.83, 57.56, 62.75, 67.94, 73.13, 78.64]
        ];
        this.forteMultiplier = [2, 1];

        this.rotationDesc = ['Intro', 'Resonance Liberation', 'Resonance Skill', '8x Basic Attack', 'Resonance Skill', 'Heavy Attack', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumLiberationDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumForteDmg', 'sumForteDmg'],
            [0, 0, 0, 0, 1, 2, 3, 0, 1, 2, 3, 1, 0, 1]
        ];

        this.rotationColor = ['intro', 'liberation', 'skill', 'basic', 'skill', 'basic', 'outro']
        this.rotationCommands = ['r', 'cv', 'e', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'mbh'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['ELECTRO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'ATK %', 'Skill %', 'ATK'];

    }
}