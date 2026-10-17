import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Util } from '../shared/utils/util.model';
import { Settings } from '../shared/models/settings.model';
import Swal from 'sweetalert2';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, RouterLink, RouterLinkActive, TranslocoPipe]
})
export class NavbarComponent {

  private transloco = inject(TranslocoService);

  lang = input('');
  callback = output<string>();
  settings = output<string>();
  configs = input(new Settings());

  versions: number[] = [...Array.from(Array(2).keys()).reverse()]

  changeLang(lang: string) {
    this.callback.emit(lang);
  }

  changeAudio() {
    this.settings.emit('');
  }


  save() {
    Util.saveCharacters();
  }

  saveConfigs() {
    Util.save(this.configs());
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
