import { Default } from "./default.model";

export class Jiyan extends Default {

    constructor() {
        super();

      this.lastUpdate = new Date(2024,10,9,0,0,0);
this.name =  'Jiyan'
        this.icon = 'jiyan';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Jiyan';
        this.type = 'aero';
        this.weapon = 'broadblade';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'h', 'h', 'h'];
        this.basicName = 'Lone Lance';
        this.basicNames = ['Lone Lance DMG 1', 'Lone Lance DMG 2', 'Lone Lance DMG 3', 'Lone Lance DMG 4', 'Lone Lance DMG 5', 'Mid-Air DMG', 'Mid-Air: Banner of Triumph', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack', 'Heavy Attack: Windborne Strike', 'Heavy Attack: Abyssal Slash'];
        this.basicCurrent = 1;
        this.basic = [
            [36.80, 39.81, 42.83, 47.05, 50.07, 53.54, 58.37, 63.20, 68.03, 73.16],
            [22, 23.80, 25.60, 28.13, 29.93, 32.01, 34.89, 37.78, 40.67, 43.73],
            [18.30, 19.80, 21.30, 23.40, 24.90, 26.62, 29.02, 31.43, 33.83, 36.38],
            [33.30, 36.03, 38.76, 42.58, 45.31, 48.45, 52.82, 57.19, 61.56, 66.20],
            [11.87, 12.84, 13.82, 15.18, 16.15, 17.27, 18.83, 20.39, 21.95, 23.60],
            [62, 67.08, 72.16, 79.28, 84.36, 90.21, 98.35, 106.48, 114.61, 123.26],
            [40, 43.28, 46.56, 51.15, 54.43, 58.20, 63.45, 68.70, 73.94, 79.52],
            [78.30, 84.72, 91.14, 100.13, 106.5, 113.93, 124.20, 134.48, 144.75, 155.66],
            [63.30, 68.349, 73.68, 80.94, 86.13, 92.10, 100.41, 108.71, 117.02, 125.84],
            [11.16, 12.08, 12.99, 14.27, 15.19, 16.24, 17.71, 19.17, 20.64, 22.20],
            [41.10, 44.47, 47.84, 52.55, 55.92, 59.80, 65.19, 70.58, 75.98, 81.71],
            [53.30, 57.67, 62.04, 68.16, 72.53, 77.55, 84.54, 91.54, 98.53, 105.96]
        ];
        this.basicMultiplier = [1, 1, 5, 2, 1, 1, 1, 1, 2, 6, 1, 1];
        this.basicEnds = 4;

        this.basicSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [78.18, 83.51, 89.84, 98.70, 105.03, 112.31, 122.44, 132.56, 142.69, 153.45],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.basicSecondMultiplier = [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0];

        //Skill
        this.skillBonusType = ['s'];
        this.skillName = 'Windqueller';
        this.skillNames = [this.skillName];
        this.skillCurrent = 1;
        this.skill = [
            [53.50, 57.88, 62.27, 68.41, 72.80, 77.84, 84.86, 91.88, 98.90, 106.36]
        ];
        this.skillMultiplier = [4];


        //Liberation
        this.liberationBonusType = ['h', 'h', 'h'];
        this.liberationName = 'Emerald Storm: Prelude';
        this.liberationNames = ['Lance of Qingloong DMG 1', 'Lance of Qingloong DMG 2', 'Lance of Qingloong DMG 3'];
        this.liberationCurrent = 1;
        this.liberation = [
            [32.95, 35.66, 38.36, 42.14, 44.84, 47.95, 52.28, 56.60, 60.93, 65.52],
            [30.96, 33.49, 36.03, 39.59, 42.13, 45.05, 49.11, 53.17, 57.23, 61.55],
            [33.58, 36.33, 39.08, 42.94, 45.69, 48.86, 53.27, 57.67, 62.08, 66.76]
        ];
        this.liberationMultiplier = [8, 8, 8];

        //Intro Skill
        this.introName = 'Tactical Strike';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        this.outroName = 'Discipline'
        this.outroNames = [this.outroName];
        this.outro = [[313.40]];
        this.outroMultiplier = [1];


        //Forte Skill
        this.forteBonusType = ['h'];
        this.forteName = 'Qingloong at War'
        this.forteNames = [this.forteName];
        this.forteCurrent = 1;
        this.forte = [
            [81.88, 77.77, 83.67, 91.92, 97.81, 104.59, 114.02, 123.45, 132.88, 142.91]
        ];
        this.forteMultiplier = [2];

        this.forteSecondDmg = [
            [215.64, 233.33, 251.01, 275.77, 293.45, 313.78, 342.08, 370.37, 298.66, 428.73]
        ];
        this.forteSecondMultiplier = [1];

        this.rotationDesc = ['Intro', 'Resonance Skill', 'Resonance Liberation', '7x Basic Attack', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumOutroDmg'],
            [0, 0, 0, 1, 2, 0, 1, 2, 0, 0]
        ];

        this.rotationColor = ['intro', 'skill', 'liberation', 'basic', 'outro']
        this.rotationCommands = ['e', 'cv', 'r', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['AERO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'ATK %', 'Heavy %', 'ATK', 'Energy Regen %'];
    }

}