import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminModule } from '../admin/admin.module';

@NgModule({
  declarations: [UserDashboardComponent],
  imports: [
    CommonModule,
    AdminModule
  ],
  exports: [
    UserDashboardComponent,
 
  ]
})
export class UserDashboardModule { }
