import { Default } from "./default.model";

export class Yangyang extends Default {

    constructor() {
        super();

        this.name = 'Yangyang'
        this.icon = 'yangyang';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Yangyang';
        this.type = 'aero';
        this.weapon = 'sword';
        //Basic Attacks
        this.basicNames = ['Feather as Blade Part 1', 'Feather as Blade Part 2', 'Feather as Blade Part 3', 'Feather as Blade Part 4', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack', 'Zephyr Song'];
        this.basicCurrent = 1;
        this.basic = [
            [22.50, 24.34, 26.18, 28.77, 30.61, 32.73, 35.69, 38.64, 41.59, 44.73],
            [30, 32.46, 34.92, 38.36, 40.82, 43.65, 47.58, 51.52, 55.46, 59.64],
            [23.55, 25.48, 27.41, 30.11, 32.04, 34.26, 37.35, 40.44, 43.53, 46.81],
            [29.86, 32.31, 34.76, 38.19, 40.64, 43.45, 47.37, 51.29, 55.20, 59.36],
            [46.50, 50.31, 54.12, 59.46, 63.27, 67.66, 73.76, 79.86, 85.96, 92.44],
            [43.80, 47.39, 50.98, 56.01, 59.60, 63.73, 69.47, 75.22, 80.97, 87.07],
            [10, 10.82, 11.64, 12.78, 13.60, 14.55, 15.86, 17.17, 18.48, 19.88],
            [53.62, 58.02, 62.41, 68.57, 72.97, 78.02, 85.06, 92.10, 99.13, 106.61]
        ];
        this.basicMultiplier = [1, 1, 2, 2, 1, 2, 3, 1];
        this.basicEnds = 3;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [39.81, 43.07, 46.33, 50.90, 54.17, 57.92, 63.15, 68.37, 73.59, 79.14],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.basicSecondMultiplier = [0, 0, 0, 1, 0, 0, 0, 0];

        //Skill
        this.skillNames = ['Zephyr Domain'];
        this.skillCurrent = 1;
        this.skill = [
            [17.37, 18.79, 20.21, 22.21, 23.63, 25.27, 27.55, 29.83, 32.11, 34.53]
        ]
        this.skillMultiplier = [4];

        this.skillSecondDmg = [
            [104.22, 112.76, 121.31, 133.27, 141.82, 151.65, 165.32, 178.99, 192.67, 207.19]
        ];
        this.skillSecondMultiplier = [1];


        //Liberation
        this.liberationNames = ['Wind Spirals'];
        this.liberationCurrent = 1;
        this.liberation = [
            [23.43, 25.35, 27.27, 29.96, 31.88, 34.09, 37.17, 40.24, 43.32, 46.58]
        ];
        this.liberationMultiplier = [12];

        this.liberationSecondDmg = [
            [187.46, 202.83, 218.21, 239.73, 255.10, 272.78, 297.37, 321.97, 346.56, 372.70]
        ]
        this.liberationSecondMultiplier = [1];

        //Outro
        //this.outroName = ['Whispering Breeze']

        //Intro Skill
       // this.introName = ['Cerulean Song'];
        this.introCurrent = 1;
        this.intro = [
            [40, 43.28, 46.56, 51.15, 54.43, 58.20, 63.45, 68.70, 73.94, 79.52]
        ];
        this.introMultiplier = [2];


        //Forte Skill
        //this.forteName = ['Echoing Feathers: Stormy Strike', 'Echoing Feathers: Feather Release'];
        this.forteCurrent = 1;
        this.forte = [
            [19.12, 20.69, 22.26, 24.45, 26.02, 27.82, 30.33, 32.84, 35.35, 38.02],
            [10.93, 11.83, 12.72, 13.98, 14.88, 15.91, 17.34, 18.78, 20.21, 21.73]
        ];
        this.forteMultiplier = [2, 5];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [63.78, 69.01, 74.24, 81.57, 86.80, 92.81, 101.18, 109.55, 117.92, 126.81]
        ];
        this.forteSecondMultiplier = [0, 2];

        this.rotationName = ['Intro', 'Resonance Liberation', 'Resonance Skill', 'Heavy Attack', 'Zephyr Song', 'Echoing Feathers: Stormy Strike', 'Echoing Feathers: Feather Release', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumLiberationDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumForteDmg', 'sumForteDmg'],
            [0, 0, 0, 6, 7, 0, 1]
        ];

    }
}