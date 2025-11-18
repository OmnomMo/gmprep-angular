import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-password-validation-messages',
  imports: [],
  templateUrl: './password-validation-messages.html',
  styleUrl: './password-validation-messages.css'
})
export class PasswordValidationMessages {
	passwordControl = input.required<FormControl>();
}
