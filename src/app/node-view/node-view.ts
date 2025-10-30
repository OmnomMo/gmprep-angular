import {
	Component,
	inject,
	input,
	OnChanges,
	signal,
	SimpleChanges,
	ViewChild,
	viewChild,
} from '@angular/core';
import { CreatureInfo, GmNode, LocationInfo } from '../models/map-node';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NameFormComponent } from '../forms/name-form-component/name-form-component';
import { MultilineFormComponent } from '../forms/multiline-form-component/multiline-form-component';
import { NodeService } from '../node-service';
import { CampaignService } from '../campaign-service';
import { AuthService } from '../auth';
import { PortraiticonFormComponent } from '../forms/portraiticon-form-component/portraiticon-form-component';
import { GmNodeOptions } from '../utils/gm-node-options';
import { StringSelector } from '../forms/string-selector/string-selector';
import { StatsForm } from '../forms/stats-form/stats-form';
import { MovementForm } from '../forms/movement-form/movement-form';
import { MultiStringSelector } from '../forms/multi-string-selector/multi-string-selector';
import { NodeFormArray } from '../forms/node-form-array/node-form-array';
import { ActionForm } from '../forms/action-form/action-form';
import { SkillForm } from '../forms/skill-form/skill-form';
import { SecretForm } from '../forms/secret-form/secret-form';

@Component({
	selector: 'app-node-view',
	imports: [
		NameFormComponent,
		ReactiveFormsModule,
		MultilineFormComponent,
		PortraiticonFormComponent,
		StringSelector,
		StatsForm,
		MovementForm,
		MultiStringSelector,
		NodeFormArray,
		ActionForm,
		SkillForm,
		SecretForm,
	],
	templateUrl: './node-view.html',
	styleUrl: './node-view.css',
})
export class NodeView implements OnChanges {
	node = input.required<GmNode>();
	formBuilder = inject(FormBuilder);
	nodeForm: FormGroup | null = null;

	isCreature = signal<boolean>(false);
	isLocation = signal<boolean>(false);

	@ViewChild('actionsForm') actionsForm: NodeFormArray | undefined;
	@ViewChild('skillsForm') skillsForm: NodeFormArray | undefined;
	@ViewChild('secretsForm') secretsForm: NodeFormArray | undefined;

	protected defaultAction = {
		name: 'Name',
		description: 'Description',
	};

	protected defaultSkill = {
		skillName: 'Athletics',
		bonus: '10',
	};

	protected defaultSecret = {
		description: '',
		testSkill: 'None',
		testDifficulty: '10',
	};

	constructor(
		private auth: AuthService,
		private nodeService: NodeService,
		private campaignService: CampaignService,
		protected gmNodeOptions: GmNodeOptions,
	) {}

	onControlSubmit() {
		this.submitNode();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.buildForm();
	}

	buildForm() {
		console.log('Building Form:');
		console.log(this.node());

		this.isCreature.set(this.node().creatureInfo != null);
		this.isLocation.set(this.node().locationInfo != null);

		var creatureInfoGroup: FormGroup = this.formBuilder.group({});
		if (this.isCreature()) {
			//build creature info form group
			var creatureInfo: CreatureInfo = this.node().creatureInfo!;
			creatureInfoGroup = this.formBuilder.group({
				creatureType: [creatureInfo.creatureType ?? 'Humanoid'],
				size: [creatureInfo.size ?? 'Medium'],
				AC: [creatureInfo.ac ?? '15'],
				HP: [creatureInfo.hp ?? '20'],
				speed: [creatureInfo.speed ?? ''],
				speedFlying: [creatureInfo.speedFlying ?? ''],
				speedSwimming: [creatureInfo.speedSwimming ?? ''],
				alignment: [creatureInfo.alignment ?? 'Lawful Good'],
				languages: [creatureInfo.languages ?? ''],
				senses: [creatureInfo.senses ?? ''],
				damageResistances: [creatureInfo.damageResistances ?? ''],
				damageImmunities: [creatureInfo.damageImmunities ?? ''],
				conditionImmunities: [creatureInfo.conditionImmunities ?? ''],
				damageVulnerabilities: [creatureInfo.damageVulnerabilities ?? ''],
				skills: this.formBuilder.array([]),
				actions: this.formBuilder.array([]),
				CHA: [creatureInfo.cha ?? '10'],
				CON: [creatureInfo.con ?? '10'],
				DEX: [creatureInfo.dex ?? '10'],
				INT: [creatureInfo.int ?? '10'],
				STR: [creatureInfo.str ?? '10'],
				WIS: [creatureInfo.wis ?? '10'],
				CR: [creatureInfo.cr ?? '1'],
			});

			var actionFormArray: FormArray = creatureInfoGroup.get('actions') as FormArray;
			creatureInfo.actions.forEach((action) => {
				actionFormArray.push(
					this.formBuilder.group({
						id: action.id,
						name: [action.name],
						description: [action.description],
					}),
				);
			});

			var skillsFormArray: FormArray = creatureInfoGroup.get('skills') as FormArray;
			creatureInfo.skills.forEach((skill) => {
				skillsFormArray.push(
					this.formBuilder.group({
						id: skill.id,
						skillName: [skill.skillName],
						bonus: [skill.bonus],
					}),
				);
			});
		}

		var locationInfoGroup : FormGroup = this.formBuilder.group({});
		if (this.isLocation()) {
			var locationInfo = this.node().locationInfo;
			locationInfoGroup = this.formBuilder.group({
				population: locationInfo!.population,
			})
		}

		//build form group from node
		this.nodeForm = this.formBuilder.group({
			name: [this.node().name ?? '', Validators.required],
			description: [this.node().description ?? ''],
			mapIconPath: [this.node().mapIconPath ?? '', Validators.required],
			portraitPath: [this.node().portraitPath ?? ''],
			mapIconSize: [this.node().mapIconSize ?? '64', Validators.required],
			creatureInfo: creatureInfoGroup,
			locationInfo: locationInfoGroup,
			secrets: this.formBuilder.array([]),
		});

		var secretsFormArray: FormArray = this.nodeForm.get('secrets') as FormArray;
		this.node().secrets.forEach((secret) => {
			secretsFormArray.push(
				this.formBuilder.group({
					id: secret.id,
					description: secret.description,
					testSkill: secret.testSkill,
					testDifficulty: secret.testDifficulty,
				}),
			);
		});
	}

	setIsCreature(isCreature: boolean) {
		if (!isCreature) {
			if (confirm('Are you sure you want to remove all creature infos from this node?')) {
				this.node().creatureInfo = null;
				this.isCreature.set(false);
			}
		} else {
			this.node().creatureInfo = new CreatureInfo();
			this.isCreature.set(true);
		}
		this.buildForm();
		this.onControlSubmit();
	}

	setIsLocation(isLocation: boolean) {
		if (!isLocation) {
			if (confirm('Are you sure you want to remove all location info from this node?')) {
				this.node().locationInfo = null;
				this.isLocation.set(false);
			}
		} else {
			this.node().locationInfo = new LocationInfo();
			this.isLocation.set(true);
		}
		this.buildForm();
		this.onControlSubmit();
	}

	getSubFormGroup(groupName: string): FormGroup {
		var control = this.nodeForm!.get(groupName) as FormGroup;
		return control;
	}

	getFormArray(group: FormGroup, arrayName: string): FormArray {
		var array = group.get(arrayName) as FormArray;
		return array;
	}

	getFormArrayGroups(group: FormGroup, arrayName: string): FormGroup[] {
		var array = group.get(arrayName) as FormArray;
		return array.controls as FormGroup[];
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
		this.nodeService.updateNode(
			this.auth.getUserToken(),
			this.campaignService.getSelectedCampaign()!.id!,
			updatedNode,
		);
	}
}
