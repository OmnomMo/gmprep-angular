import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiline-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './multiline-form-component.html',
  styleUrl: './multiline-form-component.css'
})
export class MultilineFormComponent {
	label = input.required<string>();
	controlName = input.required<string>();
	formGroup = input.required<FormGroup>();
}
