import { Default } from "./default.model";

export class Encore extends Default {

    constructor() {
        super();

        this.name = 'Encore'
        this.icon = 'encore';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Encore';
        this.type = 'fusion';
        this.weapon = 'rectifier';

        //Skills
        this.basicNames = ['Wooly Attack: Part 1', 'Wooly Attack: Part 2', 'Wooly Attack: Part 3', 'Wooly Attack: Part 4', 'Wooly Strike', 'Air/Jump Attack', 'Dodge Attack', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [28, 30.29, 32.59, 35.80, 38.10, 40.74, 44.41, 48.09, 51.76, 55.66],
            [33.30, 36.03, 38.76, 42.58, 45.31, 48.45, 52.82, 57.19, 61.56, 66.20],
            [33.35, 36.08, 38.81, 42.64, 45.38, 48.52, 52.90, 57.27, 61.65, 66.30],
            [19.25, 20.82, 22.40, 24.61, 26.19, 28.01, 30.53, 33.03, 35.58, 38.27],
            [120, 129.84, 139.67, 153.45, 163.29, 174.61, 190.35, 206.10, 221.84, 238.57],
            [62, 67.08, 72.16, 79.28, 84.36, 90.21, 98.35, 106.48, 114.61, 123.26],
            [63.34, 68.54, 73.73, 81.01, 86.20, 92.18, 100.49, 108.80, 117.11, 125.94],
            [94.10, 101.81, 109.53, 120.33, 128.05, 136.92, 149.27, 161.61, 173.96, 187.08],
        ];
        this.basicMultiplier = [1, 1, 2, 4, 1, 1, 1, 2];
        this.basicEnds = 4;

        this.skillNames = ['Flaming Woolies', 'Energetic Welcome'];
        this.skillCurrent = 1;
        this.skill = [
            [38.53, 41.69, 44.85, 49.28, 52.44, 56.07, 61.13, 66.18, 71.24, 76.61],
            [170.60, 184.58, 198.57, 218.16, 232.15, 248.24, 270.62, 293, 315.38, 339.16]
        ]
        this.skillMultiplier = [8, 1];

        this.liberationNames = ['Cosmos: Frolicking Part 1', 'Cosmos: Frolicking Part 2', 'Cosmos: Frolicking Part 3', 'Cosmos: Frolicking Part 4', 'Cosmos: Dodge Counter', 'Cosmos Rampage', 'Cosmos: Heavy Attack'];
        this.liberationCurrent = 1;
        this.liberation = [
            [45.36, 49.08, 52.8, 58.01, 61.73, 66.01, 71.96, 77.91, 83.86, 90.18],
            [28.37, 30.7, 33.02, 36.28, 38.61, 41.28, 45, 48.72, 52.45, 56.4],
            [33.19, 35.92, 38.64, 42.45, 45.17, 48.3, 52.65, 57.01, 61.36, 65.99],
            [97.59, 105.59, 113.59, 124.79, 132.79, 142, 154.8, 167.6, 180.4, 194.01],
            [33.19, 35.92, 38.64, 42.45, 45.17, 48.3, 52.65, 57.01, 61.36, 65.99],
            [31.85, 34.46, 37.07, 40.72, 43.34, 46.34, 50.52, 54.7, 58.88, 63.32],
            [109.44, 118.42, 127.39, 139.96, 148.93, 159.25, 173.61, 187.97, 202.32, 217.58]
        ];
        this.liberationMultiplier = [2, 3, 4, 3, 4, 4, 1];

        //Intro
       // this.introName = ['Angry Cosmos'];
        this.introCurrent = 1;
        this.intro = [[100, 108.2, 116.4, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]];
        this.introMultiplier = [1];

        //Outro
        //this.outroName = ['Woolies Cheer Dance'];
        this.outro = [[176.76]];
        this.outroMultiplier = [4];

        //this.forteName = ['Cloudy: Frenzy', 'Cosmos: Rupture'];
        this.forteCurrent = 1;
        this.forte = [
            [168, 181.77, 195.55, 214.83, 228.61, 244.45, 266.49, 288.53, 310.58, 334],
            [23.35, 25.26, 27.18, 29.86, 31.77, 33.97, 37.04, 40.10, 43.17, 46.42]
        ];
        this.forteMultiplier = [1, 6];

        this.forteSecondDmg = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [249.08, 269.51, 289.93, 318.53, 338.95, 362.44, 395.12, 427.80, 460.48, 495.21]];
        this.forteSecondMultiplier = [0, 1];

        this.rotationName = ['Resonance Skill + Energetic Welcome', 'Resonance Liberation', 'Cosmos Rampage (Liberation)', '4x Cosmos: Frolicking (Basic Attack)', 'Cosmos Rampage (Liberation)', '4x Cosmos: Frolicking (Basic Attack)', 'Cosmos Rampage (Liberation)', 'Cosmos Heavy Attack'];
        this.rotation = [
            ['sumSkillDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg'],
            [0, 1, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 6]
        ];

    }
}