import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  @Input() user: User;
  editUserForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log("init edit user");
    const me = this;
    this.editUserForm = this.formBuilder.group({
      firstName: [me.user.firstName],
      lastName: [me.user.lastName],
      email: [me.user.email]
    });
  }

}
