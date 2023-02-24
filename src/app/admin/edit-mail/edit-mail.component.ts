import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MailService } from 'src/app/services/mail.service';
import { ReceiverService } from 'src/app/services/receiver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-mail',
  templateUrl: './edit-mail.component.html',
  styleUrls: ['./edit-mail.component.scss']
})
export class EditMailComponent implements OnInit {

  services: any[] = []
  files: File[] = [];
  formGroup!: FormGroup;
  id!: number;

  loading: boolean = false;
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
    private receiverService: ReceiverService,
    private mailService: MailService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.getAllService();
    this.loadMail();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      id: [''],
      corresponding: ['', Validators.required],
      object: ['', Validators.required],
      dateReceived: ['', Validators.required],
      idService: ['', Validators.required]
    });
  }

  onSubmit() {
    const formData = new FormData();

    const service = this.services.find((service: any) => service.serv_label == this.formGroup.get('idService')?.value)

    formData.append('mail_id', this.formGroup.get('id')?.value);
    formData.append('mail_corresponding', this.formGroup.get('corresponding')?.value);
    formData.append('mail_object', this.formGroup.get('object')?.value);
    formData.append('mail_date_received', this.formGroup.get('dateReceived')?.value);
    formData.append('id_service', service.serv_id);
    
    for (let i = 0; i < this.files.length; i++) {
      formData.append('attachments[]', this.files[i]);
    }

    if (this.id === 0) {
      this.mailService.newMail(formData).subscribe(
        response => {
          if (response.success) {
            this.Toast.fire({
              icon: 'success',
              title: response.message
            });
            this.formGroup.reset();
            this.files = [];
          }
          else {
            this.Toast.fire({
              icon: 'error',
              title: response.message
            })
          }
        }
      );
    }
    else {
      this.mailService.updateMail(formData).subscribe(
        response => {
          if (response.success) {
            this.Toast.fire({
              icon: 'success',
              title: response.message
            });
            this.formGroup.reset();
            this.files = [];
          }
          else {
            this.Toast.fire({
              icon: 'error',
              title: response.message
            })
          }
        }
      );
    }
  }

  loadMail() {
    if (this.id > 0) {
      this.mailService.loadMail(this.id).subscribe(
        response => {
          this.formGroup.patchValue({
            id: this.id,
            corresponding: response.results[0].mail_corresponding,
            object: response.results[0].mail_object,
            dateReceived: response.results[0].mail_date_received,
            idService: response.results[0].serv_label
          });
        }
      );
    }
  }

  getAllService() {
    this.receiverService.getAllReceiver().subscribe(
      response => {
        this.services = response.results
      }
    );
  }

  onBack() {
    history.back();
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
}
