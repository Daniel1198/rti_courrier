import { Component, OnInit } from '@angular/core';
import { faCheck, faEnvelope, faFileImport, faMailBulk, faPause, faPrint, faTrash, faUpRightFromSquare, faUserTie } from '@fortawesome/free-solid-svg-icons';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ConfigService } from 'src/app/services/config.service';
import { MailService } from 'src/app/services/mail.service';
import { ReceiverService } from 'src/app/services/receiver.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    faFileImport = faFileImport;
    faPrint = faPrint;
    faEnvelope = faEnvelope;
    faMailBulk = faMailBulk;
    faPause = faPause;
    faUpRightFromSquare = faUpRightFromSquare;
    faTrash = faTrash;
    faUserTie = faUserTie;
    faCheck = faCheck;

    page: number = 1;
    count: number = 0;
    tableSize: number = 5;
    tableSizes: any = [5, 10, 15, 20];

    exempleLink = "../uploaded_files/documents/exemple.xlsx";
    loading: boolean[] = [];
    data: any = [1, 2, 3, 4, 5, 6];
    mails: any[] = [];
    directions: any[] = [];
    success: boolean[] = [];
    statistics: any;
    years: number[] = [];
    firstDayOfWeek!: Date;
    lastDayOfWeek!: Date;
    highcharts = Highcharts;
    chartOptions!: Highcharts.Options;
    Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

    constructor(
        private statisticService: StatisticsService,
        private receiverService: ReceiverService,
        private mailService: MailService,
        private configService: ConfigService

    ) {
        this.exempleLink = this.configService.urlg + this.exempleLink;
    }

    ngOnInit(): void {
        this.firstDayOfWeek = moment().startOf('week').toDate();
        this.lastDayOfWeek = moment().endOf('week').toDate();
        const firstDate = this.firstDayOfWeek.getFullYear() + '-' + ((this.firstDayOfWeek.getMonth() + 1) > 9 ? ((+this.firstDayOfWeek.getMonth() + 1)) : '0' + (this.firstDayOfWeek.getMonth() + 1)) + '-' + (this.firstDayOfWeek.getDate() > 9 ? this.firstDayOfWeek.getDate() : '0' + this.firstDayOfWeek.getDate());
        const lastDate = this.lastDayOfWeek.getFullYear() + '-' + ((this.lastDayOfWeek.getMonth() + 1) > 9 ? ((+this.lastDayOfWeek.getMonth() + 1)) : '0' + (this.lastDayOfWeek.getMonth() + 1)) + '-' + (this.lastDayOfWeek.getDate() > 9 ? this.lastDayOfWeek.getDate() : '0' + this.lastDayOfWeek.getDate());
        this.getStatistics(firstDate, lastDate);
        const nowDate = new Date();
        for (let i = nowDate.getFullYear(); i >= 2020; i--) {
            this.years.push(i);
        };
        this.onGetStat(nowDate.getFullYear());
        this.getAllDirection();
    }

    getStatistics(firstDate: string, lastDate: string) {
        this.statisticService.getStatisticByPeriod(firstDate, lastDate).subscribe(
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

    importFile(event: any) {
        const file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsBinaryString(file);

        fileReader.onload = (e) => {
            var workbook = XLSX.read(fileReader.result, { type: 'binary' });
            var sheetNames = workbook.SheetNames;
            this.mails = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
        }
    }

    getAllDirection() {
        this.receiverService.getAllReceiver().subscribe(
          response => {
            this.directions = response.results
          }
        );
    }

    onSubmit() {
        for (let i = 0; i < this.mails.length ;i++) {
            this.loading[i] = true;
            const formData = new FormData();
    
            const direction = this.directions.find((direction: any) => direction.dir_label == this.mails[i]["Destinataire"])
        
            formData.append('mail_ref', '');
            formData.append('mail_corresponding', this.mails[i]["Expéditeur"]);
            formData.append('mail_object', this.mails[i]["Objet"]);
            formData.append('mail_date_received', this.mails[i]["Date de réception"]);
            formData.append('id_direction', direction.dir_id);
            
            this.mailService.newMail(formData).subscribe(
                response => {
                    this.loading[i] = false;
                    if (response.success) {
                        this.success[i] = true;
                        setTimeout(() => {
                            this.deleteMail(i);
                        }, 2000)
                    }
                    else {
                        this.success[i] = false;
                    }
                }
            );
        }
    }    

    deleteMail(index: number) {
        this.mails.splice(index, 1);
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
