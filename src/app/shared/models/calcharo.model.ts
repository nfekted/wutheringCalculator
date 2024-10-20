import { Default } from "./default.model";

export class Calcharo extends Default {

    constructor() {
        super();

        this.name = 'Calcharo'
        this.icon = 'calcharo';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Calcharo';
        this.type = 'electro';
        this.weapon = 'broadblade';

        //Basic Attacks
        this.basicNames = ['Gnawing Fangs: Part 1', 'Gnawing Fangs: Part 2', 'Gnawing Fangs: Part 3', 'Gnawing Fangs: Part 4', 'Mid-Air DMG', 'Dodge DGM', 'Heavy DGM'];
        this.basicCurrent = 1;
        this.basic = [
            [23, 24.89, 26.78, 29.42, 31.3, 33.47, 36.49, 39.51, 42.53, 45.73],
            [50, 54.10, 58.20, 63.94, 68.04, 72.76, 79.32, 85.88, 92.44, 99.41],
            [42.84, 46.36, 49.87, 54.79, 58.30, 62.34, 67.96, 73.58, 79.20, 85.18],
            [39.99, 43.27, 46.55, 51.14, 54.42, 58.19, 63.44, 68.69, 73.93, 79.51],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [33.44, 36.18, 38.93, 42.76, 45.51, 48.66, 53.05, 57.43, 61.82, 66.48],
            [20.8, 22.51, 24.22, 26.60, 28.31, 30.27, 33, 35.73, 38.46, 41.36]
        ];
        this.basicMultiplier = [2, 1, 1, 2, 1, 3, 5];
        this.basicEnds = 3;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [21.42, 23.18, 24.94, 27.40, 29.15, 31.17, 33.98, 36.79, 39.60, 42.59],
            [53.32, 57.70, 62.07, 68.19, 72.56, 77.59, 84.59, 91.58, 98.58, 106.01],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [42.99, 46.52, 50.05, 54.98, 58.51, 62.56, 68.20, 73.84, 79.48, 85.47],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 0, 3, 1, 0, 1, 0];

        //Skill
        this.skillNames = ['Extermination Order: Part 1', 'Extermination Order: Part 2', 'Extermination Order: Part 3'];
        this.skillCurrent = 1;
        this.skill = [
            [25.94, 28.07, 30.20, 33.17, 35.30, 37.75, 41.15, 44.55, 47.96, 51.57],
            [38.91, 42.10, 45.29, 49.76, 52.95, 56.62, 61.72, 66.83, 71.93, 77.36],
            [108.08, 116.94, 125.80, 138.21, 147.07, 157.26, 171.44, 185.62, 199.80, 214.87]
        ]
        this.skillMultiplier = [2, 2, 1];

        this.skillSecondDmg = [
            [34.59, 37.42, 40.26, 44.23, 47.07, 50.33, 54.87, 59.40, 63.94, 68.76],
            [51.88, 56.13, 60.39, 66.34, 70.60, 75.49, 82.30, 89.10, 95.91, 103.14],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.skillSecondMultiplier = [1, 1, 0];

        //Liberation
        this.liberationNames = ['Phantom Etching', 'Necessary Means (Liberation Intro)', 'Hounds Roar Part 1', 'Hounds Roar Part 2', 'Hounds Roar Part 3', 'Hounds Roar Part 4', 'Hounds Roar Part 5', 'Dodge DMG', 'Heavy DGM'];
        this.liberationCurrent = 1;
        this.liberation = [
            [300, 324.60, 349.20, 383.64, 408.24, 436.53, 475.89, 515.25, 554.61, 596.43],
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81],
            [44.30, 47.93, 51.56, 56.65, 60.28, 64.46, 70.27, 76.08, 81.89, 88.07],
            [17.72, 19.18, 20.63, 22.66, 24.11, 25.79, 28.11, 30.43, 32.76, 35.23],
            [82.41, 89.17, 95.93, 105.39, 112.14, 119.92, 130.73, 141.54, 152.35, 163.84],
            [17.52, 18.95, 20.39, 22.40, 23.83, 25.49, 27.78, 30.08, 32.38, 34.82],
            [75.54, 81.74, 87.93, 96.61, 102.80, 109.92, 119.83, 129.74, 139.66, 150.19],
            [28.67, 31.02, 33.37, 36.66, 39.01, 41.72, 45.48, 49.24, 53, 56.99],
            [31.20, 33.76, 36.32, 39.90, 42.46, 45.40, 49.50, 53.59, 57.68, 62.03],
        ];
        this.liberationMultiplier = [1, 2, 1, 2, 1, 6, 2, 6, 5];

        this.liberationSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [26.58, 28.76, 30.94, 33.99, 36.17, 38.68, 42.16, 45.65, 49.14, 52.84],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.liberationSecondMultiplier = [0, 0, 0, 2, 0, 0, 0, 0, 0];

        //Intro Skill
       // this.introName = ['Wanted Outlaw'];
        this.introCurrent = 1;
        this.intro = [
            [20, 21.64, 23.28, 25.58, 27.22, 29.11, 31.73, 34.35, 36.98, 39.77]
        ];
        this.introMultiplier = [2];

        this.introSecondDmg = [
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
        ];
        this.introSecondMultiplier = [2];

        //Outro Skill
        //this.outroName = ['Shadowy Raid'];
        this.outro = [[195.98]];
        this.outroMultiplier = [1];

        this.outroSecondDmg = [[391.96]];
        this.outroSecondMultiplier = [1];

        // //Forte Skill
        //this.forteName = ['Hunting Mission: Mercy', 'Hunting Mission: Death Messager'];
        this.forteCurrent = 1;
        this.forte = [
            [19.67, 21.29, 22.90, 25.16, 26.77, 28.63, 31.21, 33.79, 36.37, 39.11],
            [49.18, 53.21, 57.24, 62.89, 66.92, 71.56, 78.01, 84.46, 90.91, 97.77]
        ];
        this.forteMultiplier = [8, 8];

        this.forteSecondDmg = [
            [39.34, 42.57, 45.80, 50.31, 53.54, 57.25, 62.41, 67.57, 72.73, 78.22],
            [98.35, 106.42, 114.48, 125.77, 133.84, 143.11, 156.02, 168.92, 181.82, 195.53]
        ];
        this.forteSecondMultiplier = [1, 1];

        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumForteDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumForteDmg', 'sumOutroDmg'],
            [0, 0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 1, 2, 3, 4, 5, 6, 0, 1, 2, 1, 0]
        ];
        this.rotationName = ['Intro Skill: Wanted Outlaw', 'Ressonance Skill', 'Resonance Liberation', 'Heavy Attack: Death Messager', '5x Basic Attack', 'Ressonance Skill', 'Heavy Attack: Death Messager', '5x Basic Attack', 'Ressonance Skill', 'Heavy Attack: Death Messager', 'Outro: Shadowy Raid']
    }
}