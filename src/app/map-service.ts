import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { GMMap } from './models/map';
import { AuthService } from './auth';
import { CampaignService } from './campaign-service';
import { GMUser } from './models/user';
import { Campaign } from './models/campaign';
import { HttpClient } from '@angular/common/http';
import { UrlBuilder } from './utils/url-builder';
import { GmNode, MapNode } from './models/map-node';
import { NodeService } from './node-service';

@Injectable({
	providedIn: 'root'
})
export class MapService {

	constructor(
		public http: HttpClient,
		public campaignService: CampaignService,
		public nodeService: NodeService,
		public auth: AuthService,
		public urlBuilder: UrlBuilder,
	) {
		campaignService.selectedCampaign$.subscribe({
			next: campaign => {
				if (campaign != null) {
					this.invalidateMaps(true);
				}
			}
		});
		auth.authState$.subscribe({
			next: state => {
				if (!state) {
					this.invalidateMaps(true);
				}
			}
		});
		this.selectedMap$.subscribe({
			next: () => {
				this.invalidateMapNodes();
			}
		});
		this.nodeService.nodesLoaded$.subscribe({
			next: () => {
				//this.selectedNode.next(null);
				//this.requestSelectedNode();
				this.requestMapNodes(auth.getUserToken(), this.selectedMap.getValue()!);
			}
		});
		this.nodeService.nodeDeleted$.subscribe({
			next: nodeId => {
				if(this.getSelectedNode()?.id == nodeId) {
					this.setSelectedNode(null);
				}
			}
		});
		this.nodeService.nodeCreated$.subscribe({
			next: node => {
				this.setSelectedNode(node);
			}
		});
	}

	private maps = new BehaviorSubject<GMMap[]>([])
	maps$ = this.maps.asObservable();

	private mapsLoaded = new BehaviorSubject<boolean>(false);
	mapsLoaded$ = this.mapsLoaded.asObservable();

	private mapNodes = new BehaviorSubject<MapNode[]>([]);
	mapNodes$ = this.mapNodes.asObservable();

	private mapNodesLoaded = new BehaviorSubject<boolean>(false);
	mapNodesLoaded$ = this.mapNodesLoaded.asObservable();

	private selectedNode = new BehaviorSubject<GmNode | null>(null);
	selectedNode$ = this.selectedNode.asObservable();

	private selectedMap = new BehaviorSubject<GMMap | null>(null);
	selectedMap$ = this.selectedMap.asObservable();

	private mapNodeDropped = new Subject<NodeDropInfo>();
	mapNodeDropped$ = this.mapNodeDropped.asObservable();

	private mapNodeDragged = new Subject<GmNode>();
	mapNodeDragged$ = this.mapNodeDragged.asObservable();


	editedMap: GMMap | null = null;
	cachedUrl: string = "";



	setSelectedNode(node: GmNode | null) {
		console.log("Set selected node")
		console.log(node);
		this.selectedNode.next(node);
		this.storeSelectedNode();
	}

	getSelectedNodeObservable(): Observable<GmNode | null> {
		if (this.selectedNode.getValue() == null) {
			console.log("no selected node set in memory, checking local storage");
			this.requestSelectedNode();
		}
		return this.selectedNode$;
	}

	getSelectedNode(): GmNode | null {
		return this.selectedNode.getValue();
	}

	requestSelectedNode() {

		if (this.selectedNode.getValue() != null) {
			return;
		}
		var storedNodeId: string | null = window.localStorage.getItem("selectedNodeID");
		if (storedNodeId == null) {
			return;
		}
		console.log("retreiving selected node data from storage");
		var found : GmNode | null = this.nodeService.getLocalNode(parseInt(storedNodeId));
		console.log(found);
		this.selectedNode.next(found);
	}

	storeSelectedNode() {
		if (this.selectedNode.getValue() == null) {
			return;
		}

		window.localStorage.setItem("selectedNodeID", this.selectedNode.getValue()!.id.toString());

	}

	//#region mapnodes



	getMapNodesLoaded(): Observable<boolean> {
		return this.mapNodesLoaded$;
	}

	areMapNodesLoaded(): boolean {
		return this.mapNodesLoaded.getValue();
	}

	getMapNodes() : MapNode[] {
		return this.mapNodes.getValue();
	}

	invalidateMapNodes() {
		this.mapNodesLoaded.next(false);
		this.mapNodes.next([]);
		if (this.selectedMap.getValue() != null) {
			this.requestMapNodes(this.auth.getUserToken(), this.selectedMap.getValue()!);
		}
	}
	dropMapNode(e: MouseEvent, node: GmNode) {
		this.mapNodeDropped.next(new NodeDropInfo(e, node));
	}

	startDragMapNode(userToken: string, node: MapNode) {
		this.deleteMapNode(userToken, this.getSelectedMap()!, node);
		this.mapNodeDragged.next(node.node);
	}

	startDragNode(node: GmNode) {
		this.mapNodeDragged.next(node);
	}

	private requestMapNodes(userToken: string, map: GMMap) {
		var url: string = this.urlBuilder.buildUrl(["nodes", "mapnodes", map.id.toString(), userToken]);
		console.log("Requestion map node reload");
		this.http.get(url).subscribe({
			next: value => {
				console.log("received map nodes: ");
				console.log(value);
				this.mapNodes.next(value as MapNode[]);
				this.mapNodesLoaded.next(true);
			},
			error: e => {
				throw new Error(e);
			}
		});
	}

	createMapNode(userToken: string, map: GMMap, mapNode: MapNode) {

		if (userToken == "") {
			throw new Error(`Cannot find usertoken`);
		}
		var url: string = this.urlBuilder.buildUrl(["nodes", "createmapnode", map.id.toString(), userToken])

		this.http.post(url, mapNode).subscribe({
			next: () => {
				console.log("Map Node added");
				this.invalidateMapNodes();
			},
			error: e => {
				throw new Error("Could not add map node: " + e);
			}
		})
	}

	deleteMapNode(userToken: string, map: GMMap, mapNode: MapNode) {

		if (userToken == "") {
			throw new Error(`Cannot find usertoken`);
		}

		var url: string = this.urlBuilder.buildUrl(["nodes", "deletemapnode", mapNode.id.toString(), userToken]);
		this.http.post(url, {}).subscribe({
			next: () => {
				console.log("MapNode deleted");
				this.invalidateMapNodes();
			},
			error: e => {
				throw new Error("Could not delete map node: " + e);
			}
		})
	}

	//#region Maps



	getMapsLoaded(): Observable<boolean> {
		return this.mapsLoaded$;
	}

	areMapsLoaded(): boolean {
		return this.mapsLoaded.getValue();
	}

	setSelectedMap(map: GMMap | null) {
		console.log("setting selected map: " + map);
		this.selectedMap.next(map);
		this.storeSelectedMap();
	}


	getSelectedMap(): GMMap | null {
		if (this.selectedMap.getValue() != null) {
			return this.selectedMap.getValue();
		}
		console.log("retrieving selected map data from local storage")
		var map: GMMap | null = this.getMap(parseInt(window.localStorage.getItem("selectedMapID") ?? ""));
		console.log("found map: " + map);
		return map;
	}

	getSelectedMapObserver(): Observable<GMMap | null> {
		this.setSelectedMap(this.getSelectedMap());
		return this.selectedMap$;
	}

	invalidateMaps(invalidateCachedUrl: boolean = false) {
		this.mapsLoaded.next(false);

		if (invalidateCachedUrl) {
			this.cachedUrl = "";
		}
		if (this.cachedUrl != "") {
			this.requestMapsByUrl(this.cachedUrl);
		}
	}



	private storeSelectedMap() {
		var map: GMMap | null = this.selectedMap.getValue();
		console.log("storing selected map: " + map);
		if (map == null) {
			window.localStorage.setItem("selectedMapID", "");
			return;
		}
		window.localStorage.setItem("selectedMapID", map.id.toString());
	}

	getMap(id: number): GMMap | null {
		console.log("getting map with id " + id);
		for (var map of this.maps.getValue()) {
			if (map.id == id) {
				return map;
			}
		}
		return null;
	}

	getMaps(userToken: string, campaign: Campaign): Observable<GMMap[]> {

		if (!this.areMapsLoaded()) {
			this.requestMaps(userToken, campaign);
		}
		return this.maps$;
	}


	deleteMap(userToken: string, id: number) {

		if (userToken == "") {
			throw new Error(`Cannot find usertoken`);
		}

		var url: string = this.urlBuilder.buildUrl(["campaigns", "maps", "delete", id.toString(), userToken]);
		var request: Observable<Object> = this.http.post(url, {})
		request.subscribe({
			next: () => {
				console.log("Map Deleted")
				this.invalidateMaps();
			},
			error: e => {
				throw new Error("Could not delete map: " + e);
			}
		})
	}


	private requestMaps(userToken: string, campaign: Campaign) {

		if (userToken == "" || campaign == null) {
			throw new Error(`Cannot request campaign info for campaign ${campaign}.\nUser ${userToken}`)
		}
		this.cachedUrl = this.urlBuilder.buildUrl(["campaigns", "maps", campaign.id.toString(), userToken]);
		this.requestMapsByUrl(this.cachedUrl);
	}
	updateMap(userToken: string, campaign: Campaign, map: GMMap) {


		console.log("updating map:");
		console.log(map);

		if (userToken == "" || campaign == null) {
			throw new Error(`Cannot update map for campaign ${campaign}\nUsertoken: ${userToken}`);
		}

		this.http.post(
			this.urlBuilder.buildUrl(["campaigns", "maps", "create", campaign.id.toString(), userToken]),
			map)
			.subscribe({
				next: () => {
					this.invalidateMaps();
				},
				error: e => {
					throw new Error("Could not update map: " + e);
				}
			})

	}
	private requestMapsByUrl(url: string) {

		if (url == "") {
			throw new Error("Url empty");
		}

		this.http.get(url)
			.subscribe({
				next: (response) => {
					console.log(response)
					this.maps.next(response as GMMap[]);
					this.mapsLoaded.next(true);
				},
				error: (e) => {
					alert("Error fetching maps. Logging out");
					this.auth.logout();
					throw new Error(e);
				}
			});
	}


	//#endregion
}

export class NodeDropInfo {
	constructor(
		public e: MouseEvent,
		public node: GmNode,
	) { }
}