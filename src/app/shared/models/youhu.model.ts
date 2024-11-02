import { Default } from "./default.model";

export class Youhu extends Default {

    constructor() {
        super();

        this.name = 'Youhu'
        this.icon = 'youhu';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Youhu';
        this.type = 'glacio';
        this.weapon = 'gauntlets';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicName = 'Frosty Punches';
        this.basicNames = ['Frosty Punches DMG 1', 'Frosty Punches DMG 2', 'Frosty Punches DMG 3', 'Frosty Punches DMG 4', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [23.83, 25.79, 27.74, 30.48, 32.43, 34.68, 37.80, 40.93, 44.05, 47.38],
            [16.05, 17.37, 18.69, 20.53, 21.84, 23.36, 25.46, 27.57, 29.67, 31.91],
            [19.15, 20.72, 22.29, 24.49, 26.06, 27.86, 30.37, 32.88, 35.40, 38.06],
            [58.53, 63.33, 68.13, 74.84, 79.64, 85.16, 92.84, 100.52, 108.20, 116.35],
            [62.00, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [14.53, 15.73, 16.92, 18.58, 19.78, 21.15, 23.05, 24.96, 26.86, 28.89],
            [7.27, 7.87, 8.46, 9.29, 9.89, 10.58, 11.53, 12.48, 13.43, 14.45]
        ];
        this.basicMultiplier = [1, 1, 1, 1, 1, 6, 6];
        this.basicEnds = 3;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [29.81, 32.25, 34.70, 38.12, 40.56, 43.37, 47.28, 51.19, 55.10, 59.26],
            [23.40, 25.32, 27.24, 29.93, 31.84, 34.05, 37.12, 40.19, 43.26, 46.52],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 1, 1, 0, 0, 0, 0];

        //Skill
        this.skillBonusType = ['s', 'c', 's', 's', 's', 's'];
        this.skillHeal = [false, true, false, false, false, false];
        this.skillName = 'Scroll Divination';
        this.skillNames = ['Scroll Divination', 'Scroll Divination Healing', 'Chime DMG', 'Ruyi DMG', 'Ding DMG', 'Mask DMG'];
        this.skillCurrent = 1;
        this.skill = [
            [78.70, 85.16, 91.61, 100.64, 107.10, 114.52, 124.84, 135.17, 145.49, 156.46],
            [-1041, -1097, -1162, -1302, -1469, -1627, -1655, -1692, -1720, -1767],
            [20.65, 22.34, 24.04, 26.41, 28.10, 30.05, 32.76, 35.46, 38.17, 41.05],
            [68.91, 74.56, 80.21, 88.13, 93.78, 100.27, 109.31, 118.36, 127.40, 137.00],
            [14.38, 15.55, 16.73, 18.38, 19.56, 20.92, 22.80, 24.69, 26.57, 28.57],
            [5.77, 6.24, 6.71, 7.37, 7.85, 8.39, 9.15, 9.90, 10.66, 11.46]
        ]
        this.skillMultiplier = [1, 1, 1, 1, 6, 9];

        this.skillSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [39.00, 40.56, 42.12, 44.46, 47.58, 50.70, 56.55, 63.18, 70.20, 81.90],
            [25.07, 27.13, 29.19, 32.06, 34.12, 36.48, 39.77, 43.06, 46.35, 49.85],
            [84.23, 91.13, 98.04, 107.71, 114.61, 122.56, 133.61, 144.66, 155.71, 167.45],
            [57.49, 62.20, 66.91, 73.51, 78.23, 83.65, 91.19, 98.73, 106.27, 114.28],
            [22.23, 24.06, 25.88, 28.43, 30.25, 32.35, 35.27, 38.18, 41.10, 44.20]
        ];
        this.skillSecondMultiplier = [0, 1, 3, 1, 1, 1];

        this.skillThirdDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [51.62, 55.85, 60.08, 66.01, 70.24, 75.11, 81.88, 88.65, 95.42, 102.62],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.skillThirdMultiplier = [0, 0, 1, 0, 0, 0];


        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = `Fortune's Favor`;
        this.liberationNames = [this.liberationName];
        this.liberationCurrent = 1;
        this.liberation = [
            [164.58, 178.07, 191.57, 210.46, 223.95, 239.47, 261.06, 282.66, 304.25, 327.19]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
        this.introName = 'Scroll of Wonders';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [45.00, 48.69, 52.38, 57.55, 61.24, 65.48, 71.39, 77.29, 83.20, 89.47]
        ];
        this.introMultiplier = [1];

        this.introSecondDmg = [
            [55.00, 59.51, 64.02, 70.34, 74.85, 80.04, 87.25, 94.47, 101.68, 109.35]
        ];
        this.introSecondMultiplier = [1];

        //Outro Skill
        this.outroName = 'Timeless Classics';
        this.outroNames = [this.outroName];
        this.outro = [[0]];
        this.outroMultiplier = [0];

        //Forte Skill
        this.forteBonusType = ['s', 'c', 'c'];
        this.forteName = 'Poetic Essence';
        this.forteNames = ['Poetic Essence', 'Poetic Essence Healing', 'Double Pun Bonus Healing	'];
        this.forteCurrent = 1;
        this.forte = [
            [18.72, 20.26, 21.79, 23.94, 25.47, 27.24, 29.69, 32.15, 34.60, 37.21],
            [-1180, -1243, -1317, -1475, -1665, -1844, -1876, -1918, -1949, -2002],
            [-694, -731, -775, -868, -979, -1085, -1103, -1128, -1147, -1178]
        ];
        this.forteMultiplier = [10, 1, 1];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [44.20, 45.97, 47.74, 50.39, 53.92, 57.46, 64.09, 71.60, 79.56, 92.82],
            [26.00, 27.04, 28.08, 29.64, 31.72, 33.80, 37.70, 42.12, 46.80, 54.60]
        ];
        this.forteSecondMultiplier = [0, 1, 1];

        this.rotationName = ['Intro', 'Basic Attack (Auspieces 1)', 'Lucky Draw', 'Auspieces Basic Attack (Auspieces 2)', 'Resonance Skill', 'Auspieces Basic Attack (Auspieces 3)', 'Resonance Liberation', 'Auspieces Basic Attack (Auspieces 4)', 'Heavy Attack Poetic Essence', 'Outro'];
        this.rotation = [
            ['sumIntroDmg'],
            []
        ];

        this.rotationColor = ['intro', 'basic', 'basic', 'basic', 'skill', 'basic', 'liberation', 'basic', 'outro'];
        this.rotationCommands = ['mb', 'cv', 'mbh', 'cv', 'mb', 'cv', 'e', 'cv', 'mb', 'cv', 'l', 'cv', 'mbh'];

        //Recommended Echo
        this.echo4 = ['Healing %'];
        this.echo3 = ['GLACIO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'Skill %', 'ATK %', 'ATK'];

    }
}