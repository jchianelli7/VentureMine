import { Component, OnInit } from '@angular/core';
import { AuctionService } from 'src/app/services/auction-service.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models/User';
import { Auction } from 'src/app/models/Auction';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  users: User[];
  auctions: Auction[];

  constructor(private auctionService: AuctionService, authService: AuthenticationService, private adminService: AdminService) {

   }

  ngOnInit() {
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
    })

    this.auctionService.getAuctions().subscribe((auctions) => {
      this.auctions = auctions;
    })
  }

}
