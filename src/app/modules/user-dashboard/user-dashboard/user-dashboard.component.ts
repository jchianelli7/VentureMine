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
  activeBids: Bid[];

  constructor(private authService: AuthenticationService, private auctionService: AuctionService) {
  }

  ngOnInit() {
    const me = this;
    if (this.authService.currentUserValue) {
      this.activeUser = this.authService.currentUserValue;
    }
    this.auctionService.getAuctions().subscribe(auctions => {
      if (auctions)  {
        me.auctions = auctions;
      }
      // if (this.activeUser) {
      //   this.auctionService.getActiveUserBids(this.activeUser.id).subscribe(activeBids => {
      //     this.activeBids = activeBids;
      //   });
      // }
    });

  }

  // setActiveBids(auctions: Auction[]) {
  //   const me = this;
  //   auctions.forEach(auction => {
  //     for (const bid of auction.bids) {
  //       if (bid.ownerId === me.activeUser.id) {
  //         me.bids.push(bid);
  //       }
  //     }
  //   });
  // }

  setActiveBids(auctions: Auction[]) {
    const me = this;
    console.log("Auctions: ", auctions);
    for (const auction of auctions) {
      for (const bid of auction.bids) {
        if (bid.ownerId === me.activeUser.id) {
          me.activeBids.push(bid);
        }
      }
    }
  }
}
