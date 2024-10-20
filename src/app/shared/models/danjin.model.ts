import { Default } from "./default.model";

export class Danjin extends Default {

    constructor() {
        super();

        this.name = 'Danjin'
        this.icon = 'danjin';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Danjin';
        this.type = 'havoc';
        this.weapon = 'sword';

        //Basic Attacks
        this.basicNames = ['Execution Part 1', 'Execution Part 2', 'Execution Part 3', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [28.80, 31.17, 33.53, 36.83, 39.20, 41.91, 45.69, 493.47, 53.25, 57.26],
            [29.60, 32.03, 34.46, 37.86, 40.28, 43.08, 46.96, 50.84, 54.73, 58.85],
            [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
            [49.60, 53.67, 57.74, 63.43, 67.50, 72.18, 78.69, 85.19, 91.70, 98.61],
            [32, 34.63, 37.25, 40.93, 43.55, 46.57, 50.77, 54.96, 59.16, 63.62],
            [18.67, 20.20, 21.373, 23.88, 25.41, 27.17, 29.62, 32.06, 34.51, 37.12]
        ];
        this.basicMultiplier = [1, 1, 1, 1, 3, 3];
        this.basicEnds = 2;

        //Skill
        this.skillNames = ['Carmine Gleam', 'Crimson Erosion Part 1', 'Crimson Erosion', 'Sanguine Pulse Part 1', 'Sanguine Pulse Part 2', 'Sanguine Pulse Part 3'];
        this.skillCurrent = 1;
        this.skill = [
            [19.20, 20.78, 22.35, 24.56, 26.13, 27.94, 30.46, 32.98, 35.50, 38.18],
            [32.40, 35.06, 37.72, 41.44, 44.09, 47.15, 51.40, 55.65, 59.90, 64.42],
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
            [28.20, 30.52, 32.83, 36.07, 38.38, 41.04, 44.74, 48.44, 52.14, 56.07],
            [21.60, 23.38, 25.15, 27.63, 29.40, 31.44, 34.27, 37.10, 39.94, 42.95],
            [32.40, 35.06, 37.72, 41.44, 44.09, 47.15, 51.40, 55.65, 59.90, 64.42]
        ]
        this.skillMultiplier = [2, 2, 2, 2, 3, 3];

        //Liberation
        this.liberationNames = ['Continuous Attack', 'Scarlet Burst'];
        this.liberationCurrent = 1;
        this.liberation = [
            [24.69, 26.72, 28.74, 31.58, 33.60, 35.93, 39.17, 42.41, 45.64, 49.09],
            [197.50, 213.70, 229.89, 252.57, 268.76, 287.39, 313.30, 339.21, 365.12, 392.65]
        ];
        this.liberationMultiplier = [8, 1];

        //Intro Skill
       // this.introName = ['Vindiction'];
        this.introCurrent = 1;
        this.intro = [
            [25, 27.05, 29.10, 31.97, 34.02, 36.38, 39.66, 42.94, 46.22, 49.71]
        ];
        this.introMultiplier = [4];

        //Outro Skill
        this.outro = [[0]];
        this.outroMultiplier = [0];
        //this.outroName = ['Duality'];

        //Forte Skill
        //this.forteName = ['Chaoscleave', 'Full Energy Chaoscleave', 'Scatterbloom', 'Full Energy Scatterbloom'];
        this.forteCurrent = 1;
        this.forte = [
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
            [72, 77.91, 83.81, 92.08, 97.98, 104.77, 114.22, 123.66, 133.11, 143.15],
            [90, 97, 105, 115, 122, 131, 143, 155, 166, 179],
            [216, 233.72, 251.43, 276.23, 293.94, 314.31, 342.65, 370.98, 399.32, 429.43]
        ];
        this.forteMultiplier = [7, 7, 1, 1];

        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumSkillDmg', 'sumForteDmg', 'sumForteDmg'],
            [0, 1, 2, 0, 1, 3, 4, 5, 0, 1, 2, 3, 4, 5, 1, 3]
        ];
        this.rotationName = ['Intro', '2x Resonance Skill', 'Resonance Liberation', '2x Basic Attack', '3x Resonance Skill', '3x Basic Attack', '3x Resonance Skill', 'Heavy Attack (Full Energy)', 'Basic Attack (Full Energy)', 'Outro']
    }
}