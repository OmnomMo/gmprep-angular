import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GMMap } from './models/map';
import { AuthService } from './auth';
import { CampaignService } from './campaign-service';
import { GMUser } from './models/user';
import { Campaign } from './models/campaign';
import { HttpClient } from '@angular/common/http';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
	providedIn: 'root'
})
export class MapService {

	constructor(
		public auth: AuthService,
		public campaignService: CampaignService,
		public http: HttpClient,
		public urlBuilder: UrlBuilder,
	) {
		auth.authState$.subscribe({
			next: state => {
				if (!state) {
					console.log("User logged out. Clearing selected map")
					this.selectedMap.next(null);
				}
			}
		})
	}

	private maps = new BehaviorSubject<GMMap[]>([])
	maps$ = this.maps.asObservable();

	private mapsLoaded = new BehaviorSubject<boolean>(false);
	mapsLoaded$ = this.mapsLoaded.asObservable();

	private selectedMap = new BehaviorSubject<GMMap | null>(null);
	selectedMap$ = this.selectedMap.asObservable();

	editedMap : GMMap | null = null;

	areMapsLoaded() :boolean {
		return this.mapsLoaded.getValue();
	}

	setSelectedMap(map : GMMap) {
		this.selectedMap.next(map);
		this.storeSelectedMap();
	}

	getSelectedMap(): GMMap | null {
		if (this.selectedMap.getValue() != null) {
			return this.selectedMap.getValue();
		}

		var map : GMMap | null = this.getMap(parseInt(window.localStorage.getItem("selectedMapID") ?? ""));
		return map;
	}

	storeSelectedMap() {
		var map : GMMap | null = this.selectedMap.getValue();
		if (map == null) {
			window.localStorage.setItem("selectedMapID", "");
			return;
		}
		window.localStorage.setItem("selectedMapID", map.id.toString());
	}

	getMap(id : number) : GMMap | null {
		for (var map of this.maps.getValue()) {
			if (map.id == id) {
				return map;
			}
		}
		return null;
	}

	getMaps() : GMMap[] {
		return this.maps.value;
	}

	requestMaps() {
		var userToken: string = this.auth.getUserToken();
		var campaign: Campaign | null = this.campaignService.getSelectedCampaign();

		if (userToken == "" || campaign == null) {
			throw new Error(`Cannot request campaign info for campaign ${campaign}.\nUser ${userToken}`)
		}

		this.http.get(this.urlBuilder.buildUrl(["campaigns", "maps", campaign.id.toString(), userToken]))
			.subscribe({
				next: (response) => {
					console.log(response)
					this.maps.next(response as GMMap[]);
					this.mapsLoaded.next(true);
				},
				error: (e) => {
					throw new Error(e);
				}
			});

	}

	deleteMap(id : number) : Observable<object> {
		var userToken: string = this.auth.getUserToken();
		

		if (userToken == "" ) {
			throw new Error(`Cannot find usertoken`);
		}

		return this.http.post(this.urlBuilder.buildUrl(["campaigns", "maps", "delete", id.toString(), userToken]), {})
	}

	updateMap(map: GMMap) : Observable<object> {
		var userToken: string = this.auth.getUserToken();
		var campaign: Campaign | null = this.campaignService.getSelectedCampaign();

		if (userToken == "" || campaign == null) {
			throw new Error(`Cannot update map for campaign ${campaign}\nUsertoken: ${userToken}`);
		}

		return this.http.post(this.urlBuilder.buildUrl(["campaigns", "maps", "create", campaign.id.toString(), userToken]), map)
	}
}
