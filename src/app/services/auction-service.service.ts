import { Injectable } from '@angular/core';
import { Auction } from '../models/Auction';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { pipe } from 'rxjs/internal/util/pipe';
import { Socket } from 'ngx-socket-io';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  currentAuction = this.socket.fromEvent<Auction>('auction');

  constructor(private http: HttpClient, private socket: Socket, private authService: AuthenticationService) {
  }

  getAuction(id: string): Observable<Auction> {
    return this.http.get<Auction>('http://localhost:3000/auctions/' + id, {}).pipe(map(
      auction => {
        if (auction) {
          return auction;
        }
      }
    ));
  }

  placeBid(auctionId: number, pps: number, numShares: number): Observable<Auction> {
    let userId = this.authService.currentUserValue._id;
    return this.http.post<Auction>('http://localhost:3000/auctions/' + auctionId, { userId, auctionId, pps, numShares }).pipe(map(auction => {
      if (auction) {
        return auction;
      }
    }))
  }

  // placeBid(auctionId: number, pps: number, numShares: number) {
  //   this.socket.emit('bidPlaced', {auctionId, pps, numShares});
  // }

  // disconnect(auctionId: number){
  //   this.socket.emit('close', auctionId);
  // }

  getAuctions() {
    return this.http.get<Auction[]>('http://localhost:3000/auctions', {}).pipe(map(auctions => {
      if (auctions) {
        return auctions;
      } else {
        console.log('Error Getting Auctions');
      }
    }));
  }

  resetBids(auctionId: string): Observable<Auction> {
    return this.http.post<Auction>('http://localhost:3000/auctions/' + auctionId + '/clear', {auctionId}).pipe(map(auction => {
      if(auction){
        return auction;
      }
    }))
  }
}
