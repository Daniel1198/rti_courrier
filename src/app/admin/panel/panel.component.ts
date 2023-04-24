import { Component, HostListener, OnInit } from '@angular/core';
import { faArchive, faBell, faChartPie, faCog, faEnvelopesBulk, faPencil, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import Swal from 'sweetalert2';
import Push from 'push.js';
import { take, timer } from 'rxjs';
import { formatDate } from '@angular/common';

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
  nbrNotif: number = 0;

  isOnline = true;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private notifService: NotificationsService
  ) {
    this.urlG = this.configService.urlg
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.resetTimer();
    timer(0, 3600000).subscribe(
      () => {
        this.getNotifications();
      }
    );
    timer(0, 1000).subscribe(
      () => {
        this.nbrNotif = this.notifService.getNotifications().length
      }
    );
  }

  getNotifications() {
    this.notifService.clearNotifications();
    this.notifService.getMailsWaiting().subscribe(
      response => {
        if (response.results.length != 0) { 
          response.results.forEach((notification: any) => {
            if (notification.jourdiff != 0) {
              const notif: any = {
                ref: notification.mail_ref,
                date: new Date(),
                title: "Courrier en attente",
                objet: notification.mail_object,
                expediteur: notification.mail_corresponding,
                destinataire: notification.dir_label,
                body: "Le courrier N° " + notification.mail_ref + " réçu le " + formatDate(notification.mail_date_received.toString(), "EEE d MMM y", "fr") + " est toujours en attente de traitement."
              }
              this.notifService.addNotification(notif);
              Push.create("S2G Courrier", {
                body: "Le courrier N° " + notification.mail_ref + " réçu le " + formatDate(notification.mail_date_received.toString(), "EEE d MMM y", "fr") + " est toujours en attente de traitement. Veuillez contacter la direction chargée de son traitement svp !",
                icon: 'favicon.ico',
                timeout: 20000,
                onClick: function () {
                    window.focus();
                }
              });
            }
          });
        }
      }
    )
  }

  @HostListener('window:online', ['$event'])
  onOnline(event: any) {
    this.isOnline = true;
    this.Toast.fire({
      icon: 'success',
      title: "Connexion rétablie"
    });
  }

  @HostListener('window:offline', ['$event'])
  onOffline(event: any) {
    this.isOnline = false;
    this.Toast.fire({
      icon: 'error',
      title: "Vérifiez votre connexion Internet"
    });
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
