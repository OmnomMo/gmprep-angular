import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import { Campaign } from './models/campaign';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
	providedIn: 'root',
})
export class CampaignService {
	//local storage location where selectedcampaignId information is stored
	campaignIdStorage: string = 'SelectedCampaignId';

	constructor(
		private http: HttpClient,
		private urlBuilder: UrlBuilder,
		private auth: AuthService,
	) {
		//if we log in and the stored user is not the same as the new user
		auth.user$.subscribe({
			next: (user) => {
				if (user != null && user?.id != auth.retrieveUser()?.id) {
					console.log("User changed. Resetting selected campaign");
					this.setSelectedCampaign(null);
					this.requestCampaigns();
				}
			}
		})
	}

	private campaigns = new BehaviorSubject<Campaign[]>([]);
	campaigns$ = this.campaigns.asObservable();

	private campaignsLoaded = new BehaviorSubject<boolean>(false);
	campaignsLoaded$ = this.campaignsLoaded.asObservable();

	private selectedCampaign = new BehaviorSubject<Campaign | null>(null);
	selectedCampaign$ = this.selectedCampaign.asObservable();

	editedCampaign: Campaign | null = null;
	cachedUrl: string = '';

	setSelectedCampaign(campaign: Campaign | null) {
		console.log('set selected campaign ' + JSON.stringify(campaign));
		this.selectedCampaign.next(campaign);
		this.storeSelectedCampaign();
	}

	getCampaignsLoaded(): Observable<boolean> {
		return this.campaignsLoaded$;
	}

	areCampaignsLoaded(): boolean {
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

	//returns all campaigns of currently logged in user
	getCampaigns(): Observable<Campaign[]> {
		if (!this.campaignsLoaded.getValue()) {
			this.requestCampaigns();
		}

		return this.campaigns$;
	}

	//gets campaign with specific Id of currently logged in user (or null if not found)
	getCampaign(id: number): Campaign | null {
		var campaigns: Campaign[] = this.campaigns.getValue();
		for (const c of campaigns) {
			if (c.id == id) {
				return c;
			}
		}

		return null;
	}

	updateCampaign(campaign: Campaign) {
		console.log(`updating campaign: ${campaign}`);


		var request: Observable<Object> = this.http.post(
			this.urlBuilder.buildUrl(['campaigns', 'create']),
			campaign,
			{withCredentials: true},
		);
		request.subscribe({
			next: () => {
				this.invalidateCampaigns();
			},
			error: (e) => {
				throw new Error('could not update campaign: ' + e);
			},
		});
	}

	deleteCampaign(id: number) {
		console.log(`deleting campaign: ${id}`);

		var request: Observable<Object> = this.http.post(
			this.urlBuilder.buildUrl(['campaigns', 'delete', id.toString()]),
			{},
			{withCredentials: true},
		);

		request.subscribe({
			next: () => {
				this.invalidateCampaigns();
			},
			error: (e) => {
				throw new Error('Could not delete campaign: ' + e);
			},
		});
	}

	invalidateCampaigns(invalidateCachedUrl: boolean = false) {
		this.setSelectedCampaign(null);
		this.campaignsLoaded.next(false);
		if (invalidateCachedUrl) {
			this.cachedUrl = '';
		}
		if (this.cachedUrl != '') {
			this.requestCampaignsWithUrl(this.cachedUrl);
		}
	}

	//request campaign info from backend
	//updates observable class member if returned.
	requestCampaigns() {
		console.log('Requesting campaigns');
		this.campaignsLoaded.next(false);

		
		this.cachedUrl = this.urlBuilder.buildUrl(['campaigns']);
		this.requestCampaignsWithUrl(this.cachedUrl);
	}

	private requestCampaignsWithUrl(url: string) {
		this.http.get(url, {
			withCredentials: true,
			params: {
				useCookies: true,
			}
		}).subscribe({
			next: (response) => {
				this.campaignsLoaded.next(true);
				this.campaigns.next(response as Campaign[]);
			},
			error: (e) => {
				console.error("Fetching capmaigns failed");
				console.error(e);
				this.auth.logout();
			},
		});
	}

	//write campaign info into local storage
	private storeSelectedCampaign() {
		var campaign: Campaign | null = this.selectedCampaign.getValue();
		console.log('store selected campaign: ' + JSON.stringify(campaign));
		if (campaign == null) {
			window.localStorage.setItem(this.campaignIdStorage, '');
			return;
		}
		window.localStorage.setItem(this.campaignIdStorage, campaign.id.toString());
	}

	//read campaign info from local storage
	private requestSelectedCampaign(): Campaign | null {
		console.log('requesting selected campaign data from local storage');
		var id: string = window.localStorage.getItem(this.campaignIdStorage) ?? '';
		var campaign: Campaign | null = this.getCampaign(parseInt(id));

		return campaign;
	}
}
