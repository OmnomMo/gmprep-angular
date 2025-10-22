import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MouseTracker {


	mouseUp = new Subject<MouseEvent>();
	mouseUp$ = this.mouseUp.asObservable();

	mouseMove = new BehaviorSubject<MouseEvent | null>(null);
	mouseMove$ = this.mouseMove.asObservable();

	setMouseEvent(e: MouseEvent) {
		this.mouseMove.next(e);
	}

	callMouseUp(e : MouseEvent) {
		this.mouseUp.next(e);
	}


}
