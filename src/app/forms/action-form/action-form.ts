import { Component, input } from '@angular/core';
import { FormBase } from '../form-base';
import { NameFormComponent } from "../name-form-component/name-form-component";
import { MultilineFormComponent } from "../multiline-form-component/multiline-form-component";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-action-form',
  imports: [NameFormComponent, MultilineFormComponent],
  templateUrl: './action-form.html',
  styleUrl: './action-form.css'
})
export class ActionForm extends FormBase{
	nameFormControlName = input.required<string>();
	descriptionFormControlName = input.required<string>();
}
