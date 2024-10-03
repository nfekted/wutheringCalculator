import { Default } from "./default.model";

export class Jianxin extends Default {

    constructor() {
        super();

        this.name = 'Jianxin'
        this.icon = 'jianxin';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Jianxin';
        this.type = 'aero';
        this.weapon = 'gauntlets';

        //Basic Attacks
        this.basicNames = ['Fengyiquan Part 1', 'Fengyiquan Part 2', 'Fengyiquan Part 3', 'Fengyiquan Part 4', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [34.94, 37.8, 40.67, 44.68, 47.54, 50.84, 55.42, 60.01, 64.59, 69.46],
            [13.40, 14.50, 15.60, 17.14, 18.23, 19.50, 21.26, 23.01, 24.77, 26.64],
            [21, 22.72, 24.44, 26.85, 28.57, 30.55, 33.31, 36.06, 38.82, 41.75],
            [57.04, 61.72, 66.39, 72.94, 77.62, 83, 90.48, 97.96, 105.45, 113.4],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [20.54, 22.22, 23.91, 26.26, 27.95, 29.88, 32.58, 35.27, 37.96, 40.83],
            [63.41, 68.61, 73.81, 81.09, 86.29, 92.27, 100.59, 108.91, 117.23, 126.07]
        ];
        this.basicMultiplier = [1, 2, 4, 1, 1, 2, 1];
        this.basicEnds = 3;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [40.19, 43.49, 46.78, 51.4, 54.69, 58.48, 63.76, 69.03, 74.3, 79.9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [82.14, 88.87, 95.61, 105.04, 111.77, 119.52, 130.29, 141.07, 151.84, 163.29],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 1, 0, 0, 0, 1, 0];

        //Skill
        this.skillNames = ['Calming Air: Chi Counter', 'Calming Air: Chi Parry'];
        this.skillCurrent = 1;
        this.skill = [
            [168.3, 182.11, 195.91, 215.23, 229.03, 244.9, 266.98, 289.06, 311.14, 334.6],
            [130.14, 140.81, 151.48, 166.42, 177.09, 189.36, 206.44, 223.51, 240.59, 258.73]
        ]
        this.skillMultiplier = [1, 1];

        //Liberation
        this.liberationNames = ['Purification Force Field: Continuous (1hit)', 'Purification Force Field: Continuous (12hit)', 'Purification Force Field: Explosion'];
        this.liberationCurrent = 1;
        this.liberation = [
            [15, 16.23, 17.46, 19.19, 20.42, 21.83, 23.8, 25.77, 27.74, 29.83],
            [15, 16.23, 17.46, 19.19, 20.42, 21.83, 23.8, 25.77, 27.74, 29.83],
            [320, 346.24, 372.48, 409.22, 435.46, 465.64, 507.62, 549.6, 591.59, 636.2]
        ];
        this.liberationMultiplier = [1, 12, 1];

        //Intro Skill
        this.introName = ['Essence of Tao'];
        this.introCurrent = 1;
        this.intro = [
            [17, 18.40, 19.79, 21.74, 23.14, 24.74, 26.97, 29.20, 31.43, 33.80]
        ];
        this.introMultiplier = [3];

        this.introSecondDmg = [
            [34, 36.79, 39.58, 43.48, 46.27, 49.48, 53.94, 58.40, 62.86, 67.60]
        ];
        this.introSecondMultiplier = [1];

        //Outro Skill
        this.outro = [[0]];
        this.outroMultiplier = [0];
        this.outroName = ['Transcendence'];

        //Forte Skill
        this.forteName = ['Primordial Chi Spiral: Pushin Punch', '1x Zhoutian Damage', '20x Zhoutian Damage', 'Minor Zhoutian Shock', 'Major Zhoutian: Inner Shock', 'Major Zhoutian: Outer Shock', 'Yielding Pull', 'Incomplete Minor Zhoutian Shield', 'Major Zhoutian: Inner Shield', 'Major Zhoutian: Outer Shield', 'Shield Healing'];
        this.forteCurrent = 1;
        this.forteHeal = [false, false, false, false, false, false, false, false, false, false, true];
        this.forteShield = [false, false, false, false, false, false, false, true, true, true, false];
        this.forte = [
            [125, 135.25, 145.50, 159.85, 170.10, 181.89, 198.29, 214.69, 231.09, 248.52],
            [12.50, 13.53, 14.55, 15.99, 17.01, 18.19, 19.83, 21.47, 23.11, 24.86],
            [12.50, 13.53, 14.55, 15.99, 17.01, 18.19, 19.83, 21.47, 23.11, 24.86],
            [70, 75.74, 81.48, 89.52, 95.26, 101.86, 111.05, 120.23, 129.41, 139.17],
            [190, 205.58, 221.16, 242.98, 258.56, 276.47, 301.40, 326.33, 351.26, 377.74],
            [260, 281.32, 302.64, 332.49, 353.81, 378.33, 412.44, 446.55, 480.67, 516.71],
            [110, 119.02, 128.04, 140.67, 149.69, 160.07, 174.50, 188.93, 203.36, 218.70],
            [-437, -490, -546, -612, -691, -765, -778, -796, -809, -831],
            [-875, -980, -1093, -1225, -1382, -1531, -1557, -1592, -1618, -1662],
            [-1750, -1960, -2187, -2450, -2765, -3062, -3115, -3185, -3237, -3325],
            [-2915, -3265, -3644, -4081, -4606, -5102, -5189, -5306, -5393, -5539],
            [-700, -784, -875, -980, -1106, -1225, -1246, -1274, -1295, -1330]
        ];
        this.forteMultiplier = [1, 1, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [17.06, 17.75, 18.43, 19.45, 20.82, 22.18, 24.74, 27.64, 30.71, 35.83],
            [34.13, 35.49, 36.86, 38.90, 41.63, 44.36, 49.48, 55.28, 61.43, 71.66],
            [68.25, 70.98, 73.71, 77.81, 83327, 88.73, 98.96, 110.57, 122.85, 143.33],
            [113.70, 118.25, 122.80, 129.62, 138.72, 147.82, 164.87, 184.20, 204.67, 238.78],
            [27.30, 28.39, 29.48, 31.12, 33.31, 35.49, 39.59, 44.23, 49.14, 57.33]
        ];
        this.forteSecondMultiplier = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];

        // rotation: Array<Array<string | number>> = [[], []];
        // rotationName: Array<string> = []
    }

}