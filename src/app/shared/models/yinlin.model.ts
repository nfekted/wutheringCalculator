export class Yinlin {
    name: string = 'Yinlin'
    icon: string = 'yinlin';
    wiki: string = 'https://wutheringwaves.fandom.com/wiki/Yinlin';
    type: string = 'electro';
    weapon: string = 'rectifier';
    //Basic Attacks
    basicNames: string[] = [];
    basicCurrent: number = 1;
    basic: Array<Array<number>> = [

    ];
    basicMultiplier: number[] = [];
    basicEnds: number = 3;

    basicSecondDmg: Array<Array<number>> = [

    ]
    basicSecondMultiplier: number[] = [];

    basicThirdDmg: Array<Array<number>> = [

    ]
    basicThirdMultiplier: number[] = [];

    //Skill
    skillNames: string[] = [];
    skillCurrent: number = 1;
    skill: Array<Array<number>> = [

    ]
    skillMultiplier: number[] = [];

    skillSecondDmg: Array<Array<number>> = [

    ];
    skillSecondMultiplier: number[] = [];

    skillThirdDmg: Array<Array<number>> = [

    ];
    skillThirdMultiplier: number[] = [];


    //Liberation
    liberationNames: string[] = [];
    liberationCurrent: number = 1;
    liberation: Array<Array<number>> = [

    ];
    liberationMultiplier: number[] = [1];

    liberationSecondDmg: Array<Array<number>> = [

    ]
    liberationSecondMultiplier: number[] = [1];

    //Intro Skill
    introName: string[] = [];
    introCurrent: number = 1;
    intro: Array<Array<number>> = [

    ];
    introMultiplier: number[] = [];

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
    rotationName: Array<string> = []
}