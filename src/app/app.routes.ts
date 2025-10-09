import { Routes } from '@angular/router';
import { MapView } from './map-view/map-view';
import { Login } from './login/login';
import { MapSelection } from './mapselection/mapselection';
import { CampaignSelection } from './campaignselection/campaignselection';
import { AuthGuard } from './auth-guard';
import { CampaignGuard } from './campaign-guard';
import { CreateCampaign } from './create-campaign/create-campaign';
import { CreateMap } from './create-map/create-map';

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
		canActivate: [AuthGuard, CampaignGuard],
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
		canActivate: [AuthGuard],
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
		canActivate: [AuthGuard, CampaignGuard],
	},
	{
		path: '**',
		redirectTo: '/map'
	},
];
