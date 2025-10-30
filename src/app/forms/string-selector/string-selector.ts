import { Component, input, ViewChild, viewChild } from '@angular/core';
import { FormBase } from '../form-base';
import { ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-string-selector',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './string-selector.html',
  styleUrl: './string-selector.css'
})
export class StringSelector extends FormBase{
	options = input.required<string[]>();
	selected = input.required<string>();

	@ViewChild('stringSelect') stringSelect : HTMLSelectElement | undefined;


	onSelected(e : Event) {


		console.log("SELECTED OPTION: ")
		console.log(this.formGroup().get(this.controlName())?.value);
		console.log(this.formGroup());
		var inputEvent = e as InputEvent;
		var target = inputEvent.target! as HTMLInputElement;

		this.formGroup().patchValue({
			[this.controlName()]: target.value,
		})

		this.stopEditing();
		this.onChange.emit();
	}
}
