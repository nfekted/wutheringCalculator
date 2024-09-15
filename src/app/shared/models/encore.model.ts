export class Encore {
    name: string = 'Encore'
    icon: string = 'encore';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Encore';
    type: string = 'fusion';
    weapon: string = 'rectifier';
    //Skills
    basicNames: string[] = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Wooly Strike', 'Air/Jump Attack', 'Dodge Attack', 'Heavy Attack'];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [
        [28, 30.29, 32.59, 35.80, 38.10, 40.74, 44.41, 48.09, 51.76, 55.66],
        [33.30, 36.03, 38.76, 42.58, 45.31, 48.45, 52.82, 57.19, 61.56, 66.20],
        [33.35, 36.08, 38.81, 42.64, 45.38, 48.52, 52.90, 57.27, 61.65, 66.30],
        [19.25, 20.82, 22.40, 24.61, 26.19, 28.01, 30.53, 33.03, 35.58, 38.27],
        [120, 129.84, 139.67, 153.45, 163.29, 174.61, 190.35, 206.10, 221.84, 238.57],
        [62, 67.08, 72.16, 79.28, 84.36, 90.21, 98.35, 106.48, 114.61, 123.26],
        [63.34, 68.54, 73.73, 81.01, 86.20, 92.18, 100.49, 108.80, 117.11, 125.94],
        [94.10, 101.81, 109.53, 120.33, 128.05, 136.92, 149.27, 161.61, 173.96, 187.08],
    ];
    basicMultiplier: number[] = [1, 1, 2, 4, 1, 1, 1, 2];
    basicEnds: number = 4;

    skillNames: string[] = ['Flaming Woolies', 'Energetic Welcome'];
    skillCurrent: number = 1;
    skill: Array<Array<number>> = [
        [38.53, 41.69, 44.85, 49.28, 52.44, 56.07, 61.13, 66.18, 71.24, 76.61],
        [170.60, 184.58, 198.57, 218.16, 232.15, 248.24, 270.62, 293, 315.38, 339.16]
    ]
    skillMultiplier: number[] = [8, 1];

    liberationNames: string[] = ['Cosmos: Frolicking Part 1', 'Cosmos: Frolicking Part 2', 'Cosmos: Frolicking Part 3', 'Cosmos: Frolicking Part 4', 'Cosmos Rampage', 'Cosmos: Dodge Counter', 'Cosmos: Heavy Attack'];
    liberationCurrent: number = 1;
    liberation: Array<Array<number>> = [
        [45.36, 49.08, 52.8, 58.01, 61.73, 66.01, 71.96, 77.91, 83.86, 90.18],
        [28.37, 30.7, 33.02, 36.28, 38.61, 41.28, 45, 48.72, 52.45, 56.4],
        [33.19, 35.92, 38.64, 42.45, 45.17, 48.3, 52.65, 57.01, 61.36, 65.99],
        [97.59, 105.59, 113.59, 124.79, 132.79, 142, 154.8, 167.6, 180.4, 194.01],
        [31.85, 34.46, 37.07, 40.72, 43.34, 46.34, 50.52, 54.7, 58.88, 63.32],
        [33.19, 35.92, 38.64, 42.45, 45.17, 48.3, 52.65, 57.01, 61.36, 65.99],
        [109.44, 118.42, 127.39, 139.96, 148.93, 159.25, 173.61, 187.97, 202.32, 217.58]
    ];
    liberationMultiplier: number[] = [2, 3, 4, 3, 4, 4, 1];

    introName: string[] = ['Angry Cosmos'];
    introCurrent: number = 1;
    intro: Array<Array<number>> = [[100, 108.2, 116.4, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]];
    introMultiplier: number[] = [1];

    outroName: string[] = ['Woolies Cheer Dance'];
    outro: Array<Array<number>> = [[176.76]];
    outroMultiplier: number[] = [4];


    forteName: string[] = ['Cloudy: Frenzy', 'Cosmos: Rupture'];
    forteCurrent: number = 1;
    forte: Array<Array<number>> = [
        [168, 181.77, 195.55, 214.83, 228.61, 244.45, 266.49, 288.53, 310.58, 334],
        [23.35, 25.26, 27.18, 29.86, 31.77, 33.97, 37.04, 40.10, 43.17, 46.42]
    ];
    forteMultiplier: number[] = [1, 6];

    forteSecondDmg: Array<Array<number>> = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [249.08, 269.51, 289.93, 318.53, 338.95, 362.44, 395.12, 427.80, 460.48, 495.21]];
    forteSecondMultiplier: number[] = [0, 1];

    rotation: Array<Array<string | number>> = [['sumSkillDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg', 'sumLiberationDmg'], [0, 1, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 6]];
    rotationName: Array<string> = ['Resonance Skill + Energetic Welcome', 'Resonance Liberation', 'Cosmos Rampage (Liberation)', '4x Cosmos: Frolicking (Basic Attack)', 'Cosmos Rampage (Liberation)', '4x Cosmos: Frolicking (Basic Attack)', 'Cosmos Rampage (Liberation)', 'Cosmos Heavy Attack'];
}