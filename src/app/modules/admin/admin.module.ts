import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AllAuctionsComponent } from './components/all-auctions/all-auctions.component';
import { RouterModule } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { EditAuctionComponent } from './components/edit-auction/edit-auction.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AdminDashboardComponent, AllUsersComponent, AllAuctionsComponent, EditUserComponent, EditAuctionComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
