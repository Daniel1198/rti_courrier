import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedUserSubject!: BehaviorSubject<object>;
  public accessToken!: Observable<any>;

  urgl: string = this.configService.urlg;
  getLoggedUser: any;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.getLoggedUser = JSON.parse(localStorage.getItem('access_token')!);
    this.loggedUserSubject = new BehaviorSubject(this.getLoggedUser);
    this.accessToken = this.loggedUserSubject.asObservable();
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.urgl}/auth/login.php`, credentials)
        .pipe(map(response=> {
            localStorage.setItem('access_token', JSON.stringify(response));
            this.loggedUserSubject.next(response);
            return response;
        }));
  }

  logoutUser() {
      localStorage.removeItem('access_token');
      this.loggedUserSubject.next(null!);
  }

  public get accessTokenValue(){
      return this.loggedUserSubject.value;
  }
}
