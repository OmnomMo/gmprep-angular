import { Component, OnDestroy, signal, Signal } from '@angular/core';
import { MapBackground } from "./map-background/map-background";
import { AuthService } from '../auth';
import { CampaignService } from '../campaign-service';
import { NodeService } from '../node-service';
import { GmNode, MapNode } from '../models/map-node';
import { toSignal } from '@angular/core/rxjs-interop';
import { NodeIcon } from './node-icon/node-icon';
import { DraggedNode } from "./dragged-node/dragged-node";
import { MapService } from '../map-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [MapBackground, NodeIcon, DraggedNode],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css'
})
export class MapView implements OnDestroy{

	nodes : Signal<GmNode[] | undefined> 
	draggedNode = signal<GmNode | null>(null);

	nodeDroppedSubscription : Subscription

	constructor(
		private auth : AuthService,
		private campaignService : CampaignService,
		private mapService: MapService,
		private nodeService : NodeService,
	) {
		this.nodes = toSignal(nodeService.nodes$);

		this.nodeDroppedSubscription = mapService.mapNodeDropped$.subscribe({
			next: () => {
				this.draggedNode.set(null);
			}
		})
	}

	ngOnDestroy(): void {
		this.nodeDroppedSubscription.unsubscribe();
	}

	onDragStarted(node : GmNode) {
		this.draggedNode.set(node);
	}

}
