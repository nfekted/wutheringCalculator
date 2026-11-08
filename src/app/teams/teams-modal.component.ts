import { Component, ChangeDetectionStrategy, WritableSignal, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Character } from '../shared/models/character.model';
import { Team, canJoinTeam } from '../shared/models/team.model';
import { StorageService } from '../shared/services/storage.service';
import { ConfirmService } from '../shared/ui/confirm.service';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

export interface TeamsModalData {
  characters: Character[];
  teams: WritableSignal<Team[]>;
}

@Component({
  selector: 'app-teams-modal',
  templateUrl: './teams-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(48rem,calc(100vw-2rem))]' },
  imports: [FormsModule, TranslocoPipe, DialogPanelComponent]
})
export class TeamsModalComponent {

  private data = inject<TeamsModalData>(DIALOG_DATA);
  private storage = inject(StorageService);
  private confirmation = inject(ConfirmService);
  private transloco = inject(TranslocoService);

  protected teams = this.data.teams;
  protected readonly slots = ['A', 'B', 'C'];

  /** Team being created or edited; null shows the list */
  protected editing = signal<Team | null>(null);

  protected character(index: number | null): Character | undefined {
    return index === null ? undefined : this.data.characters[index];
  }

  /** Every slot filled with a character that has a rotation */
  protected complete(team: Team): boolean {
    return team.members.every(m => { const c = this.character(m); return !!c && canJoinTeam(c); });
  }

  /** Characters that can go into a slot: with a rotation, and not already in another slot */
  protected options(team: Team, slot: number): Character[] {
    return this.data.characters.filter(c => canJoinTeam(c) && !team.members.some((m, i) => i !== slot && m === c.index));
  }

  protected create() {
    const id = Math.max(0, ...this.teams().map(t => t.id)) + 1;
    const name = this.transloco.translate('home.teams.defaultName', { n: this.teams().length + 1 });
    this.editing.set({ id, name, members: [null, null, null] });
  }

  protected edit(team: Team) {
    // Members no longer able to join (removed, or rotation cleared) come back empty
    const members = team.members.map(m => { const c = this.character(m); return c && canJoinTeam(c) ? m : null; });
    this.editing.set({ ...team, members });
  }

  protected setMember(slot: number, value: number | null) {
    const team = this.editing()!;
    team.members[slot] = value;
  }

  protected canSave(team: Team): boolean {
    return team.name.trim().length > 0 && this.complete(team);
  }

  protected save() {
    const team = this.editing()!;
    team.name = team.name.trim();
    const exists = this.teams().some(t => t.id === team.id);
    this.teams.update(list => exists ? list.map(t => t.id === team.id ? team : t) : [...list, team]);
    this.storage.saveTeams(this.teams());
    this.editing.set(null);
  }

  protected async remove(team: Team) {
    if (!await this.confirmation.confirm(this.transloco.translate('home.teams.delete', { name: team.name }))) return;
    this.teams.update(list => list.filter(t => t.id !== team.id));
    this.storage.saveTeams(this.teams());
  }
}
