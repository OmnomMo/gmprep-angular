import { Component,  input, output, signal } from '@angular/core';
import { FormGroup,  ReactiveFormsModule } from '@angular/forms';
import { UserEvents } from '../../utils/user-events';
import { FormBase } from '../form-base';

@Component({
	selector: 'app-name-form-component',
	imports: [ReactiveFormsModule],
	templateUrl: './name-form-component.html',
	styleUrl: './name-form-component.css',
})
export class NameFormComponent extends FormBase{
	label = input.required<string>();
	header = input<boolean>(false);

	getValue() : string {
		return this.formGroup().controls[this.controlName()].value;
	}

	getDisplayClass() : string {
		if (this.header()) {
			return "header";
		}
		return "";
	}
}


