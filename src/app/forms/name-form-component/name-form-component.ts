import { Component,  input, signal } from '@angular/core';
import { FormGroup,  ReactiveFormsModule } from '@angular/forms';
import { KeyboardEvents } from '../../utils/keyboard-events';

@Component({
	selector: 'app-name-form-component',
	imports: [ReactiveFormsModule],
	templateUrl: './name-form-component.html',
	styleUrl: './name-form-component.css',
})
export class NameFormComponent {
	label = input.required<string>();
	controlName = input.required<string>();
	formGroup = input.required<FormGroup>();
	editing = signal<boolean>(false);

	onKeyDown(e: KeyboardEvent){
		console.log(e);
	}

	constructor(keyboardEvents : KeyboardEvents) {
		keyboardEvents.keyboardEvent$.subscribe({
			next: e => {
				if (this.editing() && e.key == 'Enter') {
					this.stopEditing();
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


