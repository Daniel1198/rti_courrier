import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  urlg = this.configService.urlg;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  getAllYear(): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/years.php');
  }
}
