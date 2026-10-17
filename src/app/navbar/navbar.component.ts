import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StorageService } from '../shared/services/storage.service';
import Swal from 'sweetalert2';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, RouterLinkActive, TranslocoPipe]
})
export class NavbarComponent {

  private transloco = inject(TranslocoService);

  private storage = inject(StorageService);

  lang = input('');
  callback = output<string>();

  versions: number[] = [...Array.from(Array(2).keys()).reverse()]

  changeLang(lang: string) {
    this.callback.emit(lang);
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
        this.storage.clear()
      }
    });
  }
}
