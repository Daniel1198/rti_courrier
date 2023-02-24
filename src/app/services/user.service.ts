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

  getAllUser(): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/users.php');
  }

  deleteUser(id: number): Observable<any> {
    return this.http.get<any>(this.urlg + '/delete/user.php?user_id=' + id);
  }

  updateUser(user: any): Observable<any> {
    return this.http.post<any>(this.urlg + '/update/user.php', user);
  }

  loadOneUser(id: number): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/one_user.php?user_id=' + id);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(this.urlg + '/update/change_user_password.php', data);
  }
}
