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
import { Sidebar } from "../generic/sidebar/sidebar";
import { NodeView } from "../node-view/node-view";

@Component({
  selector: 'app-map',
  imports: [MapBackground, NodeIcon, DraggedNode, Sidebar, NodeView],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css'
})
export class MapView implements OnDestroy{

	nodes : Signal<GmNode[] | undefined> 
	selectedNode : Signal<GmNode | null | undefined>
	draggedNode = signal<GmNode | null>(null);

	nodeDroppedSubscription : Subscription
	nodeDraggedSubscription : Subscription

	constructor(
		private auth : AuthService,
		private campaignService : CampaignService,
		private mapService: MapService,
		private nodeService : NodeService,
	) {
		this.nodes = toSignal(nodeService.nodes$);
		this.selectedNode = toSignal(mapService.getSelectedNode());

		this.nodeDroppedSubscription = mapService.mapNodeDropped$.subscribe({
			next: () => {
				this.draggedNode.set(null);
			}
		});
		this.nodeDraggedSubscription = mapService.mapNodeDragged$.subscribe({
			next: (node: GmNode) => {
				this.draggedNode.set(node)
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
