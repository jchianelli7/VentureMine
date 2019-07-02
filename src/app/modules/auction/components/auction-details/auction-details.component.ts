import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';
import { ChartDataSets } from 'chart.js';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  @Input() auction: Auction;
  @Output() bidPlaced = new EventEmitter();
  currentUser: User;
  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private authService: AuthenticationService) {

  }

  ngOnInit() {
    // this.auctionSub = this.auctionService.getBids(this.auction._id).subscribe(auction => {
    //   this.auction = auction;
    // });
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
    }
  }

  placeBid(numShares: number, pricePerShare: number) {
    this.auctionService.placeBid(this.auction._id, this.currentUser._id, pricePerShare, numShares);
  }

}
