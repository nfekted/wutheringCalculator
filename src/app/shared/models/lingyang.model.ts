import { Default } from "./default.model";

export class Lingyang extends Default {

    constructor() {
        super();
        this.name = 'Lingyang'
        this.icon = 'lingyang';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Lingyang';
        this.type = 'glacio';
        this.weapon = 'gauntlets';

        //Basic Attacks
        this.basicNames = ['Majestic Fists: Part 1', 'Majestic Fists: Part 2', 'Majestic Fists: Part 3', 'Majestic Fists: Part 4', 'Majestic Fists: Part 5', 'Feral Roars', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
            [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
            [36.65, 39.66, 42.67, 46.87, 49.88, 53.33, 58.14, 62.95, 67.76, 72.87],
            [10.27, 11.11, 11.95, 13.13, 13.97, 14.94, 16.28, 17.63, 18.98, 20.41],
            [76.70, 82.99, 89.28, 98.09, 104.38, 111.61, 121.67, 131.74, 141.8, 152.49],
            [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [63.40, 68.60, 73.80, 81.08, 86.28, 92.26, 100.58, 108.89, 117.21, 126.05],
            [73.30, 79.32, 85.33, 93.74, 99.75, 106.66, 116.28, 125.90, 135.51, 145.73]
        ];
        this.basicMultiplier = [1, 1, 2, 5, 1, 2, 1, 2, 1];
        this.basicEnds = 4;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [21.99, 23.80, 25.60, 28.13, 29.93, 32, 34.89, 37.77, 40.66, 43.72],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.basicSecondMultiplier = [0, 0, 0, 1, 0, 0, 0, 0, 0];

        //Skill
        this.skillNames = ['Ancient Arts', 'Furious Punches'];
        this.skillCurrent = 1;
        this.skill = [
            [66.70, 72.17, 77.64, 85.30, 90.77, 97.06, 105.81, 114.56, 123.31, 132.61],
            [38.35, 41.50, 44.64, 49.05, 52.19, 55.81, 60.84, 65.78, 70.90, 76.25]
        ];
        this.skillMultiplier = [1, 2];


        //Liberation
        this.liberationNames = ['Strive: Lion\'s Vigor'];
        this.liberationCurrent = 1;
        this.liberation = [
            [200, 216.40, 232.80, 255.76, 272.16, 291.02, 317.26, 343.50, 369.74, 397.62]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
        this.introName = ['Lion Awakens'];
        this.introCurrent = 1;
        this.intro = [
            [50, 54.10, 58.20, 63.94, 68.04, 72.76, 79.32, 85.88, 92.44, 99.41]
        ];
        this.introMultiplier = [2];

        //Outro Skill
        this.outroName = ['Frosty Marks'];
        this.outro = [[587.94]];
        this.outroMultiplier = [1];


        //Forte Skill
        this.forteName = ['Unification of Spirits: Glorious Plunge', 'Unification of Spirits: Tail Strike', 'Striding Lion: Feral Gyrate 1', 'Striding Lion: Feral Gyrate 2', 'Striding Lion: Stormy Kicks', 'Striding Lion: Mountain Roamer'];
        this.forteCurrent = 1;
        this.forte = [
            [86.70, 93.81, 100.92, 110.88, 117.99, 126.16, 137.54, 148.91, 160.29, 172.37],
            [88, 95.22, 102.44, 112.54, 119.76, 128.05, 139.60, 151.14, 162.69, 174.96],
            [43.80, 47.40, 50.99, 56.02, 59.61, 63.74, 69.48, 75.23, 80.98, 87.08],
            [15.98, 17.29, 18.60, 20.44, 21.75, 23.26, 25.35, 27.45, 29.55, 31.77],
            [18.13, 19.61, 21.10, 23.18, 24.67, 26.37, 28.75, 31.13, 33.51, 36.03],
            [41.69, 45.11, 48.53, 53.31, 56.73, 60.66, 66.13, 71.60, 77.07, 82.88]
        ];
        this.forteMultiplier = [1, 2, 1, 6, 8, 2];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [58.40, 63.19, 67.98, 74.69, 79.48, 84.98, 92.64, 100.31, 107.97, 116.11],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [96.65, 104.58, 112.51, 123.60, 131.53, 140.64, 153.32, 166, 178.68, 192.15],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.forteSecondMultiplier = [0, 0, 1, 0, 1, 0];

        this.rotationName = ['Intro', '3x Basic Attack', 'Resonance Skill', 'Basic Attack', 'Resonance Skill', 'Basic Attack', 'Resonance Skill',
            '3x Basic Attack', 'Resonance Skill', 'Basic Attack', 'Resonance Skill', 'Basic Attack', 'Resonance Skill',
            'Resonance Liberation', ' Heavy Attack', '2x Feral Gyrate', 'Resonance Skill Mountain Roamer', '2x Feral Gyrate', 'Resonance Skill Mountain Roamer', '2x Feral Gyrate', 'Basic Attack: Stormy Kicks', 'Basic Attack: Tail Strike', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumSkillDmg',
                'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumSkillDmg',
                'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumOutroDmg'
            ],
            [0, 0, 1, 2, 1, 3, 1, 4, 1, 0, 1, 2, 1, 3, 1, 4, 1, 0, 0, 2, 3, 5, 2, 3, 5, 2, 3, 4, 2, 0]
        ];

    }

}