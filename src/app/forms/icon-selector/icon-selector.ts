import { Component, input, output, signal } from '@angular/core';
import { GmNode } from '../../models/map-node';
import defaultIcons from './DefaultIcons.json'
import { SelectableIcon } from './selectable-icon/selectable-icon';
import { MapService } from '../../map-service';

@Component({
  selector: 'app-icon-selector',
  imports: [SelectableIcon],
  templateUrl: './icon-selector.html',
  styleUrl: './icon-selector.css'
})
export class IconSelector {

	onSelected = output<{iconPath : string, iconSize : string}>();
	onClosed = output<void>();

	iconPath = input.required<string>();
	iconSize = input.required<string>();
	selectedIcon = signal<string>("");
	selectedSize = signal<string>("");

	defaultIconData = signal<IconData[]>([]);
	visibleFilter = signal<string>("");

	constructor(private mapService : MapService) {
		this.defaultIconData.set(defaultIcons as unknown as IconData[]);
		mapService.selectedNode$.subscribe({
			next: () => {
				this.closeSelector(null);
			}
		})
	}

	getFilteredIcons() {
		if (this.visibleFilter() == "") {
			return this.defaultIconData();
		} else {
			return this.defaultIconData().filter(value => {return value.Tags.includes(this.visibleFilter())});
		}
	}

	setIconTagFilter(filter : string) {
		this.visibleFilter.set(filter);
	}

	getIsFilterSelectedClass(filter : string) : string {
		if (filter == this.visibleFilter()) {
			return "selected";
		} else {
			return "";
		}
	}

	closeSelector(e: PointerEvent | null) {
		e?.stopPropagation();
		this.onClosed.emit();
	}

	onIconSelected(icon : string) {
		this.selectedIcon.set(icon);
	}

	getSize() : string {
		if (this.selectedSize() != "") {
			return this.selectedSize();
		} else {
			return this.iconSize();
		}
	}

	setSize(e: Event) {
		var inputEvent : InputEvent = e as InputEvent;
		var inputElement : HTMLInputElement = inputEvent.target as HTMLInputElement;
		this.selectedSize.set(inputElement!.value);
	}

	submit(e: PointerEvent) {
		e.stopPropagation();
		//if user selectes icon/size, return newly selected ones. Else return previously set ones.
		var icon = this.selectedIcon() != "" ? this.selectedIcon() : this.iconPath();
		var size = this.selectedSize() != "" ? this.selectedSize() : this.iconSize(); 
		this.onSelected.emit({iconPath: icon, iconSize: size});
	}
}

type IconData = {
	Name: string,
	Tags: string[],
}

