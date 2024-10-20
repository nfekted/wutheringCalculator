import { Component, Input, SimpleChanges } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-data-table-modal',
  templateUrl: './data-table-modal.component.html',
  styleUrl: './data-table-modal.component.scss'
})
export class DataTableModalComponent {

  @Input() id: string;
  @Input() character: Character;

  currentSelection: string = '';
  constructor(private transloco: TranslocoService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentSelection = this.character.character.icon;
  }
}
