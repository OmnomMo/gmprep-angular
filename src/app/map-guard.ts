import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CampaignService } from './campaign-service';
import { MapService } from './map-service';
import { BehaviorSubject, first, Observable, Subject } from 'rxjs';
import { CampaignGuard } from './campaign-guard';
import { GuardExtension } from './guard-extension';
import { AuthService } from './auth';

@Injectable({
	providedIn: 'root'
})
export class MapGuard implements CanActivate {

	private isMapSet = new Subject<GuardResult>();
	private isMapSet$ = this.isMapSet.asObservable();

	constructor(
		private mapService: MapService,
		private authService: AuthService,
		private campaignService: CampaignService,
		private router: Router,
		private campaignGuard: CampaignGuard,
		private guardExtension: GuardExtension,

	) { }


	//guard checks if the current map is set and if campaigns and maps are loaded
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): MaybeAsync<GuardResult> {

		console.log("MapGuard canActivate Called.")

		var self = this;

		this.isMapSet$.pipe(first()).subscribe({ next: value => { console.log("Map Guard observable updated: " + value); } });

		this.guardExtension.evaluateAfterPrerequisite(
			this.campaignGuard,
			route,
			state,
			() => {
				//on prerequisite success
				console.log("MapGuard prerequisites cleared, check if map is set")
				this.checkMaps(self);
			},
			(result) => {
				//onfailure
				console.log("MapGuard prerequisites failed, return to campaign");
				self.isMapSet.next(result);
			}
		)

		console.log("Returning mapguard observable.")
		return this.isMapSet$;
	}

	//at this point we are sure that campaigns are already loaded
	//returns observable(true) if selected map is set,
	//returns observable(map selection url if not)
	checkMaps(self: MapGuard) {
		if (self.mapService.areMapsLoaded()) {
			self.checkSelectedMapSet(self);
		} else {
			console.log("maps not loaded. requesting maps.");
			self.mapService.getMaps(self.authService.getUserToken(), self.campaignService.getSelectedCampaign()!)
				.subscribe({
					next: (maps) => {
						if (maps.length > 0) {
							self.checkSelectedMapSet(self)
						}
					}
				});
		}
	}

	checkSelectedMapSet(self: MapGuard) {
		console.log("maps loaded. check if selected map is set.");
		if (self.mapService.getSelectedMap() != null) {
			console.log("map set. Clearing Guard")
			self.isMapSet.next(true);
		} else {
			console.log("map not set. returning to map selection.")
			self.isMapSet.next(self.router.parseUrl('/mapselection'));
		}
	}

}
