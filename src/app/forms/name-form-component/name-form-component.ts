import { Component, forwardRef, input } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CampaignSelection } from '../../campaignselection/campaignselection';

@Component({
  selector: 'app-name-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './name-form-component.html',
  styleUrl: './name-form-component.css',
})
export class NameFormComponent {
	label = input.required<string>();
	controlName = input.required<string>();
	formGroup = input.required<FormGroup>();

	click() {
		console.log(this.formGroup().value);
	}
}
