import { Component, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserEvents } from '../../utils/user-events';
import { FormBase } from '../form-base';

@Component({
  selector: 'app-multiline-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './multiline-form-component.html',
  styleUrl: './multiline-form-component.css'
})
export class MultilineFormComponent extends FormBase {
	label = input.required<string>();
}
