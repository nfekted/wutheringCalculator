import { CharacterData } from '../character-data.model';

// Characters are added here as their data is migrated to the hit-based model (see scripts/import-character.mjs)
import aalto from './aalto.json';
import aemeath from './aemeath.json';
import augusta from './augusta.json';
import baizhi from './baizhi.json';
import brant from './brant.json';
import calcharo from './calcharo.json';
import buling from './buling.json';
import camellya from './camellya.json';
import cantarella from './cantarella.json';
import carlotta from './carlotta.json';
import changli from './changli.json';
import chisa from './chisa.json';
import chixia from './chixia.json';
import danjin from './danjin.json';
import denia from './denia.json';
import encore from './encore.json';
import galbrena from './galbrena.json';
import hiyuki from './hiyuki.json';
import hsin from './hsin.json';
import jingran from './jingran.json';
import jinhsi from './jinhsi.json';
import jiyan from './jiyan.json';
import lingyang from './lingyang.json';
import lucilla from './lucilla.json';
import lucy from './lucy.json';
import lumi from './lumi.json';
import lupa from './lupa.json';
import luuk from './luuk.json';
import lynae from './lynae.json';
import mornye from './mornye.json';
import mortefi from './mortefi.json';
import phoebe from './phoebe.json';
import phrolova from './phrolova.json';
import rebecca from './rebecca.json';
import roccia from './roccia.json';
import rover from './rover.json';
import rovere from './rovere.json';
import roverh from './roverh.json';
import sanhua from './sanhua.json';
import shorekeeper from './shorekeeper.json';
import suisui from './suisui.json';
import suoming from './suoming.json';
import taoqi from './taoqi.json';
import verina from './verina.json';
import xiangliYao from './xiangli-yao.json';
import yangyang from './yangyang.json';
import yangyangXuanling from './yangyang-xuanling.json';
import yinlin from './yinlin.json';
import youhu from './youhu.json';
import yuanwu from './yuanwu.json';
import zani from './zani.json';
import zhezhi from './zhezhi.json';

export const CHARACTERS = [
  aalto, aemeath, augusta, baizhi, brant, buling, calcharo, camellya, cantarella, carlotta, changli, chisa, chixia, danjin, denia, encore, galbrena, hiyuki, hsin, jingran, jinhsi, jiyan, lingyang, lucilla, lucy, lumi, lupa, luuk, lynae, mornye, mortefi, phoebe, phrolova, rebecca, roccia, rover, rovere, roverh, sanhua, shorekeeper, suisui, suoming, taoqi, verina, xiangliYao, yangyang, yangyangXuanling, yinlin, youhu, yuanwu, zani, zhezhi
] as unknown as CharacterData[];

export function getCharacterData(id: string): CharacterData {
  return CHARACTERS.find(c => c.id === id)!;
}
