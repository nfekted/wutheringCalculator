import { Default } from "./default.model";

export class Sanhua extends Default {

    constructor() {
        super();

        this.name = 'Sanhua'
        this.icon = 'sanhua';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Sanhua';
        this.type = 'glacio';
        this.weapon = 'sword';

        //Basic
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicName = 'Frigid Light';
        this.basicNames = ['Frigid Light DMG 1', 'Frigid Light DMG 2', 'Frigid Light DMG 3', 'Frigid Light DMG 4', 'Frigid Light DMG 5', 'Air/Jump Attack', 'Dodge Attack', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [24.5, 26.51, 28.52, 31.34, 33.34, 35.65, 38.87, 42.08, 45.3, 48.71],
            [37.1, 40.15, 43.19, 47.45, 50.49, 53.99, 58.86, 63.72, 68.59, 73.76],
            [10.85, 11.74, 12.63, 13.88, 14.77, 15.79, 17.22, 18.64, 20.06, 21.58],
            [19.95, 21.59, 23.23, 25.52, 27.15, 29.03, 31.65, 34.27, 36.89, 39.67],
            [117.6, 127.25, 136.89, 150.39, 160.04, 171.12, 186.55, 201.98, 217.41, 233.81],
            [43.4, 46.96, 50.52, 55.5, 59.06, 63.16, 68.85, 74.54, 8024, 86.29],
            [84, 90.89, 97.78, 107.42, 114.31, 122.23, 133.25, 144.27, 155.3, 167.01],
            [11.2, 12.12, 13.04, 14.33, 15.25, 16.3, 17.77, 19.24, 20.71, 22.27]
        ];
        this.basicMultiplier = [1, 1, 4, 2, 1, 1, 1, 5];
        this.basicEnds = 4;

        //Skills
        this.skillBonusType = ['s'];
        this.skillName = 'Eternal Frost';
        this.skillNames = [this.skillName];
        this.skillCurrent = 1;
        this.skill = [
            [181, 195.85, 210.69, 231.47, 246.31, 263.38, 287.13, 310.87, 334.62, 359.85]
        ]
        this.skillMultiplier = [1];

        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = 'Glacial Gaze';
        this.liberationNames = [this.liberationName];
        this.liberationCurrent = 1;
        this.liberation = [
            [407.16, 440.55, 473.94, 520.68, 554.07, 592.46, 645.88, 699.30, 752.72, 809.48]
        ];
        this.liberationMultiplier = [1];

        //Intro
        this.introName = 'Freezing Thorns';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [[70, 75.74, 81.48, 89.52, 95.26, 101.86, 111.05, 120.23, 129.41, 139.17]];
        this.introMultiplier = [1];

        //Outro
        this.outroName = 'Silversnow';
        this.outroNames = [this.outroName];
        this.outro = [[0]];
        this.outroMultiplier = [0];

        //Forte
        this.forteBonusType = ['h', 's', 's', 's'];
        this.forteName = 'Clarity of Mind';
        this.forteNames = ['Clarity of Mind: Detonate', 'Clarity of Mind: Glacier', 'Ice Prism', 'Ice Thorn'];
        this.forteCurrent = 1;
        this.forte = [
            [93.70, 101.39, 109.07, 119.83, 127.51, 136.35, 148.64, 160.93, 173.23, 186.29],
            [70, 75.74, 81.84, 89.52, 95.26, 101.86, 111.05, 120.23, 129.41, 139.17],
            [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
        ];
        this.forteMultiplier = [2, 1, 1, 1];


        this.rotationDesc = ['intro', 'Resonance Liberation', 'Heavy Attack (Detonate)', 'Resonance Skill', 'Heavy Attack (Detonate)', 'Outro Skill'];
        this.rotation = [
            ['sumIntroDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumSkillDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg'],
            [0, 0, 0, 1, 2, 3, 0, 0, 1, 2, 3]
        ];

        this.rotationColor = ['intro', 'liberation', 'basic', 'skill', 'basic', 'outro']
        this.rotationCommands = ['r', 'cv', 'mbh', 'cv', 'e', 'cv', 'mbh'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['AERO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'ATK %', 'Liberation %', 'Skill %', 'Energy Regen %'];
    }
}