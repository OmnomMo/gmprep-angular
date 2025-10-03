import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

	constructor(private authService : AuthService, private http: HttpClient) {
	}

	private campaigns = new Subject();
	campaigns$ = this.campaigns.asObservable();

	requestCampaigns() {
		console.log("Requesting campaigns");
		this.http.get(`http://localhost:5140/campaigns/${this.authService.getUserToken()}`)
			.subscribe({
				next: (response) => {
					console.log(response);
				},
				error: (e) => {
					console.log(e);
				}
			});
	}
  
}
