import { Default } from "./default.model";

export class Carlotta extends Default {

    constructor() {
        super();

        //Character
        this.lastUpdate = new Date(2025, 1, 25, 18, 50, 0);
        this.name = 'Carlotta'
        this.icon = 'carlotta';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Carlotta';
        this.type = 'glacio';
        this.weapon = 'pistols';

        //Basic Attacks
        this.basicName = 'Silent Execution';
        this.basicNames = ['Silent Execution: DMG 1', 'Silent Execution: DMG 2', 'Necessary Measures: DMG 1', 'Necessary Measures: DMG 2', 'Necessary Measures: DMG 3', 'Containment Tactics', 'Customary Greetings', 'Mid-Air Attack', 'Dodge Damage', 'Heavy Attack'];
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'h', 'b', 'b', 'b', 'h'];
        this.basicCurrent = 1;
        this.basic = [
            [27.20, 29.44, 31.67, 34.79, 37.02, 39.58, 43.15, 46.72, 50.29, 54.08],
            [19.89, 21.53, 23.16, 25.44, 27.07, 28.95, 31.56, 34.17, 36.78],
            [33.15, 35.87, 38.59, 42.40, 45.12, 48.24, 52.59, 56.94, 61.29, 65.91],
            [30.22, 32.70, 35.18, 38.65, 41.12, 43.97, 47.94, 51.90, 55.87, 60.08],
            [70.38, 76.16, 81.93, 90.01, 95.78, 102.41, 111.65, 120.88, 130.12, 139.93],
            [17.22, 18.63, 20.04, 22.02, 23.43, 25.05, 27.31, 29.57, 31.83, 34.23],
            [54.32, 58.77, 63.23, 69.46, 73.92, 79.04, 86.16, 93.29, 100.42, 107.99],
            [52.70, 57.03, 61.35, 67.40, 71.72, 76.69, 83.60, 90.52, 97.43, 104.78],
            [52.20, 56.48, 60.76, 66.75, 71.03, 75.95, 82.80, 89.65, 96.49, 103.77],
            [11.48, 12.42, 13.36, 14.68, 15.62, 16.70, 18.21, 19.71, 21.22, 22.82],

        ];
        this.basicMultiplier = [1, 1, 1, 1, 1, 2, 1, 1, 1, 2];
        this.basicEnds = 5;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [19.89, 21.53, 23.16, 25.44, 27.07, 28.95, 31.56, 34.17, 36.78],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [36.94, 39.97, 42.99, 47.23, 50.26, 53.75, 58.59, 63.44, 68.28, 73.43],
            [11.73, 12.70, 13.66, 15.01, 15.97, 17.07, 18.61, 20.15, 21.69, 23.33],
            [17.22, 18.63, 20.04, 22.02, 23.43, 25.05, 27.31, 29.57, 31.83, 34.23],
            [66.39, 71.83, 77.28, 84.90, 90.34, 96.60, 105.31, 114.02, 122.73, 131.99],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [69.19, 74.86, 80.54, 88.48, 94.15, 100.68, 109.76, 118.83, 127.91, 137.55],
            [11.48, 12.42, 13.36, 14.68, 15.62, 16.70, 18.21, 19.71, 21.22, 22.82],
        ];
        this.basicSecondMultiplier = [0, 1, 0, 1, 4, 2, 1, 0, 1, 2];

        this.basicThirdDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [26.52, 28.70, 30.87, 33.92, 36.09, 38.59, 42.07, 45.55, 49.03, 52.73],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [45.90, 49.67, 53.43, 58.70, 62.47, 66.79, 72.82, 78.84, 84.86, 91.26],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [30.60, 33.11, 35.62, 39.14, 41.65, 44.53, 48.55, 52.56, 56.58, 60.84],
        ];
        this.basicThirdMultiplier = [0, 1, 0, 0, 0, 1, 0, 0, 0, 1];

        //Skills
        this.skillBonusType = ['s', 's'];
        this.skillName = 'Art of Violence'
        this.skillNames = ['Mist Bullets', 'Chromatic Splendor'];
        this.skillCurrent = 1;
        this.skill = [
            [72.49, 78.43, 84.37, 92.69, 98.64, 105.47, 114.98, 124.49, 134.00, 144.11],
            [56.70, 61.35, 66, 72.51, 77.16, 82.51, 89.95, 97.39, 104.83, 112.73]
        ]
        this.skillMultiplier = [1, 1];

        this.skillSecondDmg = [
            [72.49, 78.43, 84.37, 92.69, 98.64, 105.47, 114.98, 124.49, 134.00, 144.11],
            [56.70, 61.35, 66, 72.51, 77.16, 82.51, 89.95, 97.39, 104.83, 112.73]
        ];
        this.skillMultiplier = [1]

        this.skillThirdDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [170.1, 184.05, 198, 217.53, 231.48, 247.52, 269.83, 292.15, 314.47, 338.18]
        ];
        this.skillThirdMultiplier = [0, 1];

        //Liberation
        this.liberationBonusType = ['s', 's', 's'];
        this.liberationName = 'Era of New Wave';
        this.liberationNames = ['Era of New Wave', 'Death Knell', 'Fatal Finale'];
        this.liberationCurrent = 1;
        this.liberation = [
            [202.56, 219.17, 235.78, 259.03, 275.64, 294.74, 321.32, 347.89, 374.47, 402.71],
            [92.37, 99.94, 107.52, 118.12, 125.70, 134.41, 146.52, 158.64, 170.76, 183.64],
            [324.09, 350.67, 377.24, 414.45, 441.03, 471.59, 514.11, 556.63, 599.15, 644.33,]
        ];
        this.liberationMultiplier = [1, 1, 1];

        this.liberationSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [7.30, 7.89, 8.49, 9.33, 9.93, 10.62, 11.57, 12.53, 13.49, 14.50],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.liberationSecondMultiplier = [0, 4, 0];

        //Intro Skill
        this.introName = 'Wintertime Aria';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [90.00, 97.38, 104.76, 115.10, 122.48, 130.96, 142.77, 154.58, 166.39, 178.93]
        ];
        this.introMultiplier = [1];

        this.introSecondDmg = [
            [30.00, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
        ];
        this.introSecondMultiplier = [2];

        //Outro Skill
        this.outroName = 'Closing Remark'
        this.outroNames = [this.outroName];
        this.outro = [[794.2]];
        this.outroMultiplier = [1];


        //Forte Skill
        this.forteBonusType = ['s'];
        this.forteName = 'Lethal Repertoire';
        this.forteNames = ['Imminent Oblivion'];
        this.forteCurrent = 1;
        this.forte = [
            [33.62, 36.38, 39.13, 42.99, 45.75, 48.92, 53.33, 57.74, 62.15, 66.83]
        ];
        this.forteMultiplier = [5];

        this.forteSecondDmg = [
            [252.11, 272.78, 293.45, 322.39, 343.07, 366.84, 399.92, 432.99, 466.07, 501.21]
        ];
        this.forteSecondMultiplier = [1]

        //rotations
        this.rotationDesc = ['Intro:' + this.introName, 'Heavy Attack', '3x Basic Attack: Necessary Measures', 'Resonance Skill: Art of Violence',
            'Resonance Skill: Chromatic Splendor', 'Mid-Air Attack', 'Heavy Attack: Containment Tactics', 'Resonance Liberation', '4x Basic Attack Liberation',
            'Basic Attack Liberation: Fatal Finalle', 'Resonance Skill: Art of Violence', 'Resonance Skill: Chromatic Splendor', 'Outro Skill'];
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg',
                'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg',
                'sumLiberationDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumOutroSkill'],
            [0, 9, 2, 3, 4, 0, 1, 7, 5, 0, 1, 1, 1, 1, 2, 0, 1]
        ];
        this.rotationColor = ['intro', 'heavy', 'basic', 'skill', 'skill', 'basic', 'heavy', 'liberation', 'liberation', 'liberation', 'skill', 'skill', 'outro']
        this.rotationCommands = ['mbh', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'e', 'cv', 'mb', 'cv', 'mbh', 'cv', 'r', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'e'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['GLACIO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'ATK %', 'Skill %', 'ATK'];
    }











}