import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MailService } from 'src/app/services/mail.service';
import { ReceiverService } from 'src/app/services/receiver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-mail',
  templateUrl: './edit-mail.component.html',
  styleUrls: ['./edit-mail.component.scss']
})
export class EditMailComponent implements OnInit {

  directions: any[] = []
  formGroup!: FormGroup;
  id!: string;
  currentUser: any;

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
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.getAllDirection();
    this.loadMail();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      ref: [''],
      corresponding: ['', Validators.required],
      object: ['', Validators.required],
      dateReceived: ['', Validators.required],
      idDirection: ['', Validators.required]
    });
  }

  onSubmit() {
    const formData = new FormData();

    const direction = this.directions.find((direction: any) => direction.dir_label == this.formGroup.get('idDirection')?.value)

    formData.append('mail_ref', this.formGroup.get('ref')?.value);
    formData.append('mail_corresponding', this.formGroup.get('corresponding')?.value);
    formData.append('mail_object', this.formGroup.get('object')?.value);
    formData.append('mail_date_received', this.formGroup.get('dateReceived')?.value);
    formData.append('id_direction', direction.dir_id);
    formData.append('id_user', this.currentUser.data.user_id);

    if (this.id == "0") {
      this.mailService.newMail(formData).subscribe(
        response => {
          if (response.success) {
            this.Toast.fire({
              icon: 'success',
              title: response.message
            });
            this.formGroup.reset();
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
      Swal.fire({
        title: 'Voulez-vous vraiment enregistrer les modifications apportées à ce courrier ?',
        showDenyButton: true,
        confirmButtonText: 'Oui',
        denyButtonText: `Non`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.loading = true;
          this.mailService.updateMail(formData).subscribe(
            response => {
              if (response.success) {
                this.Toast.fire({
                  icon: 'success',
                  title: response.message
                });
                history.back();
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
      })
    }
  }

  loadMail() {
    if (this.id != "0") {
      this.mailService.loadMail(this.id).subscribe(
        response => {
          this.formGroup.patchValue({
            ref: this.id,
            corresponding: response.results[0].mail_corresponding,
            object: response.results[0].mail_object,
            dateReceived: response.results[0].mail_date_received,
            idDirection: response.results[0].dir_label
          });
        }
      );
    }
  }

  getAllDirection() {
    this.receiverService.getAllReceiver().subscribe(
      response => {
        this.directions = response.results
      }
    );
  }

  onBack() {
    history.back();
  }
}
