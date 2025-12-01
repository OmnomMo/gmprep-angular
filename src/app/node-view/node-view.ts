import {
	Component,
	inject,
	input,
	OnChanges,
	Signal,
	signal,
	SimpleChanges,
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
import { MapService } from '../map-service';
import { UserEvents } from '../utils/user-events';
import { toSignal } from '@angular/core/rxjs-interop';
import { ImportService } from '../import-service';
import { TagsForm } from "../forms/tags-form/tags-form";
import { debounceTime, Subscription } from 'rxjs';

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
    TagsForm
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
	editMode: Signal<boolean | undefined>;

	nodeUpdateSubscription : Subscription | null | undefined;

	
	protected defaultAction = {
		name: 'Name',
		description: 'Description',
	};

	protected defaultSkill = {
		skillName: 'Athletics',
		bonus: '10',
	};
	
	protected defaultSavingThrow = {
		savingThrowName: 'STR',
		bonus: '4',
	};

	protected defaultSecret = {
		description: '',
		testSkill: 'None',
		testDifficulty: '10',
	};

	constructor(
		private auth: AuthService,
		private nodeService: NodeService,
		private mapService: MapService,
		private campaignService: CampaignService,
		protected userEvents: UserEvents,
		protected importService: ImportService,
		protected gmNodeOptions: GmNodeOptions,
	) {
		this.editMode = toSignal<boolean>(userEvents.editMode$);
	}


	ngOnChanges(changes: SimpleChanges): void {
		this.nodeUpdateSubscription?.unsubscribe
		this.buildForm();
		this.nodeUpdateSubscription = this.nodeForm?.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
			this.submitNode();
		});
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
				ac: [creatureInfo.ac ?? '15'],
				hp: [creatureInfo.hp ?? '20'],
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
				savingThrows: this.formBuilder.array([]),
				actions: this.formBuilder.array([]),
				cha: [creatureInfo.cha ?? '10'],
				con: [creatureInfo.con ?? '10'],
				dex: [creatureInfo.dex ?? '10'],
				int: [creatureInfo.int ?? '10'],
				str: [creatureInfo.str ?? '10'],
				wis: [creatureInfo.wis ?? '10'],
				cr: [creatureInfo.cr ?? '1'],
			});

			//build form arrays

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

			var savingThrowsFormArray: FormArray = creatureInfoGroup.get(
				'savingThrows',
			) as FormArray;
			creatureInfo.savingThrows.forEach((savingThrow) => {
				savingThrowsFormArray.push(
					this.formBuilder.group({
						id: savingThrow.id,
						savingThrowName: [savingThrow.savingThrowName],
						bonus: [savingThrow.bonus],
					}),
				);
			});
		}

		var locationInfoGroup: FormGroup = this.formBuilder.group({});
		if (this.isLocation()) {
			var locationInfo = this.node().locationInfo;
			locationInfoGroup = this.formBuilder.group({
				population: locationInfo!.population,
			});
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
			tags: this.node().tags ?? "",
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
		var modifiedNode: GmNode = this.getNodeFromForm();

		if (!isCreature) {
			if (confirm('Are you sure you want to remove all creature infos from this node?')) {
				modifiedNode.creatureInfo = null;
				this.isCreature.set(false);
			}
		} else {
			modifiedNode.creatureInfo = new CreatureInfo();
			this.isCreature.set(true);
		}
		this.submitNode(modifiedNode);
		this.mapService.setSelectedNode(modifiedNode);
	}

	setIsLocation(isLocation: boolean) {
		var modifiedNode: GmNode = this.getNodeFromForm();
		if (!isLocation) {
			if (confirm('Are you sure you want to remove all location info from this node?')) {
				modifiedNode.locationInfo = null;
				this.isLocation.set(false);
			}
		} else {
			modifiedNode.locationInfo = new LocationInfo();
			this.isLocation.set(true);
		}
		this.submitNode(modifiedNode);
		this.mapService.setSelectedNode(modifiedNode);
	}

	importFromString() {
		console.log('Import button clicked');
		this.importService.parseClipboard().then((node) => {
			console.log('Node imported.');
			console.log(node);
			if (node != null) {
				this.nodeService.copyNodeValues(node, this.node());
				this.buildForm();
				this.submitNode();
			}
		});
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

	deleteNode() {
		if (confirm('Are you sure you want to delete this node? This cannot be undone.')) {
			this.nodeService.deleteNode(
				this.campaignService.getSelectedCampaign()!.id,
				this.node(),
			);
		}
	}

	getNodeFromForm(): GmNode {
		var node: GmNode = this.nodeForm!.value;
		node.id = this.node().id;
		if (!this.isCreature()) {
			node.creatureInfo = null;
		}
		if (!this.isLocation()) {
			node.locationInfo = null;
		}
		return node;
	}

	submitNode(node: GmNode | null = null) {
		var submittedNode: GmNode = node ?? this.getNodeFromForm();

		this.nodeService.updateNode(
			this.campaignService.getSelectedCampaign()!.id!,
			submittedNode,
		);
	}
}
