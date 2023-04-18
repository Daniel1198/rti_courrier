import { Component, HostListener, OnInit } from '@angular/core';
import { faArchive, faBell, faChartPie, faCog, faEnvelopesBulk, faPencil, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
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
  faArchive = faArchive
  faBell = faBell

  currentUser: any;
  lastActivity!: Date;
  urlG: string;

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.urlG = this.configService.urlg
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.resetTimer();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  resetTimer() {
    this.lastActivity = new Date();
    setTimeout(() => {
      this.SignOut();
    }, 1800000) // Déconnexion automatique après 30 minutes
  }

  SignOut() {
    this.authService.logoutUser();
  }
}
