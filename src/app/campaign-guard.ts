import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterState, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CampaignService } from './campaign-service';
import { BehaviorSubject, first, Observable, Subject } from 'rxjs';
import { AuthGuard } from './auth-guard';
import { GuardExtension } from './guard-extension';
import { AuthService } from './auth';

@Injectable({
	providedIn: 'root'
})
export class CampaignGuard implements CanActivate {
	constructor(
		private campaignService: CampaignService,
		private router: Router,
		private authGuard: AuthGuard,
		private auth: AuthService,
		private guardExtension : GuardExtension
	) { }

	private isCampaignSet = new Subject<boolean | UrlTree>();
	private isCampaignSet$ = this.isCampaignSet.asObservable();

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): MaybeAsync<GuardResult> {
		console.log("Campaign guard checking if selected campaign is set:")

		var self = this;

		this.isCampaignSet$.pipe(first()).subscribe((value) => {
			console.log("Campaign guard observable set: " + value);
		});

		this.guardExtension.evaluateAfterPrerequisite(
			this.authGuard,
			route,
			state,
			() => {
				this.checkCampaigns(self);
			},
			() => {
				//onfailure
				console.log("prerequisites failed, return to login");
				self.isCampaignSet.next(this.router.parseUrl('/login'));
			}
		);
		console.log("returning observable")
		return this.isCampaignSet$;
	}

	checkCampaigns(self: CampaignGuard) {
		console.log("Prerequisites cleared. Checking campaigns")
		console.log(self);
		if (self.campaignService.areCampaignsLoaded()) {
			console.log("campaigns loaded")
			self.checkLoadedCampaigns(self);
		} else {
			self.campaignService.getCampaigns(self.auth.getUserToken()).subscribe({
				next: () => {
					if (self.campaignService.areCampaignsLoaded()) {
						self.checkLoadedCampaigns(self);
					}
				}
			})
		}
	}

	checkLoadedCampaigns(self : CampaignGuard) {
		if (self.campaignService.getSelectedCampaign() != null) {
			console.log("Selected campaign found.");
			console.log(self.campaignService.getSelectedCampaign());
			self.isCampaignSet.next(true);
		} else {
			console.log("could not find selected campaign.")
			self.isCampaignSet.next(self.router.parseUrl('/campaignselection'));
		}
	}




}
