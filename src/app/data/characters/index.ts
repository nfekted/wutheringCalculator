import { CharacterData } from '../character-data.model';

// Characters are added here as their data is migrated to the hit-based model (see scripts/import-character.mjs)
import baizhi from './baizhi.json';
import carlotta from './carlotta.json';
import hiyuki from './hiyuki.json';
import lingyang from './lingyang.json';
import lucilla from './lucilla.json';
import sanhua from './sanhua.json';
import suisui from './suisui.json';
import youhu from './youhu.json';
import zhezhi from './zhezhi.json';

export const CHARACTERS = [
  baizhi, carlotta, hiyuki, lingyang, lucilla, sanhua, suisui, youhu, zhezhi
] as unknown as CharacterData[];

export function getCharacterData(id: string): CharacterData {
  return CHARACTERS.find(c => c.id === id)!;
}
