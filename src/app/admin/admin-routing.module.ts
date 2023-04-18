import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration/administration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditMailComponent } from './edit-mail/edit-mail.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { PanelComponent } from './panel/panel.component';
import { RegistryPanelComponent } from './registry-panel/registry-panel.component';
import { RegistryComponent } from './registry/registry.component';
import { SearchMailComponent } from './search-mail/search-mail.component';
import { ShowAttachmentsComponent } from './show-attachments/show-attachments.component';
import { UsersComponent } from './users/users.component';
import { ArchiveComponent } from './archive/archive.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  { 
    path: '', component: PanelComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'registry', component: RegistryPanelComponent, children: [
        { path: '', component: RegistryComponent },
        { path: 'mail-list/:id', component: MailListComponent },
        { path: 'show-attachments/:id', component: ShowAttachmentsComponent },
        { path: 'edit-mail/:id', component: EditMailComponent },
      ] },
      { path: 'archives/:id', component: ArchiveComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'search', component: SearchMailComponent },
      { 
        path: 'settings', component: AdministrationComponent, children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'users', component: UsersComponent },
          { path: 'edit-user/:id', component: EditUserComponent }
        ] 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
