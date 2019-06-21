import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder,
    private router: Router, 
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if(this.authService.currentUserValue){
      this.router.navigate(['/dashboard']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }

    let user = this.authService.login(this.f.username.value, this.f.password.value);
    if(!user){
      console.log("Invalid User");
    }else{
      this.router.navigate(['/dashboard']);
    }
  }
}
