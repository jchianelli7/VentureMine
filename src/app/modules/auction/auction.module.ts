import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionComponent } from './auction.component';
import { AuctionDetailsComponent } from './components/auction-details/auction-details.component';
import { AuctionGraphComponent } from './components/auction-graph/auction-graph.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { AuctionListComponent } from './components/auction-list/auction-list.component';
import {RouterModule} from "@angular/router";

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [AuctionComponent, AuctionDetailsComponent, AuctionGraphComponent, AuctionListComponent],
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    RouterModule
  ]
})
export class AuctionModule {
}
