import { Injectable, isDevMode } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UrlBuilder {
	private localUrl: string = `http://localhost:5140/`;
	private remoteUrl: string = 'https://gmprep-server.fly.dev';

	public buildUrl(route: string[]): string {
		return this.getUrlBase() + route.join('/');
	}

	private getUrlBase(): string {
		if (isDevMode()) {
			return this.localUrl;
		} else {
			return this.remoteUrl;
		}
	}
}
