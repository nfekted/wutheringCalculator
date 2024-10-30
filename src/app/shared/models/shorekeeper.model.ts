import { Default } from "./default.model";

export class Shorekeeper extends Default {

    constructor() {
        super();

        this.name = 'The Shorekeeper'
        this.icon = 'shorekeeper';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/The_Shorekeeper';
        this.type = 'spectro';
        this.weapon = 'rectifier';

        //Basic Attacks
        this.basicBonusType = ['b', 'b', 'b', 'b', 'b', 'b', 'h'];
        this.basicName = 'Origin Calculus';
        this.basicNames = ['Origin Calculus DMG 1', 'Origin Calculus DMG 2', 'Origin Calculus DMG 3', 'Origin Calculus DMG 4', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [15.99, 17.30, 18.61, 20.45, 21.76, 23.26, 25.36, 27.46, 29.55, 31.78],
            [12, 12.99, 13.97, 15.35, 16.33, 17.47, 19.04, 20.61, 22.19, 23.86],
            [11.73, 12.69, 13.66, 15, 15.96, 17.07, 18.61, 20.15, 21.69, 23.32],
            [36.58, 39.58, 42.58, 46.78, 49.78, 53.23, 58.03, 62.82, 67.62, 72.72],
            [37.20, 40.26, 43.31, 47.58, 50.63, 54.13, 59.02, 63.90, 68.78, 73.96],
            [44, 47.61, 51.22, 56.27, 59.88, 64.03, 69.80, 75.57, 81.35, 87.48],
            [23.04, 24.93, 26.82, 29.47, 31.36, 33.53, 36.55, 39.58, 42.60, 45.81]
        ];
        this.basicMultiplier = [1, 2, 3, 1, 1, 2, 1];
        this.basicEnds = 3;

        //Skill
        this.skillBonusType = ['s', 'c'];
        this.skillHeal = [false, true];
        this.skillName = 'Chaos Theory';
        this.skillDMGType = ['atk', 'hp']
        this.skillNames = ['Dim Star Butterfly', 'Chaos Theory Healing'];
        this.skillCurrent = 1;
        this.skill = [
            [15.75, 17.04, 18.33, 20.14, 21.43, 22.91, 24.98, 27.05, 29.11, 31.31],
            [-660, -715, -769, -845, -899, -961, -1047, -1134, -1221, -1313]
        ]
        this.skillMultiplier = [1, 1];

        this.skillSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 3.25, 3.50, 3.84, 4.09, 4.37, 4.76, 5.16, 5.55, 5.97]
        ];
        this.skillSecondMultiplier = [0, 1];

        //Liberation
        this.liberationBonusType = ['c'];
        this.liberationHeal = [true];
        this.liberationDMGType = ['hp'];
        this.liberationName = 'End Loop';
        this.liberationNames = ['End Loop Healing'];
        this.liberationCurrent = 1;
        this.liberation = [
            [-220, -239, -257, -282, -300, -321, -349, -378, -407, -438]
        ];
        this.liberationMultiplier = [1];

        this.liberationSecondDmg = [
            [1.20, 1.30, 1.40, 1.54, 1.64, 1.75, 1.91, 2.07, 2.22, 2.39]
        ]
        this.liberationSecondMultiplier = [1];

        //Intro Skill
        this.introBonusType = ['s', 's', 'c', 'c'];
        this.introDMGType = ['atk', 'hp', 'hp', 'hp'];
        this.introHeal = [false, false, true, true];
        this.introName = 'Proof of Existence';
        this.introNames = ['Enlightenment', 'Discernment', 'Enlightenment Healing', 'Discernment Healing'];
        this.introCurrent = 1;
        this.intro = [
            [22.79, 24.66, 26.53, 29.14, 31.01, 33.16, 36.15, 39.14, 42.13, 45.30],
            [9.88, 10.69, 11.50, 12.64, 13.45, 14.38, 15.67, 16.97, 18.26, 19.64],
            [-130, -141, -152, -167, -177, -190, -207, -224, -241, -259],
            [-145, -157, -169, -186, -198, -211, -231, -250, -269, -289]
        ];
        this.introMultiplier = [5, 3, 1, 1];

        this.introSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.60, 0.65, 0.70, 0.77, 0.82, 0.88, 0.96, 1.04, 1.11, 1.20],
            [0.66, 0.72, 0.77, 0.85, 0.90, 0.97, 1.05, 1.14, 1.23, 1.32]
        ];
        this.introSecondMultiplier = [0, 0, 1, 1]

        //Outro Skill
        this.outroName = 'Binary Butterfly';
        this.outroNames = [this.outroName];
        this.outro = [[0]];
        this.outroMultiplier = [0];


        //Forte Skill
        this.forteBonusType = ['b', 'h', 'b'];
        this.forteName = 'Astral Chord';
        this.forteNames = ['Flare Star Butterfly', 'Illation', 'Transmutation'];
        this.forteCurrent = 1;
        this.forte = [
            [18.76, 20.29, 21.83, 23.99, 25.52, 27.29, 29.75, 32.21, 34.67, 37.29],
            [9.54, 10.33, 11.11, 12.20, 12.99, 13.89, 15.14, 16.39, 17.64, 18.97],
            [37.20, 40.26, 43.31, 47.58, 50.63, 54.13, 59.02, 53.90, 68.78, 73.96]
        ];
        this.forteMultiplier = [1, 5, 1];

        this.rotationName = ['intro', '3x Basic Attack', 'Mid-Air Attack', 'Heavy Attack', 'Resonance Skill', '3x Basic Attack', 'Heavy Attack', 'Resonance Liberation', 'Outro'];
        this.rotation = [
            ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumSkillDmg', 'sumHealingSkill',
                'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumHealingLiberation'
            ],
            [0, 0, 1, 2, 4, 6, 1, 1, 1, 1, 1, 0, 1, 1, 2, 3, 6, 1, 1, 1, 1, 1, 0]
        ];

        this.rotationColor = ['intro', 'basic', 'basic', 'basic', 'skill', 'basic', 'basic', 'liberation', 'outro']
        this.rotationCommands = ['mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'space', 'cv', 'mb', 'cv', 'mbh', 'cv', 'e', 'cv', 'mb', 'cv', 'mb', 'cv', 'mb', 'cv', 'mbh', 'cv', 'r'];

        //Recommended Echo
        this.echo4 = ['Healing %'];
        this.echo3 = ['Energy Regen'];
        this.echo1 = ['HP %'];
        this.echoSub = ['Energy Regen %', 'HP %', 'HP'];

    }
}