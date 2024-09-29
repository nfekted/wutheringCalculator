import { Component } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Encore } from '../shared/models/encore.model';
import { Sanhua } from '../shared/models/sanhua.model';
import { Util } from '../shared/utils/util.model';
import { Jinhsi } from '../shared/models/jinhsi.model';
import { Aalto } from '../shared/models/aalto.model';
import { Baizhi } from '../shared/models/baizhi.model';
import { Calcharo } from '../shared/models/calcharo.model';
import { Changli } from '../shared/models/changli.model';
import { Chixia } from '../shared/models/chixia.model';
import { Danjin } from '../shared/models/danjin.model';
import { Jianxin } from '../shared/models/jianxin.model';
import { Jiyan } from '../shared/models/jiyan.model';
import { Lingyang } from '../shared/models/lingyang.model';
import { Mortefi } from '../shared/models/mortefi.model';
import { RoverHavoc } from '../shared/models/roverh.model';
import { Rover } from '../shared/models/rover.model';
import { Taoqi } from '../shared/models/taoqi.model';
import { Verina } from '../shared/models/verina.model';
import { XiangliYao } from '../shared/models/xiangliyao.model';
import { Yangyang } from '../shared/models/yangyang.model';
import { Yinlin } from '../shared/models/yinlin.model';
import { Yuanwu } from '../shared/models/yuanwu.model';
import { Zhezhi } from '../shared/models/zhezhi.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  characterList: any[] = [];
  characters: Array<Character> = new Array<Character>();
  currentSelection: string = '';

  constructor() {
    this.characterList = [
      new Aalto(), new Baizhi(), new Calcharo(),
      //new Changli(),
      // new Chixia(), new Danjin(), new Encore(), new Jianxin(),
      // new Jinhsi(), new Jiyan(), new Lingyang(), new Mortefi(),
      // new RoverHavoc(), new Rover(), new Sanhua(), new Taoqi(),
      // new Verina(), new XiangliYao(), new Yangyang(), new Yinlin(),
      // new Yuanwu(), new Zhezhi()
    ];
  }

  ngOnInit(): void {
    this.load();
  }

  createNew(load?: any) {
    let char: Character;
    switch (this.currentSelection) {
      case 'aalto':
        const aal: Aalto = new Aalto();
        char = this.charCreation(aal, load);
        break;
      case 'baizhi':
        const bai: Baizhi = new Baizhi();
        char = this.charCreation(bai, load);
        char.hpType = true;
        char.healType = true;
        break;
      case 'calcharo':
        const cal: Calcharo = new Calcharo();
        char = this.charCreation(cal, load);

        break;
      case 'changli':
        const cha: Changli = new Changli();
        char = this.charCreation(cha);

        break;
      case 'chixia':
        const chi: Chixia = new Chixia();
        char = this.charCreation(chi);

        break;
      case 'danjin':
        const dan: Danjin = new Danjin();
        char = this.charCreation(dan);

        break;
      case 'encore':
        const enc: Encore = new Encore();
        char = this.charCreation(enc);

        break;
      case 'jianxin':
        const jia: Jianxin = new Jianxin();
        char = this.charCreation(jia);

        break;
      case 'jinhsi':
        const jin: Jinhsi = new Jinhsi();
        char = this.charCreation(jin);

        break;
      default: break;
      case 'jiyan':
        const jiy: Jiyan = new Jiyan();
        char = this.charCreation(jiy);

        break;
      case 'lingyang':
        const lin: Lingyang = new Lingyang();
        char = this.charCreation(lin);

        break;
      case 'mortefi':
        const mor: Mortefi = new Mortefi();
        char = this.charCreation(mor);

        break;
      case 'roverh':
        const roh: RoverHavoc = new RoverHavoc();
        char = this.charCreation(roh);

        break;
      case 'rover':
        const rov: Rover = new Rover();
        char = this.charCreation(rov);

        break;
      case 'sanhua':
        const san: Sanhua = new Sanhua();
        char = this.charCreation(san);

        break;
      case 'taoqi':
        const tao: Taoqi = new Taoqi();
        char = this.charCreation(tao);
        char.defType = true;

        break;
      case 'verina':
        const ver: Verina = new Verina();
        char = this.charCreation(tao);
        char.healType = true;

        break;
      case 'xiangliyao':
        const xia: XiangliYao = new XiangliYao();
        char = this.charCreation(xia);

        break;
      case 'yangyang':
        const yan: Yangyang = new Yangyang();
        char = this.charCreation(yan);

        break;
      case 'yinlin':
        const yin: Yinlin = new Yinlin();
        char = this.charCreation(yin);

        break;
      case 'yuanwu':
        const yua: Yuanwu = new Yuanwu();
        char = this.charCreation(yua);

        break;
      case 'zhezhi':
        const zhe: Zhezhi = new Zhezhi();
        char = this.charCreation(zhe);

        break;
    }
    this.characters.push(char);
    Util.characters = this.characters;
    this.currentSelection = '';

    if (!load) this.save();
  }

  save() {
    if (Util.load()['autosave']) {
      Util.save(Util.characters, 'wuteringcalculator-chars');
    };
  }

  charCreation(char: any, load?: any) {
    return new Character(this.characters.length, char, load);
  }

  load() {
    const load = Util.load('wuteringcalculator-chars');
    if (!load) {
      this.characters = new Array<Character>();
    } else {
      for (const c of load) {
        // this.characters.push(Object.assign(new Character(0, null), c));
        this.currentSelection = c.character.icon;
        this.createNew(c);
      }
      Util.characters = this.characters;
    }
  }

  audio(type: string) {
    const settings = Util.load();
    if (settings?.audio) {
      new Audio(`assets/sound/${type}.wav`).play();
    }
  }

  delete(index: number) {
    this.characters = this.characters.filter(c => c.index != index);
    for (let i = 0; i < this.characters.length; i++) {
      this.characters[i].index = i;
    }

    Util.characters = this.characters;
    this.save();
  }
}
