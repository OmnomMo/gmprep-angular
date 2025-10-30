import { Component, input, signal } from '@angular/core';
import { MouseTracker } from '../../utils/mouse-tracker';

@Component({
	selector: 'app-sidebar',
	imports: [],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.css'
})
export class Sidebar {
	isLeftSide = input.required<boolean>();
	width = signal<number>(400);

	draggingHandle: boolean = false;
	dragHandleStartPosX: number = 0;

	constructor(
		mouseTracker: MouseTracker
	) {
		mouseTracker.mouseMove$.subscribe({
			next: e => {
				this.onHandleMouseMove(e!);
			}
		});
		mouseTracker.mouseUp$.subscribe({
			next: e => {
				this.onHandleMouseUp(e);
			}
		})
	}

	getWidthStyle(): string {
		return `width: ${this.width()}px;`;
	}

	getSidebarClass(): string {
		if (this.isLeftSide()) {
			return "sidebar sidebarLeft";
		} else {
			return "sidebar sidebarRight";
		}
	}

	getHandleClass(): string {
		if (this.isLeftSide()) {
			return "sidebarHandle sidebarHandleRight";
		} else {
			return "sidebarHandle sidebarHandleLeft";
		}
	}

	onHandleMouseDown(e: MouseEvent) {
		this.dragHandleStartPosX = e.clientX;
		this.draggingHandle = true;
	}

	onHandleMouseMove(e: MouseEvent) {
		e.stopPropagation();
		if (!this.draggingHandle) {
			return;
		}
		var dX = this.dragHandleStartPosX - e.clientX;
		this.dragHandleStartPosX = e.clientX;

		if (this.isLeftSide()) {
			this.width.set(this.width() - dX);
		} else {
			this.width.set(this.width() + dX);
		}
	}

	onHandleMouseUp(e: MouseEvent) {
		this.draggingHandle = false;
	}

}
