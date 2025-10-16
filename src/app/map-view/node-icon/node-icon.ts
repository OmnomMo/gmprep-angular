import { Component, input, output } from '@angular/core';
import { GmNode } from '../../models/map-node';
import { MapService } from '../../map-service';

@Component({
  selector: 'app-node-icon',
  imports: [],
  templateUrl: './node-icon.html',
  styleUrl: './node-icon.css'
})
export class NodeIcon {
	node = input.required<GmNode>();

	constructor(
		private mapService: MapService,
	) {}

	mouseDown() {
		console.log("drag started");
		this.mapService.startDragNode(this.node());
	}
}
