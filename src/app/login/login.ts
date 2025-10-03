import { Component } from '@angular/core';
import { GoogleSignInComponent } from "../google-sign-in/google-sign-in";

@Component({
  selector: 'app-login',
  imports: [GoogleSignInComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
