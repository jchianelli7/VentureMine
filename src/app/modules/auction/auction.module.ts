import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionComponent } from './auction.component';
import { AuctionDetailsComponent } from './components/auction-details/auction-details.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { AuctionListComponent } from './components/auction-list/auction-list.component';
import {RouterModule} from "@angular/router";
import { AuctionBidListComponent } from './components/auction-bid-list/auction-bid-list.component';
import { AuctionGraphComponent } from './components/auction-graph/auction-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AuctionBidComponent } from './components/auction-bid/auction-bid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes} from '@fortawesome/free-solid-svg-icons'
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import { CompanyDetailsComponent } from '../company/components/company-details/company-details.component';
import { CompanyModule } from '../company/company.module';

 
const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [AuctionComponent, AuctionDetailsComponent, AuctionListComponent, AuctionBidListComponent, AuctionGraphComponent, AuctionBidComponent],
  imports: [
    CommonModule ,
    ChartsModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    RouterModule,
    NgxChartsModule,
    FontAwesomeModule,
    CompanyModule
  ]
})
export class AuctionModule {
  constructor(){
    library.add(faTimes);
    library.add(faCheck);
  }
}
