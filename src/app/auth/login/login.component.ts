import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  faEnvelope = faEnvelope;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  visible: boolean = false;

  constructor(
    private router: Router
  ) {}

  onVisible() {
    this.visible = !this.visible;
  }

  onSubmit() {
    this.router.navigate(['/admin'])
  }

}
