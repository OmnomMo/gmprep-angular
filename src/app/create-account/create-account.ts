import { Component, inject, signal } from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { debounceTime, first, map, Observable, switchMap, timer } from 'rxjs';
import CustomValidators from '../utils/custom-validators';
import { PasswordValidationMessages } from "./password-validation-messages/password-validation-messages";

@Component({
	selector: 'app-create-account',
	imports: [ReactiveFormsModule, PasswordValidationMessages],
	templateUrl: './create-account.html',
	styleUrl: './create-account.css',
})
export class CreateAccount {
	formBuilder = inject(FormBuilder);
	auth = inject(AuthService);
	router = inject(Router);
	customValidators = inject(CustomValidators);

	creatingAccount = signal<boolean>(false);

	createAccountForm: FormGroup = this.formBuilder.group(
		{
			email: [
				'',
				{
					validators: [Validators.required, Validators.email],
					asyncValidators: [this.customValidators.emailTakenValidator()],
					updateOn: 'change',
				},
			],
			password: [
				'',
				[Validators.minLength(6), this.customValidators.passwordPatternValidator()],
			],
			passwordRep: [''],
		},
		{
			validator: this.customValidators.passwordRepeatValidator(),
		},
	);

	getPasswordControl(): FormControl {
		return this.createAccountForm.get('password')! as FormControl;
	}

	onCreateAccountSubmit() {
		this.auth.createAccount(this.createAccountForm.value);
		this.creatingAccount.set(true);

		var _self = this;
		this.auth.user$.subscribe({
			next: (user) => {
				if (user != null) {
					_self.router.navigate(['/campaignselection']);
				}
			},
			error: (e) => {
				alert(e);
				_self.router.navigate(['/createaccount']);
			},
		});

		this.auth.authError$.subscribe({
			next: (e) => {
				console.error(e);
				var error: object = e.error.errors;

				alert('Error creating account: ' + Object.keys(error)[0]);
				this.creatingAccount.set(false);
			},
		});
	}
}
