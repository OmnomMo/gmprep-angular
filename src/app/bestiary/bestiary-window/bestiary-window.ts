import { Component, inject, output } from '@angular/core';
import { Bestiary } from '../bestiary';
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { GmNode } from '../../models/map-node';

@Component({
	selector: 'app-bestiary-window',
	imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
	templateUrl: './bestiary-window.html',
	styleUrl: './bestiary-window.css',
})
export class BestiaryWindow {
	bestiary = inject(Bestiary);
	formBuilder = inject(FormBuilder);

	closeBestiary = output<GmNode | null>();

	filterForm = this.formBuilder.group({
		filter: [''],
	});

	getFilteredEntries(): GmNode[] {
		var searchString: string = this.filterForm.get('filter')!.value ?? "";
		return this.bestiary.beasts.filter((b) =>
			b.name.toLowerCase().includes(searchString.toLowerCase()),
		
		);
	}
}
