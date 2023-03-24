import { Component, OnInit } from '@angular/core';
import { faEye, faFileExport, faPencil, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import { AuthService } from 'src/app/services/auth.service';
import { replaceAccent } from 'src/app/services/function';
import { MailService } from 'src/app/services/mail.service';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-search-mail',
  templateUrl: './search-mail.component.html',
  styleUrls: ['./search-mail.component.scss']
})
export class SearchMailComponent implements OnInit {
  faFileExport = faFileExport
  faPrint = faPrint
  faEye = faEye
  faPencil = faPencil
  faTrash = faTrash

  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [10, 15, 20];

  registers: any[] = [];
  mails: any[] = [];
  data: any[] = [];
  mail: any;
  loading: boolean = false;
  currentUser: any;
  regValue!: string;
  initialDate!: string;
  finalDate!: string;
  state!: string;

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
    private registerService: RegisterService,
    private mailService: MailService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.getAllRegister();
    this.getMails();
  }

  getAllRegister() {
    this.registerService.getAllRegister().subscribe(
      response => {
        this.registers = response.results;
      }
    )
  }

  getMails() {
    this.loading = true;
    this.mailService.getMailsByRegister().subscribe(
      response => {
        this.loading = false;
        this.mails = response.results;
        this.data = response.results;
      }
    )
  }

  onSearch(value:string) {
    this.mails = this.data.filter((mail: any) => {
      return replaceAccent(mail.mail_corresponding).includes(replaceAccent(value)) ||
             replaceAccent(mail.mail_object).includes(replaceAccent(value)) ||
             replaceAccent(mail.dir_label).includes(replaceAccent(value)) ||
             replaceAccent(mail.mail_ref).includes(replaceAccent(value))
    });

    if (this.regValue) {
      this.mails = this.mails.filter((mail: any) => {
        return mail.id_register == this.regValue
      });
    }

    if (this.initialDate) {
      this.mails = this.mails.filter((mail: any) => {
        const initDate = new Date(this.initialDate);
        const endDate = new Date(this.finalDate);
        const mailDate = new Date(mail.mail_date_received);
        if (this.finalDate) {
          return (mailDate.getTime() >= initDate.getTime()) && (mailDate.getTime() <= endDate.getTime());
        }
        return initDate.getTime() == mailDate.getTime();
      });
    }

    if (this.state) {
      if (this.state == '1') {
        this.mails = this.mails.filter((mail: any) => {
          return mail.mail_shipping_date ? this.getTimeDifference(mail.mail_shipping_date) < 0 : false;
        });
      }
      else if (this.state == '2') {
        this.mails = this.mails.filter((mail: any) => {
          return mail.mail_shipping_date ? this.getTimeDifference(mail.mail_shipping_date) > 0 : false;
        });
      }
      else {
        this.mails = this.mails.filter((mail: any) => {
          return mail.mail_shipping_date ? this.getTimeDifference(mail.mail_shipping_date) == 0 : false;
        });
      }
    }
    
    this.page = 1;
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer ce courrier ?',
      showDenyButton: true,
      confirmButtonText: 'Oui',
      denyButtonText: `Non`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading = true;
        this.mailService.deleteMail(id).subscribe(
          response => {
            this.loading = false;
              if (response.success) {
                this.Toast.fire({
                  icon: 'success',
                  title: response.message
                });
                this.getMails();
                this.page = 1;
              }
              else {
                this.Toast.fire({
                  icon: 'error',
                  title: response.message
                });
              }
            }
          )
        }
    })
  }

  getTimeDifference(value: string): number {
    const nowDate = new Date();
    const date = new Date(value);
    const dt = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    return date.getTime() - dt.getTime();
  }

  getMail(mail: any) {
    this.mail = mail;
  }

  exportToExcel() {

    let jsonData = [];
    // Récupération des données filtrées 
    for (let i = 0; i < this.mails.length; i++) {
      jsonData[i] = {
        Numéro: this.mails[i].mail_ref,
        Expéditeur: this.mails[i].mail_corresponding,
        Objet: this.mails[i].mail_object,
        Destinataire: this.mails[i].dir_label,
        Annotation: this.mails[i].mail_annotation,
        Imputation: this.mails[i].mail_imputation,
        "Date de réception": this.mails[i].mail_date_received,
        "Date de transmission": this.mails[i].mail_shipping_date,
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(jsonData, {
      cellStyles: true
    });
    worksheet['A1'].s = { fill: { fgColor: { rgb: '0000FF' } }, font: { color: { rgb: 'FFFFFF' } } };

    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Feuille1');

    XLSX.writeFile(book, 'resultat.xlsx');
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
