import { Component, OnInit } from '@angular/core';
import { faCheck, faEnvelope, faFileImport, faMailBulk, faPause, faPrint, faTrash, faUpRightFromSquare, faUserTie } from '@fortawesome/free-solid-svg-icons';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { MailService } from 'src/app/services/mail.service';
import { ReceiverService } from 'src/app/services/receiver.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { YearService } from 'src/app/services/year.service';
import { formatDate } from '@angular/common';

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
    nbrErreur: number = 0;
    nbrSucces: number = 0;
    nbrMail: number = 0;

    exempleLink = "../uploaded_files/documents/exemple.xlsx";
    urlg: string = '';
    loading: boolean[] = [];
    data: any = [1, 2, 3, 4, 5, 6];
    mails: any[] = [];
    directions: any[] = [];
    success: boolean[] = [];
    statistics: any;
    years: any[] = [];
    nowDate = new Date();
    firstDayOfWeek!: Date;
    lastDayOfWeek!: Date;
    highcharts = Highcharts;
    chartOptions!: Highcharts.Options;
    chartOptions2!: Highcharts.Options;
    chartOptions3!: Highcharts.Options;
    currentUser: any;
    Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
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
        private configService: ConfigService,
        private authService: AuthService,
        private yearService: YearService
    ) {
        this.exempleLink = this.configService.urlg + this.exempleLink;
        this.urlg = this.configService.urlg;
    }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUser;
        this.firstDayOfWeek = moment().startOf('week').toDate();
        this.lastDayOfWeek = moment().endOf('week').toDate();
        const firstDate = this.firstDayOfWeek.getFullYear() + '-' + ((this.firstDayOfWeek.getMonth() + 1) > 9 ? ((+this.firstDayOfWeek.getMonth() + 1)) : '0' + (this.firstDayOfWeek.getMonth() + 1)) + '-' + (this.firstDayOfWeek.getDate() > 9 ? this.firstDayOfWeek.getDate() : '0' + this.firstDayOfWeek.getDate());
        const lastDate = this.lastDayOfWeek.getFullYear() + '-' + ((this.lastDayOfWeek.getMonth() + 1) > 9 ? ((+this.lastDayOfWeek.getMonth() + 1)) : '0' + (this.lastDayOfWeek.getMonth() + 1)) + '-' + (this.lastDayOfWeek.getDate() > 9 ? this.lastDayOfWeek.getDate() : '0' + this.lastDayOfWeek.getDate());
        this.getStatistics(firstDate, lastDate);
        this.getStatYear();
        this.getAllDirection();
    }

    getStatistics(firstDate: string, lastDate: string) {
        this.statisticService.getStatisticByPeriod(firstDate, lastDate).subscribe(
            response => {
                this.statistics = response.results;
                let chartData: any[] = []
                let barData: any[] = []
                let categories: any[] = []

                response.results.total_by_corresponding.forEach((stat: any) => {
                    chartData.push({
                        name: stat.mail_corresponding,
                        y: +stat.total
                    })
                });
                this.chartOptions2 = {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Statistiques Des Courriers par Expéditeur',
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} : {point.y}'
                            }
                        }
                    },
                    series: [{
                        name: 'Courrier total',
                        data: chartData,
                        type: 'pie'
                    }]
                };

                response.results.total_by_direction.forEach((stat: any) => {
                    barData.push(+stat.total);
                    categories.push(stat.dir_label);
                });

                this.chartOptions3 = {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Statistiques Des Courriers par Direction',
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
                            '<td style="padding-left:5px"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            },
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Courrier total',
                        data: barData,
                        type: 'bar'
                    }]
                };
        
                const pieChart = new Highcharts.Chart('pieChart', this.chartOptions2);
                const barChart = new Highcharts.Chart('barChart', this.chartOptions3);
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
                        text: 'Statistiques Des Courriers en ' + year,
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
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            },
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

    getStatYear() {
        this.yearService.getAllYear().subscribe(
            response => {
                this.years = response.results
                if (this.years.length > 1)
                    this.onGetStat(this.years[1].year);
                else
                    this.onGetStat(this.years[0].year);
            }
        );
    }

    importFile(event: any) {
        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();

        const header = ["Date de réception", "Expéditeur", "Objet", "Destinataire", "Date de transmission", "Annotation", "Imputation"];
        function mapRow(row: any) {
            return {
              reception: row["Date de réception"],
              expediteur: row["Expéditeur"],
              objet: row["Objet"],
              destinataire: row["Destinataire"],
              transmission: row["Date de transmission"],
              annotation: row["Annotation"],
              imputation: row["Imputation"]
            };
        }
        
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            this.mails = XLSX.utils.sheet_to_json(ws, { header: header, dateNF: 'yyyy-mm-dd' });
            this.mails = this.mails.map(mapRow);
            this.mails.shift();
            console.log(this.mails);
        };
        reader.readAsBinaryString(target.files[0]);
    }

    getTime(nbreJr: number): Date {
        const date = new Date((nbreJr - 25569)*24*3600000);
        return date;
    }

    getAllDirection() {
        this.receiverService.getAllReceiver().subscribe(
          response => {
            this.directions = response.results
          }
        );
    }

    showToast() {
        if (this.mails.length == 0) {
            this.Toast.fire({
                icon: 'success',
                title: "Données enregistrées avec succès"
            });
        }
        else if (this.mails.length == this.nbrMail) {
            this.Toast.fire({
                icon: 'error',
                title: "Données non enregistrées"
            });
        }
        else if (this.mails.length != this.nbrMail && this.mails.length != 0){
            this.Toast.fire({
                icon: 'warning',
                title: this.nbrSucces + " enregistrés & " + this.nbrErreur + " non enregistrés"
            });
        }
    }

    onSubmit() {
        const cu:any = this.authService.currentUser;
        this.nbrMail = this.mails.length;
        this.mails.forEach(mail => {
            const formData = new FormData();

            formData.append('mail_corresponding', mail.expediteur);
            formData.append('mail_object', mail.objet);
            formData.append('mail_date_received', formatDate(this.getTime(mail.reception), "yyyy-MM-dd", "fr"));
            formData.append('mail_shipping_date', mail.transmission ? formatDate(this.getTime(mail.transmission), "yyyy-MM-dd", "fr") : '');
            formData.append('mail_annotation', mail.annotation);
            formData.append('mail_imputation', mail.imputation);
            formData.append('id_direction', mail.destinataire.slice(0, 2).trim());
            formData.append('id_user', cu.data.user_id);

            this.mailService.newMail(formData).subscribe(
                response => {
                    if (response.success) {
                        formData.append('mail_ref', response.results);
                        if (mail.transmission) {
                            this.mailService.changeMailRegister(formData).subscribe(
                                res => {
                                    if (res.success) {
                                        const index = this.mails.indexOf(mail);
                                        this.mails.splice(index, 1);
                                        this.nbrSucces++;
                                    }
                                    else {
                                        this.nbrErreur++;
                                    }
                                }
                            );
                        }
                        else {
                            const index = this.mails.indexOf(mail);
                            this.mails.splice(index, 1);
                            this.nbrSucces++;
                        }
                    }
                    else {
                        this.nbrErreur++;
                    }
                }
            )
        })
        this.showToast();
        const firstDate = this.firstDayOfWeek.getFullYear() + '-' + ((this.firstDayOfWeek.getMonth() + 1) > 9 ? ((+this.firstDayOfWeek.getMonth() + 1)) : '0' + (this.firstDayOfWeek.getMonth() + 1)) + '-' + (this.firstDayOfWeek.getDate() > 9 ? this.firstDayOfWeek.getDate() : '0' + this.firstDayOfWeek.getDate());
        const lastDate = this.lastDayOfWeek.getFullYear() + '-' + ((this.lastDayOfWeek.getMonth() + 1) > 9 ? ((+this.lastDayOfWeek.getMonth() + 1)) : '0' + (this.lastDayOfWeek.getMonth() + 1)) + '-' + (this.lastDayOfWeek.getDate() > 9 ? this.lastDayOfWeek.getDate() : '0' + this.lastDayOfWeek.getDate());
        this.getStatistics(firstDate, lastDate);
        this.getStatYear();
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

