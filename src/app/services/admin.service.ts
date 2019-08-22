import { Injectable } from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/User';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  //TODO: Protect this service for only admins -- add user priveleges 

  getUsers(){
    return this.http.get<User[]>('http://localhost:3000/admin/users').pipe(map(
      users => {
        if (users) {
          return users;
        }
      }
    ));
  }

  getUser(id: string){
    return this.http.get<User>('http://localhost:3000/users/' + id).pipe(map(
      user => {
        if(user){
          return user;
        }
      }
    ));
  }
}
