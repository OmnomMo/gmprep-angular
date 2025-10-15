import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth';
import { GMUser } from './models/user';
import { MapService } from './map-service';
import { CampaignService } from './campaign-service';
import { MouseTracker } from './utils/mouse-tracker';

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
	) {
		var _self = this;
		authService.authState$.subscribe({
			next(state) {
				var test : boolean = state as boolean
				_self.loginStateChanged(test);
			}
		})
		authService.user$.subscribe({
			next(user) {
				_self.user.set(user);
			}
		})
	}

	protected readonly title = signal('gmprep');
	navButtonState = signal('disabled-link');
	loggedIn = signal(false);
	user = signal<GMUser | null>(null);

	onMouseMove(e : MouseEvent) {
		this.mouseTracker.setMouseEvent(e);
	}

	loginStateChanged(state : boolean) {
		if (state) {
			this.navButtonState.set('enabled-link');
			this.loggedIn.set(true);
		} else {
			this.navButtonState.set('disabled-link');
			this.loggedIn.set(false);
		}
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}
}
