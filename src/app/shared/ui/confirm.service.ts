import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  private dialog = inject(Dialog);

  async confirm(message: string): Promise<boolean> {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      data: message,
      backdropClass: 'app-backdrop',
      ariaLabelledBy: 'confirm-title'
    });
    return !!(await firstValueFrom(ref.closed));
  }
}
