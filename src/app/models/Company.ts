import { Auction } from './Auction';
import { User } from './User';

export class Company {
    companyName: string;
    auctions: [Auction];
    companyOwner: User;
}