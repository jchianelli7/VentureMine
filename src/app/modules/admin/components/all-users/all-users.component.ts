import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  @Input() users: User[];
  activeEditingUser: User;
  editingUser: boolean = false;

  constructor() { }

  ngOnInit() { 
  }

  editUser(id: string){
    console.log(id);
    var userToEdit = this.users.filter(function(user) {
      return String(user._id) === id;
    });

    if(userToEdit) {
      this.activeEditingUser = userToEdit[0];
      this.editingUser = true;
    }
    console.log(this.activeEditingUser);
  }

}
