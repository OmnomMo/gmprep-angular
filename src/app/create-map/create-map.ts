import { Component, signal } from '@angular/core';
import { NameFormComponent } from "../forms/name-form-component/name-form-component";
import { MultilineFormComponent } from "../forms/multiline-form-component/multiline-form-component";
import { ImagelinkFormComponent } from "../forms/imagelink-form-component/imagelink-form-component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { MapService } from '../map-service';
import { GMMap } from '../models/map';

@Component({
  selector: 'app-create-map',
  imports: [NameFormComponent, MultilineFormComponent, ImagelinkFormComponent, ReactiveFormsModule],
  templateUrl: './create-map.html',
  styleUrl: './create-map.css'
})
export class CreateMap {

	createMapForm = new FormGroup({
		name: new FormControl(''),
		description: new FormControl(''),
		imageLink: new FormControl(''),
	})

	submitting = signal<boolean>(false);

	constructor(
		public router: Router,
		public auth: AuthService,
		public mapService: MapService) {

		var editedMap : GMMap | null = mapService.editedMap;
		
		if (editedMap != null) {
			this.createMapForm.setValue({
				name: editedMap.name,
				description: editedMap.description,
				imageLink: editedMap.externalImageUrl,
			})
		}
	}

	ngOnDestroy(): void {
		console.log("Cleaning up create map data");
		this.mapService.editedMap = null;
	}

	abort() {
		this.router.navigate(['/mapselection']);
	}

	onSubmit() {
		console.log(this.createMapForm.value)

		var map : GMMap;
		var controls = this.createMapForm.controls;

		if (this.mapService.editedMap != null) {
			map = this.mapService.editedMap;
			map.name = controls.name.value!;
			map.description = controls.description.value!;
			map.externalImageUrl = controls.imageLink.value!;
		} else {
			map = new GMMap(
				0,
				controls.name.value!,
				controls.description.value!,
				"",
				controls.imageLink.value!,
				"2048",
				"2048",
			)
		}

		this.submitting.set(true);

		this.mapService.updateMap(map).subscribe({
			next: () => {
				console.log("Successfully created new map!")
				this.router.navigate(['/mapselection'])
			},
			error: (e) => {
				console.error(`Could not create map: ${e}`);
				alert(e);
				this.router.navigate(['/mapselection'])
			}
		})
	}
}
