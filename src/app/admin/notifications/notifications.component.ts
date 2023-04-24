import { Component, OnInit } from '@angular/core';
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
  constructor(
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    timer(0, 60000).subscribe(
      () => {
        this.notifications = this.notifService.getNotifications();
      }
    )
  }

  remove(index: number) {
    this.notifService.removeNotification(index);
  }

  diff(date: Date): number {
    const now = new Date();
    return differenceInMinutes(now, date);
  }
}
