import { Component, inject, Input, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CreatureInfo, GmNode, LocationInfo } from '../models/map-node';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NameFormComponent } from "../forms/name-form-component/name-form-component";
import { MultilineFormComponent } from "../forms/multiline-form-component/multiline-form-component";
import { NodeService } from '../node-service';
import { CampaignService } from '../campaign-service';
import { AuthService } from '../auth';
import { PortraiticonFormComponent } from "../forms/portraiticon-form-component/portraiticon-form-component";
import { GmNodeOptions } from '../utils/gm-node-options';
import { StringSelector } from "../forms/string-selector/string-selector";
import { StatsForm } from '../forms/stats-form/stats-form';

@Component({
	selector: 'app-node-view',
	imports: [NameFormComponent, ReactiveFormsModule, MultilineFormComponent, PortraiticonFormComponent, StringSelector, StatsForm],
	templateUrl: './node-view.html',
	styleUrl: './node-view.css'
})
export class NodeView implements OnChanges {
	node = input.required<GmNode>();
	formBuilder = inject(FormBuilder);
	nodeForm: FormGroup | null = null;

	isCreature = signal<boolean>(false);
	isLocation = signal<boolean>(false);



	constructor(
		private auth: AuthService,
		private nodeService: NodeService,
		private campaignService: CampaignService,
		protected gmNodeOptions: GmNodeOptions,
	) { }

	onControlSubmit() {
		this.submitNode();
	}

	ngOnChanges(changes: SimpleChanges): void {

		this.isCreature.set(this.node().creatureInfo != null);
		this.isLocation.set(this.node().locationInfo != null);

		//build form group from node
		this.nodeForm = this.formBuilder.group({
			name: [this.node().name ?? '', Validators.required],
			description: [this.node().description ?? ''],
			mapIconPath: [this.node().mapIconPath ?? '', Validators.required],
			portraitPath: [this.node().portraitPath ?? ''],
			mapIconSize: [this.node().mapIconSize ?? '64', Validators.required],
			creatureInfo: this.formBuilder.group({
				creatureType: [this.node().creatureInfo?.creatureType ?? ''],
				size: [this.node().creatureInfo?.size ?? ''],
				AC: [this.node().creatureInfo?.AC ?? ''],
				HP: [this.node().creatureInfo?.HP ?? ''],
				speed: [this.node().creatureInfo?.speed ?? ''],
				speedFlying: [this.node().creatureInfo?.speedFlying ?? ''],
				speedSwimming: [this.node().creatureInfo?.speedSwimming ?? ''],
				alignment: [this.node().creatureInfo?.alignment ?? ''],
				languages: [this.node().creatureInfo?.languages ?? ''],
				senses: [this.node().creatureInfo?.senses ?? ''],
				damageResistances: [this.node().creatureInfo?.damageResistances ?? ''],
				damageImmunities: [this.node().creatureInfo?.damageImmunities ?? ''],
				conditionImmunities: [this.node().creatureInfo?.conditionImmunities ?? ''],
				damageVulnerabilities: [this.node().creatureInfo?.damageVulnerabilities ?? ''],
				skills: this.formBuilder.array([
					this.formBuilder.group({
						skillName: ['', Validators.required],
						bonus: ['0', Validators.required],
					})
				]),
				actions: this.formBuilder.array([
					this.formBuilder.group({
						name: [''],
						description: [''],
					})
				]),
				CHA: [this.node().creatureInfo?.CHA ?? '10'],
				CON: [this.node().creatureInfo?.CON ?? '10'],
				DEX: [this.node().creatureInfo?.DEX ?? '10'],
				INT: [this.node().creatureInfo?.INT ?? '10'],
				STR: [this.node().creatureInfo?.STR ?? '10'],
				WIS: [this.node().creatureInfo?.WIS ?? '10'],
				CR: [this.node().creatureInfo?.CR ?? '1'],
			}),
			locationInfo: this.formBuilder.group({
				population: [this.node().locationInfo?.population ?? ''],
			}),
			secrets: this.formBuilder.array([
				this.formBuilder.group({
					description: [''],
					testSkill: [''],
					testDifficulty: [''],
				})
			])

		})
	}

	setIsCreature(isCreature: boolean) {
		if (!isCreature) {
			this.node().creatureInfo = null;
			this.isCreature.set(false);
		} else {
			this.node().creatureInfo = new CreatureInfo();
			this.isCreature.set(true);
		}
		this.onControlSubmit();
	}

	setIsLocation(isLocation: boolean) {
		if (!isLocation) {
			this.node().locationInfo = null;
			this.isLocation.set(false);
		} else {
			this.node().locationInfo = new LocationInfo();
			this.isLocation.set(true);
		}
		this.onControlSubmit();

	}

	getSubFormGroup(groupName: string): FormGroup {
		var control = this.nodeForm!.get(groupName) as FormGroup;
		return control;
	}

	submitNode() {
		var updatedNode: GmNode = this.nodeForm!.value;
		updatedNode.id = this.node().id;
		if (!this.isCreature()) {
			updatedNode.creatureInfo = null;
		}
		if (!this.isLocation()) {
			updatedNode.locationInfo = null;
		}
		updatedNode.secrets = [];
		this.nodeService.updateNode(this.auth.getUserToken(), this.campaignService.getSelectedCampaign()!.id!, updatedNode);
	}
}
