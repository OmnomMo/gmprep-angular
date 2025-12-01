import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { CampaignService } from './campaign-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, first, firstValueFrom, Observable, Subject } from 'rxjs';
import { GmNode } from './models/map-node';
import { UrlBuilder } from './utils/url-builder';
import { MapService } from './map-service';

@Injectable({
	providedIn: 'root',
})
export class NodeService {
	constructor(
		public http: HttpClient,
		public urlBuilder: UrlBuilder,
	) {}

	nodes = new BehaviorSubject<GmNode[]>([]);
	nodes$ = this.nodes.asObservable();

	nodesLoaded = new BehaviorSubject<boolean>(false);
	nodesLoaded$ = this.nodesLoaded.asObservable();

	nodeUpdated = new Subject<GmNode>();
	nodeUpdated$ = this.nodeUpdated.asObservable();

	nodeCreated = new Subject<GmNode>();
	nodeCreated$ = this.nodeCreated.asObservable();

	nodeDeleted = new Subject<number>();
	nodeDeleted$ = this.nodeDeleted.asObservable();

	requestNodes(campaignId: number): Observable<GmNode[]> {
		console.log('Requesting nodes');

		this.http
			.get(this.urlBuilder.buildUrl(['nodes', 'all', campaignId.toString()]), {
				withCredentials: true,
			})
			.subscribe({
				next: (value) => {
					console.log('received nodes:');
					console.log(value);
					this.nodes.next(value as GmNode[]);
					this.nodesLoaded.next(true);
				},
				error: (e) => {
					console.error(e);
				},
			});

		return this.nodes$;
	}

	getLocalNode(nodeId: number): GmNode | null {
		for (var i: number = 0; i < this.nodes.getValue().length; i++) {
			if (this.nodes.getValue()[i].id == nodeId) {
				return this.nodes.getValue()[i];
			}
		}

		return null;
	}

	getNode(userToken: string, nodeId: string): Observable<GmNode | null> {
		if (userToken == '') {
			throw new Error('User not authenticated');
		}

		var node = new Subject<GmNode | null>();
		var node$ = node.asObservable();

		this.http.get(this.urlBuilder.buildUrl(['nodes', nodeId, userToken]), {withCredentials: true}).subscribe({
			next: (value) => {
				console.log(`received node ${nodeId}.`);
				console.log(value);
				node.next(value as GmNode);
			},
			error: (e) => {
				console.error('Error receiving node: ' + e);
				node.next(null);
			},
		});

		return node$;
	}

	copyNodeValues(from: GmNode, to: GmNode) {
		to.name = from.name;
		to.description = from.description;
		to.mapIconPath = from.mapIconPath;
		to.portraitPath = from.portraitPath;
		to.mapIconSize = from.mapIconSize;
		to.creatureInfo = from.creatureInfo;
		to.locationInfo = from.locationInfo;
		to.secrets = from.secrets;
		to.links = from.links;
	}

	updateNode(campaignId: number, node: GmNode) {
		this.nodeUpdated.next(node);

		this.http
			.post(this.urlBuilder.buildUrl(['nodes', 'update', campaignId.toString()]), node, {withCredentials: true})
			.subscribe({
				next: () => {
					console.log('node successfully updated');
					//update node in nodes array
					for (var i: number = 0; i < this.nodes.value.length; i++) {
						if (this.nodes.value[i].id == node.id) {
							//create a copy of nodes array, update changed node and push back into nodes array
							var newNodes: GmNode[] = Object.assign([], this.nodes.value);
							newNodes[i] = node;
							this.nodes.next(newNodes);
							this.nodesLoaded.next(true);
							break;
						}
					}
					console.log(node);
				},
				error: (e) => {
					console.error('Error updating node ' + e);
				},
			});
	}

	createNode(campaignId: number, node: GmNode) : Observable<GmNode | null> {

		var createdNode = new Subject<GmNode |null >();
		this.http
			.post(this.urlBuilder.buildUrl(['nodes', 'update', campaignId.toString()]), node, {withCredentials: true})
			.subscribe({
				next: (newNode) => {
					var newNodes: GmNode[] = Object.assign([], this.nodes.value);
					newNodes.push(newNode as GmNode);
					this.nodes.next(newNodes);
					this.nodesLoaded.next(true);
					this.nodeCreated.next(newNode as GmNode);
					createdNode.next(newNode as GmNode);
				},
				error: (e) => {
					console.error('Error creating node ' + e);
					createdNode.next(null);
				},
			});

		return createdNode.asObservable().pipe(first());
	}

	deleteNode(campaignId: number, node: GmNode) {
		this.http.post(this.urlBuilder.buildUrl(['nodes', 'delete']), node, {withCredentials: true}).subscribe({
			next: (result) => {
				console.log('Node successfully deleted');
				this.nodeDeleted.next(node.id);
				this.requestNodes(campaignId);
			},
			error: (e) => {
				console.error('Error deleting node');
				console.log(e);
			},
		});
	}
}
