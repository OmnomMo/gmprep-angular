import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-map-context',
  imports: [],
  templateUrl: './map-context.html',
  styleUrl: './map-context.css'
})
export class MapContext {

	contextClosed = output<void>();
	mapNodeAdded = output<void>();


	posX = input.required<number>();
	posY = input.required<number>();

	getContainerPosStyle() : string {
		return `left:${this.posX()}px;top:${this.posY()}px;`
	}

}
