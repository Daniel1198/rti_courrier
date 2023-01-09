import { Component } from '@angular/core';
import { faAlignRight, faEllipsisVertical, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  faUserPlus = faUserPlus
  faEllipsisVertical = faEllipsisVertical
}
