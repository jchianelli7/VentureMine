import {Component, OnInit} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {

  auction: Auction;

  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(this.route.snapshot.params.id);
      this.auctionService.getAuction(this.route.snapshot.params.id).subscribe(auction => {
        this.auction = auction;
      });
    });
    console.log('initializIng parent comp');
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
    });
  }

  bidPlaced(auction: Auction) {
    console.log('In Parent Component - Auction');
    this.auction = auction;
  }

}
