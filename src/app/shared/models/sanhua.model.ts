export class Sanhua {
    name: string = 'Sanhua'
    icon: string = 'sanhua';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Sanhua';
    type: string = 'glacio';
    weapon: string = 'sword';
    //Skills
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
    basicNames: string[] = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5', 'Air/Jump Attack', 'Dodge Attack', 'Heavy Attack'];
    basicEnds: number = 4;

    skillCurrent: number = 1;
    skill: Array<Array<number>> = [
        [38.53, 41.69, 44.85, 49.28, 52.44, 56.07, 61.13, 66.18, 71.24, 76.61],
        [170.60, 184.58, 198.57, 218.16, 232.15, 248.24, 270.62, 293, 315.38, 339.16]
    ]
    skillMultiplier: number[] = [8, 1];
    skillNames: string[] = ['Eternal Frost', 'Glacial Gaze'];

    liberationCurrent: number = 1;
    liberation: Array<Array<number>> = [
        [45.36, 49.08, 52.8, 58.01, 61.73, 66.01, 71.96, 77.91, 83.86, 90.18],
        [28.37, 30.7, 33.02, 36.28, 38.61, 41.28, 45, 48.72, 52.45, 56.4],
        [33.19, 35.92, 38.64, 42.45, 45.17, 48.3, 52.65, 57.01, 61.36, 65.99],
        [97.59, 105.59, 113.59, 124.79, 132.79, 142, 154.8, 167.6, 180.4, 194.01],
        [109.44, 118.42, 127.39, 139.96, 148.93, 159.25, 173.61, 187.97, 202.32, 217.58],
        [31.85, 34.46, 37.07, 40.72, 43.34, 46.34, 50.52, 54.7, 58.88, 63.32],
        [33.19, 35.92, 38.64, 42.45, 45.17, 48.3, 52.65, 57.01, 61.36, 65.99]
    ];
    liberationMultiplier: number[] = [2, 3, 4, 3, 1, 4, 4];
    liberationNames: string[] = ['Cosmos: Frolicking Part 1', 'Cosmos: Frolicking Part 2', 'Cosmos: Frolicking Part 3', 'Cosmos: Frolicking Part 4', 'Cosmos: Heavy Attack', 'Cosmos Rampage', 'Cosmos: Dodge Counter'];

    introCurrent: number = 1;
    intro: Array<Array<number>> = [[100, 108.2, 116.4, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]];
    introMultiplier: number[] = [1];
    introName: string[] = ['Angry Cosmos'];

    outro: Array<Array<number>> = [[176.76]];
    outroMultiplier: number[] = [4];
    outroName: string[] = ['Woolies Cheer Dance'];

    forteCurrent: number = 1;
    forte: Array<Array<number>> = [
        [168, 181.77, 195.55, 214.83, 228.61, 244.45, 266.49, 288.53, 310.58, 334],
        [23.35, 25.26, 27.18, 29.86, 31.77, 33.97, 37.04, 40.10, 43.17, 46.42]
    ];
    forteMultiplier: number[] = [1, 6];
    forteName: string[] = ['Cloudy: Frenzy', 'Cosmos: Rupture'];
    forteBonus: Array<Array<number>> = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [249.08, 269.51, 289.93, 318.53, 338.95, 362.44, 395.12, 427.80, 460.48, 495.21]];

}