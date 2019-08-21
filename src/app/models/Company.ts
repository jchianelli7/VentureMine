import { User } from './User';
import { Person } from './Person';

export class Company {
    companyName: string;
    auctionIds: [string];
    activeAuctionId: string;
    generalBio: string;
    images: [string];
    staff: [Person];
    documents: [string];        // Make sure this is the best way to do it
    owner: User;
}