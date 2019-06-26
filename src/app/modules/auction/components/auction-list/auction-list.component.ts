import {Component, OnInit} from '@angular/core';
import {AuctionService} from '../../../../services/auction-service.service';
import {Auction} from '../../../../models/Auction';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent implements OnInit {

  auctions: Auction[];

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit() {
    this.auctionService.getAuctions().subscribe(auctions => {
      this.auctions = auctions;
    });
  }

}
