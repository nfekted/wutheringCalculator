import { CharacterData } from '../character-data.model';

import aalto from './aalto.json';
import baizhi from './baizhi.json';
import calcharo from './calcharo.json';
import camellya from './camellya.json';
import carlotta from './carlotta.json';
import changli from './changli.json';
import chixia from './chixia.json';
import danjin from './danjin.json';
import encore from './encore.json';
import jianxin from './jianxin.json';
import jinhsi from './jinhsi.json';
import jiyan from './jiyan.json';
import lingyang from './lingyang.json';
import mortefi from './mortefi.json';
import rover from './rover.json';
import roverh from './roverh.json';
import sanhua from './sanhua.json';
import shorekeeper from './shorekeeper.json';
import taoqi from './taoqi.json';
import verina from './verina.json';
import xiangliyao from './xiangliyao.json';
import yangyang from './yangyang.json';
import yinlin from './yinlin.json';
import youhu from './youhu.json';
import yuanwu from './yuanwu.json';
import zhezhi from './zhezhi.json';

export const CHARACTERS = [
  aalto, baizhi, calcharo, camellya, carlotta, changli, chixia, danjin, encore, jianxin, jinhsi, jiyan, lingyang, mortefi, rover, roverh, sanhua, shorekeeper, taoqi, verina, xiangliyao, yangyang, yinlin, youhu, yuanwu, zhezhi
] as unknown as CharacterData[];

export function getCharacterData(id: string): CharacterData {
  return CHARACTERS.find(c => c.id === id)!;
}
