import { Component, input } from '@angular/core';
import { GmNode, MapNode } from '../../models/map-node';
import { AuthService } from '../../auth';
import { MapService } from '../../map-service';
import { NodeService } from '../../node-service';

@Component({
  selector: 'app-map-icon',
  imports: [],
  templateUrl: './map-icon.html',
  styleUrl: './map-icon.css'
})
export class MapIcon {
	node = input.required<MapNode>();
	widthFactor = input<number>(1);

	mousePressed: boolean = false;

	constructor(
		private auth: AuthService,
		private mapService: MapService,
	) {
	}

	getSize(): number {
		return parseFloat(this.node().node.mapIconSize) * this.widthFactor();
	}

	onMouseDown(e: MouseEvent) {
		e.stopPropagation();
		this.mousePressed = true;
	}

	onClicked(e: MouseEvent) {
		this.mapService.setSelectedNode(this.node().node);
	}

	onMouseLeave(e: MouseEvent) {
		if (!this.mousePressed) {
			return;
		}
		this.mapService.startDragMapNode(this.node());
		this.mousePressed = false;
	}

	onMouseUp(e: MouseEvent) {
		this.mousePressed = false;
	}

}
