import { CharacterData } from '../character-data.model';

// Characters are added here as their data is migrated to the hit-based model (see scripts/import-character.mjs)
import aemeath from './aemeath.json';
import baizhi from './baizhi.json';
import brant from './brant.json';
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
import jingran from './jingran.json';
import jinhsi from './jinhsi.json';
import lingyang from './lingyang.json';
import lucilla from './lucilla.json';
import lucy from './lucy.json';
import lupa from './lupa.json';
import luuk from './luuk.json';
import lynae from './lynae.json';
import mornye from './mornye.json';
import mortefi from './mortefi.json';
import phoebe from './phoebe.json';
import phrolova from './phrolova.json';
import roccia from './roccia.json';
import rover from './rover.json';
import roverh from './roverh.json';
import sanhua from './sanhua.json';
import shorekeeper from './shorekeeper.json';
import suisui from './suisui.json';
import taoqi from './taoqi.json';
import verina from './verina.json';
import yangyangXuanling from './yangyang-xuanling.json';
import youhu from './youhu.json';
import zani from './zani.json';
import zhezhi from './zhezhi.json';

export const CHARACTERS = [
  aemeath, baizhi, brant, camellya, cantarella, carlotta, changli, chisa, chixia, danjin, denia, encore, galbrena, hiyuki, jingran, jinhsi, lingyang, lucilla, lucy, lupa, luuk, lynae, mornye, mortefi, phoebe, phrolova, roccia, rover, roverh, sanhua, shorekeeper, suisui, taoqi, verina, yangyangXuanling, youhu, zani, zhezhi
] as unknown as CharacterData[];

export function getCharacterData(id: string): CharacterData {
  return CHARACTERS.find(c => c.id === id)!;
}
