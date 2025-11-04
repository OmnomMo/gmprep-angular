import { Injectable } from '@angular/core';
import { GmNode } from './models/map-node';
import { NodeService } from './node-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TagService {
	tags = new BehaviorSubject<Set<string>>(new Set<string>());
	tags$ = this.tags.asObservable();

	constructor(private nodeService: NodeService) {
		nodeService.nodes$.subscribe({
			next: (nodes) => {
				this.updateTags(nodes);
			},
		});

		nodeService.nodeUpdated$.subscribe({
			next: () => {
				this.updateTags(nodeService.nodes.value);
			}
		})
	}

	updateTags(nodes: GmNode[]) {
		var newTags = new Set<string>();

		for (const node of nodes) {
			var nodeTags: string[] = this.getTags(node.tags);
			nodeTags.forEach((tag) => newTags.add(tag));
		}

		this.tags.next(newTags);
	}

	getTags(tagString : string) : string[] {
		if (tagString.length == 0){
			return [];
		}
		return tagString.split(';');
	}
}
