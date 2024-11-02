import { Default } from "./default.model";

export class Verina extends Default {

    constructor() {
        super();

        this.name = 'Verina'
        this.icon = 'verina';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Verina';
        this.type = 'spectro';
        this.weapon = 'rectifier';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'h', 'h'];
        this.basicName = 'Cultivation';
        this.basicNames = ['Cultivation: DMG 1', 'Cultivation: DMG 2', 'Cultivation: DMG 3', 'Cultivation: DMG 4', 'Cultivation: DMG 5', 'Mid-Air Part 1', 'Mid-Air Part 2', 'Mid-Air Part 3', 'Dodge DMG', 'Heavy Attack', 'Mid-Air Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [19.04, 20.61, 22.17, 24.35, 25.91, 27.71, 30.21, 32.70, 35.20, 37.86],
            [25.73, 27.84, 29.95, 32.91, 35.02, 37.44, 40.82, 44.19, 47.57, 51.16],
            [12.87, 13.92, 14.98, 16.46, 17.51, 18.72, 20.41, 22.10, 23.79, 25.58],
            [33.86, 36.64, 39.42, 43.30, 46.08, 49.27, 53.72, 58.16, 62.60, 67.32],
            [36.03, 38.98, 41.83, 46.07, 49.02, 52.42, 57.14, 61.87, 66.60, 71.62],
            [28.35, 30.68, 33, 36.26, 38.58, 41.26, 44.98, 48.70, 52.42, 56.37],
            [27, 28.95, 31.14, 34.21, 36.41, 38.93, 42.44, 45.95, 49.46, 53.19],
            [12.79, 13.84, 14.88, 16.35, 17.40, 18.61, 20.28, 21.96, 23.64, 25.42],
            [65, 70.33, 75.66, 83.13, 88.46, 94.59, 103.11, 111.64, 120.17, 129.23],
            [50, 54.10, 58.20, 63.94, 68.04, 72.76, 79.32, 85.88, 92.44, 99.41],
            [31, 33.55, 36.09, 39.65, 42.19, 45.11, 49.18, 53.25, 57.31, 61.64]
        ];
        this.basicMultiplier = [1, 1, 2, 1, 1, 1, 1, 3, 1, 1, 1];
        this.basicEnds = 4;

        //Skill
        this.skillBonusType = ['s'];
        this.skillName = 'Botany Experiment';
        this.skillNames = [this.skillName];
        this.skillCurrent = 1;
        this.skill = [
            [18, 19.48, 20.96, 23.02, 24.5, 26.2, 28.56, 30.92, 33.28, 35.79]
        ]
        this.skillMultiplier = [3];

        this.skillSecondDmg = [
            [36, 38.96, 41.91, 46.04, 48.99, 52.39, 57.11, 61.83, 66.56, 71.58]
        ];
        this.skillSecondMultiplier = [1];


        //Liberation
        this.liberationBonusType = ['l', 'c', 'l', 'c'];
        this.liberationHeal = [false, true, false, true];
        this.liberationName = 'Arboreal Flourish';
        this.liberationNames = ['Arboreal Flourish', 'Arboreal Flourish Healing', 'Coordinated DMG', 'Coordinated Healing'];
        this.liberationCurrent = 1;
        this.liberation = [
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81],
            [-500, -600, -700, -800, -825, -890, -900, -915, -930, -950],
            [5, 5.41, 5.82, 6.4, 6.81, 7.28, 7.94, 8.59, 9.25, 9.95],
            [-225, -270, -315, -360, -372, -401, -405, -412, -419, -428]
        ];
        this.liberationMultiplier = [1, 1, 1, 1];

        this.liberationSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [11.33, 13.03, 14.17, 15.87, 17, 18.13, 19.27, 20.40, 21.53, 23.80],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5.10, 5.87, 6.38, 7.14, 7.65, 8.16, 8.67, 9.18, 9.69, 10.71]
        ];
        this.liberationSecondMultiplier = [0, 1, 0, 1];

        //Intro Skill
        this.introName = 'Verdant Growth';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [50, 54.1, 58.2, 63.94, 68.04, 72.76, 79.32, 85.88, 92.44, 99.41]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        this.outroBonusType = ['c'];
        this.outroHeal = [true];
        this.outroName = 'Blossom';
        this.outroNames = [this.outroName];
        this.outro = [[19]];
        this.outroMultiplier = [1];


        //Forte Skill
        this.forteBonusType = ['h', 'b', 'b', 'b', 'c'];
        this.forteHeal = [false, false, false, false, true]
        this.forteName = 'Starflower Blooms';
        this.forteNames = ['Starflower Blooms: Heavy Attack', 'Starflower Blooms: Mid-Air Part 1', 'Starflower Blooms: Mid-Air Part 2', 'Starflower Blooms: Mid-Air Part 3', 'Starflower Blooms: Healing'];
        this.forteCurrent = 1;
        this.forte = [
            [32.67, 35.35, 38.03, 41.78, 44.46, 47.54, 51.82, 56.11, 60.40, 64.95],
            [34.02, 36.81, 39.60, 43.51, 46.30, 49.51, 53.97, 58.43, 62.90, 67.64],
            [32.10, 34.74, 37.37, 41.05, 43.69, 46.71, 50.93, 55.14, 59.35, 63.82],
            [15.34, 16.60, 17.86, 19.62, 20.88, 22.33, 24.34, 26.35, 28.36, 30.50],
            [-625, -750, -875, -1000, -1032, -1113, -1125, -1144, -1163, -1188]
        ];
        this.forteMultiplier = [1, 1, 1, 3, 1];

        this.forteSecondDmg = [
            [49, 53.02, 57.04, 62.67, 66.68, 71.30, 77.73, 84.16, 90.59, 97.42],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [14.17, 16.29, 17.71, 19.83, 21.25, 22.67, 24.08, 25.50, 26.92, 29.75]
        ];
        this.forteSecondMultiplier = [1, 0, 0, 0, 1];

        this.rotationDesc = ['Intro', '5x Basic Attack', 'Resonance Skill', 'Heavy Attack', '2x Mid-Air ATK', 'Resonance Liberation', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumHealingForte', 'sumHealingForte', 'sumHealingForte', 'sumLiberationDmg', 'sumLiberationDmg', 'sumHealingLiberation', 'sumHealingLiberation', 'sumHealingOutro'],
            [0, 0, 1, 2, 3, 4, 0, 0, 1, 2, 4, 4, 4, 0, 2, 1, 3, 0]
        ];

        this.rotationColor = ['intro', 'basic', 'skill', 'basic', 'basic', 'liberation', 'outro']
        this.rotationCommands = ['mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'mbh', 'cv', 'mb', 'cv', 'mb', 'cv', 'r',];

        //Recommended Echo
        this.echo4 = ['Healing %'];
        this.echo3 = ['Energy Regen %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Energy Regen %', 'ATK %', 'ATK'];
    }
}