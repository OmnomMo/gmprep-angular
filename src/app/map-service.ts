import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Map } from './models/map';
import { AuthService } from './auth';
import { CampaignService } from './campaign-service';
import { GMUser } from './models/user';
import { Campaign } from './models/campaign';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class MapService {

	constructor(
		public auth: AuthService,
		public campaignService: CampaignService,
		public http: HttpClient,
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

	private maps = new BehaviorSubject<Map[]>([])
	maps$ = this.maps.asObservable();

	private mapsLoaded = new BehaviorSubject<boolean>(false);
	mapsLoaded$ = this.mapsLoaded.asObservable();

	private selectedMap = new BehaviorSubject<Map | null>(null);
	selectedMap$ = this.selectedMap.asObservable();


	areMapsLoaded() :boolean {
		return this.mapsLoaded.getValue();
	}

	setSelectedMap(map : Map) {
		this.selectedMap.next(map);
		this.storeSelectedMap();
	}

	getSelectedMap(): Map | null {
		if (this.selectedMap.getValue() != null) {
			return this.selectedMap.getValue();
		}

		var map : Map | null = this.getMap(parseInt(window.localStorage.getItem("selectedMapID") ?? ""));
		return map;
	}

	storeSelectedMap() {
		var map : Map | null = this.selectedMap.getValue();
		if (map == null) {
			window.localStorage.setItem("selectedMapID", "");
			return;
		}
		window.localStorage.setItem("selectedMapID", map.id.toString());
	}

	getMap(id : number) : Map | null {
		for (var map of this.maps.getValue()) {
			if (map.id == id) {
				return map;
			}
		}
		return null;
	}

	getMaps() : Map[] {
		return this.maps.value;
	}

	requestMaps() {
		var userToken: string = this.auth.getUserToken();
		var campaign: Campaign | null = this.campaignService.getSelectedCampaign();

		if (userToken == "" || campaign == null) {
			throw new Error(`Cannot request campaign info for campaign ${campaign}.\nUser ${userToken}`)
		}

		this.http.get(`http://localhost:5140/campaigns/maps/${campaign!.id}/${userToken}`)
			.subscribe({
				next: (response) => {
					console.log(response)
					this.maps.next(response as Map[]);
					this.mapsLoaded.next(true);
				},
				error: (e) => {
					throw new Error(e);
				}
			});
	}
}
