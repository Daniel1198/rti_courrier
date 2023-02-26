import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PanelComponent } from './panel/panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MailListComponent } from './mail-list/mail-list.component';
import { SearchMailComponent } from './search-mail/search-mail.component';
import { AdministrationComponent } from './administration/administration.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditMailComponent } from './edit-mail/edit-mail.component';
import { RegistryPanelComponent } from './registry-panel/registry-panel.component';
import { RegistryComponent } from './registry/registry.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../loader/loader.module';
import { ShowAttachmentsComponent } from './show-attachments/show-attachments.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    PanelComponent,
    DashboardComponent,
    MailListComponent,
    SearchMailComponent,
    AdministrationComponent,
    EditMailComponent,
    RegistryPanelComponent,
    RegistryComponent,
    UsersComponent,
    EditUserComponent,
    ShowAttachmentsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgxPaginationModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule,
    PdfViewerModule,
    SweetAlert2Module.forRoot()
  ]
})
export class AdminModule { }
