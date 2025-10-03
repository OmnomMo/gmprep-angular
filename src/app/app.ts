import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {

	constructor(private authService : AuthService, private router: Router) {
		var _self = this;
		authService.authState$.subscribe({
			next(state) {
				var test : boolean = state as boolean
				_self.loginStateChanged(test);
			}
		})
	}

	protected readonly title = signal('gmprep');
	navButtonState = signal('disabled-link');

	loginStateChanged(state : boolean) {
		if (state) {
			this.navButtonState.set('enabled-link');
		} else {
			this.navButtonState.set('disabled-link');
		}
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}
}
