import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { EchoAttribute, EchoCost, EchoData, EchoSlot } from '../data/echos/echo-data.model';
import { ECHO_VALUES, ECHOS, SONATAS, getEcho, getSonata } from '../data/echos';
import { sameAttribute } from '../core/stat-engine';
import { Character } from '../shared/models/character.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';
import { EchoEditorComponent } from './echo-editor.component';
import { attributeLabel, isRecommended } from './echo-attribute';

export const MAX_COST = 12;
export const COSTS = [4, 3, 1] as const;

/** Sonatas the character uses first, then every other one by name */
export function sonataGroups(characterId: string) {
  const byName = [...SONATAS].sort((a, b) => a.name.localeCompare(b.name));
  return [
    { title: 'char.echoSet.recommended', sonatas: byName.filter(s => s.characters?.includes(characterId)) },
    { title: 'char.echoSet.allSonatas', sonatas: byName.filter(s => !s.characters?.includes(characterId)) },
  ].filter(group => group.sonatas.length);
}

/** Total cost of a set without one slot (-1: with all of them) */
export function costWithout(slots: (EchoSlot | null)[], index: number): number {
  return slots.reduce((sum, slot, i) => sum + (slot && i !== index ? getEcho(slot.echo)?.cost ?? 0 : 0), 0);
}

/** What the slot being filled or edited shows: the list of Sonatas, the Echos of one, or the editor */
type View =
  | { slot: number; step: 'sonata' }
  | { slot: number; step: 'echo'; sonata: number }
  | { slot: number; step: 'edit'; sonata: number; echo: EchoData };

@Component({
  selector: 'app-echo-set-modal',
  templateUrl: './echo-set-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(60rem,calc(100vw-2rem))]' },
  imports: [TranslocoPipe, DialogPanelComponent, EchoEditorComponent]
})
export class EchoSetModalComponent {

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  slots = signal<(EchoSlot | null)[]>([...this.character().echoSet]);
  view = signal<View | null>(null);

  readonly maxCost = MAX_COST;
  protected readonly label = attributeLabel;
  protected readonly getEcho = getEcho;
  protected readonly getSonata = getSonata;
  protected readonly recommended = this.character().data.recommended;

  totalCost = computed(() => costWithout(this.slots(), -1));

  sonataGroups = sonataGroups(this.character().data.id);

  /** Echos of the Sonata being picked, by cost; the ones that would take the total over the limit are blocked */
  echoGroups = computed(() => {
    const view = this.view();
    if (view?.step !== 'echo') return [];
    const free = MAX_COST - costWithout(this.slots(), view.slot);
    return COSTS.map(cost => ({
      cost,
      echos: ECHOS.filter(e => e.cost === cost && e.sonatas.includes(view.sonata))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(echo => ({ echo, blocked: echo.cost > free })),
    })).filter(group => group.echos.length);
  });

  /** Main slot: the Echo Skill and the main slot bonuses that apply to this character, only as information */
  mainInfo = computed(() => {
    const slot = this.slots()[0];
    const echo = slot && getEcho(slot.echo);
    if (!echo) return null;
    const id = this.character().data.id;
    return {
      skill: echo.skill.text.split('\n'),
      forms: echo.skill.hits.length > 1 ? echo.skill.hits.map(hit => hit.name) : [],
      bonuses: echo.mainSlotBonus.filter(bonus => !bonus.character || bonus.character === id).map(bonus => bonus.text),
    };
  });

  protected mainValue(slot: EchoSlot): EchoAttribute & { value: number } | undefined {
    const echo = getEcho(slot.echo);
    return echo && ECHO_VALUES.main[echo.cost].options.find(option => sameAttribute(option, slot.main));
  }

  /** Star before a recommended main attribute (with the cost) or substat */
  protected mark(attribute: EchoAttribute, cost?: EchoCost): string {
    return isRecommended(this.recommended, attribute, cost) ? '★ ' : '';
  }

  protected fixedValue(slot: EchoSlot) {
    const echo = getEcho(slot.echo);
    return echo && ECHO_VALUES.main[echo.cost].fixed;
  }

  protected open(slot: number) {
    this.view.set({ slot, step: 'sonata' });
  }

  protected pickSonata(sonata: number) {
    const view = this.view();
    if (view) this.view.set({ slot: view.slot, step: 'echo', sonata });
  }

  protected pickEcho(echo: EchoData) {
    const view = this.view();
    if (view?.step === 'echo') this.view.set({ slot: view.slot, step: 'edit', sonata: view.sonata, echo });
  }

  protected edit(index: number) {
    const slot = this.slots()[index];
    const echo = slot && getEcho(slot.echo);
    if (slot && echo) this.view.set({ slot: index, step: 'edit', sonata: slot.sonata, echo });
  }

  protected back() {
    const view = this.view();
    if (view?.step === 'echo') this.view.set({ slot: view.slot, step: 'sonata' });
    else this.view.set(null);
  }

  protected save(slot: EchoSlot) {
    const view = this.view();
    if (!view) return;
    this.update(this.slots().map((s, i) => i === view.slot ? slot : s));
    this.view.set(null);
  }

  protected remove(index: number) {
    this.update(this.slots().map((s, i) => i === index ? null : s));
  }

  private update(slots: (EchoSlot | null)[]) {
    this.slots.set(slots);
    const character = this.character();
    character.echoSet = slots;
    character.applyEchoSet();
    character.calculate();
  }
}
