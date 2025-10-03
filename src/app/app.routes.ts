import { Routes } from '@angular/router';
import { Map } from './map/map';
import { Login } from './login/login';
import { MapSelection } from './mapselection/mapselection';
import { CampaignSelection } from './campaignselection/campaignselection';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
	{
		path: 'login',
		title:'Login',
		component: Login
	},
	{
		path:'mapselection',
		title:'Select Map',
		component: MapSelection,
		canActivate: [AuthGuard],
	},
	{
		path: 'campaignselection',
		title:'Select Campaign',
		component: CampaignSelection,
		canActivate: [AuthGuard],
	},
	{
		path: 'map',
		title:'Map',
		component: Map,
		canActivate: [AuthGuard],
	},
	{
		path: '**',
		redirectTo: '/map'
	},
];
