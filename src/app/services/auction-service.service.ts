import {Injectable} from '@angular/core';
import {Auction} from '../models/Auction';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, observable} from 'rxjs';
import {pipe} from 'rxjs/internal/util/pipe';
import {Socket} from 'ngx-socket-io';
import {AuthenticationService} from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  // currentAuction = this.socket.fromEvent<Auction>('auctionUpdated');
  socket = io('http://localhost:4000');

  constructor(private http: HttpClient, private authService: AuthenticationService) {

  }

  getAuction(id: string) {
    return this.http.get<Auction>('http://localhost:3000/auctions/' + id, {}).pipe(map(
      auction => {
        if (auction) {
          return auction;
        }
      }
    ));
  }

  getBids(id: string): Observable<Auction> {
    const observable = new Observable<Auction>(observer => {
      this.socket = io('http://localhost:4000');
      this.socket.on('bidPlaced', (auction) => {
        console.log('BID PLACED - GET BIDS');
        observer.next(auction);
      });
      return () => {
        console.log('Disconnecting');
        this.socket.disconnect();
      };
    });
    return observable;
  }

  placeBid(auctionId: number, ownerId: number, pps: number, numShares: number) {
    console.log('Placing Bid: ');
    console.log('auctionID: ', auctionId);
    console.log('OwnerID: ', ownerId);
    console.log('PPS: ', pps);
    console.log('# Shares: ', numShares);
    console.log('************************');
    this.socket.emit('placeBid', {auctionId, ownerId, pps, numShares});
  }

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
      if (auction) {
        return auction;
      }
    }));
  }
}
