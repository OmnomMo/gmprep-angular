import { Component, inject, input, output, signal } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { UserEvents } from "../utils/user-events";

@Component({
	template: "",
})
export class FormBase {
	controlName = input.required<string>();
	formGroup = input.required<FormGroup>();
	onChange = output<void>();
	editing = signal<boolean>(false);

	userEvents = inject(UserEvents);
	
	constructor() {
		console.log("Form Base constructor called.");
		this.userEvents.keyboardEvent$.subscribe({
			next: e => {
				if (this.editing() && e.key == 'Enter' && !e.getModifierState('Shift')) {
					this.stopEditing();
				}
			}
		});
		this.userEvents.nodeFormEditingStartEvent$.subscribe({
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

	toggleEditing() {
		if(!this.editing()) {
			this.startEditing();
		} else{
			this.stopEditing();
		}
	}

}