import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {first} from "rxjs/operators";

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
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      console.log('invalid form:' + this.findInvalidControls());
      return;
    }
    this.authService.login(this.f.username.value, this.f.password.value).pipe(first()).subscribe(user => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.log('AUTH ERROR');
      });

  }
}
