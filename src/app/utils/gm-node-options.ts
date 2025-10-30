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

	public skills : string[] = [
		"NONE",
		"Athletics",
		"Acrobatics",
		"Sleight of Hand",
		"Stealth",
		"Arcana",
		"History",
		"Investigation",
		"Nature",
		"Religion",
		"Animal Handling",
		"Insight",
		"Medicine",
		"Perception",
		"Survival",
		"Deception",
		"Intimidation",
		"Performance",
		"Persuasion",
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

	public damageTypes : string[] = [
		"Slashing",
		"Slashing*",
		"Bludgeoning",
		"Bludgeoning*",
		"Piercing",
		"Piercing*",
		"Acid",
		"Cold",
		"Fire",
		"Force",
		"Lightning",
		"Necrotic",
		"Poison",
		"Psychic",
		"Radiant",
		"Thunder"
	]

	public conditions : string[] = [
		"Blinded",
		"Charmed",
		"Deafened",
		"Frightened",
		"Grappled",
		"Incapacitated",
		"Invisible",
		"Paralyzed",
		"Petrified",
		"Poisoned",
		"Prone",
		"Restrained",
		"Stunned",
		"Unconscious",
	]
}
