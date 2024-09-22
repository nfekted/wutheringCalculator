export class Aalto {
    name: string = 'Aalto'
    icon: string = 'aalto';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Aalto';
    type: string = 'aero';
    weapon: string = 'pistols';
    //Basic Attacks
    basicNames: string[] = ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5', 'Mid-Air Attack', 'Aimed Shot', 'Charged Aim Shot', 'Dodge Damage'];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [
        [16, 17.32, 18.63, 20.478, 21.78, 23.29, 25.39, 27.48, 29.58, 31.81],
        [26.67, 28.86, 31.04, 34.11, 36.29, 38.81, 42.31, 45.80, 49.30, 53.02],
        [24, 25.97, 27.94, 30.7, 32.66, 34.93, 38.08, 41.22, 44.37, 47.72],
        [25.34, 27.42, 29.49, 32.4, 34.48, 36.84, 40.19, 43.51, 46.84, 50.37],
        [90.40, 97.82, 105.23, 115.61, 123.02, 131.55, 143.41, 155.27, 167.13, 179.73],
        [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65],
        [18, 19.48, 20.96, 23.02, 24.50, 26.20, 28.56, 30.92, 33.28, 35.79],
        [40.50, 43.83, 47.15, 51.80, 55.12, 58.94, 64.25, 69.56, 74.88, 80.52],
        [107.70, 116.54, 125.37, 137.73, 146.56, 156.72, 170.85, 184.98, 199.11, 214.12]
    ];
    basicMultiplier: number[] = [1, 1, 2, 2, 1, 1, 1, 1, 1];
    basicEnds: number = 4;

    //Skill
    skillNames: string[] = ['Mist Missile'];
    skillCurrent: number = 1;
    skill: Array<Array<number>> = [
        [30, 32.46, 34.92, 38.37, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
    ]
    skillMultiplier: number[] = [1];

    //Liberation
    liberationNames: string[] = ['Flower in the Mist'];
    liberationCurrent: number = 1;
    liberation: Array<Array<number>> = [
        [200, 216.40, 232.80, 255.76, 272.16, 291.02, 317.26, 343.50, 369.74, 397.62]
    ];
    liberationMultiplier: number[] = [1];

    //Intro Skill
    introName: string[] = ['Feint Shot'];
    introCurrent: number = 1;
    intro: Array<Array<number>> = [
        [33.34, 36.07, 38.8, 42.63, 45.36, 48.51, 52.88, 57.25, 61.63, 66.27]
    ];
    introMultiplier: number[] = [3];

    //Outro Skill
    outro: Array<Array<number>> = [[0]];
    outroMultiplier: number[] = [0];
    outroName: string[] = ['Dissolving Mist'];

    //Forte Skill
    forteName: string[] = ['Misty Cover: Mist Missle'];
    forteCurrent: number = 1;
    forte: Array<Array<number>> = [
        [30, 32.46, 34.92, 38.47, 40.83, 43.66, 47.59, 51.53, 55.47, 59.65]
    ];
    forteMultiplier: number[] = [1];

    rotation: Array<Array<string | number>> = [
        ['sumIntroDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumSkillDmg', 'sumLiberationDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumBasicDmg'],
        [0, 0, 1, 0, 0, 0, 1, 2]
    ];
    rotationName: Array<string> = ['Intro Skill', 'Basic Attack', 'Basic Attack', 'Resonance Skill: Mist Missle', 'Resonance Liberation: Flower in the Mist', 'Basic Attack', 'Basic Attack', 'Basic Attack', 'Outro Skill']
}