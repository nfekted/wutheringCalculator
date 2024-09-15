export class Sanhua {
    name: string = 'Sanhua'
    icon: string = 'sanhua';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Sanhua';
    type: string = 'glacio';
    weapon: string = 'sword';
    //Skills
    basicNames: string[] = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5', 'Air/Jump Attack', 'Dodge Attack', 'Heavy Attack'];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [
        [24.5, 26.51, 28.52, 31.34, 33.34, 35.65, 38.87, 42.08, 45.3, 48.71],
        [37.1, 40.15, 43.19, 47.45, 50.49, 53.99, 58.86, 63.72, 68.59, 73.76],
        [10.85, 11.74, 12.63, 13.88, 14.77, 15.79, 17.22, 18.64, 20.06, 21.58],
        [19.95, 21.59, 23.23, 25.52, 27.15, 29.03, 31.65, 34.27, 36.89, 39.67],
        [117.6, 127.25, 136.89, 150.39, 160.04, 171.12, 186.55, 201.98, 217.41, 233.81],
        [43.4, 46.96, 50.52, 55.5, 59.06, 63.16, 68.85, 74.54, 8024, 86.29],
        [84, 90.89, 97.78, 107.42, 114.31, 122.23, 133.25, 144.27, 155.3, 167.01],
        [11.2, 12.12, 13.04, 14.33, 15.25, 16.3, 17.77, 19.24, 20.71, 22.27]
    ];
    basicMultiplier: number[] = [1, 1, 4, 2, 1, 1, 1, 5];
    basicEnds: number = 4;

    skillNames: string[] = ['Eternal Frost'];
    skillCurrent: number = 1;
    skill: Array<Array<number>> = [
        [181, 195.85, 210.69, 231.47, 246.31, 263.38, 287.13, 310.87, 334.62, 359.85]
    ]
    skillMultiplier: number[] = [1];


    liberationNames: string[] = ['Glacial Gaze'];
    liberationCurrent: number = 1;
    liberation: Array<Array<number>> = [
        [407.16, 440.55, 473.94, 520.68, 554.07, 592.46, 645.88, 699.30, 752.72, 809.48]
    ];
    liberationMultiplier: number[] = [1];


    introName: string[] = ['Freezing Thorns'];
    introCurrent: number = 1;
    intro: Array<Array<number>> = [[70, 75.74, 81.48, 89.52, 95.26, 101.86, 111.05, 120.23, 129.41, 139.17]];
    introMultiplier: number[] = [1];


    outroName: string[] = ['Silversnow'];
    outro: Array<Array<number>> = [[0]];
    outroMultiplier: number[] = [0];


    forteName: string[] = ['Burst Damage', 'Glacier Burst Damage', 'Ice Prism', 'Ice Thorn'];
    forteCurrent: number = 1;
    forte: Array<Array<number>> = [
        [93.70, 101.39, 109.07, 119.83, 127.51, 136.35, 148.64, 160.93, 173.23, 186.29],
        [70, 75.74, 81.84, 89.52, 95.26, 101.86, 111.05, 120.23, 129.41, 139.17],
        [40, 43.28, 46.56, 51.16, 54.44, 58.21, 63.46, 68.70, 73.95, 79.53],
        [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
    ];
    forteMultiplier: number[] = [2, 1, 1, 1];

    rotation: Array<Array<string | number>> = [['sumLiberationDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg',], [0, 7, 0, 7]];
    rotationName: Array<string> = ['Resonance Liberation', 'Heavy Attack (Forte Gauge)', 'Resonance Skill', 'Heavy Attack (Forte Gauge)', 'Outro Skill (Buff)'];

}