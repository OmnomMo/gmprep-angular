import { Component, output } from '@angular/core';
import { FormBase } from '../form-base';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StringSelector } from "../string-selector/string-selector";
import { InlineNameForm } from "../inline-name-form/inline-name-form";
import { MultilineFormComponent } from "../multiline-form-component/multiline-form-component";
import { GmNodeOptions } from '../../utils/gm-node-options';

@Component({
  selector: 'app-secret-form',
  imports: [StringSelector, InlineNameForm, MultilineFormComponent, ReactiveFormsModule],
  templateUrl: './secret-form.html',
  styleUrl: './secret-form.css'
})
export class SecretForm extends FormBase{

	constructor(protected nodeOptions : GmNodeOptions) {
		super();
	}

	onDelete = output<FormGroup>();
}
