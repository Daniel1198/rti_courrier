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
    chartOptions: Highcharts.Options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Statistiques Des Courriers en 2022',
        },
        xAxis: {
            categories: [
                'Janvier',
                'Février',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Août',
                'Septemebre',
                'Octobre',
                'Novembre',
                'Décembre'
            ],
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
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'

        }, {
            name: 'Traités ',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,51.2],
            type: 'column'

        }]
    };

    constructor(
        private statisticService: StatisticsService
    ) {}

    ngOnInit(): void {
        this.getStatistics();
        const nowDate = new Date();
        for (let i = 2020; i <= nowDate.getFullYear(); i++) {
            this.years.push(i);
        }
    }

    getStatistics() {
        this.statisticService.getStatisticByPeriod().subscribe(
            response => {
                this.statistics = response.results;
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
