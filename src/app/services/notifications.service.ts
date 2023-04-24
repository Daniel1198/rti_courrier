import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  urlg = this.configService.urlg;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  private notifications: any[] = [];
  private refMail!: string;

  setRef(value: string) {
    this.refMail = value;
  }

  getRef(): string {
    return this.refMail;
  }
    
  getMailsWaiting() : Observable<any> {
    return this.http.get<any>(this.urlg + '/read/mails_waiting.php');
  }

  addNotification(notif: any) {
    this.notifications.push(notif);
  }

  clearNotifications() {
    this.notifications = [];
  }

  getNotifications(): any[] {
    return this.notifications
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1);
  }
}
