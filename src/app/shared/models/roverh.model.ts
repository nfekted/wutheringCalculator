import { Default } from "./default.model";

export class RoverHavoc extends Default {

    constructor() {
        super();

        this.name = 'Rover (Havoc)'
        this.icon = 'roverh';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Rover-Havoc';
        this.type = 'havoc';
        this.weapon = 'sword';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicName = 'Tuneslayer';
        this.basicNames = ['Tuneslayer: DMG 1', 'Tuneslayer: DMG 2', 'Tuneslayer: DMG 3', 'Tuneslayer: DMG 4', 'Tuneslayer: DMG 5', 'Mid-Air DMG', 'Counter DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [28.50, 30.84, 33.18, 36.45, 38.79, 41.48, 45.21, 48.95, 52.69, 56.67],
            [28.50, 30.84, 33.18, 36.45, 38.79, 41.48, 45.21, 48.95, 52.69, 56.67],
            [42.75, 46.26, 49.77, 54.67, 58.18, 62.21, 67.82, 73.43, 79.04, 85],
            [20.27, 21.93, 23.60, 25.92, 27.58, 29.50, 32.15, 34.81, 37.47, 40.30],
            [47.50, 51.40, 55.29, 60.75, 64.64, 69.12, 75.35, 81.59, 87.82, 94.44],
            [58.90, 63.73, 68.56, 75.33, 80.16, 85.71, 93.44, 101.17, 108.89, 117.10],
            [90.25, 97.66, 105.06, 115.42, 122.82, 131.33, 143.17, 155.01, 166.85, 179.43],
            [48, 51.94, 55.88, 61.39, 65.32, 69.85, 76.15, 82.44, 88.74, 95.43]
        ];
        this.basicMultiplier = [1, 2, 1, 3, 2, 1, 1, 1];
        this.basicEnds = 4;

        //Skill
        this.skillBonusType = ['s'];
        this.skillName = 'Wingblade';
        this.skillNames = [this.skillName];
        this.skillCurrent = 1;
        this.skill = [
            [144, 155.81, 167.62, 184.15, 195.96, 209.54, 228.43, 247.32, 266.22, 286.29]
        ]
        this.skillMultiplier = [2];

        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = 'Deadening Abyss';
        this.liberationNames = [this.liberationName];
        this.liberationCurrent = 1;
        this.liberation = [
            [765, 827.73, 890.46, 978.29, 1041.02, 1113.16, 1213.52, 1313.89, 1414.26, 1520.90]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
        this.introName = 'Instant of Annihilation';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        this.outroName = 'Soundweaver';
        this.outroNames = [this.outroName];
        this.outro = [[143.3]];
        this.outroMultiplier = [1];


        //Forte Skill
        this.forteBonusType = ['h', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 's', 'h', 'h'];
        this.forteName = 'Umbra Eclipse';
        this.forteNames = [' Devastation', 'Umbra Eclipse: DMG 1', 'Umbra Eclipse: DMG 2', 'Umbra Eclipse: DMG 3', 'Umbra Eclipse: DMG 4', 'Umbra Eclipse: DMG 5', 'Umbra Eclipse: Plunging', 'Umbra Eclipse: Dodge DMG', 'Umbra Eclipse: Lifetaker', 'Umbra Eclipse: Thwackblade ', 'Umbra Eclipse: Heavy Attack'];
        this.forteCurrent = 1;
        this.forte = [
            [114.75, 124.16, 133.57, 146.75, 156.16, 166.98, 182.03, 197.09, 212.14, 228.14],
            [28.35, 30.68, 33, 36.26, 38.58, 41.26, 44.98, 48.70, 52.42, 56.37],
            [47.25, 51.13, 55, 60.43, 64.30, 68.76, 74.96, 81.16, 87.36, 93.94],
            [78.30, 84.73, 91.15, 100.14, 106.56, 113.94, 124.21, 134.49, 144.76, 155.67],
            [18.68, 20.21, 21.74, 23.89, 25.42, 27.18, 29.63, 32.08, 34.53, 37.13],
            [14.35, 15.52, 16.70, 18.35, 19.52, 20.88, 22.76, 24.64, 26.52, 28.52],
            [139, 150.40, 161.80, 177.76, 189.16, 202.26, 220.50, 238.74, 256.97, 276.35],
            [62, 67.09, 72.17, 79.29, 84.37, 90.22, 98.36, 106.49, 114.62, 123.27],
            [159.30, 172.37, 185.43, 203.72, 216.78, 231.80, 252.70, 273.60, 294.50, 316.71],
            [63.70, 68.93, 74.15, 81.46, 86.69, 92.69, 101.05, 109.41, 117.77, 126.65],
            [64.80, 70.12, 75.43, 82.87, 88.18, 94.30, 102.80, 111.30, 119.80, 128.83]
        ];
        this.forteMultiplier = [1, 1, 1, 1, 3, 4, 1, 2, 1, 1, 1];

        this.forteSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [56.03, 60.62, 65.22, 71.65, 76.24, 81.53, 88.88, 96.23, 103.58, 111.39],
            [57.38, 62.08, 66.79, 73.38, 78.08, 83.49, 91.02, 98.55, 106.07, 114.07],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5.41, 5.82, 6.40, 6.81, 7.28, 7.94, 8.59, 9.25, 9.95],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5.41, 5.82, 6.40, 6.81, 7.28, 7.94, 8.59, 9.25, 9.95],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.forteSecondMultiplier = [0, 0, 0, 0, 1, 1, 0, 4, 0, 4, 0];

        this.rotationName = ['Intro', 'Resonance Skill', '5x Basic Attack', 'Heavy Attack (Devastation)', 'Heavy Attack (Dark Surge)', 'Basic Attack', 'Resonance Skill', 'Heavy Attack', '3x Basic Attack', 'Heavy Attack', '3x Basic Attack', 'Resonance Liberation', 'Outro'];
        this.rotation = [
            ['sumIntroDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumLiberationDmg', 'sumOutroDmg'],
            [0, 0, 0, 1, 2, 3, 4, 0, 10, 9, 8, 10, 9, 3, 4, 10, 9, 3, 4, 0, 0]
        ];

        this.rotationColor = ['intro', 'skill', 'basic', 'basic', 'basic', 'basic', 'skill', 'basic', 'basic', 'basic', 'basic', 'liberation', 'outro'];
        this.rotationCommands = ['e', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mbh', 'cv', 'mbh', 'cv', 'mb', 'cv', 'e', 'cv', 'mbh', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mbh', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'r'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['AERO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'ATK %', 'ATK', 'Skill %', 'Liberation %'];

    }
}