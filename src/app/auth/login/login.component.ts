import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    
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
    
  }

}
