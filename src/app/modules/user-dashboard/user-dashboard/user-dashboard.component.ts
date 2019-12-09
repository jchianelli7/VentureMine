import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/User';
import {AuctionService} from '../../../services/auction-service.service';
import {Bid} from '../../../models/Bid';
import {Auction} from "../../../models/Auction";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  activeUser: User;
  bids: Bid[];
  auctions: Auction[];

  constructor(private authService: AuthenticationService, private auctionService: AuctionService) {
  }

  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.activeUser = this.authService.currentUserValue;
    }


  }

}
