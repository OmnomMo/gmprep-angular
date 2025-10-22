import { Component,  input, output, signal } from '@angular/core';
import { FormGroup,  ReactiveFormsModule } from '@angular/forms';
import { UserEvents } from '../../utils/user-events';

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
	onChange = output<void>();
	editing = signal<boolean>(false);

	onKeyDown(e: KeyboardEvent){
		console.log(e);
	}

	constructor(private userEvents : UserEvents) {
		userEvents.keyboardEvent$.subscribe({
			next: e => {
				if (this.editing() && e.key == 'Enter') {
					this.stopEditing();
				}
			}
		});
		userEvents.nodeFormEditingStartEvent$.subscribe({
			next: controlName => {
				if (controlName != this.controlName()) {
					this.stopEditing();
				}
			}
		})
	}

	startEditing() {
		this.userEvents.fireNodeFormEditingStartEvent(this.controlName())
		this.editing.set(true);
	}

	stopEditing() {
		if (!this.editing()) {
			return;
		}
		this.onChange?.emit();
		this.editing.set(false);
	}
}


