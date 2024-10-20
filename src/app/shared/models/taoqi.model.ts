import { Default } from "./default.model";

export class Taoqi extends Default {

    constructor() {
        super();

        this.name = 'Taoqi'
        this.icon = 'taoqi';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Taoqi';
        this.type = 'havoc';
        this.weapon = 'broadblade';

        //Basic Attacks
        this.basicNames = ['Concealed Edge : Part 1', 'Concealed Edge : Part 2', 'Concealed Edge : Part 3', 'Concealed Edge : Part 4', 'Mid-Air DMG', 'Counter DMG', 'Strategic Parry', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [45.34, 49.06, 52.78, 57.99, 61.7, 65.98, 71.93, 77.88, 83.83, 90.15],
            [42.67, 46.17, 49.67, 54.57, 58.07, 62.09, 67.69, 73.29, 78.89, 84.84],
            [56, 60.6, 65.19, 71.62, 76.21, 81.49, 88.84, 963.18, 103.53, 111.34],
            [136, 147.16, 158.31, 173.92, 185.07, 197.9, 215.74, 233.58, 251.43, 270.39],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [125, 135.25, 145.5, 159.85, 170.1, 181.89, 198.29, 214.69, 231.09, 248.52],
            [39.59, 42.84, 46.08, 50.63, 53.87, 57.61, 62.8, 67.99, 73.19, 78.7],
            [110.84, 119.93, 129.02, 141.75, 150.84, 161.29, 175.83, 190.37, 204.91, 220.37]
        ];
        this.basicMultiplier = [1, 1, 1, 1, 1, 1, 1, 1];
        this.basicEnds = 3;

        //Skill
        this.skillHeal = [false, true];
        this.skillNames = ['Fortified Defense', 'HP Recover'];
        this.skillCurrent = 1;
        this.skill = [
            [67.86, 73.43, 78.99, 86.78, 92.35, 98.75, 107.65, 116.55, 125.46, 134.92],
            [-950, -1064, -1187, -1330, -1501, -1662, -1691, -1729, -1757, -1805]
        ]
        this.skillMultiplier = [1, 1];

        this.skillSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [45, 46.8, 48.6, 51.3, 54.9, 58.5, 65.25, 72.9, 81, 94.5]
        ];
        this.skillSecondMultiplier = [0, 1];


        //Liberation
        this.liberationDMGType = ['def']
        this.liberationNames = ['Unmovable'];
        this.liberationCurrent = 1;
        this.liberation = [
            [226.2, 224.75, 263.3, 289.27, 307.82, 329.15, 358.83, 388.5, 418.18, 449.91]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
       // this.introName = ['Defense Formation'];
        this.introCurrent = 1;
        this.intro = [
            [105, 113.661, 122.22, 134.28, 142.89, 152.79, 166.57, 180.34, 194.12, 208.76]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        //this.outroName = ['Iron Will'];
        this.outro = [[0]];
        this.outroMultiplier = [0];

        //Forte Skill
        this.forteShield = [false, false, false, true, true, true]
        //this.forteName = ['Power Shift: Timed Counter Part 1', 'Power Shift: Timed Counter Part 2', 'Power Shift: Timed Counter Part 3', 'Power Shift: Timed Counter Shild 1', 'Power Shift: Timed Counter Shild 2', 'Power Shift: Timed Counter Shild 3'];
        this.forteCurrent = 1;
        this.forte = [
            [43.36, 46.92, 50.47, 55.45, 59, 63.09, 68.78, 74.47, 80.16, 86.2],
            [55.8, 60.38, 64.95, 71.36, 75.93, 81.19, 88.51, 95.83, 103.16, 110.93],
            [73.14, 79.14, 85.14, 93.53, 99.53, 106.43, 116.02, 125.62, 135.22, 145.41],
            [-300, -336, -375, -420, -474, -525, -534, -546, -555, -570],
            [-450, -504, -562, -630, -711, -787, -801, -819, -832, -855],
            [-750, -840, -937, -1050, -1185, -1312, -1335, -1365, -1387, -1425]
        ];
        this.forteMultiplier = [1, 1, 1, 1, 1, 1];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [11.25, 11.7, 12.15, 12.82, 13.72, 14.62, 16.31, 18.22, 20.25, 23.62],
            [16.87, 17.55, 18.22, 19.23, 20.58, 21.93, 24.46, 27.33, 30.37, 35.43],
            [28.12, 29.25, 30.37, 32.06, 34.31, 36.56, 40.78, 45.56, 50.62, 59.06]
        ];
        this.forteSecondMultiplier = [0, 0, 0, 1, 1, 1];

        this.rotationName = ['Intro', '3x Basic Attack', 'Resonance Skill', 'Resonance Liberation', 'Outro'];
        this.rotation =
            [
                ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumLiberationDmg'],
                [0, 0, 1, 2, 0, 0]
            ];

    }
}