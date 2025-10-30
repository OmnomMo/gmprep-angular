import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserEvents {
	keyboardEvent = new Subject<KeyboardEvent>();
	keyboardEvent$ = this.keyboardEvent.asObservable();

	nodeFormEditingStartEvent = new Subject<string>();
	nodeFormEditingStartEvent$ = this.nodeFormEditingStartEvent.asObservable();

	fireKeyboardEvent(e: KeyboardEvent) {
		this.keyboardEvent.next(e);
	}

	fireNodeFormEditingStartEvent(formControlName : string) {
		console.log("start edit " + formControlName)
		this.nodeFormEditingStartEvent.next(formControlName);
	}
}
