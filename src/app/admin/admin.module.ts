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


@NgModule({
  declarations: [
    PanelComponent,
    DashboardComponent,
    MailListComponent,
    SearchMailComponent,
    AdministrationComponent,
    EditMailComponent,
    RegistryPanelComponent,
    RegistryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgxPaginationModule
  ]
})
export class AdminModule { }
