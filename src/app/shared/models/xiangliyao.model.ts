import { Default } from "./default.model";

export class XiangliYao extends Default {

    constructor() {
        super();

      this.lastUpdate = new Date(2024,10,9,0,0,0);
this.name =  'Xiangli Yao'
        this.icon = 'xiangliyao';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Xiangli_Yao';
        this.type = 'electro';
        this.weapon = 'gauntlets';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicName = 'Probe';
        this.basicNames = ['Probe: DMG 1', 'Probe: DMG 2', 'Probe: DMG 3', 'Probe: DMG 4', 'Probe: DMG 5', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [16.65, 18.02, 19.39, 21.30, 22.66, 24.23, 26.42, 28.60, 30.79, 33.11],
            [50.10, 54.21, 58.32, 64.07, 68.18, 72.91, 79.48, 86.05, 92.62, 99.61],
            [20, 21.64, 23.28, 25.58, 27.22, 29.10, 31.73, 34.35, 36.98, 39.76],
            [26.68, 28.87, 31.06, 34.12, 36.31, 38.83, 42.33, 45.83, 49.33, 53.05],
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [120, 129.84, 139.68, 153.46, 163.30, 174.62, 190.36, 206.10, 221.85, 238.58],
            [41.65, 45.07, 48.49, 53.27, 56.68, 60.61, 66.07, 71.54, 77, 82.81]
        ];
        this.basicMultiplier = [2, 1, 3, 2, 1, 1, 1, 2];
        this.basicEnds = 4;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [13.34, 14.44, 15.53, 17.06, 18.16, 19.42, 21.17, 22.92, 24.67, 26.53],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 0, 0, 1, 0, 0, 0, 0];

        //Skill
        this.skillBonusType = ['s'];
        this.skillName = 'Deduction';
        this.skillNames = [this.skillName];
        this.skillCurrent = 1;
        this.skill = [
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]
        ]
        this.skillMultiplier = [1];


        //Liberation
        this.liberationBonusType = ['l', 'b', 'b', 'b', 'l', 's'];
        this.liberationName = 'Cogitation Model';
        this.liberationNames = ['Cogitation Model DMG', 'Pivot - Impale Part 1', 'Pivot - Impale Part 2', 'Pivot - Impale Part 3', 'Pivot Dodge - Unfathomed', 'Divergence'];
        this.liberationCurrent = 1;
        this.liberation = [
            [737.42, 797.89, 858.35, 943.01, 1003.48, 1073.02, 1169.76, 1266.51, 1363.26, 1466.06],
            [60.19, 65.13, 70.06, 76.97, 81.91, 87.59, 95.48, 103.38, 111.28, 119.67],
            [30.65, 33.16, 35.67, 39.19, 41.70, 44.59, 48.61, 52.63, 56.65, 60.92],
            [67.03, 72.52, 78.02, 85.71, 91.21, 97.53, 106.32, 115.12, 123.91, 133.25],
            [19.53, 21.13, 22.73, 24.98, 26.58, 28.42, 30.98, 33.54, 36.10, 38.83],
            [24.94, 26.99, 29.04, 31.90, 33.94, 36.30, 39.57, 42.84, 46.11, 49.59]
        ];
        this.liberationMultiplier = [1, 1, 4, 2, 2, 3];

        this.liberationSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [156.22, 169.03, 181.84, 199.77, 212.58, 227.31, 247.81, 268.30, 288.80, 310.58],
            [87.29, 94.45, 101.61, 111.63, 118.79, 127.02, 138.47, 149.93, 161.38, 173.55]
        ]
        this.liberationSecondMultiplier = [0, 0, 0, 0, 1, 2];

        //Intro Skill
        this.introName = 'Principle';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [50, 54.10, 58.20, 63.94, 68.04, 72.76, 79.32, 85.88, 92.44, 99.41]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        this.outroName = 'Chain Rule';
        this.outroNames = [this.outroName];
        this.outro = [[237.63]];
        this.outroMultiplier = [3];

        //Forte Skill
        this.forteBonusType = ['l', 'l', 'l'];
        this.forteName = 'Forever Seeking';
        this.forteNames = ['Forever Seeking : Decipher', 'Forever Seeking: Law of Reigns', 'Forever Seeking: Revamp'];
        this.forteCurrent = 1;
        this.forte = [
            [200.10, 216.51, 232.92, 255.89, 272.30, 291.17, 317.42, 343.68, 369.93, 397.82],
            [48.15, 52.10, 56.05, 61.58, 65.53, 70.07, 76.39, 82.70, 89.02, 95.73],
            [11, 11.91, 12.81, 14.07, 14.97, 16.01, 17.45, 18.90, 20.34, 21.87]

        ];
        this.forteMultiplier = [1, 4, 4];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [128.40, 138.93, 149.46, 164.20, 174.73, 186.84, 203.69, 220.53, 237.38, 255.28],
            [33, 35.71, 38.42, 42.21, 44.91, 48.02, 52.35, 56.68, 61.01, 65.61]
        ];
        this.forteSecondMultiplier = [0, 1, 2];

        this.rotationDesc = ['Intro', 'Resonance Skill', 'Resonance Liberation',
            'Resonance Skill: Divergence', 'Basic Attack - Revamp', 'Resonance Skill Law of Reigns',
            'Resonance Skill: Divergence', 'Basic Attack - Revamp', 'Resonance Skill Law of Reigns',
            'Resonance Skill: Divergence', 'Basic Attack - Revamp', 'Resonance Skill Law of Reigns',
            'Outro'];
        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg', 'sumOutroDmg'],
            [0, 0, 0, 5, 2, 1, 5, 2, 1, 5, 2, 1, 0]
        ];

        this.rotationColor = ['intro', 'skill', 'liberation', 'skill', 'basic', 'skill', 'skill', 'basic', 'skill', 'skill', 'basic', 'skill', 'outro']
        this.rotationCommands = ['e', 'cv', 'r', 'cv', 'e', 'cv', 'mb', 'cv', 'e', 'cv', 'e', 'cv', 'mb', 'cv', 'e', 'cv', 'e', 'cv', 'mb', 'cv', 'e'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['Electro DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'Liberation %', 'ATK %', 'ATK'];
    }
}