import { Component, ElementRef, inject, input, output, Renderer2, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserEvents } from '../utils/user-events';
import { MapService } from '../map-service';

@Component({
	template: '',
})
export class FormBase {
	controlName = input.required<string>();
	formGroup = input.required<FormGroup>();
	formId = input.required<string>();
	editMode = input<boolean>(true);
	onChange = output<void>();
	editing = signal<boolean>(false);

	userEvents = inject(UserEvents);
	mapService = inject(MapService);

	constructor() {
		this.userEvents.keyboardEvent$.subscribe({
			next: (e) => {
				if (this.editing() && e.key == 'Enter' && !e.getModifierState('Shift')) {
					this.stopEditing();
				}
			},
		});
		this.userEvents.nodeFormEditingStartEvent$.subscribe({
			next: (formId) => {
				if (formId != this.formId()) {
					this.stopEditing();
				}
			},
		});
		this.userEvents.editMode$.subscribe({
			next: (inEditMode) => {
				if (!inEditMode) {
					this.stopEditing();
				}
			},
		});
		this.mapService.selectedNode$.subscribe({
			next: (selectedNode) => {
				if (this.editing()) {
					this.stopEditing();
				}
			},
		});
	}
	startEditing() {
		if (!this.editMode()) {
			return;
		}
		this.userEvents.fireNodeFormEditingStartEvent(this.formId());
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
		if (!this.editing()) {
			this.startEditing();
		} else {
			this.stopEditing();
		}
	}
}
