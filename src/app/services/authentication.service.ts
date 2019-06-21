import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';
import { USERS } from '../USERS';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    for(let x = 0; x < USERS.length; x++){
      if (USERS[x].username === username && USERS[x].password === password) {
        localStorage.setItem('currentUser', JSON.stringify(USERS[x]));
        this.currentUserSubject.next(USERS[x]);
        return USERS[x];
      }
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
