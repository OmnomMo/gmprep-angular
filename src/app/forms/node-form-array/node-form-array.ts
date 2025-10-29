import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, input, output, signal, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-node-form-array',
  templateUrl: './node-form-array.html',
  styleUrl: './node-form-array.css',
})
export class NodeFormArray {
	testLabels = signal<string[]>(["a", "b", "c"]);

	formArray = input.required<FormArray>();
	label = input<string>("");
	defaultControls = input.required<{}>();
	onChange = output<void>();

	private formBuilder = inject(FormBuilder);

	addEntry() {
		this.formArray().push(this.formBuilder.group(this.defaultControls()));
		this.onChange.emit();
	}
}
