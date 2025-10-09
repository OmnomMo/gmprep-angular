import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import { Campaign } from './models/campaign';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

	//local storage location where selectedcampaignId information is stored
	campaignIdStorage : string = "SelectedCampaignId"

	constructor(private authService : AuthService, private http: HttpClient, private urlBuilder : UrlBuilder) {

		//when user logs out we unset selected campaign
		authService.authState$.subscribe({
			next: (value) => {
				if (value == false) {
					console.log("Logout. Set selected campaign to null");
					this.setSelectedCampaign(null);
				}
			},
		})
	}


	private campaigns = new BehaviorSubject<Campaign[]>([]);
	campaigns$ = this.campaigns.asObservable();

	private campaignsLoaded = new BehaviorSubject<boolean>(false);
	campaignsLoaded$ = this.campaignsLoaded.asObservable();

	private selectedCampaign = new BehaviorSubject<Campaign | null>(null);
	selectedCampaign$ = this.selectedCampaign.asObservable();

	editedCampaign : Campaign | null = null;

	setSelectedCampaign(campaign : Campaign | null) {
		console.log("set selected campaign " + JSON.stringify(campaign));
		this.selectedCampaign.next(campaign);
		this.storeSelectedCampaign();
	}

	areCampaignsLoaded() : boolean {
		return this.campaignsLoaded.getValue();
	}

	//returns currently selected campaign.
	//if selected campaign in memory is null check local storage
	getSelectedCampaign(): Campaign | null {

		if (this.selectedCampaign.value != null) {
			return this.selectedCampaign.value;
		}

		var stored: Campaign | null = this.requestSelectedCampaign();
		return stored;
	}

	//write campaign info into local storage
	storeSelectedCampaign() {
		var campaign : Campaign | null = this.selectedCampaign.getValue()
		console.log("store selected campaign: " + JSON.stringify(campaign))
		if (campaign == null) {
			window.localStorage.setItem(this.campaignIdStorage, "");
			return;
		}
		window.localStorage.setItem(this.campaignIdStorage, campaign.id.toString());
	}

	//read campaign info from local storage
	requestSelectedCampaign(): Campaign | null {
		console.log("requesting selected campaign data from local storage")
		var id : string = window.localStorage.getItem(this.campaignIdStorage) ?? "";
		var campaign : Campaign | null = this.getCampaign(parseInt(id));

		return campaign;
	}

	//returns all campaigns of currently logged in user
	getCampaigns(): Campaign[] {
		return this.campaigns.getValue();
	}

	//gets campaign with specific Id of currently logged in user (or null if not found)
	getCampaign(id : number): Campaign | null {
		var campaigns : Campaign[] = this.campaigns.getValue()
		for (const c of campaigns) {
			if (c.id == id) {
				return c;
			}
		}

		return null;
	}

	//request campaign info from backend
	//updates observable class member if returned.
	requestCampaigns() {
		console.log("Requesting campaigns");

		let userToken : string = this.authService.getUserToken();

		if (userToken == "") {
			throw new Error("Cannot request campaigns, usertoken not valid");
		}

		this.http.get(this.urlBuilder.buildUrl(["campaigns", this.authService.getUserToken()]))
			.subscribe({
				next: (response) => {
					this.campaigns.next(response as Campaign[]);
					this.campaignsLoaded.next(true);
				},
				error: (e) => {
					throw new Error(e);
				}
			});
	}

	updateCampaign(campaign : Campaign): Observable<object>{
		console.log(`updating campaign: ${campaign}`);
		let userToken : string = this.authService.getUserToken();

		if (userToken == "") {
			throw new Error("Cannot update Campaign, usertoken not valid");
		}

		return this.http.post(this.urlBuilder.buildUrl(["campaigns", "create", userToken]), campaign);
	}

	deleteCampaign(id : number): Observable<object>{
		console.log(`deleting campaign: ${id}`);
		let userToken : string = this.authService.getUserToken();

		if (userToken =="") {
			throw new Error("Cannot delete campaign, usertoken not valid");
		}

		return this.http.post(this.urlBuilder.buildUrl(["campaigns", "delete", id.toString(), userToken]), {});
	}
  
}
