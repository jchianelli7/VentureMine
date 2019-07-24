import { Component} from '@angular/core';
import { User } from './models/User';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VentureMine';
  currentUser: User;

 constructor(private authService: AuthenticationService, private router: Router){
   this.authService.currentUser.subscribe(user => this.currentUser = user);
   if(!this.currentUser){
     console.log("No Valid Active User");
     this.router.navigate(['/login']);
   }else{
     this.router.navigate(['/dashboard']);
   }
 }

 logout(){
   this.authService.logout();
   this.router.navigate(['/login']); 
 }
}
