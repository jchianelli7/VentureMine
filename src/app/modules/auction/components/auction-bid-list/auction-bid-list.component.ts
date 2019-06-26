import { Component, OnInit, Input } from '@angular/core';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auction-bid-list',
  templateUrl: './auction-bid-list.component.html',
  styleUrls: ['./auction-bid-list.component.css']
})
export class AuctionBidListComponent implements OnInit {

  @Input() auction;
  @Input() auctionData;
  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService) { }

  ngOnInit() {
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
    });
  }

}
