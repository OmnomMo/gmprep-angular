import { Component, inject } from '@angular/core';
import CustomValidators from '../utils/custom-validators';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidationMessages } from "../create-account/password-validation-messages/password-validation-messages";
import { AuthService } from '../auth';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, PasswordValidationMessages],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css'
})
export class EditUser {
	customValidators = inject(CustomValidators);
	formBuilder = inject(FormBuilder);
	auth = inject(AuthService);

	changePasswordForm = this.formBuilder.group({
		oldPassword: ['', [Validators.required]],
		password: ['', [Validators.required, this.customValidators.passwordPatternValidator()]],
		passwordRep: ['', [Validators.required]],
	}, {
		validator: this.customValidators.passwordRepeatValidator(),
	})

	getPasswordControl() : FormControl {
		return this.changePasswordForm.get('password') as FormControl;
	}

	getPasswordRepControl() : FormControl {
		return this.changePasswordForm.get('passwordRep')! as FormControl;
	}

	onUpdatePasswordSubmit() {
		var passwordData = {
			oldPassword: this.changePasswordForm.get('oldPassword')!.value,
			newPassword: this.getPasswordControl().value,
		};
		this.auth.updatePassword(passwordData).subscribe(
			error => {
				if (error == null) {
					alert("password change successful");
					this.changePasswordForm.reset();
				} else {
					alert("Error when changing password: " + error);
				}
			}
		);
	}

}
