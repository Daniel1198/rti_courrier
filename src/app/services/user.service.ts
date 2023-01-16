import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  urlg = this.configService.urlg;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  newUser(user: any): Observable<any> {
    return this.http.post(this.urlg + '/create/user.php', user);
  }
}
