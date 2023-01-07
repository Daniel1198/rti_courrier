import { Component } from '@angular/core';
import { faAlignRight, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  faUserPlus = faUserPlus
  faAlignRight = faAlignRight
}
