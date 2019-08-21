import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AllUsersComponent } from './components/all-users/all-users.component';



@NgModule({
  declarations: [AdminDashboardComponent, AllUsersComponent],
  imports: [
    CommonModule,
  ]
})
export class AdminModule { }
