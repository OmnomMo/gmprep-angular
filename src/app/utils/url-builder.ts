import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UrlBuilder {
	private baseUrl: string = `http://localhost:5140/`

	public buildUrl(route : string[]) : string {
		return this.baseUrl + route.join("/");
	}

	
}
