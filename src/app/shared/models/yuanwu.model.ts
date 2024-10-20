import { Default } from "./default.model";

export class Yuanwu extends Default {

    constructor() {
        super();

        this.name = 'Yuanwu'
        this.icon = 'yuanwu';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Yuanwu';
        this.type = 'electro';
        this.weapon = 'gauntlets';

        //Basic Attacks
        this.basicNames = ['Leihuangquan Part 1', 'Leihuangquan Part 2', 'Leihuangquan Part 3', 'Leihuangquan Part 4', 'Leihuangquan Part 5', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [24.70, 26.73, 28.76, 31.59, 33.62, 35.95, 39.19, 42.43, 45.67, 49.11],
            [26.06, 28.20, 30.34, 33.33, 35.46, 37.92, 41.34, 44.76, 48.18, 51.81],
            [10.99, 11.89, 12.79, 14.05, 14.95, 15.99, 17.43, 18.87, 20.31, 21.84],
            [26.06, 28.20, 30.34, 33.33, 35.46, 37.92, 41.34, 44.76, 48.18, 51.81],
            [24.70, 26.73, 28.76, 31.59, 33.62, 35.95, 39.19, 42.43, 45.67, 49.11],
            [49.60, 53.67, 57.74, 63.43, 67.50, 72.18, 78.69, 85.19, 91.70, 98.61],
            [57.60, 62.33, 67.05, 73.66, 78.39, 83.82, 91.38, 98.93, 106.49, 114.52],
            [80.00, 86.56, 93.12, 102.31, 108.87, 116.41, 126.91, 137.40, 147.90, 159.05]
        ];
        this.basicMultiplier = [1, 2, 2, 2, 2, 1, 2, 1];
        this.basicEnds = 4;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [16.48, 17.83, 19.18, 21.07, 22.42, 23.98, 26.14, 28.30, 30.46, 32.76],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [32.94, 35.64, 38.34, 42.12, 44.82, 47.93, 52.25, 56.57, 60.89, 65.48],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 0, 2, 0, 1, 0, 0, 0];

        //Skill
        this.skillNames = ['Leihuang Master', 'Thunder Wedge', 'Thunder Wedge Detonation', 'Rumbling Spark'];
        this.skillCurrent = 1;
        this.skill = [
            [12.00, 12.99, 13.97, 15.35, 16.33, 17.47, 19.04, 20.61, 22.19, 23.86],
            [4.00, 4.33, 4.66, 5.12, 5.45, 5.83, 6.35, 6.87, 7.40, 7.96],
            [30.00, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
            [54.60, 59.07, 63.55, 69.82, 74.29, 79.44, 86.60, 93.76, 100.93, 108.54]
        ]
        this.skillMultiplier = [1, 1, 1, 1];


        //Liberation
        this.liberationNames = ['Blazing Might'];
        this.liberationCurrent = 1;
        this.liberation = [
            [88.00, 95.22, 102.44, 112.54, 119.76, 128.05, 139.60, 151.14, 162.69, 174.96]
        ];
        this.liberationMultiplier = [2];

        //Intro Skill
       // this.introName = ['Thunder Bombardment'];
        this.introCurrent = 1;
        this.intro = [
            [32.00, 34.63, 37.25, 40.93, 43.55, 46.57, 50.77, 54.96, 59.16, 63.62]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        //this.outroName = ['Lightning Manipulation'];

        //Forte Skill
        //this.forteName = ['Unassuming Blade: Thunder Uprising', 'Lightning Infused Part 1', 'Lightning Infused Part 2', 'Lightning Infused Part 3', 'Lightning Infused Part 4', 'Lightning Infused Part 5', 'Lightning Infused Dodge DMG', 'Lightning Infused: Thunderweaver', 'Lightning Infused Heavy Attack'];
        this.forteCurrent = 1;
        this.forte = [
            [20.00, 21.64, 23.28, 25.58, 27.22, 29.11, 31.73, 34.35, 36.98, 39.77],
            [12.35, 13.37, 14.38, 15.80, 16.81, 17.98, 19.60, 21.22, 22.84, 24.56],
            [13.03, 14.10, 15.17, 16.67, 17.73, 18.96, 20.67, 22.38, 24.09, 25.91],
            [5.50, 5.95, 6.40, 7.03, 7.48, 8.00, 8.72, 9.44, 10.16, 10.92],
            [5.77, 6.24, 6.71, 7.38, 7.85, 8.39, 9.15, 9.90, 10.66, 11.46],
            [8.24, 8.91, 9.59, 10.53, 11.21, 11.99, 13.07, 14.15, 15.23, 16.37],
            [21.76, 23.55, 25.33, 27.83, 29.62, 31.67, 34.52, 37.38, 40.23, 43.27],
            [15.60, 16.88, 18.16, 19.95, 21.23, 22.70, 24.75, 26.80, 28.84, 31.02],
            [15.60, 16.88, 18.16, 19.95, 21.23, 22.70, 24.75, 26.80, 28.84, 31.02]
        ];
        this.forteMultiplier = [1, 1, 2, 2, 5, 3, 1, 1, 1];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [8.24, 8.92, 9.59, 10.54, 11.21, 11.99, 13.07, 14.15, 15.23, 16.38],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [16.47, 17.82, 19.17, 21.06, 22.41, 23.97, 26.13, 28.29, 30.45, 32.74],
            [16.32, 17.66, 19.00, 20.88, 22.21, 23.75, 25.89, 28.03, 30.18, 32.45],
            [10.40, 11.26, 12.11, 13.30, 14.16, 15.14, 16.50, 17.87, 19.23, 20.68],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.forteSecondMultiplier = [0, 0, 0, 2, 0, 1, 2, 2, 0];

        this.rotationName = ['Intro', 'Resonance Skill', 'Resonance Liberation', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumLiberationDmg'],
            [0, 0, 1, 2, 3, 0]
        ];

    }
}