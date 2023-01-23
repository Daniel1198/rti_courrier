import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faChartPie, faCog, faFolderTree, faPencil, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  faPowerOff = faPowerOff
  faPencil = faPencil
  faChartPie = faChartPie
  faFolderTree = faFolderTree
  faSearch = faSearch
  faCog = faCog

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  SignOut() {
    this.authService.logoutUser();
  }
}
