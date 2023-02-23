import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChartPie, faCog, faEnvelopesBulk, faFolderTree, faPencil, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  faPowerOff = faPowerOff
  faPencil = faPencil
  faChartPie = faChartPie
  faEnvelopesBulk = faEnvelopesBulk
  faSearch = faSearch
  faCog = faCog

  currentUser: any;
  urlG: string;

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.urlG = this.configService.urlg
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  SignOut() {
    this.authService.logoutUser();
  }
}
