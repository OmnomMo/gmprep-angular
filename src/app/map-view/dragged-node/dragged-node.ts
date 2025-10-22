import { Component, HostListener, Input, input, OnChanges, OnDestroy, output, signal, SimpleChanges } from '@angular/core';
import { GmNode } from '../../models/map-node';
import { MouseTracker } from '../../utils/mouse-tracker';
import { Subscription } from 'rxjs';
import { MapService } from '../../map-service';

@Component({
  selector: 'app-dragged-node',
  imports: [],
  templateUrl: './dragged-node.html',
  styleUrl: './dragged-node.css'
})
export class DraggedNode implements OnChanges, OnDestroy{

	posStyle = signal<string>("");
	node = input<GmNode | null>(null);

	mouseUpSubscription: Subscription

	constructor(
		private mouseTracker : MouseTracker,
		private mapService : MapService,
	) {

		this.mouseUpSubscription =  mouseTracker.mouseUp$.subscribe({
			next: e => {this.onMouseUp(e);},
		})

	}

	//handles position of dragged node before onMouseMove event is called
	ngOnChanges(changes: SimpleChanges): void {
		var cachedEvent : MouseEvent | null = this.mouseTracker.mouseMove.getValue();
		if (cachedEvent == null) {
			return;
		}
		this.onMouseMove(cachedEvent!);
	}

	ngOnDestroy(): void {
		this.mouseUpSubscription?.unsubscribe();
	}


	@HostListener('document:mousemove', ['$event'])
	onMouseMove(e: MouseEvent) {

		if (this.node() == null) {
			return;
		}
		var size: number = parseFloat(this.node()!.mapIconSize);
		var sizeStyle : string = `min-width: ${size}px; min-height: ${size}px; `
		var posStyle : string = `left: ${e.clientX - size/2}px; top: ${e.clientY - size/2}px;`;
		this.posStyle.set(sizeStyle + posStyle)
	}

	onMouseUp(e: MouseEvent) {
		if (this.node() == null) {
			return;
		}
		console.log("Dragged node mouse up");
		this.mapService.dropMapNode(e, this.node()!);
	}
}

