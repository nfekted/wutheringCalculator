import { Default } from "./default.model";

export class Camellya extends Default {

    constructor() {
        super();

        //Character
        this.lastUpdate = new Date(2024, 10, 14, 20, 0, 0);
        this.name = 'Camellya'
        this.icon = 'camellya';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Camellya';
        this.type = 'havoc';
        this.weapon = 'sword';

        //Basic Attacks
        this.basicName = 'Burgeoning';
        this.basicNames = ['Burgeoning: DMG 1', 'Burgeoning: DMG 2', 'Burgeoning: DMG 3', 'Burgeoning: DMG 4', 'Burgeoning: DMG 5', 'Plunging Attack', 'Dodge Damage', 'Heavy Attack'];
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicCurrent = 1;
        this.basic = [
            [31.45, 34.03, 36.61, 40.22, 42.80, 45.77, 49.89, 54.02, 58.15, 62.53],
            [23.38, 25.30, 27.21, 29.90, 31.81, 34.02, 37.08, 40.15, 43.22, 46.48],
            [25.50, 27.59, 29.68, 32.61, 34.70, 37.11, 40.45, 43.80, 47.14, 50.70],
            [12.42, 13.44, 14.46, 15.89, 16.91, 18.08, 19.71, 21.34, 22.97, 24.70],
            [24.23, 26.22, 28.20, 30.98, 32.97, 35.25, 38.43, 41.61, 44.79, 48.17],
            [33.00, 35.71, 38.42, 42.21, 44.91, 48.02, 52.35, 56.68, 61.01, 65.61],
            [50.00, 54.10, 58.20, 63.94, 68.04, 72.75, 79.31, 85.87, 92.43, 99.40],
            [44.33, 47.97, 51.60, 56.69, 60.33, 64.51, 70.32, 76.14, 81.96, 88.14]
        ];
        this.basicMultiplier = [1, 2, 3, 20, 4, 2, 3, 3];
        this.basicEnds = 4;

        //Skills
        this.skillBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'];
        this.skillName = 'Valse of Bloom and Blight'
        this.skillNames = ['Crimson Blossom', 'Vining Waltz DMG 1', 'Vining Waltz DMG 2', 'Vining Waltz DMG 3', 'Vining Waltz DMG 4', 'Blazing Waltz', 'Floral Ravage', 'Vining Ronde', 'Atonement'];
        this.skillCurrent = 1;
        this.skill = [
            [57.15, 61.84, 66.53, 73.09, 77.77, 83.16, 90.66, 98.16, 105.66, 113.62],
            [48.45, 52.43, 56.40, 61.96, 65.94, 70.50, 76.86, 83.22, 89.57, 96.33],
            [22.95, 24.84, 26.72, 29.35, 31.24, 33.40, 36.41, 39.42, 42.43, 45.63],
            [11.04, 11.95, 12.86, 14.12, 15.03, 16.07, 17.52, 18.97, 20.41, 21.95],
            [34.00, 36.79, 39.58, 43.48, 46.27, 49.47, 53.93, 58.39, 62.85, 67.59],
            [11.04, 11.95, 12.86, 14.12, 15.03, 16.07, 17.52, 18.97, 20.41, 21.95],
            [26.46, 28.63, 30.80, 33.84, 36.01, 38.51, 41.98, 45.45, 48.92, 52.61],
            [26.64, 28.82, 31.00, 34.06, 36.24, 38.76, 42.25, 45.74, 49.24, 52.95],
            [57.00, 61.68, 66.35, 72.90, 77.57, 82.95, 90.42, 97.90, 105.38, 113.33]
        ]
        this.skillMultiplier = [2, 1, 2, 6, 3, 19, 5, 3, 2];

        //Liberation
        this.liberationBonusType = ['l'];
        this.liberationName = 'Embers of Corolla';
        this.liberationNames = ['Embers of Corolla'];
        this.liberationCurrent = 1;
        this.liberation = [
            [605.00, 654.61, 704.22, 773.68, 823.29, 880.34, 959.72, 1039.09, 1118.47, 1202.81]
        ];
        this.liberationMultiplier = [1];

        //Intro Skill
        this.introName = 'Everblooming Flower';
        this.introNames = [this.introName];
        this.introCurrent = 1;
        this.intro = [
            [100.00, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81,]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        this.outroName = 'Twining'
        this.outroNames = ['Twining', 'Twining Extra'];
        this.outro = [[329], [459]];
        this.outroMultiplier = [1, 1];


        //Forte Skill
        this.forteBonusType = ['b'];
        this.forteName = 'Vegetative Universe';
        this.forteNames = ['Ephemeral '];
        this.forteCurrent = 1;
        this.forte = [
            [635.00, 687.07, 739.14, 812.04, 864.11, 923.99, 1007.31, 1090.62, 1173.93, 1262.45,]
        ];
        this.forteMultiplier = [1];

        //rotations
        this.rotationDesc = ['Heavy Attack', 'Basic Attack 4', 'Basic Attack 5', 'Resonance Skill Crimson Blossom', 'Outro',
            'Intro', 'Resonance Skill Floral Ravage', 'Heavy Attack', 'Basic Attack 4', 'Basic Attack 5', 'Resonance Skill Crimson Blossom', 'Resonance Skill Ephemeral', 'Resonance Liberation',
            'Heavy Attack', 'Basic Attack 4', 'Basic Attack 5', 'Resonance Skill Crimson Blossom', 'Outro'];
        this.rotation = [
            ['sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumOutroDmg',
                'sumIntroDmg', 'sumSkillDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumForteDmg', 'sumLiberationDmg',
                'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumOutroDmg'],
            [7, 3, 4, 0, 0,
                0, 6, 7, 3, 4, 0, 0, 0,
                7, 3, 4, 0, 1]
        ];
        this.rotationColor = ['basic', 'basic', 'basic', 'skill', 'outro',
            'intro', 'skill', 'basic', 'basic', 'basic', 'skill', 'skill', 'liberation',
            'basic', 'basic', 'basic', 'skill', 'outro'
        ]
        this.rotationCommands = ['mbh', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'outro', 'cv', 'intro', 'cv', 'e', 'cv', 'mbh', 'cv', 'mb', 'cv', 'mb', 'cv', 'e', 'cv', 'e', 'cv', 'r', 'cv', 'mbh', 'cv', 'mb', 'cv', 'mb'];

        //Recommended Echo
        this.echo4 = ['Crit Rate %', 'Crit DMG %'];
        this.echo3 = ['HAVOC DMG %', 'ATK %'];
        this.echo1 = ['ATK %'];
        this.echoSub = ['Energy Regen %', 'Crit Rate %', 'Crit DMG %', 'ATK %', 'Basic %', 'ATK'];
    }











}