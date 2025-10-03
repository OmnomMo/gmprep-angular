import { Routes } from '@angular/router';
import { Map } from './map/map';
import { Login } from './login/login';
import { MapSelection } from './mapselection/mapselection';
import { CampaignSelection } from './campaignselection/campaignselection';

export const routes: Routes = [
	{path: 'login', title:'Login', component: Login},
	{path: 'mapselection', title:'Select Map', component: MapSelection},
	{path: 'campaignselection', title:'Select Campaign', component: CampaignSelection},
	{path: 'map', title:'Map', component: Map},
	{path: '**', redirectTo: '/map'},
];
