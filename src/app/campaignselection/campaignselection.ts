import { Component, signal } from '@angular/core';
import { CampaignService } from '../campaign-service';
import { AuthService } from '../auth';
import { Campaign } from '../models/campaign';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BigButton } from '../big-button/big-button';

@Component({
  selector: 'app-campaignselection',
  imports: [BigButton, AsyncPipe],
  templateUrl: './campaignselection.html',
  styleUrl: './campaignselection.css'
})
export class CampaignSelection {

	campaignsLoaded = signal<boolean>(false);

	constructor(
		public campaignService : CampaignService,
		public auth : AuthService,
		public router : Router,
	) {
		console.log("Campaign selection constructor");

		if (campaignService.getCampaigns().length == 0) {
			this.campaignsLoaded.set(false);
		} else {
			this.campaignsLoaded.set(true)
		}
		
		try {

			campaignService.requestCampaigns();
			campaignService.campaigns$.subscribe({
				next: value => this.campaignsUpdated(value),
				error: err => console.error('Campaigns returned error: ' + err)
			});
			
		} catch(e) {
			console.error(e);
		}
	}

	getImageStyle(campaign : Campaign): string {
		return `background-image: url(${campaign.imageLink})`;
	}

	campaignsUpdated(campaigns: Campaign[]) {
		this.campaignsLoaded.set(true);
		console.log(campaigns);
	}

	campaignEdited(id: number) {
		this.campaignService.editedCampaign = this.campaignService.getCampaign(id);
		this.router.navigate([`/createcampaign`]);
		console.log("campaign edited " + id);
	}

	campaignDeleted(id: number) {

			this.campaignService.deleteCampaign(id).subscribe({
			next: () => {
				console.log("Campaign deleted!");
				this.campaignService.requestCampaigns();
			},
			error: (e) => {
				console.error(e);
				throw new Error("could not delete campaign: ");
			}
		});
		console.log("campaign deleted " + id);
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
