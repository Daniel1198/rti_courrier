import { Component, OnInit } from '@angular/core';
import { faEnvelope, faFileExport, faMailBulk, faPause, faPrint, faUpRightFromSquare, faUserTie } from '@fortawesome/free-solid-svg-icons';
import * as Highcharts from 'highcharts';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    faFileExport = faFileExport;
    faPrint = faPrint;
    faEnvelope = faEnvelope;
    faMailBulk = faMailBulk;
    faPause = faPause
    faUpRightFromSquare = faUpRightFromSquare
    faUserTie = faUserTie

    page: number = 1;
    count: number = 0;
    tableSize: number = 5;
    tableSizes: any = [5, 10, 15, 20];

    data: any = [1, 2, 3, 4, 5, 6];
    statistics: any;
    years: number[] = [];

    highcharts = Highcharts;
    chartOptions!: Highcharts.Options;

    constructor(
        private statisticService: StatisticsService
    ) {}

    ngOnInit(): void {
        this.getStatistics();
        const nowDate = new Date();
        for (let i = nowDate.getFullYear(); i >= 2020; i--) {
            this.years.push(i);
        };
        this.onGetStat(nowDate.getFullYear());
    }

    getStatistics() {
        this.statisticService.getStatisticByPeriod().subscribe(
            response => {
                this.statistics = response.results;
            }
        );
    }

    onGetStat(year: number) {
        this.statisticService.getStatisticByYear(year).subscribe(
            response => {
                const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                let categories: any[] = [];
                let totaux: number[] = [];
                let traites: number[] = [];
                let nontraites: number[] = [];

                response.results.forEach((stat: any) => {
                    categories.push(months[(+stat.month)-1]);
                    totaux.push(+stat.total);
                    traites.push(+stat.traite);
                    nontraites.push(+stat.nontraite);
                });
                this.chartOptions = {
                    chart: {
                        type: 'month'
                    },
                    title: {
                        text: 'Statistiques Des Courriers en 2022',
                    },
                    xAxis: {
                        categories: categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Nombre de courriers'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} : </td>' +
                            '<td style="padding-left:5px"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Total ',
                        data: totaux,
                        type: 'column'
            
                    }, {
                        name: 'Traités ',
                        data: traites,
                        type: 'column'
            
                    }, {
                        name: 'Non traités ',
                        data: nontraites,
                        type: 'column'
            
                    }
                ]
                };
            }
        );

        
    }

    changeSize(value: string) {
        this.tableSize = +value;
    }

    onTableDataChange(event: any) {
        this.page = event;
        this.data;
    }

    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
        this.data;
    }
}
