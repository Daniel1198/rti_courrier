import { Component } from '@angular/core';
import { faEnvelope, faFileExport, faMailBulk, faPause, faPrint, faUpRightFromSquare, faUserTie } from '@fortawesome/free-solid-svg-icons';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
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
        name: 'Externes ',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5,106.6, 92.3],
        type: 'column'

    }, {
        name: 'Traités ',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,51.2],
        type: 'column'

    }]
};

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
