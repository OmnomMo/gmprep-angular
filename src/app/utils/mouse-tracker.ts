import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MouseTracker {

	public e: MouseEvent | null = null

	mouseUp = new Subject<MouseEvent>();
	mouseUp$ = this.mouseUp.asObservable();

	setMouseEvent(e: MouseEvent) {
		this.e = e;
	}

	callMouseUp(e : MouseEvent) {
		this.mouseUp.next(e);
	}


}
