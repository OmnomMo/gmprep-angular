import { Component } from '@angular/core';
import { FormBase } from '../form-base';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movement-form',
  imports: [ReactiveFormsModule],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css',
})
export class MovementForm extends FormBase {
	showSwimming() : boolean {
		var swimSpeed : number = +this.formGroup().get("speedSwimming")?.value;
		return (swimSpeed > 0);
	}

	showFlying() : boolean {
		var flySpeed : number = +this.formGroup().get("speedFlying")?.value;
		return (flySpeed > 0);
	}
}
