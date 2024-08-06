import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import Swal from 'sweetalert2';
import { Util } from '../shared/utils/util.model';
import { Settings } from '../shared/models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  constructor(private translocoService: TranslocoService) {

  }

  delete() {
    Swal.fire({
      title: this.translocoService.translate("s.deleteTitle"),
      text: this.translocoService.translate('s.deleteBody'),
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: 'red',
      confirmButtonColor: 'black',
      confirmButtonText: this.translocoService.translate('s.deleteConfirm'),
      cancelButtonText: this.translocoService.translate('cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.download();
        Swal.fire({
          title: this.translocoService.translate('done'),
          text: this.translocoService.translate('s.deleteReturn'),
          icon: "success"
        }).then(() => {
          Util.clear();
        });
      }
    });
  }

  download() {
    const save = Util.load();
    if (save == null) {
      return;
    }
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(save)));
    element.setAttribute('download', "backup_WuteringCalculator_" + new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString());

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  import() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  async upload() {
    const { value: file } = await Swal.fire({
      title: "Select image",
      input: "file",
      inputAttributes: {
        "accept": "text/plain",
        "aria-label": "Upload your profile picture"
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json: string = atob((e.target.result + '').replace('data:text/plain;base64,', ''));
        let settings: Settings = JSON.parse(json);
        if (settings == null) {
          settings = new Settings();
        }
        Util.save(settings);
        window.location.reload();
      };
      reader.readAsDataURL(file)
    }
  }

}
