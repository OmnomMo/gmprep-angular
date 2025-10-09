import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-imagelink-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './imagelink-form-component.html',
  styleUrl: './imagelink-form-component.css'
})
export class ImagelinkFormComponent {
	label = input.required<string>();
	controlName = input.required<string>();
	formGroup = input.required<FormGroup>();

}
