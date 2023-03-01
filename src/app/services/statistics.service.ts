import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  urlg = this.configService.urlg;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  getStatisticByPeriod(): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/statistics_by_period.php');
  }

  getStatisticByYear(year: number): Observable<any> {
    return this.http.get<any>(this.urlg + '/read/statistic_by_year.php?year=' + year);
  }
}
