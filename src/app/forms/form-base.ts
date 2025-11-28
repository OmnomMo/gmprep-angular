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
	alwaysEdit = input<boolean>(false);

	userEvents = inject(UserEvents);
	mapService = inject(MapService);

	getControlValue() : string {
		return this.formGroup().get(this.controlName())?.value;
	}

	setControlValue(newValue : string) {
		this.formGroup().get(this.controlName())!.setValue(newValue);
	}
}
