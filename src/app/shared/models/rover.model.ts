import { Default } from "./default.model";

export class Rover extends Default {

    constructor() {
        super();

        this.name = 'Rover (Spectro)'
        this.icon = 'rover';
        this.wiki = 'https://wutheringwaves.fandom.com/wiki/Rover';
        this.type = 'spectro';
        this.weapon = 'sword';

        //Basic Attacks
        this.basicNames = ['Vibration Manifestation Part 1', 'Vibration Manifestation Part 2', 'Vibration Manifestation Part 3', 'Vibration Manifestation Part 4', 'Mid-Air DMG', 'Dodge DMG', 'Heavy Attack', 'Heavy: Resonance ', 'Heavy: Aftertune '];
        this.basicCurrent = 1;
        this.basic = [
            [29.75, 32.19, 34.63, 38.05, 40.49, 43.29, 47.20, 51.10, 55, 59.15],
            [38.25, 41.39, 44.53, 48.92, 52.06, 55.66, 60.68, 35.70, 70.72, 76.05],
            [7.65, 8.28, 8.91, 9.79, 10.42, 11.14, 12.14, 13.14, 14.15, 15.21],
            [65.45, 70.82, 76.19, 83.70, 89.07, 95.24, 103.83, 112.42, 121, 130.13],
            [52.70, 57.03, 61.35, 67.40, 71.72, 76.69, 83.60, 90.52, 97.43, 104.78],
            [98.25, 106.31, 114.37, 125.65, 133.70, 142.97, 155.86, 168.75, 181.64, 195.34],
            [9.69, 10.49, 11.28, 12.40, 13.19, 14.10, 15.38, 16.65, 17.92, 19.27],
            [38.25, 41.39, 44.53, 48.92, 52.06, 55.66, 60.68, 65.70, 70.72, 76.05],
            [63.75, 68.98, 74.21, 81.53, 86.76, 92.77, 101.13, 109.50, 117.86, 126.75]
        ];
        this.basicMultiplier = [1, 1, 5, 1, 1, 1, 1, 1, 5];
        this.basicEnds = 3;

        //Skill
        this.skillNames = ['Resonating Slashes'];
        this.skillCurrent = 1;
        this.skill = [
            [118.80, 128.55, 138.29, 151.93, 161.67, 172.87, 188.46, 204.04, 219.63, 236.19]
        ];
        this.skillMultiplier = [1];


        //Liberation
        this.liberationNames = ['Echoing Orchestra'];
        this.liberationCurrent = 1;
        this.liberation = [
            [100, 108.20, 116.40, 127.88, 136.08, 145.51, 158.63, 171.75, 184.87, 198.81]
        ];
        this.liberationMultiplier = [1];

        this.liberationSecondDmg = [
            [340, 367.88, 395.76, 434.80, 462.68, 494.74, 539.35, 583.95, 628.56, 675.96]
        ]
        this.liberationSecondMultiplier = [1];

        //Intro Skill
        this.introName = ['Waveshock'];
        this.introCurrent = 1;
        this.intro = [
            [85, 91.97, 98.94, 108.70, 115.67, 123.69, 134.84, 145.99, 157.14, 168.99]
        ];
        this.introMultiplier = [1];

        //Outro Skill
        this.outroName = ['Instant'];


        //Forte Skill
        this.forteName = ['World in a Grain of Sand: Rosonating Spin', 'Resonating Whirl', 'Resonating Echoes Part 1', 'Resonating Echoes Part 2'];
        this.forteCurrent = 1;
        this.forte = [
            [64.93, 70.25, 75.58, 83.03, 88.35, 94.48, 103, 111.51, 120.03, 129.08],
            [20, 21.64, 23.28, 25.58, 27.22, 29.11, 31.73, 34.35, 36.98, 39.77],
            [40, 43.28, 46.56, 51.16, 54.44, 58.21, 53.46, 68.70, 73.95, 79.53],
            [80, 86.56, 93.12, 102.31, 108.87, 116.41, 126.91, 137.40, 147.90, 159.05]
        ];
        this.forteMultiplier = [2, 1, 1, 1];

        this.rotationName = ['Intro', 'Resonance Liberation', 'Heavy Attack', 'Heavy Attack: Resonance', 'Resonance Skill: Resonating Spin', '2x Basic Attack: Resonating Echoes', 'Outro']
        this.rotation = [
            ['sumIntroDmg', 'sumLiberationDmg', 'sumBasicDmg', 'sumBasicDmg', 'sumForteDmg', 'sumForteDmg', 'sumForteDmg'],
            [0, 0, 6, 7, 0, 2, 3]
        ];

    }

}