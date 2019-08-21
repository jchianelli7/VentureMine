import { Component, OnInit, Input } from '@angular/core';
import { Auction } from 'src/app/models/Auction';

@Component({
  selector: 'app-all-auctions',
  templateUrl: './all-auctions.component.html',
  styleUrls: ['./all-auctions.component.css']
})
export class AllAuctionsComponent implements OnInit {

  @Input() auctions: Auction[];

  constructor() { }

  ngOnInit() {
  }

}
