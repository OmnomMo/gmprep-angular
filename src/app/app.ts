import { Component, HostListener, inject, Signal, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth';
import { GMUser } from './models/user';
import { MouseTracker } from './utils/mouse-tracker';
import { UserEvents } from './utils/user-events';
import { toSignal } from '@angular/core/rxjs-interop';
import { VersionService } from './utilities/version-service';
import { Bestiary } from './bestiary/bestiary';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {

	constructor(
		protected authService : AuthService,
		private router: Router,
		private mouseTracker : MouseTracker,
		private keyboardEvents: UserEvents,
		protected versionService : VersionService
	) {
		this.user = toSignal(authService.user$);
	}

	protected readonly title = signal('gmprep');
	user : Signal<GMUser | null | undefined>;
	bestiary = inject(Bestiary)

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.keyboardEvents.fireKeyboardEvent(event);
	}

	getNavButtonState() {
		if (this.user() != null) {
			return ('navElement linkEnabled');
		} else {
			return('navElement linkDisabled');
		}
	}

	onMouseMove(e : MouseEvent) {
		this.mouseTracker.setMouseEvent(e);
	}

	onMouseUp(e: MouseEvent) {
		this.mouseTracker.callMouseUp(e);
	}


	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}
}
