import { Component, HostListener, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { differenceInMinutes } from 'date-fns';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  isOnline: boolean = false;
  constructor(
    private notifService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.checkInternetConnectivity();
    if (this.isOnline) {
      timer(0, 60000).subscribe(
        () => {
          this.notifications = this.notifService.getNotifications();
        }
      )
    }
  }

  @HostListener('window:online')
  onOnline() {
    this.isOnline = true;
  }

  @HostListener('window:offline')
  onOffline() {
    this.isOnline = false;
  }

  checkInternetConnectivity() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  remove(index: number) {
    this.notifService.removeNotification(index);
  }

  diff(date: Date): number {
    const now = new Date();
    return differenceInMinutes(now, date);
  }
}
