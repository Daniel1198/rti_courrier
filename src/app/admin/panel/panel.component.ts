import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faChartPie, faCog, faMailBulk, faPencil, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  faPowerOff = faPowerOff
  faPencil = faPencil
  faChartPie = faChartPie
  faMailBulk = faMailBulk
  faSearch = faSearch
  faCog = faCog

  constructor(
    private router: Router
  ) {}

  SignOut() {
    this.router.navigate(['/'])
  }
}
