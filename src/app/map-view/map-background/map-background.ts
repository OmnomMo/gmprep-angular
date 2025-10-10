import { Component, Signal, signal } from '@angular/core';
import { CampaignService } from '../../campaign-service';
import { MapService } from '../../map-service';
import { AuthService } from '../../auth';
import { Router } from '@angular/router';
import { GMMap } from '../../models/map';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-map-background',
  imports: [],
  templateUrl: './map-background.html',
  styleUrl: './map-background.css'
})
export class MapBackground {

	selectedMap : Signal<GMMap | null | undefined>
	xOffset = signal<number>(0);
	yOffset = signal<number>(0);

	mouseDown : boolean = false;
	mouseStartX : number = 0;
	mouseStartY : number = 0;
	

	constructor(
		private campaignService : CampaignService,
		private mapService : MapService,
		private auth : AuthService,
		private router : Router) {
		
		this.selectedMap = toSignal(mapService.selectedMap$);
	}

	onMouseDown(e : MouseEvent) {
		this.mouseDown = true;
		this.mouseStartX = e.clientX;
		this.mouseStartY = e.clientY;

		console.log("mouse down!");
	}

	onMouseUp(e: MouseEvent) {
		if (!this.mouseDown) {
			return;
		}

		this.mouseDown = false;

	}

	onMouseMove(e: MouseEvent) {
		if (!this.mouseDown) {
			return;
		}

		var offsetX : number = e.clientX - this.mouseStartX;
		var offsetY : number = e.clientY - this.mouseStartY;

		console.log(`Mouse offset : ${offsetX}|${offsetY}`)
	}
}
