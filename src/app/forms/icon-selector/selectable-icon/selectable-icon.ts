import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-selectable-icon',
  imports: [],
  templateUrl: './selectable-icon.html',
  styleUrl: './selectable-icon.css'
})
export class SelectableIcon implements OnChanges{
	icon = input.required<string>();
	selectedIcon = input<string>("");
	onSelected = output<string>();

	selected = signal<boolean>(false);

	onSelect() {
		this.selected.set(true);
		this.onSelected.emit(this.icon());
	}

	getClass() : string {
		if (this.selected()) {
			return "selectableIcon selected";
		} else {
			return "selectableIcon";
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.selectedIcon() != this.icon()) {
			this.selected.set(false);
		}
	}
}
