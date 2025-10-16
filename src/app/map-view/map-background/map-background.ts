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
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-map-background',
	imports: [MapIcon],
	templateUrl: './map-background.html',
	styleUrl: './map-background.css'
})
export class MapBackground implements OnDestroy {

	selectedMap: Signal<GMMap | null | undefined>;
	nodes: Signal<MapNode[] | undefined>;
	xOffset = signal<number>(0);
	yOffset = signal<number>(0);
	zoomPivotPositionX = signal<number>(0);
	zoomPivotPositionY = signal<number>(0);
	zoom = signal<number>(1);
	//factor between map width and window innerWidth
	widthFactor = signal<number>(1);
	mapMousePosX: number = 0;
	mapMousePosY: number = 0;

	mouseDown: boolean = false;
	mouseStartX: number = 0;
	mouseStartY: number = 0;
	xOffsetStart: number = 0;
	yOffsetStart: number = 0;
	mapWidth: number = 0;

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
		nodeService.requestNodes(auth.getUserToken(), campaignService.getSelectedCampaign()!.id)

		this.mapNodeDroppedSubscription = this.mapService.mapNodeDropped$.subscribe({
			next: info => { this.onMapNodeDropped(info); }
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

	onMapNodeDropped(info: NodeDropInfo) {

		var target: HTMLElement | null = info.e.target as HTMLElement;

		var targetX: number = this.mapMousePosX / this.widthFactor();
		var targetY: number = this.mapMousePosY / this.widthFactor();

		if (
			target.className == "mapIcon" ||
			target.className == "mapBackground") {
			var newMapNode: MapNode = new MapNode(0, info.node, targetX, targetY);
			this.mapService.createMapNode(this.auth.getUserToken(), this.mapService.getSelectedMap()!, newMapNode)
		}
	}

	//#endregion


	//#region HTML getters
	get imgSrc(): string {
		var src: string | undefined = this.selectedMap()?.externalImageUrl;
		if (src == undefined || src == "") {
			src = '/empty_map.jpg';
		}
		return src!;
	}
	getNodePositionStyle(mapNode: MapNode): string {
		var posX: number = mapNode.locationX * this.widthFactor();
		var posY: number = mapNode.locationY * this.widthFactor();
		posX -= parseFloat(mapNode.node.mapIconSize) / 2 * this.widthFactor();
		posY -= parseFloat(mapNode.node.mapIconSize) / 2 * this.widthFactor();
		return `left: ${posX}px; top: ${posY}px;`;
	}
	//#endregion



	//#region Mouseevents

	onMouseDown(e: MouseEvent) {
		this.mouseDown = true;
		this.mouseStartX = e.clientX;
		this.mouseStartY = e.clientY;
		this.xOffsetStart = this.xOffset();
		this.yOffsetStart = this.yOffset();

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
		var wheelEvent: WheelEvent = e as WheelEvent;
		//console.log(wheelEvent.deltaY);

		var newZoom = this.zoom();

		if (wheelEvent.deltaY < 0) {
			newZoom *= 1.15;
		} else {
			newZoom *= 0.8;
		}


		newZoom = Math.max(0.5, Math.min(newZoom, 5.0));
		//only adjust focus position if zooming in
		if (newZoom - this.zoom() > 0.02) {
			var target: Element = e!.target! as Element;
			var mapBackground: Element = target as Element;
			if (target.className != "mapBackground") {
				mapBackground = target.firstChild as Element;
			}
			this.zoomPivotPositionX.set(wheelEvent.clientX - mapBackground.clientWidth / 2);
			this.zoomPivotPositionY.set(wheelEvent.clientY - mapBackground.clientHeight / 2);
		}
		this.zoom.set(newZoom);
	}

	//#endregion
	//#region Utils
	computeWidthFactor() {

		this.widthFactor.set(window.innerWidth / this.mapWidth);
		console.log("Width factor set: " + this.widthFactor())
	}

	//#endregion
}
