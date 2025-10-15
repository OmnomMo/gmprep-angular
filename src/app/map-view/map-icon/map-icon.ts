import { Component, input } from '@angular/core';
import { GmNode, MapNode } from '../../models/map-node';

@Component({
  selector: 'app-map-icon',
  imports: [],
  templateUrl: './map-icon.html',
  styleUrl: './map-icon.css'
})
export class MapIcon {
	node = input.required<MapNode>();
	widthFactor = input<number>(1);

	getSize(): number {
		return parseFloat(this.node().node.mapIconSize) * this.widthFactor();
	}
}
