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

  changeMailRegister(mail: any): Observable<any> {
    return this.http.post(this.urlg + '/update/change_mail_register.php', mail);
  }

  updateMail(mail: any): Observable<any> {
    return this.http.post(this.urlg + '/update/mail.php', mail);
  }

  getMailsByRegister(idRegister?: number): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/mails.php?id_register=' + idRegister);
  }

  loadMail(mailRef: string): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/one_mail.php?mail_ref=' + mailRef);
  }

  deleteMail(ref: string): Observable<any> {
    return this.http.get<any>(this.urlg + '/delete/mail.php?mail_ref=' + ref);
  }

  getAttachments(): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/attachments.php');
  }
}
