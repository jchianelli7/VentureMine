import { Component, OnInit, Input } from '@angular/core';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-auction-bid-list',
  templateUrl: './auction-bid-list.component.html',
  styleUrls: ['./auction-bid-list.component.css']
})
export class AuctionBidListComponent implements OnInit {

  @Input() auction;
  @Input() bids;
  private auctionSub: Subscription;
  currentUser: User;

  constructor(private auctionService: AuctionService, private authService: AuthenticationService) { }

  ngOnInit() {
    // this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
    //   this.auction = auction;
    // });
    if(this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
    }
  }

}
