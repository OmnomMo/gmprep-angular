import { Component, signal, Signal } from '@angular/core';
import { MapBackground } from "./map-background/map-background";
import { AuthService } from '../auth';
import { CampaignService } from '../campaign-service';
import { NodeService } from '../node-service';
import { GmNode } from '../models/map-node';
import { toSignal } from '@angular/core/rxjs-interop';
import { NodeIcon } from './node-icon/node-icon';
import { DraggedNode } from "./dragged-node/dragged-node";

@Component({
  selector: 'app-map',
  imports: [MapBackground, NodeIcon, DraggedNode],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css'
})
export class MapView {

	nodes : Signal<GmNode[] | undefined> 
	draggedNode = signal<GmNode | null>(null);


	constructor(
		private auth : AuthService,
		private campaignService : CampaignService,
		private nodeService : NodeService,
	) {
		this.nodes = toSignal(nodeService.nodes$);
	}

	onDragStarted(node : GmNode) {
		this.draggedNode.set(node);
	}

	onDragStopped(e : MouseEvent) {
		console.log(e);
		this.draggedNode.set(null);
	}


}
