import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionComponent } from './auction.component';
import { AuctionDetailsComponent } from './components/auction-details/auction-details.component';
import { AuctionGraphComponent } from './components/auction-graph/auction-graph.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AuctionComponent, AuctionDetailsComponent, AuctionGraphComponent],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class AuctionModule { 
  
}
