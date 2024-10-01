import { Default } from "./default.model";

export class Changli extends Default {
    constructor() {
        super();

        this.name = 'Changli'
        this.icon = 'changli';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Changli';
        this.type = 'fusion';
        this.weapon = 'sword';

        //Basic Attacks
        this.basicNames = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Mid-Air Part 1', 'Mid-Air Part 2', 'Mid-Air Part 3', 'Mid-Air Part 4', 'Dodge DMG', 'Heavy Attack', 'Mid-Air Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [14.84, 16.05, 17.27, 18.97, 20.19, 21.59, 23.53, 25.48, 27.43, 29.49],
            [17.85, 19.32, 20.78, 22.83, 24.30, 25.98, 28.32, 30.66, 33, 35.49],
            [18.34, 19.84, 21.34, 23.45, 24.95, 26.68, 29.08, 34.49, 33.89, 36.45],
            [25.50, 27.60, 29.69, 32.61, 34.71, 37.11, 40.46, 43.80, 47.15, 50.70],
            [30.86, 33.39, 35.92, 39.46, 41.99, 44.90, 48.95, 53., 57.05, 61.35],
            [25.59, 27.69, 29.79, 32.72, 34.82, 37.23, 40.59, 43.95, 47.30, 50.87],
            [22.13, 23.95, 25.76, 28.30, 30.12, 32.20, 35.11, 38.01, 40.91, 44],
            [19.13, 20.70, 22.27, 24.46, 26.03, 27.83, 30.34, 32.85, 35.36, 38.03],
            [41.57, 44.98, 48.39, 53.16, 56.57, 60.49, 65.94, 71.40, 76.85, 82.64],
            [14.58, 15.78, 16.97, 18.65, 19.84, 21.22, 23.13, 25.04, 26.95, 28.99],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27]
        ];
        this.basicMultiplier = [2, 2, 3, 1, 1, 2, 3, 1, 3, 3, 1];
        this.basicEnds = 7;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [14.88, 16.10, 17.32, 19.03, 20.25, 21.65, 23.60, 25.55, 27.50, 29.58],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [11.16, 12.08, 12.99, 14.27, 15.19, 16.24, 17.70, 19.17, 20.63, 22.18],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [18.75, 20.28, 21.82, 23.97, 25.51, 27.28, 29.74, 32.20, 34.65, 37.27],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 0, 0, 4, 0, 0, 0, 4, 0, 1, 0];

        //Skill
        this.skillNames = ['Tripartite Flames, True Sight: Capture', 'Tripartite Flames, True Sight: Conquest', 'Tripartite Flames, True Sight: Charge'];
        this.skillCurrent = 1;
        this.skill = [
            [41.19, 44.57, 47.94, 52.67, 56.05, 59.93, 65.34, 70.74, 76.14, 81.88],
            [29.65, 32.08, 34.51, 37.92, 40.35, 43.14, 47.03, 50.92, 54.81, 58.95],
            [36.56, 39.56, 42.56, 46.75, 49.75, 53.20, 58, 62.79, 67.59, 72.68]
        ]
        this.skillMultiplier = [3, 2, 1];

        this.skillSecondDmg = [
            [82.37, 89.13, 95.88, 105.34, 112.09, 119.86, 130.67, 141.47, 152.28, 163.76],
            [41.51, 44.91, 48.32, 53.08, 56.49, 60.40, 65.85, 71.29, 76.74, 82.52],
            [54.84, 59.34, 63.83, 70.13, 74.62, 79.80, 86.99, 94.18, 101.38, 109.02]
        ];
        this.skillSecondMultiplier = [1, 1, 1];

        this.skillThirdDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [47.44, 51.33, 55.22, 60.67, 64.56, 69.03, 75.25, 81.48, 87.70, 94.31],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.skillThirdMultiplier = [0, 1, 0];

        //Liberation
        this.liberationNames = ['Radiance of Fealty'];
        this.liberationCurrent = 1;
        this.liberation = [
            [610, 660.02, 710.04, 780.07, 830.09, 887.62, 967.65, 1047.68, 1127.71, 1212.75]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
        this.introName = ['Obedience of Rules'];
        this.introCurrent = 1;
        this.intro = [
            [22.38, 24.22, 26.06, 28.62, 30.46, 32.57, 35.51, 38.44, 41.38, 44.50]
        ];
        this.introMultiplier = [1];

        this.introSecondDmg = [
            [13.06, 14.13, 15.20, 16.70, 17.77, 19, 20.71, 22.43, 24.14, 26.96]
        ];
        this.introSecondMultiplier = [4];

        //Outro Skill
        this.outro = [[0]];
        this.outroMultiplier = [0];
        this.outroName = ['Strategy of Duality'];

        //Forte Skill
        this.forteName = ['Flaming Sacrifice'];
        this.forteCurrent = 1;
        this.forte = [
            [19.74, 21.36, 22.98, 25.25, 26.87, 28.73, 31.32, 33.91, 36.50, 39.25]
        ];
        this.forteMultiplier = [5];

        this.forteSecondDmg = [
            [230.30, 249.18, 268.07, 294.51, 313.39, 335.11, 365.32, 395.54, 425.75, 457.85]
        ];
        this.forteSecondMultiplier = [1];

        this.rotationName = ['Intro: ' + this.introName[0], 'Resonance Skill: Capture', 'True Sight Charge', 'True Sight Conquest', 'Resonance Skill: Capture', 'True Sight Charge', 'Heavy Attack', 'Resonance Liberation', 'Heavy Attack', '4x Basic Attack'];
        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumLiberationDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg'],
            [0, 0, 2, 1, 0, 1, 9, 0, 9, 0, 1, 2, 3]
        ];
    }
}