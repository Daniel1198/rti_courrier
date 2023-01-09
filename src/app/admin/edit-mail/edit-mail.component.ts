import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-mail',
  templateUrl: './edit-mail.component.html',
  styleUrls: ['./edit-mail.component.scss']
})
export class EditMailComponent {
  onBack() {
    history.back();
  }
}
