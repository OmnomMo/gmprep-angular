import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GmNodeOptions {

	public stats : string[] = [
		"STR",
		"DEX",
		"CON",
		"INT",
		"WIS",
		"CHA",
	]

	public sizes : string[] = [
		"Tiny",
		"Small",
		"Medium",
		"Large",
		"Huge",
		"Gargantuan",
	];

	public alignments : string[] = [
		"Lawful Good",
		"Neutral Good",
		"Chaotic Good",
		"Lawful Neutral",
		"True Neutral",
		"Chaotic Neutral",
		"Lawful Evil",
		"Neutral Evil",
		"Chaotic Evil",
	]

	public creatureTypes : string[] = [
		"Aberration",
		"Beast",
		"Celestial",
		"Construct",
		"Dragon",
		"Elemental",
		"Fey",
		"Fiend",
		"Giant",
		"Humanoid",
		"Monstrosity",
		"Ooze",
		"Plant",
		"Undead",
	]
}
