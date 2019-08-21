import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AllAuctionsComponent } from './components/all-auctions/all-auctions.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AdminDashboardComponent, AllUsersComponent, AllAuctionsComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminModule { }
