import { Component, input, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GmNode } from '../../models/map-node';
import { IconSelector } from '../icon-selector/icon-selector';
import { FormBase } from '../form-base';

@Component({
  selector: 'app-portraiticon-form-component',
  imports: [IconSelector],
  templateUrl: './portraiticon-form-component.html',
  styleUrl: './portraiticon-form-component.css'
})
export class PortraiticonFormComponent extends FormBase{
	controlNameSize = input.required<string>();
	node = input.required<GmNode>();

	showSelector = signal<boolean>(false);

	onClick() {
		this.showSelector.set(true);
	}

	closeSelector() {
		this.showSelector.set(false);
	}

	onSelected(input : {iconPath: string, iconSize: string}) {
		this.showSelector.set(false);
		this.formGroup().patchValue({
			[this.controlName()]: input.iconPath,
			[this.controlNameSize()]: input.iconSize,
		});
		this.onChange.emit();
	}
}
