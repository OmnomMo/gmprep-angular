import { Component, input, output } from '@angular/core';
import { GmNode } from '../../models/map-node';

@Component({
  selector: 'app-node-icon',
  imports: [],
  templateUrl: './node-icon.html',
  styleUrl: './node-icon.css'
})
export class NodeIcon {
	node = input.required<GmNode>();
	onDragStarted = output<GmNode>();

	mouseDown() {
		console.log("drag started");
		this.onDragStarted.emit(this.node());
	}
}
