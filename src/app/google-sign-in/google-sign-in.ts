 import { Component, OnInit} from '@angular/core';

   declare const google: any;

   @Component({
     selector: 'app-google-sign-in',
     templateUrl: './google-sign-in.html',
     styleUrls: ['./google-sign-in.css']
   })
   export class GoogleSignInComponent implements OnInit {

     ngOnInit(): void {
       this.initializeGoogleSignIn();
     }

     initializeGoogleSignIn() {
       google.accounts.id.initialize({
         client_id: '22535597810-ml4s14qa3sq76doaohsjkf3r1vjpv1jo.apps.googleusercontent.com',
         callback: (response: any) => this.handleCredentialResponse(response)
       });

       google.accounts.id.renderButton(
         document.getElementById('google-signin-button'),
         { theme: 'outline', size: 'large' }  // customization attributes
       );

       google.accounts.id.prompt(); // also display the One Tap dialog
     }

     handleCredentialResponse(response: any) {
       // response.credential is the JWT token
       console.log('Encoded JWT ID token: ' + response.credential);

       // You can decode the JWT token here or send it to your backend for verification
       // For demonstration, we'll just log it

     }

   }