import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  
  urlg = this.configService.urlg;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  newMail(mail: any): Observable<any> {
    return this.http.post(this.urlg + '/create/mail.php', mail);
  }

  getAllUser(): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/mails.php');
  }
}
