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
	dragging: boolean = false;

	constructor(
		private mapService: MapService,
	) { }

	mouseDown() {
		this.dragging = true;
	}

	mouseUp() {
		this.dragging = false;
	}

	mouseLeave() {
		if (this.dragging) {
			console.log("drag started");
			this.dragging = false;
			this.mapService.startDragNode(this.node());
		}
	}

	clicked() {
		this.dragging = false;
		this.mapService.setSelectedNode(this.node());
	}


}
