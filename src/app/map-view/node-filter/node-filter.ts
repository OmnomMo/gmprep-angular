import { Component, output, Signal, signal } from '@angular/core';
import { GmNode } from '../../models/map-node';
import { filter } from 'rxjs';
import { MapService } from '../../map-service';
import { TagService } from '../../tag-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-node-filter',
	imports: [],
	templateUrl: './node-filter.html',
	styleUrl: './node-filter.css',
})
export class NodeFilter {
	filterActive = signal<boolean>(false);
	filterVisible = signal<boolean>(false);
	possibleTags = signal<string[]>([]);

	onSettingsChanged = output<NodeFilterSettings>();

	filterSettings: NodeFilterSettings;

	constructor(
		private mapService: MapService,
		protected tagService: TagService,
	) {
		this.filterSettings = new NodeFilterSettings(mapService, tagService);

		tagService.tags$.subscribe({
			next: tags => {
				this.possibleTags.set(Array.from(tags));
				//remove all filters for tags that don't exist anymore
				this.filterSettings.filterByTags.forEach(item => {
					if (!tags.has(item)) {
						this.filterSettings.filterByTags.delete(item);
					}
				})
			}
		})
	}

	
	toggleTag(tag : string) {
		if (this.filterSettings.filterByTags.has(tag)) {
			this.filterSettings.filterByTags.delete(tag);
		} else {
			this.filterSettings.filterByTags.add(tag);
		}
		this.updateFilters();
	}

	clickedFilterIcon(e: MouseEvent) {
		e.stopPropagation();
		if (this.filterActive()) {
			this.filterSettings = new NodeFilterSettings(this.mapService, this.tagService);
			this.updateFilters();
			this.filterVisible.set(false);
		} else {
			this.filterVisible.set(!this.filterVisible());
		}
	}

	toggleFilterViewOff(e: MouseEvent) {
		e.stopPropagation();
		this.filterVisible.set(false);
	}

	toggleFilterByCreatures() {
		this.filterSettings.filterByCreatures = !this.filterSettings.filterByCreatures;
		this.updateFilters();
	}

	toggleFilterByLocations() {
		this.filterSettings.filterByLocations = !this.filterSettings.filterByLocations;
		this.updateFilters();
	}
	toggleFilterByMapNodes() {
		this.filterSettings.filterByMapNodes = !this.filterSettings.filterByMapNodes;
		this.updateFilters();
	}

	setFilterString(string: string) {
		this.filterSettings.filterString = string;
		this.updateFilters();
	}

	updateFilters() {
		this.filterActive.set(this.filterSettings.areFiltersActive());
		this.onSettingsChanged.emit(this.filterSettings);
	}
}

export class NodeFilterSettings {
	constructor(private mapService: MapService, private tagService : TagService) {}

	filterByCreatures: boolean = false;
	filterByLocations: boolean = false;
	filterByMapNodes: boolean = false;

	filterString: string = '';

	filterByTags: Set<string> = new Set<string>();

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

		if (this.filterByTags.size > 0) {
			filteredNodes = filteredNodes.filter((node) => {
				var nodeTags : string[] = this.tagService.getTags(node.tags);
				//check if node tags include all tags that are filtered for.
				var filterTagArray : string[] = Array.from(this.filterByTags);
				return filterTagArray.every(filterTag => nodeTags.includes(filterTag));
			})
		}

		return filteredNodes;
	}

	areFiltersActive(): boolean {
		return (
			this.filterByCreatures ||
			this.filterByLocations ||
			this.filterByMapNodes ||
			this.filterString != ''
		);
	}
}
