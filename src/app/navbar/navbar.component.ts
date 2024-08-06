import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() lang: string = '';
  @Output() callback: EventEmitter<string> = new EventEmitter<string>();

  changeLang(lang: string) {
    this.callback.emit(lang);
  }
}
