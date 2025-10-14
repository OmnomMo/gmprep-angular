import { Component, input } from '@angular/core';
import { MapNode } from '../../models/map-node';

@Component({
  selector: 'app-map-icon',
  imports: [],
  templateUrl: './map-icon.html',
  styleUrl: './map-icon.css'
})
export class MapIcon {
	node = input.required<MapNode>();
}
