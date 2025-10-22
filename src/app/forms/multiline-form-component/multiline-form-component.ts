import { Component, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserEvents } from '../../utils/user-events';

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
	onChange = output<void>();
	editing = signal<boolean>(false);


	constructor(
		private userEvents : UserEvents,
	) {
		userEvents.keyboardEvent$.subscribe({
			next: e => {
				if (this.editing() && e.key == 'Enter' && e.getModifierState('Shift')) {
					this.stopEditing()
				}
			}
		});
		userEvents.nodeFormEditingStartEvent$.subscribe({
			next: controlName => {
				if (controlName != this.controlName()) {
					this.stopEditing()
				}
			}
		})
	}

	startEditing() {
		if (this.editing()) {
			return;
		}
		this.userEvents.fireNodeFormEditingStartEvent(this.controlName());
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
