import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { CampaignService } from './campaign-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GmNode } from './models/map-node';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
	providedIn: 'root'
})
export class NodeService {
	constructor(
		public http : HttpClient,
		public urlBuilder : UrlBuilder,
	) {}

	nodes = new BehaviorSubject<GmNode[]>([]);
	nodes$ = this.nodes.asObservable();

	nodesLoaded = new BehaviorSubject<boolean>(false);
	nodesLoaded$ = this.nodesLoaded.asObservable();

	requestNodes(userToken : string, campaignId : number) : Observable<GmNode[]> {

		if (userToken == "") {
			throw new Error("User not authenticated");
		}


		this.http.get(this.urlBuilder.buildUrl(
			[
				"nodes",
				"all",
				campaignId.toString(),
				userToken
			]))
			.subscribe({
				next: (value) => {
					console.log("received nodes:");
					console.log(value);
					this.nodes.next(value as GmNode[]);
					this.nodesLoaded.next(true);
				},
				error: (e) => {
					console.error(e);
				},
			})


		return this.nodes$;
	}

	getNode(userToken : string, nodeId : string) : Observable<GmNode | null> {
		if (userToken == "") {
			throw new Error("User not authenticated");
		}

		var node = new Subject<GmNode | null>();
		var node$ = node.asObservable();

		this.http.get(this.urlBuilder.buildUrl([
			"nodes",
			nodeId,
			userToken
		]))
		.subscribe({
			next: (value) => {
				console.log(`received node ${nodeId}.`);
				console.log(value);
				node.next(value as GmNode);
			},
			error: e => {
				console.error("Error receiving node: " + e);
				node.next(null);
			}
		})

		return node$;
	}
}
