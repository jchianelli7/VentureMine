import { User } from './User';
import { ChartDataSets } from 'chart.js';

export class Auction {
    id: number;
    title: string;
    ownerId: number;
    description: string;
    auctionStart: string;
    auctionEnd: string;
    sharesOffered: number;
    currentStrikePrice: number;
    currentPricePerShare: number;       // Live Auction PPS
    currentBids: number;
    showReserve: boolean;
    reservePrice: number;               // Minimum PPS for auction to be valid
    reserveMet: boolean;
    uniqueBidders: number;
    graphDataSets: ChartDataSets[];

    // TODO: Graph variables? Or unique object for this


}