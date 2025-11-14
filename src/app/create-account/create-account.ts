import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccount {

	formBuilder = inject(FormBuilder);
	auth = inject(AuthService);

	createAccountForm : FormGroup = this.formBuilder.group({
		userName: ["", Validators.required],
		email: ["", [Validators.required, Validators.email]],
		password: ["", [Validators.required, Validators.minLength(6)]],
	});

	onCreateAccountSubmit() {
		this.auth.createAccount(this.createAccountForm.value);
	};
}
