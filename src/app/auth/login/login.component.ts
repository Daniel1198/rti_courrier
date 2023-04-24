import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  faEnvelope = faEnvelope;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  visible: boolean = false;
  formGroup!: FormGroup;
  loading: boolean = false;
  cu: any;

  isOnline = true;
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  @HostListener('window:online', ['$event'])
  onOnline(event: any) {
    this.isOnline = true;
    this.Toast.fire({
      icon: 'success',
      title: "Connexion rétablie"
    });
  }

  @HostListener('window:offline', ['$event'])
  onOffline(event: any) {
    this.isOnline = false;
    this.Toast.fire({
      icon: 'error',
      title: "Vérifiez votre connexion Internet"
    });
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  onVisible() {
    this.visible = !this.visible;
  }

  onSubmit() {
    if (this.isOnline || !this.isOnline) {
      this.loading = true;
      const formData = new FormData();
  
      formData.append('user_email', this.formGroup.get('email')?.value);
      formData.append('user_pwd', this.formGroup.get('password')?.value);
  
      this.authService.loginUser(formData).subscribe(
        response => {
          this.loading = false;
          if (response.success) {
            this.cu = this.authService.currentUser;
            if (this.cu.data.user_isFirstConnection == 1) {
              this.router.navigate(['/admin/dashboard']);
            }
            else {
              this.router.navigate(['/auth/change-password/' + this.cu.data.user_id]);
            }
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
    // else {
    //   this.Toast.fire({
    //     icon: 'error',
    //     title: "Vérifiez votre connexion Internet"
    //   });
    // }
  }
}
