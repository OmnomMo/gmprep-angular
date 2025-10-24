import { Component, input } from '@angular/core';
import { FormBase } from '../form-base';

@Component({
  selector: 'app-string-selector',
  imports: [],
  templateUrl: './string-selector.html',
  styleUrl: './string-selector.css'
})
export class StringSelector extends FormBase{
	options = input.required<string[]>();
	selected = input.required<string>();

	onSelected(e : Event) {
		var inputEvent = e as InputEvent;
		var target = inputEvent.target! as HTMLInputElement;

		this.formGroup().patchValue({
			[this.controlName()]: target.value,
		})

		this.editing.set(false);
		this.onChange.emit();
	}
}
