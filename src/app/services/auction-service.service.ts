import { Injectable } from '@angular/core';
import { AUCTIONS } from '../AUCTIONS';
import { Auction } from '../models/Auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor() { } 

  getAuction(id: number): Auction{
    for(let i = 0; i < AUCTIONS.length; i++){
      if(AUCTIONS[i].id === id){
        return AUCTIONS[i];
      }
    }
  }
}
