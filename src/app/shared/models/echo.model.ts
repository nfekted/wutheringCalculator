export class Echo {

    //0 - Common, 1 - Elite, 2 - Over/Calamity
    type: number = 0;
    main1Index: number = 0;
    main2Index: number = 0;
    commonAttr: string[] = [];

    currentSubs: Array<string> = [null, null, null, null, null];
    currentSubsValue: Array<number> = [0, 0, 0, 0, 0];

    mainStats: Array<Array<string>> = [
        ['HP', 'HP %', 'ATK %', 'DEF %'],
        ['ATK', 'HP %', 'ATK %', 'DEF %', 'Energy Regen %', 'AERO DMG %', 'GLACIO DMG %', 'FUSION DMG %', 'ELECTRO DMG %', 'HAVOC DMG %', 'SPECTRO DMG %'],
        ['ATK', 'HP %', 'ATK %', 'DEF %', 'Energy Regen %', 'Crit Rate %', 'Crit Dmg %', 'Healing %'],
    ];

    mainValues: Array<Array<number>> = [
        [2280, 22.8, 18, 18],
        [100, 30, 30, 38, 32, 32, 30, 30, 30, 30, 30],
        [150, 33, 33, 41.8, 22, 22, 44, 26.4]
    ];

    secondaryStats: Array<string> = [
        'HP', 'DEF', 'ATK', 'HP %', 'DEF %', 'ATK %', 'Energy Regen %', 'Crit Rate %', 'Crit DMG %', 'Basic %', 'Heavy %', 'Skill %', 'Liberation %'
    ];
}