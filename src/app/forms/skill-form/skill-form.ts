import { Component, output } from '@angular/core';
import { StringSelector } from "../string-selector/string-selector";
import { NameFormComponent } from "../name-form-component/name-form-component";
import { FormBase } from '../form-base';
import { GmNodeOptions } from '../../utils/gm-node-options';
import { FormGroup } from '@angular/forms';
import { InlineNameForm } from "../inline-name-form/inline-name-form";

@Component({
  selector: 'app-skill-form',
  imports: [StringSelector, InlineNameForm],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.css'
})
export class SkillForm extends FormBase{

	onRemove = output<FormGroup>();

	constructor(
		protected nodeOptions : GmNodeOptions
	) {
		super();
	}

	getBonusFormId() {
		var skillName : string = this.formGroup().get('skillName')!.value;
		return "skillBonus" + skillName;
	}
}
