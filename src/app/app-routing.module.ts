import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './modules/user-dashboard/user-dashboard/user-dashboard.component';
import { AuctionComponent } from './modules/auction/auction.component';
import {AuctionListComponent} from './modules/auction/components/auction-list/auction-list.component';
import { EditCompanyComponent } from './modules/company/edit-company/edit-company.component';
import { AdminDashboardComponent } from './modules/admin/components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: UserDashboardComponent},
  {path: 'auction/:id', component: AuctionComponent},
  {path: 'auctions', component: AuctionListComponent},
  {path: 'auction/:id/edit', component: EditCompanyComponent},
  {path: 'admin', component: AdminDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
