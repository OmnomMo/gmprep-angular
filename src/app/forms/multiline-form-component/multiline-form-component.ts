import { Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KeyboardEvents } from '../../utils/keyboard-events';

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
	editing = signal<boolean>(false);


	constructor(keyboardEvents : KeyboardEvents) {
		keyboardEvents.keyboardEvent$.subscribe({
			next: e => {
				if (this.editing() && e.key == 'Enter' && e.getModifierState('Shift')) {
					this.stopEditing()
				}
			}
		})
	}

	startEditing() {
		this.editing.set(true);
	}

	stopEditing() {
		this.editing.set(false);
	}
}
