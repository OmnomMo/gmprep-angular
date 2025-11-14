import { Component, Signal, signal } from '@angular/core';
import { CampaignService } from '../campaign-service';
import { AuthService } from '../auth';
import { Campaign } from '../models/campaign';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BigButton } from '../big-button/big-button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-campaignselection',
  imports: [BigButton],
  templateUrl: './campaignselection.html',
  styleUrl: './campaignselection.css'
})
export class CampaignSelection {

	campaignsLoaded: Signal<boolean | undefined>
	campaigns: Signal<Campaign[] | undefined>

	constructor(
		public campaignService : CampaignService,
		public auth : AuthService,
		public router : Router,
	) {
		this.campaignsLoaded = toSignal(campaignService.getCampaignsLoaded());
		this.campaigns = toSignal(campaignService.getCampaigns());
	}

	getImageStyle(campaign : Campaign): string {
		return `background-image: url(${campaign.imageLink})`;
	}

	campaignEdited(id: number) {
		this.campaignService.editedCampaign = this.campaignService.getCampaign(id);
		this.router.navigate([`/createcampaign`]);
		console.log("campaign edited " + id);
	}

	campaignDeleted(id: number) {
		this.campaignService.deleteCampaign(id)
	}

	createCampaign() {
		console.log("New campaign button clicked");
		this.router.navigate(['/createcampaign'])
	}

	campaignSelected(id : number) {

		console.log("campaign selected " + id);
		const campaign : Campaign | null= this.campaignService.getCampaign(id);

		if (campaign == null) {
			console.error("Campaign not found!")
			return;
		}

		this.campaignService.setSelectedCampaign(campaign!);
		this.router.navigate(['/mapselection']);
	}
}
