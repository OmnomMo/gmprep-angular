import { Component } from '@angular/core';
import { MapBackground } from "./map-background/map-background";

@Component({
  selector: 'app-map',
  imports: [MapBackground],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css'
})
export class MapView {

}
