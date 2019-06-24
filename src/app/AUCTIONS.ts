import { Auction } from './models/Auction';

export const AUCTIONS: Auction[] = [
    {id: 1, ownerId: 1, title: 'The Centrax', description: 'The Centrax offers precision measurements for your home renovation projects! Find the center of any two objects with ease using the Centrax. With investment interest from companies like 3M and Black & Decker, The Centrax is ready to storm the construction market!',
     auctionStart: '6/24/2019 8:00AM', auctionEnd: '7/1/2019 8:00AM', sharesOffered: 500, currentStrikePrice: 0, currentPricePerShare: 0, currentBids: 0, showReserve: true, reservePrice: 0, reserveMet: false, uniqueBidders: 0, graphDataSets:  [
        {
          data: [
            {x: 1, y:1 }
          ],
          label: 'Series A',
          pointRadius: 3,
        },
      ]   }
]