import {Injectable} from '@angular/core';
import {AUCTIONS} from '../AUCTIONS';
import {Auction} from '../models/Auction';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {pipe} from 'rxjs/internal/util/pipe';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  currentAuction = this.socket.fromEvent<Auction>('auction');

  constructor(private http: HttpClient, private socket: Socket) {
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

  placeBid(auctionId: number, pps: number, numShares: number) {
    this.socket.emit('bidPlaced', {auctionId, pps, numShares});
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
}
