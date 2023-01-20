import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';


@NgModule({
  declarations: [
    LoginComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
