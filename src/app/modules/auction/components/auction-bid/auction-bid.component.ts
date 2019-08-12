import { Component, OnInit, Input } from '@angular/core';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Auction } from 'src/app/models/Auction';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-auction-bid',
  templateUrl: './auction-bid.component.html',
  styleUrls: ['./auction-bid.component.css']
}) 
export class AuctionBidComponent implements OnInit {

  @Input() auction: Auction;
  currentUser: User;

  constructor(private auctionService: AuctionService, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue; 
    }
  }

  placeBid(numShares: number, pricePerShare: number) {
    this.auctionService.placeBid(this.auction._id, this.currentUser._id, pricePerShare, numShares);
  }

}
