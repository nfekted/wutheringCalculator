export class Baizhi {
    name: string = 'Baizhi'
    icon: string = 'baizhi';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Baizhi';
    type: string = 'glacio';
    weapon: string = 'rectifier';
    //Basic Attacks
    basicNames: string[] = ['Part 1', 'Part 2  ', 'Part 3 ', 'Part 4', 'Mid Air', 'Dodge Dmg', 'Heavy Attack'];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [
        [32.94, 35.64, 38.34, 42.12, 44.82, 47.93, 52.25, 56.57, 60.89, 65.48],
        [39.52, 42.76, 46.01, 50.354, 53.78, 57.51, 62.69, 67.88, 73.06, 78.57],
        [6.59, 7.13, 7.67, 8.43, 8.97, 9.59, 10.45, 11.32, 12.18, 13.10],
        [39.52, 42.76, 46.01, 50.54, 53.78, 57.51, 62.69, 67.88, 73.06, 78.57],
        [39.68, 42.94, 46.19, 50.75, 54, 57.74, 62.95, 68.16, 73.36, 78.89],
        [89.86, 97.23, 104.60, 114.91, 122.28, 130.75, 142.54, 154.33, 166.12, 178.65],
        [24.58, 26.60, 28.61, 31.43, 33.45, 35.77, 38.99, 42.21, 45.44, 48.86]
    ];
    basicMultiplier: number[] = [1, 1, 7, 1, 1, 1, 1];
    basicEnds: number = 3;

    //Skill
    skillNames: string[] = ['Emergency Plan (DMG)', 'Emergency Plan'];
    skillCurrent: number = 1;
    skillHeal: boolean[] = [false, true];
    skill: Array<Array<number>> = [
        [8.02, 8.68, 8.34, 10.26, 10.91, 11.67, 12.72, 13.77, 14.82, 15.94],
        [-575, -623, -670, -736, -783, -837, -913, -988, -1064, -1144]
    ]
    skillMultiplier: number[] = [1, 1];

    skillSecondDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2.9, 3.14, 3.37, 3.71, 3.94, 4.22, 4.60, 4.98, 5.36, 5.76]
    ];
    skillSecondMultiplier: number[] = [0, 1];

    //Liberation
    liberationNames: string[] = ['Remnant Entities (DMG)', 'Remnant Entities', 'Momentary Union'];
    liberationCurrent: number = 1;
    liberationHeal: boolean[] = [false, true, true];
    liberation: Array<Array<number>> = [
        [2.05, 2.22, 2.39, 2.62, 2.79, 2.98, 3.25, 3.52, 3.79, 4.07],
        [-349, -378, -406, -446, -475, -508, -554, -599, -645, -694],
        [-310, -336, -361, -397, -422, -452, -492, -533, -574, -617]
    ];
    liberationMultiplier: number[] = [1, 4, 1];

    liberationSecondDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1.42, 1.53, 1.65, 1.81, 1.93, 2.06, 2.25, 2.43, 2.62, 2.82],
        [1.26, 1.36, 1.47, 1.61, 1.71, 1.83, 2, 2.16, 2.33, 2.51]
    ]
    liberationSecondMultiplier: number[] = [0, 4, 1];

    //Intro Skill
    introName: string[] = ['Overflowing Frost (DMG)', 'Overflowing Frost'];
    introCurrent: number = 1;
    intro: Array<Array<number>> = [
        [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
        [-75, -82, -88, -96, -103, -110, -119, -129, -139, -150]
    ];
    introMultiplier: number[] = [1, 1];

    //Outro Skill
    outro: Array<Array<number>> = [];
    outroMultiplier: number[] = [];
    outroName: string[] = [];

    //Forte Skill
    forteName: string[] = [];
    forteCurrent: number = 1;
    forte: Array<Array<number>> = [

    ];
    forteMultiplier: number[] = [];

    forteSecondDmg: Array<Array<number>> = [

    ];
    forteSecondMultiplier: number[] = [];

    forteThirdDmg: Array<Array<number>> = [

    ];
    forteThirdMultiplier: number[] = [];

    rotation: Array<Array<string | number>> = [[], []];
    rotationName: Array<string> = [];

    baihziSkill() {

    }
}