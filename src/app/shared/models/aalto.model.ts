import { Default } from "./default.model";

export class Aalto extends Default {

    constructor() {
        super();

        //Character
        this.name = 'Aalto'
        this.icon = 'aalto';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Aalto';
        this.type = 'aero';
        this.weapon = 'pistols';

        //Basic Attacks
        this.basicName = 'Half Truths';
        this.basicNames = ['Half Truths: DMG 1', 'Half Truths: DMG 2', 'Half Truths: DMG 3', 'Half Truths: DMG 4', 'Half Truths: DMG 5', 'Mid-Air Attack', 'Dodge Damage', 'Aimed Shot', 'Charged Aim Shot'];
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'h', 'h'];
        this.basicCurrent = 1;
        this.basic = [
            [16, 17.32, 18.63, 20.478, 21.78, 23.29, 25.39, 27.48, 29.58, 31.81],
            [26.67, 28.86, 31.04, 34.11, 36.29, 38.81, 42.31, 45.80, 49.30, 53.02],
            [24, 25.97, 27.94, 30.7, 32.66, 34.93, 38.08, 41.22, 44.37, 47.72],
            [25.34, 27.42, 29.49, 32.4, 34.48, 36.84, 40.19, 43.51, 46.84, 50.37],
            [90.40, 97.82, 105.23, 115.61, 123.02, 131.55, 143.41, 155.27, 167.13, 179.73],
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
            [107.70, 116.54, 125.37, 137.73, 146.56, 156.72, 170.85, 184.98, 199.11, 214.12],
            [18, 19.48, 20.96, 23.02, 24.50, 26.20, 28.56, 30.92, 33.28, 35.79],
            [40.50, 43.83, 47.15, 51.80, 55.12, 58.94, 64.25, 69.56, 74.88, 80.52]
        ];
        this.basicMultiplier = [1, 1, 2, 2, 1, 1, 1, 1, 1];
        this.basicEnds = 4;

        //Skills
        this.skillBonusType = ['s'];
        this.skillName = 'Shift Trick'
        this.skillNames = ['Mist Bullets'];
        this.skillCurrent = 1;
        this.skill = [
            [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
        ]
        this.skillMultiplier = [1];

        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = 'Flower in the Mist';
        this.liberationNames = ['Flower in the Mist'];
        this.liberationCurrent = 1;
        this.liberation = [
            [200, 216.40, 232.80, 255.76, 272.16, 291.02, 317.26, 343.50, 369.74, 397.62]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
        this.introName = 'Feint Shot';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [33.34, 36.07, 38.8, 42.63, 45.36, 48.51, 52.88, 57.25, 61.63, 66.27]
        ];
        this.introMultiplier = [3];

        //Outro Skill
        this.outroName = 'Dissolving Mist'
        this.outroNames = [this.outroName];
        this.outro = [[0]];
        this.outroMultiplier = [0];


        //Forte Skill
        this.forteBonusType = ['s'];
        this.forteName = 'Misty Cover';
        this.forteNames = [this.forteName];
        this.forteCurrent = 1;
        this.forte = [
            [30, 32.46, 34.92, 38.47, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
        ];
        this.forteMultiplier = [1];

        //rotations
        this.rotationName = ['Intro:' + this.introName, '2x Basic Attack: ' + this.basicName, 'Resonance Skill: ' + this.skillName, 'Resonance Liberation: ' + this.liberationName, '3x Basic Attack: ' + this.basicName, 'Outro Skill: ' + this.outroName];
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg'],
            [0, 0, 1, 0, 0, 0, 1, 2]
        ];
        this.rotationColor = ['intro', 'basic', 'skill', 'liberation', 'basic', 'outro']
        this.rotationCommands = ['mb', 'cv', 'mb', 'cv', 'e', 'cv', 'r', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['AERO DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Crit Rate %', 'Crit DMG %', 'ATK %', 'ATK'];
    }











}