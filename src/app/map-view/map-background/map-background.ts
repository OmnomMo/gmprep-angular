import { Component, HostListener, OnDestroy, Signal, signal } from '@angular/core';
import { CampaignService } from '../../campaign-service';
import { MapService, NodeDropInfo } from '../../map-service';
import { AuthService } from '../../auth';
import { Router } from '@angular/router';
import { GMMap } from '../../models/map';
import { toSignal } from '@angular/core/rxjs-interop';
import { NodeService } from '../../node-service';
import { GmNode, MapNode } from '../../models/map-node';
import { MapIcon } from '../map-icon/map-icon';
import { min, Subscription } from 'rxjs';
import { MapContext } from '../map-context/map-context';

@Component({
	selector: 'app-map-background',
	imports: [MapIcon, MapContext],
	templateUrl: './map-background.html',
	styleUrl: './map-background.css',
})
export class MapBackground implements OnDestroy {
	selectedMap: Signal<GMMap | null | undefined>;
	nodes: Signal<MapNode[] | undefined>;
	mapTransformStyle = signal<string>('');
	offsetX: number = 0;
	offsetY: number = 0;
	zoom: number = 1;
	//factor between map width and window innerWidth
	widthFactor = signal<number>(1);
	mapMousePosX: number = 0;
	mapMousePosY: number = 0;

	mouseDown: boolean = false;
	startX: number = 0;
	startY: number = 0;
	mapWidth: number = 0;

	showMapContext = signal<boolean>(false);
	contextPosX: number = 0;
	contextPosY: number = 0;

	mapNodeDroppedSubscription: Subscription;

	constructor(
		private campaignService: CampaignService,
		private mapService: MapService,
		private nodeService: NodeService,
		private auth: AuthService,
		private router: Router,
	) {
		this.selectedMap = toSignal(mapService.getSelectedMapObserver());
		this.nodes = toSignal(mapService.mapNodes$);
		nodeService.requestNodes(campaignService.getSelectedCampaign()!.id);

		this.mapNodeDroppedSubscription = this.mapService.mapNodeDropped$.subscribe({
			next: (info) => {
				this.onMapNodeDropped(info);
			},
		});
	}

	//#region Global Events

	ngOnDestroy(): void {
		this.mapNodeDroppedSubscription.unsubscribe();
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize(e: UIEvent) {
		this.computeWidthFactor();
	}

	onMapLoaded(e: Event) {
		var target: HTMLImageElement = e.currentTarget as HTMLImageElement;
		this.mapWidth = target.naturalWidth;
		this.computeWidthFactor();
	}

	mapContextClosed() {
		this.showMapContext.set(false);
	}

	emptyMapNodeAdded() {
		this.mapNodeAdded(new GmNode(0, 'New Node'));
	}

	mapNodeAdded(newNode: GmNode) {
		console.log('map node added');
		this.nodeService
			.createNode(this.campaignService.getSelectedCampaign()!.id, newNode)
			.subscribe((node) => {
				if (node != null) {
					this.mapService
						.createMapNode(
							this.mapService.getSelectedMap()!,
							new MapNode(
								0,
								node,
								this.mapMousePosX / this.widthFactor(),
								this.mapMousePosY / this.widthFactor(),
							),
						)
						.subscribe((mapNode) => {
							if (mapNode != null) {
								this.showMapContext.set(false);
							}
						});
				}
			});
	}

	onMapNodeDropped(info: NodeDropInfo) {
		var target: HTMLElement | null = info.e.target as HTMLElement;

		var targetX: number = this.mapMousePosX / this.widthFactor();
		var targetY: number = this.mapMousePosY / this.widthFactor();

		if (target.className == 'mapIcon' || target.className == 'mapBackground') {
			var newMapNode: MapNode = new MapNode(0, info.node, targetX, targetY);
			this.mapService.createMapNode(this.mapService.getSelectedMap()!, newMapNode);
		}
	}

	//#endregion

	//#region HTML getters
	get imgSrc(): string {
		var src: string | undefined = this.selectedMap()?.externalImageUrl;
		if (src == undefined || src == '') {
			src = '/empty_map.jpg';
		}
		return src!;
	}
	getNodePositionStyle(mapNode: MapNode): string {
		var posX: number = mapNode.locationX * this.widthFactor();
		var posY: number = mapNode.locationY * this.widthFactor();
		posX -= (parseFloat(mapNode.node.mapIconSize) / 2) * this.widthFactor();
		posY -= (parseFloat(mapNode.node.mapIconSize) / 2) * this.widthFactor();
		return `left: ${posX}px; top: ${posY}px;`;
	}
	//#endregion

	//#region Mouseevents

	onMouseDown(e: MouseEvent) {
		this.mouseDown = true;
		this.startX = e.clientX - this.offsetX;
		this.startY = e.clientY - this.offsetY;
		//console.log("mouse down!");
	}

	setLocalMapMousePos(e: MouseEvent) {
		this.mapMousePosX = e.offsetX;
		this.mapMousePosY = e.offsetY;
	}

	onMouseUp(e: MouseEvent) {
		if (!this.mouseDown) {
			return;
		}

		this.mouseDown = false;
		this.showMapContext.set(false);
	}

	onRightClick(e: PointerEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();
		this.contextPosX = this.mapMousePosX;
		this.contextPosY = this.mapMousePosY;
		this.showMapContext.set(true);
	}

	onMouseMove(e: MouseEvent) {
		//console.log(e);
		if (!this.mouseDown) {
			return;
		}
		this.offsetX = e.clientX - this.startX;
		this.offsetY = e.clientY - this.startY;
		this.setTransformStyle();
	}

	onMouseWheel(e: WheelEvent) {
		//on mousewheel we want to zoom in/out but also move the offset so the zoom happens around the mouse pointer
		//normalize the new offset with old zoom
		var xs = (e.clientX - this.offsetX) / this.zoom;
		var ys = (e.clientY - this.offsetY) / this.zoom;

		e.deltaY < 0 ? (this.zoom *= 1.1) : (this.zoom /= 1.1);
		this.zoom = Math.min(3, Math.max(this.zoom, 0.5));

		//apply offsets scaled with new zoom
		this.offsetX = e.clientX - xs * this.zoom;
		this.offsetY = e.clientY - ys * this.zoom;

		this.setTransformStyle();
	}

	setTransformStyle() {
		this.mapTransformStyle.set(
			`transform: translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoom});`,
		);
	}

	//#endregion
	//#region Utils
	computeWidthFactor() {
		this.widthFactor.set(window.innerWidth / this.mapWidth);
		console.log('Width factor set: ' + this.widthFactor());
	}

	//#endregion
}
