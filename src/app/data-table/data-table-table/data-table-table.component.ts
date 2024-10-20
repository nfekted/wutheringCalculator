import { Component, Input, SimpleChanges } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Character } from '../../shared/models/character.model';

@Component({
  selector: 'app-data-table-table',
  templateUrl: './data-table-table.component.html',
  styleUrl: '../data-table-modal.component.scss'
})
export class DataTableTableComponent {

  @Input() character: any;
  @Input() type: string = 'basic';
  @Input() currentSelection: string = '';
  @Input() currentLevel: number = 1;
  constructor(private transloco: TranslocoService) { }
}
