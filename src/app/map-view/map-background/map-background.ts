import { Component, Signal, signal } from '@angular/core';
import { CampaignService } from '../../campaign-service';
import { MapService } from '../../map-service';
import { AuthService } from '../../auth';
import { Router } from '@angular/router';
import { GMMap } from '../../models/map';
import { toSignal } from '@angular/core/rxjs-interop';
import { NodeService } from '../../node-service';
import { MapNode } from '../../models/map-node';

@Component({
  selector: 'app-map-background',
  imports: [],
  templateUrl: './map-background.html',
  styleUrl: './map-background.css'
})
export class MapBackground {

	selectedMap : Signal<GMMap | null | undefined>;
	nodes : Signal<MapNode[] | undefined>;
	xOffset = signal<number>(0);
	yOffset = signal<number>(0);
	zoomPivotPositionX = signal<number>(0);
	zoomPivotPositionY = signal<number>(0);
	zoom = signal<number>(1);

	mouseDown : boolean = false;
	mouseStartX : number = 0;
	mouseStartY : number = 0;
	xOffsetStart : number = 0;
	yOffsetStart : number = 0;
	

	constructor(
		private campaignService : CampaignService,
		private mapService : MapService,
		private nodeService : NodeService,
		private auth : AuthService,
		private router : Router) {
		
		this.selectedMap = toSignal(mapService.selectedMap$);
		this.nodes = toSignal(nodeService.nodes$);
		nodeService.requestNodes(auth.getUserToken(), campaignService.getSelectedCampaign()!.id)


	}

	onMouseDown(e : MouseEvent) {
		this.mouseDown = true;
		this.mouseStartX = e.clientX;
		this.mouseStartY = e.clientY;
		this.xOffsetStart = this.xOffset();
		this.yOffsetStart = this.yOffset();

		//console.log("mouse down!");
	}

	onMouseUp(e: MouseEvent) {
		if (!this.mouseDown) {
			return;
		}

		this.mouseDown = false;

	}

	onMouseMove(e: MouseEvent) {
		//console.log(e);
		if (!this.mouseDown) {
			return;
		}

		this.xOffset.set(this.xOffsetStart + (e.clientX - this.mouseStartX) / this.zoom());
		this.yOffset.set(this.yOffsetStart + (e.clientY - this.mouseStartY) / this.zoom());

		//console.log(`Mouse offset : ${this.xOffset}|${this.yOffset}`)
	}

	onMouseWheel(e: Event) {


		var wheelEvent : WheelEvent = e as WheelEvent;
		//console.log(wheelEvent.deltaY);


		var newZoom = this.zoom();

		if (wheelEvent.deltaY < 0) {
			newZoom *= 1.15;
		} else {
			newZoom *= 0.8;
		}


		newZoom = Math.max(1.0, Math.min(newZoom, 5.0));
		//only adjust focus position if zooming in
		if (newZoom - this.zoom() > 0.02) {
			var target : Element = e!.target! as Element;
			var child : Element = target.firstChild as Element;
			this.zoomPivotPositionX.set(wheelEvent.clientX - child.clientWidth / 2);
			this.zoomPivotPositionY.set(wheelEvent.clientY - child.clientHeight / 2);
		}
		this.zoom.set(newZoom);
	}
}
