import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';
import { ChartDataSets } from 'chart.js';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  @ViewChild('timer', {static: false}) timer: ElementRef;
  @ViewChild('strikePricePopup', {static: false}) strikePricePopup: ElementRef;
  @Input() auction: Auction;
  @Output() bidPlaced = new EventEmitter();
  currentUser: User;
  timerCount;
  timerDone: Boolean = false;
   
  constructor(private auctionService: AuctionService, private authService: AuthenticationService) {

  }

  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
    }
  }

  ngAfterViewInit(){
    const me = this;
    this.timerCount = setInterval(function() {
      
      me.timeBetweenDates(me.auction.time);
    }, 1000);
    
  }

  showInfoPopup(el){
    el.style.display = "block";
    el.style.backgroundColor = "pink";
    el.style.border = "1px dashed black";
    el.style.margin = "5px";
    console.log(el);
  }

  hideInfoPopup(el){
    el.style.display = "none";
  }

 timeBetweenDates(end: Date): void {
    var endDate = new Date(end);
    var now = new Date();
    var difference = endDate.getTime() - now.getTime();
  
    if (difference <= 0) {
  
      this.timer.nativeElement.children[0].innerText = 0;
      this.timer.nativeElement.children[1].innerText = 0;
      this.timer.nativeElement.children[2].innerText = 0;
      this.timer.nativeElement.children[3].innerText= 0;
      // Timer done
      clearInterval(this.timerCount);
      this.timerDone = true;
      this.timer.nativeElement.innerHTML = "";
    
    } else {
      
      var seconds = Math.floor(difference / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
  
      hours %= 24;
      minutes %= 60;
      seconds %= 60;
  
      this.timer.nativeElement.children[0].innerText = days;
      this.timer.nativeElement.children[1].innerText = hours;
      this.timer.nativeElement.children[2].innerText = minutes;
      this.timer.nativeElement.children[3].innerText=seconds;
    }
  }
  

}
