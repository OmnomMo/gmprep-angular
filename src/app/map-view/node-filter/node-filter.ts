import { Component, output, signal } from '@angular/core';
import { GmNode } from '../../models/map-node';
import { filter } from 'rxjs';
import { MapService } from '../../map-service';

@Component({
	selector: 'app-node-filter',
	imports: [],
	templateUrl: './node-filter.html',
	styleUrl: './node-filter.css',
})
export class NodeFilter {
	filterActive = signal<boolean>(false);
	filterVisible = signal<boolean>(false);

	onSettingsChanged = output<NodeFilterSettings>();

	filterSettings: NodeFilterSettings;

	constructor(private mapService: MapService) {
		this.filterSettings = new NodeFilterSettings(mapService);
	}

	toggleActive() {
		console.log('toggle filter active');
		if (!this.filterActive()) {
			this.filterActive.set(true);
		} else {
			this.filterActive.set(false);
		}
	}

	toggleFilterByCreatures() {
		this.filterSettings.filterByCreatures = !this.filterSettings.filterByCreatures;
		this.onSettingsChanged.emit(this.filterSettings);
	}

	toggleFilterByLocations() {
		this.filterSettings.filterByLocations = !this.filterSettings.filterByLocations;
		this.onSettingsChanged.emit(this.filterSettings);
	}
	toggleFilterByMapNodes() {
		this.filterSettings.filterByMapNodes = !this.filterSettings.filterByMapNodes;
		this.onSettingsChanged.emit(this.filterSettings);
	}

	setFilterString(string: string) {
		this.filterSettings.filterString = string;
		this.onSettingsChanged.emit(this.filterSettings);
	}
}

export class NodeFilterSettings {
	constructor(private mapService: MapService) {}

	filterByCreatures: boolean = false;
	filterByLocations: boolean = false;
	filterByMapNodes: boolean = false;

	filterString: string = '';

	applyFilters(toFilter: GmNode[]): GmNode[] {
		var filteredNodes: GmNode[] = Object.assign([], toFilter);

		if (this.filterByCreatures) {
			filteredNodes = filteredNodes.filter((node) => node.creatureInfo != null);
		}

		if (this.filterByLocations) {
			filteredNodes = filteredNodes.filter((node) => node.locationInfo != null);
		}

		if (this.filterByMapNodes) {
			filteredNodes = filteredNodes.filter((node) =>
				this.mapService.getMapNodes().some((mapNode) => mapNode.node.id == node.id),
			);
		}

		if (this.filterString != '') {
			filteredNodes = filteredNodes.filter((node) =>
				node.name.toLowerCase().includes(this.filterString.toLowerCase()),
			);
		}

		return filteredNodes;
	}
}
