import { Component, inject, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GmNode, LocationInfo } from '../models/map-node';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NameFormComponent } from "../forms/name-form-component/name-form-component";
import { MultilineFormComponent } from "../forms/multiline-form-component/multiline-form-component";

@Component({
	selector: 'app-node-view',
	imports: [NameFormComponent, ReactiveFormsModule, MultilineFormComponent],
	templateUrl: './node-view.html',
	styleUrl: './node-view.css'
})
export class NodeView implements OnChanges {
	node = input.required<GmNode>();

	formBuilder = inject(FormBuilder);

	nodeForm: FormGroup | null = null;

	ngOnChanges(changes: SimpleChanges): void {
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


}
