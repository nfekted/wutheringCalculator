export class Jinhsi {
    name: string = 'Jinhsi'
    icon: string = 'jinhsi';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Jinhsi';
    type: string = 'spectro';
    weapon: string = 'broadblade';
    //Basic Attacks
    basicNames: string[] = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Air/Jump Attack', 'Dodge Attack', 'Heavy Attack'];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [
        [33.43, 36.18, 38.92, 42.75, 45.50, 48.65, 53.03, 57.42, 61.81, 66.47],
        [19.61, 21.22, 22.83, 25.08, 26.69, 28.54, 31.11, 33.68, 36.26, 38.99],
        [5.36, 5.80, 6.24, 6.85, 7.29, 7.80, 8.50, 9.20, 9.90, 10.65],
        [31.74, 34.34, 36.94, 40.58, 43.19, 46.18, 50.34, 54.50, 58.67, 63.09],
        [6.20, 6.71, 7.22, 7.93, 8.44, 9.03, 9.84, 10.65, 11.47, 12.33],
        [7.38, 7.99, 8.59, 9.44, 10.05, 10.74, 11.71, 10.65, 13.65, 14.68],
        [12, 12.99, 13.97, 15.35, 16.33, 17.47, 19.04, 20.61, 22.19, 23.86]
    ];
    basicMultiplier: number[] = [1, 1, 7, 1, 1, 7, 5];
    basicEnds: number = 3;

    basicSecondDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9.81, 10.61, 11.42, 12.54, 13.35, 14.27, 15.56, 16.84, 18.13, 19.50],
        [16.07, 17.39, 18.70, 20.55, 21.86, 23.38, 25.49, 27.59, 29.70, 31.94],
        [47.60, 51.51, 55.41, 60.87, 64.78, 69.26, 75.51, 81.75, 88, 94.63],
        [12.40, 13.42, 14.44, 15.86, 16.88, 18.05, 19.68, 21.30, 22.93, 24.66],
        [22.14, 23.96, 25.77, 28.32, 30.13, 32.22, 35.12, 38.03, 40.93, 44.02],
        [18, 19.48, 20.96, 23.02, 24.50, 26.20, 28.56, 30.92, 33.28, 35.79]
    ]
    basicSecondMultiplier: number[] = [0, 3, 1, 1, 1, 1, 1];
    basicThirdDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [43.40, 46.96, 50.52, 55.50, 59.06, 63.16, 68.85, 74.54, 80.24, 86.29],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [42, 45.45, 48.89, 53.71, 57.16, 61.12, 66.63, 72.14, 77.65, 83.51],
    ]
    basicThirdMultiplier: number[] = [0, 0, 0, 0, 1, 0, 1];

    //Skill
    skillNames: string[] = ['Skill DMG', 'Overflowing Radiance'];
    skillCurrent: number = 1;
    skill: Array<Array<number>> = [
        [9.79, 10.60, 11.40, 12.52, 13.32, 14.25, 15.53, 16.82, 18.10, 19.46],
        [4.96, 5.37, 5.78, 6.35, 6.75, 7.22, 7.87, 8.52, 9.17, 9.87]
    ]
    skillMultiplier: number[] = [4, 4];

    skillSecondDmg: Array<Array<number>> = [
        [39.15, 42.37, 45.58, 50.07, 53.28, 56.97, 62.11, 67.25, 72.38, 77.84],
        [14.88, 16.11, 17.33, 19.03, 20.25, 21.66, 23.61, 25.56, 27.51, 29.59]
    ];
    skillSecondMultiplier: number[] = [1, 4];
    skillThirdDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [19.84, 21.47, 23.10, 25.38, 27, 28.87, 31.48, 34.08, 36.68, 39.45]
    ];
    skillThirdMultiplier: number[] = [0, 1];


    //Liberation
    liberationNames: string[] = ['Liberation DMG'];
    liberationCurrent: number = 1;
    liberation: Array<Array<number>> = [
        [251.40, 272.02, 292.63, 321.50, 342.11, 365.82, 398.80, 431.78, 464.77, 499.81]
    ];
    liberationMultiplier: number[] = [1];

    liberationSecondDmg: Array<Array<number>> = [
        [586.60, 634.71, 682.81, 750.15, 798.25, 853.57, 930.53, 1007.49, 1084.45, 1166.22]
    ]
    liberationSecondMultiplier: number[] = [1];

    //Intro Skill
    introName: string[] = ['Loong\'s Halo'];
    introCurrent: number = 1;
    intro: Array<Array<number>> = [[80, 86.56, 93.12, 102.31, 108.87, 116.41, 126.91, 137.40, 147.90, 159.05]];
    introMultiplier: number[] = [1];

    //Outro Skill
    outro: Array<Array<number>> = [[0]];
    outroMultiplier: number[] = [0];
    outroName: string[] = ['Temporal Bender'];

    //Forte Skill
    forteName: string[] = ['Incarnation Part 1', 'Incarnation Part 2', 'Incarnation Part 3', 'Incarnation Part 4', 'IncarnationDodge Atk', 'Incarnation Heavy Atk', 'Crescent Divinity', 'Illuminous Epiphany: Solar Flare', 'Illuminous Epiphany: Stella Glamor'];
    forteCurrent: number = 1;
    forte: Array<Array<number>> = [
        [40.58, 48.23, 51.89, 57, 60.66, 64.86, 70.71, 76.56, 82.41, 88.62],
        [39.22, 42.44, 45.65, 50.16, 53.37, 57.07, 62.22, 67.36, 72.51, 77.97],
        [50.02, 54.12, 58.23, 63.97, 68.07, 72.79, 79.35, 85.91, 92.47, 99.44],
        [9.39, 10.16, 10.93, 12.01, 12.78, 13.67, 14.90, 16.13, 17.36, 18.67],
        [22.08, 23.89, 25.70, 28.23, 30.04, 32.12, 35.02, 37.91, 40.81, 43.89],
        [24, 25.97, 27.94, 30.70, 32.66, 34.93, 38.08, 41.22, 44.37, 47.72],
        [50.68, 54.84, 59, 64.81, 68.97, 73.75, 80.40, 87.05, 93.70, 100.76],
        [10, 10.82, 11.64, 12.79, 13.61, 14.56, 15.87, 17.18, 18.49, 19.89],
        [175, 189.35, 203.70, 223.79, 238.14, 254.65, 277.61, 300.57, 323.53, 347.92]
    ];
    forteMultiplier: number[] = [1, 1, 1, 6, 2, 1, 2, 6, 1];

    forteSecondDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [13.08, 14.15, 15.22, 16.72, 17.79, 19.03, 20.74, 22.46, 24.17, 25.99],
        [33.35, 36.08, 38.82, 42.65, 45.38, 48.53, 52.90, 57.28, 61.65, 66.30],
        [37.56, 40.64, 43.72, 48.03, 51.11, 54.65, 59.58, 64.51, 69.44, 74.67],
        [56, 60.60, 65.19, 71.62, 76.21, 81.49, 88.84, 96.18, 103.53, 111.34],
        [16.56, 17.92, 19.27, 21.17, 22.53, 24.09, 26.27, 28.44, 30.61, 32.92],
        [38.01, 41.13, 44.25, 48.61, 51.73, 55.31, 60.30, 65.29, 70.27, 75.57],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    forteSecondMultiplier: number[] = [0, 1, 1, 1, 1, 2, 2, 0, 0];

    forteThirdDmg: Array<Array<number>> = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [13.08, 14.15, 15.22, 16.72, 17.79, 19.03, 20.74, 22.46, 24.17, 25.99],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [55.19, 59.71, 64.24, 70.57, 75.10, 80.30, 87.54, 94.78, 102.02, 109.71],
        [126.70, 137.09, 147.48, 162.03, 172.42, 184.37, 200.99, 217.61, 234.24, 251.90],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    forteThirdMultiplier: number[] = [0, 1, 0, 0, 0, 1, 1, 0, 0];

    rotation: Array<Array<string | number>> = [['sumSkillDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg', 'sumLiberationDmg', 'sumForteDmg', 'sumForteDmg'], [1, 6, 0, 1, 2, 3, 0, 7, 8]];
    rotationName: Array<string> = ['Intro', 'Skill Overflowing Radiance', 'Skill Crescent Divinity', '4x Basic Attack Incarnation', 'Resonance Liberation', 'Ressonance Skill: Solar Flare + Solar Glamour']
}