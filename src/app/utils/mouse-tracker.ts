import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MouseTracker {

	public e: MouseEvent | null = null

	setMouseEvent(e: MouseEvent) {
		this.e = e;
	}
}
