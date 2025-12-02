import { Component, effect, OnDestroy, signal, Signal } from '@angular/core';
import { MapBackground } from './map-background/map-background';
import { AuthService } from '../auth';
import { CampaignService } from '../campaign-service';
import { NodeService } from '../node-service';
import { GmNode, MapNode } from '../models/map-node';
import { toSignal } from '@angular/core/rxjs-interop';
import { NodeIcon } from './node-icon/node-icon';
import { DraggedNode } from './dragged-node/dragged-node';
import { MapService } from '../map-service';
import { Subscription } from 'rxjs';
import { Sidebar } from '../generic/sidebar/sidebar';
import { NodeView } from '../node-view/node-view';
import { NodeFilter, NodeFilterSettings } from "./node-filter/node-filter";
import { BestiaryWindow } from "../bestiary/bestiary-window/bestiary-window";

@Component({
	selector: 'app-map',
	imports: [MapBackground, NodeIcon, DraggedNode, Sidebar, NodeView, NodeFilter, BestiaryWindow],
	templateUrl: './map-view.html',
	styleUrl: './map-view.css',
})
export class MapView implements OnDestroy {
	nodes: Signal<GmNode[] | undefined>;
	selectedNode: Signal<GmNode | null | undefined>;
	showBestiary = signal<boolean>(false);
	draggedNode = signal<GmNode | null>(null);
	filteredNodes = signal<GmNode[] | undefined>(undefined);

	activeFilter : NodeFilterSettings | null = null;
	nodeDroppedSubscription: Subscription;
	nodeDraggedSubscription: Subscription;

	constructor(
		private auth: AuthService,
		private campaignService: CampaignService,
		private mapService: MapService,
		private nodeService: NodeService,
	) {
		this.nodes = toSignal(nodeService.nodes$);
		this.selectedNode = toSignal(mapService.getSelectedNodeObservable());

		this.nodeDroppedSubscription = mapService.mapNodeDropped$.subscribe({
			next: () => {
				this.draggedNode.set(null);
			},
		});
		this.nodeDraggedSubscription = mapService.mapNodeDragged$.subscribe({
			next: (node: GmNode) => {
				this.draggedNode.set(node);
			},
		});

		effect(() => {
			this.setActiveFilter(this.activeFilter);
		});
	}


	setActiveFilter(filter : NodeFilterSettings | null) {
		this.activeFilter = filter;
		if (filter == null || filter == undefined) {
			console.log("No node filter. all nodes visible")
			this.filteredNodes.set(this.nodes()!);
			return;
		}
		console.log("Applying node filter.")
		this.filteredNodes.set(filter!.applyFilters(this.nodes()!));
	}

	ngOnDestroy(): void {
		this.nodeDroppedSubscription.unsubscribe();
	}

	onDragStarted(node: GmNode) {
		this.draggedNode.set(node);
	}

	createNewNode() {

		this.nodeService.createNode(
			this.campaignService.getSelectedCampaign()!.id,
			new GmNode(0, "New Node"),
		);

	}

	onBestiaryClosed(selected: GmNode | null) {
		console.log(selected);
		this.showBestiary.set(false);
		if (selected != null) {
			this.nodeService.createNode(
				this.campaignService.getSelectedCampaign()!.id,
				selected!
			);
		}
	}
}
