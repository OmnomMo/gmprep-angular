import { Component, input, output } from '@angular/core';
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
	
	abilitiesMode = input<boolean>(false);

	constructor(
		protected nodeOptions : GmNodeOptions
	) {
		super();
	}

	getOptions() : string[] {
		if (this.abilitiesMode()){
			return this.nodeOptions.stats;
		} else {
			return this.nodeOptions.skills;
		}
	}

	getBonusFormId() {
		var skillName : string = this.formGroup().get(this.controlName())!.value;
		return this.controlName() + "bonus" + skillName;
	}
}
