import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Util } from '../shared/utils/util.model';
import { Settings } from '../shared/models/settings.model';
import Swal from 'sweetalert2';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() lang: string = '';
  @Output() callback: EventEmitter<string> = new EventEmitter<string>();
  @Output() settings: EventEmitter<string> = new EventEmitter<string>();
  @Input() configs: Settings = new Settings();

  versions: number[] = [...Array.from(Array(1).keys())]

  constructor(private transloco: TranslocoService) {
  }

  changeLang(lang: string) {
    this.callback.emit(lang);
  }

  changeAudio() {
    this.settings.emit('');
  }


  save() {
    // Util.save(Util.characters, 'wuteringcalculator-chars');
    console.log('chamou nav')
    Util.saveCharacters();
  }

  saveConfigs() {
    Util.save(this.configs);
  }

  delete() {
    Swal.fire({
      title: this.transloco.translate('settings.deleteConfirm'),
      showDenyButton: true,
      confirmButtonText: this.transloco.translate('confirm'),
      denyButtonText: this.transloco.translate('cancel')
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Util.clear()
      }
    });
  }
}
