import { Routes } from '@angular/router';
import { MapView } from './map-view/map-view';
import { Login } from './login/login';
import { MapSelection } from './mapselection/mapselection';
import { CampaignSelection } from './campaignselection/campaignselection';
import { AuthGuard } from './auth-guard';
import { CampaignGuard } from './campaign-guard';
import { CreateCampaign } from './create-campaign/create-campaign';
import { CreateMap } from './create-map/create-map';
import { MapGuard } from './map-guard';
import { CreateAccount } from './create-account/create-account';


//current setup for multiple guards that depend on each other:
//The guards themselves call their prerequisites.
//Example: Mapguard first calls Campaignguard which first calls AuthGuard
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
		canActivate: [CampaignGuard],
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
		component: MapView,
		canActivate: [MapGuard],
	},
	{
		path: 'createcampaign',
		title: 'Campaign Creator',
		component: CreateCampaign,
		canActivate: [AuthGuard],
	},
	{
		path: 'createmap',
		title: 'Map Creator',
		component: CreateMap,
		canActivate: [CampaignGuard],
	},
	{
		path: 'createaccount',
		title: 'New Account',
		component: CreateAccount,
	},
	{
		path: '**',
		redirectTo: '/map'
	},
];
