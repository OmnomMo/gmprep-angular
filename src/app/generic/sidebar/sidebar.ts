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
	min_width = 250;
	max_width = 800;

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
		e.preventDefault();
		e.stopPropagation();
		this.dragHandleStartPosX = e.clientX;
		this.draggingHandle = true;
	}

	onHandleMouseMove(e: MouseEvent) {
		if (!this.draggingHandle) {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		var dX = this.dragHandleStartPosX - e.clientX;
		this.dragHandleStartPosX = e.clientX;

		var target_width : number;
		if (this.isLeftSide()) {
			target_width = this.width() - dX;
		} else {
			target_width = this.width() + dX;
		}

		target_width = Math.min(Math.max(target_width, this.min_width), this.max_width);
		this.width.set(target_width);
	}

	onHandleMouseUp(e: MouseEvent) {
		this.draggingHandle = false;
	}

}
