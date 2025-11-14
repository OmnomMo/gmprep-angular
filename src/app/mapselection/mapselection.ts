import { Component, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from '../campaign-service';
import { MapService } from '../map-service';
import { AuthService } from '../auth';
import { AsyncPipe } from '@angular/common';
import { GMMap } from '../models/map';
import { BigButton } from '../big-button/big-button';
import { toSignal } from '@angular/core/rxjs-interop';
import { Campaign } from '../models/campaign';
import { first } from 'rxjs';

@Component({
  selector: 'app-mapselection',
  imports: [BigButton],
  templateUrl: './mapselection.html',
  styleUrl: './mapselection.css'
})
export class MapSelection {

	mapsLoaded: Signal<boolean | undefined>;
	maps: Signal<GMMap[] | undefined>;

	constructor(
		public router : Router,
		public campaignService : CampaignService,
		public mapService : MapService,
		public auth : AuthService,
	) {

		this.mapsLoaded = toSignal(mapService.getMapsLoaded());


		var campaign: Campaign | null = campaignService.getSelectedCampaign();
		if (campaign == null) {
			throw new Error("Current campaign is null. Should not be possible here.")
		}

		this.maps = toSignal(mapService.getMaps(campaignService.getSelectedCampaign()!));

	}

	startCreateMap() {
		this.mapService.editedMap = null;
		this.router.navigate(["/createmap"]);
	}


	getMapImageStyle(id : number) {
		var link : string = this.mapService.getMap(id)!.externalImageUrl;
		if (link == "") {
			return `background-color: DarkSlateGrey;`
		}
		return `background-image: url(${link})`;
	}

	getBackgroundImageStyle() : string{
		return `background-image: url(${this.campaignService.getSelectedCampaign()?.imageLink})`;
	}

	mapEdited(id: number) {
		var map : GMMap | null = this.mapService.getMap(id);
		if (map == null) {
			throw new Error("Cannot edit map!");
		}
		this.mapService.editedMap = map;
		this.router.navigate(["/createmap"]);
	}

	mapDeleted(id: number) {
		console.log("Deleting map: " + id);
		this.mapService.deleteMap(id)
	}

	mapSelected(id: number) {
		const map: GMMap | null = this.mapService.getMap(id);

		if (map == null) {
			return
		}

		this.mapService.setSelectedMap(map);
		this.router.navigate(['/map']);
	}

}
