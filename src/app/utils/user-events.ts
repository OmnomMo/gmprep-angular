import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserEvents {
	keyboardEvent = new Subject<KeyboardEvent>();
	keyboardEvent$ = this.keyboardEvent.asObservable();


	editMode = new BehaviorSubject<boolean>(false);
	editMode$ = this.editMode.asObservable();

	setEditMode(inEditing : boolean) {
		this.editMode.next(inEditing);
	}

	fireKeyboardEvent(e: KeyboardEvent) {
		this.keyboardEvent.next(e);
	}

}
