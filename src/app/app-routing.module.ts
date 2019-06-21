import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './modules/user-dashboard/user-dashboard/user-dashboard.component';
import { AuctionComponent } from './modules/auction/auction.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: UserDashboardComponent},
  {path: 'auction', component: AuctionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
