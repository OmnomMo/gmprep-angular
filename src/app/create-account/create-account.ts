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

@Component({
	selector: 'app-create-account',
	imports: [ReactiveFormsModule],
	templateUrl: './create-account.html',
	styleUrl: './create-account.css',
})
export class CreateAccount {
	formBuilder = inject(FormBuilder);
	auth = inject(AuthService);
	router = inject(Router);

	creatingAccount = signal<boolean>(false);

	createAccountForm: FormGroup = this.formBuilder.group(
		{
			email: [
				'',
				{
					validators: [Validators.required, Validators.email],
					asyncValidators: [this.emailTakenValidator()],
					updateOn: 'change',
				},
			],
			password: ['', [Validators.minLength(6), this.passwordPatternValidator()]],
			passwordRep: [''],
		},
		{
			validator: this.passwordRepeatValidator(),
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

	//returns a validator function used to evaluate password pattern
	//returns an error object with more information about which pattern is missing
	//if it fails
	passwordPatternValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const uppercaseRe: RegExp = new RegExp('.*[A-Z].*');
			const uppercase: boolean = uppercaseRe.test(control.value);

			const lowerCaseRe: RegExp = new RegExp('.*[a-z].*');
			const lowercase: boolean = lowerCaseRe.test(control.value);

			const numberRe: RegExp = new RegExp('.*[\\d],*');
			const number: boolean = numberRe.test(control.value);

			const specialRe: RegExp = new RegExp('.*[^\\w :;].*');
			const special: boolean = specialRe.test(control.value);

			//no password errors
			if (uppercase && lowercase && number && special) {
				return null;
			}

			var errors: any = { patternMatch: { value: control.value } };
			if (!uppercase) {
				errors.noUpperCase = { value: control.value };
			}
			if (!lowercase) {
				errors.noLowerCase = { value: control.value };
			}
			if (!number) {
				errors.noNumber = { value: control.value };
			}
			if (!special) {
				errors.noSpecial = { value: control.value };
			}

			return errors;
		};
	}

	passwordRepeatValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			var password: string = control.get('password')!.value;
			var passwordRep: string = control.get('passwordRep')!.value;

			return password === passwordRep ? null : { passwordMatchError: {} };
		};
	}

	emailTakenValidator(): AsyncValidatorFn {
		var auth: AuthService = this.auth;
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			//debounce input
			return timer(1000).pipe(
				//runs the inner observable when timer is done
				switchMap(() => {
					//map boolean observable to async validation error observable
					return auth.isEmailTaken(control.value).pipe(
						map((isTaken) => (isTaken ? { uniqueEmail: true } : null)),
						first(),
					);
				}),
			);
		};
	}
}
