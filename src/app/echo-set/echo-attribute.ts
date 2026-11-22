import { EchoAttribute, EchoCost } from '../data/echos/echo-data.model';
import { CharacterRecommendation } from '../data/character-data.model';
import { TranslocoService } from '@jsverse/transloco';
import { sameAttribute } from '../core/stat-engine';

/** Name of an Echo attribute as the game shows it (names in `char.attr`), e.g. "ATK %", "ATK" (flat) or "Glacio DMG Bonus %" */
export function attributeLabel(attribute: EchoAttribute, transloco: TranslocoService): string {
  const element = attribute.element ?? '';
  const name = transloco.translate(`char.attr.${attribute.stat}`, { element: element.charAt(0).toUpperCase() + element.slice(1) });
  return name + (attribute.flat ? '' : ' %');
}

/** Whether the character recommends the attribute: a main attribute against the list of the cost of its Echo, a substat (no cost) against the substat list */
export function isRecommended(recommended: CharacterRecommendation, attribute: EchoAttribute, cost?: EchoCost): boolean {
  return (cost ? recommended.main[cost] : recommended.subs).some(r => sameAttribute(r, attribute));
}
