import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CampaignService } from './campaign-service';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CampaignGuard implements CanActivate {
	constructor(private campaignService: CampaignService, private router: Router) { }

	private campaignSet = new Subject<boolean | UrlTree>();
	private campaignSet$ = this.campaignSet.asObservable();

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		console.log("Campaign guard checking if selected campaign is set:")


		if (this.campaignService.areCampaignsLoaded()) {
			return this.checkLoadedCampaigns();
		} else {
			console.log("CampaignGuard: Campaigns aren't loaded yet. Load before checking")
			this.campaignService.campaignsLoaded$.subscribe({
				next: (areLoaded) => {
					if (areLoaded) {
						this.campaignSet.next(this.checkLoadedCampaigns());
						this.campaignSet.complete();
						console.log("CampaignGuard: Campaigns loading finished!");
					}
				}
			})
			this.campaignService.requestCampaigns();

			console.log("CampaignGuard: return observable");

			this.campaignSet$.subscribe({
				next: v => {
					console.log("CAMPAIGN GUARD OBSERVABLE NEXT: " + v);
				}
			})

			return this.campaignSet$;
			

		}
	}

	checkLoadedCampaigns(): boolean | UrlTree {

		if (!this.campaignService.areCampaignsLoaded()) {
			throw new Error("CampaignGuard: Campaigns not loaded!");
		}

		console.log("CampaignGuard: Campaigns loaded. checking...")
		if (this.campaignService.getSelectedCampaign() != null) {
			console.log("CampaignGuard: Campaign found!");
			return true;
		} else {
			console.log("CampaignGuard: No campaign selected. Returning to Campaign select")
			const tree: UrlTree = this.router.parseUrl('/campaignselection');
			return tree;
		}
	}
}

