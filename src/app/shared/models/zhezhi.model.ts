import { Default } from "./default.model";

export class Zhezhi extends Default {
    constructor() {
        super();

        this.name = 'Zhezhi'
        this.icon = 'zhezhi';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Zhezhi';
        this.type = 'electro';
        this.weapon = 'gauntlets';

        //Basic Attacks
        this.basicNames = ['Dimming Brush Part 1', 'Dimming Brush Part 2', 'Dimming Brush Part 3', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [21.00, 22.73, 24.45, 26.86, 28.58, 30.56, 33.32, 36.07, 38.83, 41.76],
            [10.34, 11.18, 12.03, 13.22, 14.06, 15.04, 16.39, 17.75, 19.11, 20.55],
            [67.20, 72.72, 78.23, 85.94, 91.45, 97.79, 106.60, 115.42, 124.24, 133.61],
            [12.55, 13.58, 14.61, 16.05, 17.08, 18.26, 19.91, 21.55, 23.20, 24.95],
            [14.62, 15.82, 17.02, 18.70, 19.90, 21.28, 23.20, 25.11, 27.03, 29.07],
            [56.70, 61.35, 66.00, 72.51, 77.16, 82.50, 89.94, 97.38, 104.82, 112.72]
        ];
        this.basicMultiplier = [2, 5, 1, 5, 5, 1];
        this.basicEnds = 3;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [52.70, 57.03, 61.35, 67.40, 71.72, 76.69, 83.60, 90.52, 97.43, 104.78],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 0, 0, 1, 0, 0];

        //Skill
        this.skillNames = ['Manifestation', 'Manifestation: Hold', 'Manifestation: Mid-Air'];
        this.skillCurrent = 1;
        this.skill = [
            [49.50, 53.56, 57.62, 63.31, 67.36, 72.03, 78.53, 85.02, 91.52, 98.42,],
            [49.50, 53.56, 57.62, 63.31, 67.36, 72.03, 78.53, 85.02, 91.52, 98.42,],
            [49.50, 53.56, 57.62, 63.31, 67.36, 72.03, 78.53, 85.02, 91.52, 98.42,]
        ]
        this.skillMultiplier = [3, 3, 3];


        //Liberation
        this.liberationNames = ['Living Canvas'];
        this.liberationCurrent = 1;
        this.liberation = [
            [32.80, 35.49, 38.18, 41.95, 44.64, 47.73, 52.04, 56.34, 60.64, 65.21]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
       // this.introName = ['Radiant Ruin'];
        this.introCurrent = 1;
        this.intro = [
            [43.34, 46.89, 50.44, 55.42, 58.97, 63.06, 68.74, 74.43, 80.12, 86.16,]
        ];
        this.introMultiplier = [3];

        //Outro Skill
        //this.outroName = ['Carve and Draw'];

        //Forte Skill
        //this.forteName = ['Ink and Wash', 'Ink and Wash: Stroke of Genius', 'Ink and Wash: Creation\'s Zenith'];
        this.forteCurrent = 1;
        this.forte = [
            [41.75, 45.18, 48.60, 53.39, 56.82, 60.76, 66.23, 71.71, 77.19, 83.01],
            [150.00, 162.30, 174.60, 191.82, 204.12, 218.27, 237.95, 257.63, 277.31, 298.22],
            [60.00, 64.92, 69.84, 76.73, 81.65, 87.31, 95.18, 103.05, 110.93, 119.29]
        ];
        this.forteMultiplier = [3, 1, 3];

        this.rotationName = ['Intro', '3x Basic Attack', 'Resonance Skill', 'Heavy Attack', 'Resonance Skill: Stroke of Genius', 'Resonance Skill: Stroke of Genius', 'Resonance Skill: Stroke of Maestro', 'Resonance Liberation', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumLiberationDmg'],
            [0, 0, 1, 2, 0, 0, 1, 1, 2, 0]
        ];

    }
}