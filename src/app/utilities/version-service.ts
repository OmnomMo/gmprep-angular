import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class VersionService {
	version : number = 0;
	subVersion : number = 2;

	getVersionString () : string {
		var host: string = "vercel";
		if (document.location.origin.includes("localhost")){
			host = "local";
		}

		return `${host}:${this.version}_${this.subVersion}`;
	}
}
