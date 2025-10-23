import { Component, input, output, signal } from '@angular/core';
import { GmNode } from '../../models/map-node';
import defaultIcons from './DefaultIcons.json'
import { SelectableIcon } from './selectable-icon/selectable-icon';

@Component({
  selector: 'app-icon-selector',
  imports: [SelectableIcon],
  templateUrl: './icon-selector.html',
  styleUrl: './icon-selector.css'
})
export class IconSelector {

	onSelected = output<{iconPath : string, iconSize : string}>();
	onClosed = output<void>();

	node = input.required<GmNode>();
	selectedIcon = signal<string>("");
	selectedSize = signal<string>("");

	defaultIconData = signal<IconData[]>([]);

	constructor() {
		this.defaultIconData.set(defaultIcons as unknown as IconData[]);
	}

	closeSelector(e: PointerEvent) {
		e.stopPropagation();
		this.onClosed.emit();
	}

	onIconSelected(icon : string) {
		this.selectedIcon.set(icon);
	}

	submit(e: PointerEvent) {
		e.stopPropagation();
		//if user selectes icon/size, return newly selected ones. Else return previously set ones.
		var icon = this.selectedIcon() != "" ? this.selectedIcon() : this.node().mapIconPath;
		var size = this.selectedSize() != "" ? this.selectedSize() : this.node().mapIconSize; 
		this.onSelected.emit({iconPath: icon, iconSize: size});
	}
}

type IconData = {
	Name: string,
	Tags: string[],
}

