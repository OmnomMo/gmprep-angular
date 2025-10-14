import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { CampaignService } from './campaign-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapNode } from './models/map-node';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
	providedIn: 'root'
})
export class NodeService {
	constructor(
		public http : HttpClient,
		public urlBuilder : UrlBuilder,
	) {}

	nodes = new BehaviorSubject<MapNode[]>([]);
	nodes$ = this.nodes.asObservable();

	nodesLoaded = new BehaviorSubject<boolean>(false);
	nodesLoaded$ = this.nodesLoaded.asObservable();

	requestNodes(userToken : string, campaignId : number) : Observable<MapNode[]> {

		if (userToken == "") {
			throw new Error("User not authenticated");
		}


		this.http.get(this.urlBuilder.buildUrl(
			[campaignId.toString(),
			userToken]))
			.subscribe({
				next: (value) => {
					console.log("received nodes:");
					console.log(value);
				},
				error: (e) => {
					console.error(e);
				},
			})


		return this.nodes$;
	}
}
