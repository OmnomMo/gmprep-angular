import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class KeyboardEvents {
	keyboardEvent = new Subject<KeyboardEvent>();
	keyboardEvent$ = this.keyboardEvent.asObservable();

	fireKeyboardEvent(e: KeyboardEvent) {
		this.keyboardEvent.next(e);
	}
}
