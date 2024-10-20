import { Default } from "./default.model";

export class Mortefi extends Default {

    constructor() {
        super();

        this.name = 'Mortefi'
        this.icon = 'mortefi';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Mortefi';
        this.type = 'fusion';
        this.weapon = 'pistols';

        // Basic Attacks
        this.basicNames = ['Impromptu Show: Part 1', 'Impromptu Show: Part 2', 'Impromptu Show: Part 3', 'Impromptu Show: Part 4', 'Mid-Air DMG Part 1', 'Mid-Air DMG Part 2', 'Dodge DMG', 'Aimed DMG', 'Full Charged Aimed DMG'];
        this.basicCurrent = 1;
        this.basic = [
            [24.29, 26.29, 28.28, 31.07, 33.06, 35.35, 38.54, 41.72, 44.91, 48.30],
            [20.51, 22.20, 23.88, 26.23, 27.92, 29.85, 32.54, 35.23, 37.92, 40.78],
            [53.97, 58.40, 62.83, 69.02, 73.45, 78.54, 85.62, 92.70, 99.78, 107.30],
            [10.57, 11.44, 12.31, 13.52, 14.39, 15.39, 16.77, 18.16, 19.55, 21.02],
            [11.69, 12.65, 13.61, 14.95, 15.91, 17.02, 18.55, 20.08, 21.62, 23.25],
            [11.69, 12.65, 13.61, 14.95, 15.91, 17.02, 18.55, 20.08, 21.62, 23.25],
            [98.07, 106.12, 114.16, 125.42, 133.46, 142.71, 155.57, 168.44, 181.31, 194.98],
            [49.14, 53.17, 57.20, 62.85, 66.87, 71.51, 77.96, 84.40, 90.85, 97.70],
            [84, 90.89, 97.78, 107.42, 114.31, 122.23, 133.25, 144.27, 155.30, 167.01]
        ];
        this.basicMultiplier = [1, 2, 1, 4, 1, 1, 1, 1, 1];
        this.basicEnds = 3;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [63.84, 69.08, 74.31, 81.64, 86.88, 92.90, 101.27, 109.65, 118.03, 126.93],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
        this.basicSecondMultiplier = [0, 0, 0, 1, 0, 0, 0, 0, 0];

        //Skill
        this.skillNames = ['Passionate Variation'];
        this.skillCurrent = 1;
        this.skill = [
            [105, 113.61, 122.22, 134.28, 142.89, 152.79, 166.57, 180.34, 194.12, 208.76]
        ]
        this.skillMultiplier = [1];

        //Liberation
        this.liberationNames = ['Violent Finale', 'Violent Finale: Marcato'];
        this.liberationCurrent = 1;
        this.liberation = [
            [80, 86.56, 93.12, 102.31, 108.87, 116.41, 126.91, 137.40, 147.90, 159.05],
            [16, 17.32, 18.63, 20.47, 21.78, 23.29, 25.39, 27.48, 29.58, 31.81]
        ];
        this.liberationMultiplier = [1, 1];

        //Intro Skill
       // this.introName = ['Dissonance'];
        this.introCurrent = 1;
        this.intro = [
            [85, 91.97, 98.94, 108.70, 115.67, 123.69, 134.84, 145.99, 157.14, 168.99]
        ];
        this.introMultiplier = [1];

        //Outro Skill

        //this.outroName = ['Rage Transposition'];
        this.outro = [[0]];
        this.outroMultiplier = [0];


        //Forte Skill
        //this.forteName = ['Fury Fugue'];
        this.forteCurrent = 1;
        this.forte = [
            [164, 177.45, 190.90, 209.73, 223.18, 238.64, 260.16, 281.67, 303.19, 326.05]
        ];
        this.forteMultiplier = [1];

        this.rotationName = ['Intro', 'Resonance Skill', '4x Basic', 'Resonance Skill (Fury Fugue)', 'Resonance Liberation', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumForteDmg', 'sumLiberationDmg'],
            [0, 0, 0, 1, 2, 3, 0, 0]
        ];

    }

}