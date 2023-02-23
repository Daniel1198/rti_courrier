import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  
  visible: boolean[] = [false].constructor();
  faEnvelope = faEnvelope;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  formGroup!: FormGroup;
  loading: boolean = false;
  cu: any;

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
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cu = this.authService.currentUser
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onVisible(index: number) {
    this.visible[index] = !this.visible[index];
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('id', this.cu.data.id);
    formData.append('password', this.formGroup.get('oldPassword')?.value);
    formData.append('new_password', this.formGroup.get('newPassword')?.value);
    formData.append('is_first_connection', '1');

    if (this.formGroup.get('confirmPassword')?.value == this.formGroup.get('newPassword')?.value) {
      this.userService.changePassword(formData).subscribe(
        response => {
          if (response.success) {
            this.Toast.fire({
              icon: 'success',
              title: response.message
            })

            this.router.navigate(['/auth/login']);
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
      this.Toast.fire({
        icon: 'error',
        title: 'Le nouveau mot de passe n\'a pas été confirmé'
      })
    }
  }

}
