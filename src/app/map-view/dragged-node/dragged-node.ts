import { Component, HostListener, Input, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { GmNode } from '../../models/map-node';
import { MouseTracker } from '../../utils/mouse-tracker';

@Component({
  selector: 'app-dragged-node',
  imports: [],
  templateUrl: './dragged-node.html',
  styleUrl: './dragged-node.css'
})
export class DraggedNode implements OnChanges{

	posStyle = signal<string>("");
	node = input<GmNode | null>(null);
	dropped = output<MouseEvent>();

	constructor(
		private mouseTracker : MouseTracker
	) {}

	//handles position of dragged node before onMouseMove event is called
	ngOnChanges(changes: SimpleChanges): void {
		this.onMouseMove(this.mouseTracker.e!)
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
		console.log("Dragged node mouse up");
		this.dropped.emit(e);
	}
}

