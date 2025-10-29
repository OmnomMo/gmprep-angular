import { Component, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormBase } from '../form-base';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-string-selector',
  imports: [],
  templateUrl: './multi-string-selector.html',
  styleUrl: './multi-string-selector.css'
})
export class MultiStringSelector extends FormBase implements OnChanges{
	options = input.required<string[]>();
	label = input<string>("");

	selectedStrings = signal<Set<string>>(new Set<string>());

	ngOnChanges(changes: SimpleChanges): void {
		this.initializeFromFormControl();
	}

	toggleOption(option : string) {
		if (this.selectedStrings().has(option)) {
			this.selectedStrings().delete(option);
		} else {
			this.selectedStrings().add(option);
		}
	}

	getOptionButtonClass(option: string) : string {
		if (!this.selectedStrings().has(option)) {
			return "multiStringButton"
		} else {
			return "multiStringButton active"
		}
	}

	override startEditing(): void {
		if (this.editing()) {
			return;
		}
		this.initializeFromFormControl();
		super.startEditing();
	}

	initializeFromFormControl() {
		var control : FormControl = this.formGroup().get(this.controlName()) as FormControl;
		var selected : string[];
		if (control.value == null || control.value == "") {
			selected = [];
		} else {
			selected = control.value as string[];
		}
		this.selectedStrings.set(new Set<string>(selected));
	}

	override stopEditing(): void {
		this.updateFormControl();
		super.stopEditing();
	}

	updateFormControl() {
		var control : FormControl = this.formGroup().get(this.controlName()) as FormControl;
		control.setValue(Array.from(this.selectedStrings()));
	}
}
