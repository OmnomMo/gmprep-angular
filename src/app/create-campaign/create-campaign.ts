import { Component, forwardRef, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { CampaignService } from '../campaign-service';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NameFormComponent } from "../forms/name-form-component/name-form-component";
import { MultilineFormComponent } from "../forms/multiline-form-component/multiline-form-component";
import { ImagelinkFormComponent } from "../forms/imagelink-form-component/imagelink-form-component";
import { Campaign } from '../models/campaign';

@Component({
	selector: 'app-create-campaign',
	imports: [ReactiveFormsModule, NameFormComponent, MultilineFormComponent, ImagelinkFormComponent],
	templateUrl: './create-campaign.html',
	styleUrl: './create-campaign.css',
})
export class CreateCampaign implements OnDestroy{


	createCampaignForm = new FormGroup({
		name: new FormControl(''),
		description: new FormControl(''),
		imageLink: new FormControl(''),
	})

	submitting = signal<boolean>(false);

	constructor(
		public router: Router,
		public auth: AuthService,
		public campaignService: CampaignService) {

		var editedCampaign : Campaign | null = campaignService.editedCampaign;
		
		if (editedCampaign != null) {
			this.createCampaignForm.setValue({
				name: editedCampaign.name,
				description: editedCampaign.description,
				imageLink: editedCampaign.imageLink,
			})
		}
	}

	ngOnDestroy(): void {
		console.log("Cleaning up create campaign data");
		this.campaignService.editedCampaign = null;
	}

	abort() {
		this.router.navigate(['/campaignselection']);
	}

	onSubmit() {
		console.log(this.createCampaignForm.value)

		var campaign : Campaign;
		var controls = this.createCampaignForm.controls;

		if (this.campaignService.editedCampaign != null) {
			campaign = this.campaignService.editedCampaign;
			campaign.name = controls.name.value!;
			campaign.description = controls.description.value!;
			campaign.imageLink = controls.imageLink.value!;
		} else {
			campaign = new Campaign(
				0,
				controls.name.value!,
				controls.description.value!,
				controls.imageLink.value!
			)
		}

		this.submitting.set(true);

		this.campaignService.updateCampaign(campaign).subscribe({
			next: () => {
				console.log("Successfully created new campaign!")
				this.router.navigate(['/campaignselection'])
			},
			error: (e) => {
				console.error(`Could not create campaign: ${e}`);
				alert(e);
				this.router.navigate(['/campaignselection'])
			}
		})
	}

}
