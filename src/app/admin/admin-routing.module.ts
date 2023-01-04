import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration/administration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { PanelComponent } from './panel/panel.component';
import { SearchMailComponent } from './search-mail/search-mail.component';

const routes: Routes = [
  { 
    path: '', component: PanelComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'mail-list', component: MailListComponent },
      { path: 'search', component: SearchMailComponent },
      { path: 'settings', component: AdministrationComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
