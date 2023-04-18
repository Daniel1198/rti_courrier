import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CorrespondingsService {
  urlg = this.configService.urlg;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  getCorresponding(): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/correspondings.php');
  }
}
