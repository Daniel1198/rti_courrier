import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faEnvelope, faEye, faFileExport, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { replaceAccent } from 'src/app/services/function';
import { MailService } from 'src/app/services/mail.service';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit {
  faEnvelope = faEnvelope
  faFileExport = faFileExport
  faPencil = faPencil
  faCheck = faCheck
  faEye = faEye
  faTrash = faTrash

  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [10, 15, 20];

  formGroup!: FormGroup;
  files: File[] = [];
  error: boolean = false;
  success: boolean = false;
  message: string = '';
  register: any;
  mails: any[] = [];
  data: any[] = [];
  mail: any;
  id!: number;
  idMail!: string;
  currentUser: any;
  loading: boolean = false;
  load: boolean = false;
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
    private route: ActivatedRoute,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.getAllRegister();
    this.getMailsByRegister();
    this.currentUser = this.authService.currentUser;
    this.initForm();
  }

  initForm() {
    this.formGroup = this.builder.group({
      shippingDate: ['', Validators.required],
      annotation: [''],
      imputation: [''],
    });
  }

  getAllRegister() {
    this.registerService.getAllRegister().subscribe(
      response => {
        this.register = response.results.find((register: any) => register.reg_id == this.id);
      }
    )
  }

  getMailsByRegister() {
    this.loading = true;
    this.mailService.getMailsByRegister(this.id).subscribe(
      response => {
        this.loading = false;
        this.mails = response.results;
        this.data = response.results;
      }
    )
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
                this.getMailsByRegister();
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

  getIdMail(id: string) {
    this.load = false;
    this.idMail = id;
  }

  getMail(mail: any) {
    this.mail = mail;
  }

  onSubmit() {
    this.load = true;
    const formData = new FormData();

    formData.append('mail_ref', this.idMail.toString());
    formData.append('mail_shipping_date', this.formGroup.get('shippingDate')?.value);
    formData.append('mail_annotation', this.formGroup.get('annotation')?.value);
    formData.append('mail_imputation', this.formGroup.get('imputation')?.value);
    formData.append('mail_imputation', this.formGroup.get('imputation')?.value);

    for (let i = 0; i < this.files.length; i++) {
      formData.append('attachments[]', this.files[i]);
    }

    this.mailService.changeMailRegister(formData).subscribe(
      response => {
        this.load = false;
          if (response.success) {
            this.message = response.message;
            this.error = false;
            this.success = true;
            this.getMailsByRegister();
            this.formGroup.reset();
            this.idMail = '';
            this.page = 1;
            this.files = [];
          }
          else {
            this.error = true;
            this.success = false;
            this.message = response.message;
          }
        }
      )
  }

  onSearch(value:string) {
    if (value) {
      this.mails = this.data.filter((mail: any) => {
        return replaceAccent(mail.mail_corresponding).includes(replaceAccent(value)) ||
               replaceAccent(mail.mail_object).includes(replaceAccent(value)) ||
               replaceAccent(mail.dir_label).includes(replaceAccent(value)) ||
               replaceAccent(mail.mail_ref).includes(replaceAccent(value))
      });
    }
    else {
      this.getMailsByRegister()
      this.page = 1;
    }
  }

  getTimeDifference(value: string): number {
    const nowDate = new Date();
    const date = new Date(value);
    const dt = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    return date.getTime() - dt.getTime();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i]);
      }
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  changeSize(value: string) {
    this.tableSize = +value;
    this.page = 1;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.mails;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.mails;
  }
}
