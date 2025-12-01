import { Component, inject, input, output } from '@angular/core';
import { ImportService } from '../../import-service';
import { NodeService } from '../../node-service';
import { GmNode } from '../../models/map-node';

@Component({
	selector: 'app-map-context',
	imports: [],
	templateUrl: './map-context.html',
	styleUrl: './map-context.css',
})
export class MapContext {
	contextClosed = output<void>();
	mapNodeAdded = output<void>();
	mapNodePasted = output<GmNode>();

	posX = input.required<number>();
	posY = input.required<number>();

	importService = inject(ImportService);
	nodeService = inject(NodeService);

	getContainerPosStyle(): string {
		return `left:${this.posX()}px;top:${this.posY()}px;`;
	}

	tryPasteMapNode() {
		this.importService.parseClipboard().then((node) => {
			console.log('Node imported.');
			console.log(node);
			if (node != null) {
				this.mapNodePasted.emit(node);
			}
		});
	}
}
