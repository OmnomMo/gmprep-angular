import { Component, input, Input } from '@angular/core';
import { FormBase } from '../form-base';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-name-form',
  imports: [ReactiveFormsModule],
  templateUrl: './inline-name-form.html',
  styleUrl: './inline-name-form.css'
})
export class InlineNameForm extends FormBase{
	overrideEdit = input<boolean>(false);
}
