import { Default } from "./default.model";

export class Baizhi extends Default {

    constructor() {
        super();

        this.name = 'Baizhi'
        this.icon = 'baizhi';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Baizhi';
        this.type = 'glacio';
        this.weapon = 'rectifier';

        //Basic Attacks
        this.basicNames = ['Part 1', 'Part 2  ', 'Part 3 ', 'Part 4', 'Mid Air', 'Dodge Dmg', 'Heavy Attack'];
        this.basicCurrent = 1;
        this.basic = [
            [32.94, 35.64, 38.34, 42.12, 44.82, 47.93, 52.25, 56.57, 60.89, 65.48],
            [39.52, 42.76, 46.01, 50.354, 53.78, 57.51, 62.69, 67.88, 73.06, 78.57],
            [6.59, 7.13, 7.67, 8.43, 8.97, 9.59, 10.45, 11.32, 12.18, 13.10],
            [39.52, 42.76, 46.01, 50.54, 53.78, 57.51, 62.69, 67.88, 73.06, 78.57],
            [39.68, 42.94, 46.19, 50.75, 54, 57.74, 62.95, 68.16, 73.36, 78.89],
            [89.86, 97.23, 104.60, 114.91, 122.28, 130.75, 142.54, 154.33, 166.12, 178.65],
            [24.58, 26.60, 28.61, 31.43, 33.45, 35.77, 38.99, 42.21, 45.44, 48.86]
        ];
        this.basicMultiplier = [1, 1, 7, 1, 1, 1, 1];
        this.basicEnds = 3;

        //Skill
        this.skillNames = ['Emergency Plan (DMG)', 'Emergency Plan'];
        this.skillCurrent = 1;
        this.skillHeal = [false, true];
        this.skillDMGType = ['atk', 'hp'];
        this.skill = [
            [8.02, 8.68, 8.34, 10.26, 10.91, 11.67, 12.72, 13.77, 14.82, 15.94],
            [-575, -623, -670, -736, -783, -837, -913, -988, -1064, -1144]
        ]
        this.skillMultiplier = [1, 1];

        this.skillSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2.9, 3.14, 3.37, 3.71, 3.94, 4.22, 4.60, 4.98, 5.36, 5.76]
        ];
        this.skillSecondMultiplier = [0, 1];

        //Liberation
        this.liberationNames = ['Remnant Entities (DMG)', 'Remnant Entities', 'Momentary Union'];
        this.liberationCurrent = 1;
        this.liberationHeal = [false, true, true];
        this.liberationDMGType = ['hp', 'hp', 'hp']
        this.liberation = [
            [2.05, 2.22, 2.39, 2.62, 2.79, 2.98, 3.25, 3.52, 3.79, 4.07],
            [-349, -378, -406, -446, -475, -508, -554, -599, -645, -694],
            [-310, -336, -361, -397, -422, -452, -492, -533, -574, -617]
        ];
        this.liberationMultiplier = [1, 4, 1];

        this.liberationSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1.42, 1.53, 1.65, 1.81, 1.93, 2.06, 2.25, 2.43, 2.62, 2.82],
            [1.26, 1.36, 1.47, 1.61, 1.71, 1.83, 2, 2.16, 2.33, 2.51]
        ]
        this.liberationSecondMultiplier = [0, 4, 1];

        //Intro Skill
        this.introName = ['Overflowing Frost (DMG)', 'Overflowing Frost'];
        this.introCurrent = 1;
        this.introHeal = [false, true];
        this.introDMGType = ['atk', 'hp']
        this.intro = [
            [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
            [-75, -82, -88, -96, -103, -110, -119, -129, -139, -150]
        ];
        this.introMultiplier = [1, 1];

        this.introSecondDmg = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.38, 0.41, 0.44, 0.48, 0.51, 0.55, 0.6, 0.65, 0.7, 0.75]
        ];
        this.introSecondMultiplier = [0, 1];

        //Outro Skill
        this.outroName = ['Rejuvinating Flow'];
        this.outroHeal = [true];
        this.outroDMGType = ['hp'];
        this.outro = [[1.54]];
        this.outroMultiplier = [10];

        //Forte Skill
        this.forteName = ['Concentration Healing', 'Inherent: Stimulus Feedback'];
        this.forteCurrent = 1;
        this.forteHeal = [true, true];
        this.forteDMGType = ['hp', 'hp'];
        this.forte = [
            [-32, -34, -37, -40, -43, -46, -50, -54, -58, -63],
            [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]
        ];
        this.forteMultiplier = [1, 1];

        this.forteSecondDmg = [
            [0.16, 0.17, 0.18, 0.20, 0.21, 0.23, 0.25, 0.27, 0.29, 0.31],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.forteSecondMultiplier = [1, 0];

        this.rotation = [
            ['sumIntroDmg', 'sumHealingIntro', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumHealingSkill', 'sumBasicDmg', 'sumBasicDmg', 'sumLiberationDmg', 'sumHealingLiberation', 'sumHealingLiberation', 'sumHealingOutro'],
            [0, 1, 0, 1, 2, 3, 0, 1, 0, 1, 0, 1, 2, 0]
        ];
        this.rotationName = ['Intro: Overflowing Frost (DMG + Heal)', 'Basic Attack Part 1', 'Basic Attack Part 2', 'Basic Attack Part 3', 'Basic Attack Part 4', 'Resonance Skill: Emergency Plan (DMG + Heal)', 'Basic Attack Part 1', 'Basic Attack Part 2', 'Liberation: Remnant Entities (DMG + 2x Heal)', 'Outro Skill: Rejuvinating Flow'];
    }
}