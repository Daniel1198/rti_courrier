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
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      id: [''],
      corresponding: ['', Validators.required],
      object: ['', Validators.required],
      dateReceived: ['', Validators.required],
      shippingDate: ['', this.id > 0 ? Validators.required : Validators.nullValidator],
      imputation: [''],
      annotation: [''],
      idReceiver: ['', Validators.required],
      attachments: ['']
    });
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('id', this.formGroup.get('id')?.value);
    formData.append('corresponding', this.formGroup.get('corresponding')?.value);
    formData.append('object', this.formGroup.get('object')?.value);
    formData.append('date_received', this.formGroup.get('dateReceived')?.value);
    formData.append('shipping_date', this.formGroup.get('shippingDate')?.value);
    formData.append('imputation', this.formGroup.get('imputation')?.value);
    formData.append('annotation', this.formGroup.get('annotation')?.value);
    formData.append('id_receiver', this.formGroup.get('idReceiver')?.value);
    formData.append('attachments', JSON.stringify({attachments: this.files}));

    if (this.id === 0) {
      this.mailService.newMail(formData).subscribe(
        response => {
          if (response.success) {
            this.Toast.fire({
              icon: 'success',
              title: response.message
            })
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
