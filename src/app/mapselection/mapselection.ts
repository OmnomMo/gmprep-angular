import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from '../campaign-service';
import { MapService } from '../map-service';
import { AuthService } from '../auth';
import { AsyncPipe } from '@angular/common';
import { Map } from '../models/map';
import { BigButton } from '../big-button/big-button';

@Component({
  selector: 'app-mapselection',
  imports: [BigButton, AsyncPipe],
  templateUrl: './mapselection.html',
  styleUrl: './mapselection.css'
})
export class MapSelection {

	mapsLoaded = signal<boolean>(false);

	constructor(
		public router : Router,
		public campaignService : CampaignService,
		public mapService : MapService,
		public auth : AuthService,
	) {

		this.campaignService.campaignsLoaded$.subscribe({
			next: (value) => {
				if (value) {
					console.log("campaigns changed. update maps!");
					this.requestMaps();
				}
			}
		})

		if (!this.campaignService.areCampaignsLoaded()) {
			console.log("Entered map selection but campaigns are not loaded. Loading campaigns")
			this.campaignService.requestCampaigns()
		} else {
			this.requestMaps()
		}

	}

	requestMaps() {
		if (this.mapService.getMaps().length == 0) {
			this.mapsLoaded.set(true);
		} else {
			this.mapsLoaded.set(false);
		}
		this.mapService.requestMaps()
		this.mapService.maps$.subscribe({
			next: (maps) => {
				this.mapsLoaded.set(true)
			},
			error: (err) => {
				throw new Error("Could not load maps: " + err);
			}
		})
	}

	getMapImageStyle(id : number) {
		var link : string = this.mapService.getMap(id)!.imagePath;
		if (link == "") {
			return `background-color: DarkSlateGrey;`
		}
		return `background-image: url(${link})`;
	}

	mapEdited(id: number) {

	}

	mapDeleted(id: number) {

	}

	mapSelected(id: number) {
		const map: Map | null = this.mapService.getMap(id);

		if (map == null) {
			return
		}

		this.mapService.setSelectedMap(map);
		this.router.navigate(['/map']);
	}

}
