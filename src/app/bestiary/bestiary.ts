import { inject, Injectable } from '@angular/core';
import bestiaryindex from './bestiaryindex.json';
import { HttpClient } from '@angular/common/http';
import { Action, CreatureInfo, GmNode, Skill } from '../models/map-node';
import { GmNodeOptions } from '../utils/gm-node-options';

@Injectable({
	providedIn: 'root',
})
export class Bestiary {
	httpClient = inject(HttpClient);
	nodeOptions = inject(GmNodeOptions);

	beasts: GmNode[] = [];

	constructor() {
		for (const file of Object.values(bestiaryindex)) {
			this.readBestiaryFile(file);
		}
	}

	readBestiaryFile(fileName: string) {
		this.httpClient.get<Parseable>(`/data/bestiary/${fileName}`).subscribe((res) => {
			var entries = res['monster'] as Parseable[];
			for (const entry of entries) {
				//we skip entries that are copies of other stat blocks
				if (entry['_copy'] == undefined) {
					var newBeast: GmNode = this.parseBestiaryMonster(entry);
					this.beasts.push(newBeast);
				}
			}
		});
	}

	//Read bestiary JSON entry and return it as GmNode object
	parseBestiaryMonster(newEntry: Parseable): GmNode {
		var parsed: GmNode = new GmNode(0, (newEntry['name'] as string) ?? '');

		parsed.creatureInfo = new CreatureInfo();
		parsed.creatureInfo.size = this.parseBestiarySize((newEntry['size'] as string) ?? '');
		parsed.creatureInfo.alignment = this.parseBestiaryAlignment(
			(newEntry['alignment'] as string[]) ?? ['N', 'G'],
		);
		parsed.creatureInfo.creatureType = this.parseBestiaryType(newEntry['type']);
		parsed.creatureInfo.ac = this.parseAC(newEntry);
		parsed.creatureInfo.hp = ((newEntry['hp'] as Parseable)['average']?.toString()) ?? '?';
		parsed.creatureInfo.str = (newEntry['str']?.toString()) ?? '?';
		parsed.creatureInfo.dex = (newEntry['dex']?.toString()) ?? '?';
		parsed.creatureInfo.con = (newEntry['con']?.toString()) ?? '?';
		parsed.creatureInfo.int = (newEntry['int']?.toString()) ?? '?';
		parsed.creatureInfo.wis = (newEntry['wis']?.toString()) ?? '?';
		parsed.creatureInfo.cha = (newEntry['cha']?.toString()) ?? '?';
		parsed.creatureInfo.speed = this.parseSpeed(newEntry['speed'] as Parseable, 'walk');
		parsed.creatureInfo.speedFlying = this.parseSpeed(newEntry['speed'] as Parseable, 'fly');
		parsed.creatureInfo.speedSwimming = this.parseSpeed(newEntry['speed'] as Parseable, 'swim');
		parsed.creatureInfo.skills = this.parseSkills(newEntry['skill'] as Parseable);
		parsed.creatureInfo.senses = this.parseSenses(newEntry);
		parsed.creatureInfo.languages = this.parseLanguages(newEntry);
		parsed.creatureInfo.actions = this.parseActions(newEntry);
		parsed.creatureInfo.damageResistances = this.parseDamageTypes(newEntry, 'resist');
		parsed.creatureInfo.damageImmunities = this.parseDamageTypes(newEntry, 'immune');
		parsed.creatureInfo.damageVulnerabilities = this.parseDamageTypes(newEntry, 'vulnerable');
		parsed.creatureInfo.conditionImmunities = this.parseConditions(newEntry, 'conditionImmune');

		return parsed;
	}

	parseAC(inToParse: Parseable) : string {
		var acEntries: any[] = inToParse['ac'] as any;
		var entry: Parseable | number = acEntries[0] as Parseable | number;
		if (typeof(entry) == 'number') {
			return entry.toString();
		}

		return (entry as Parseable)['ac']?.toString() || '?';

	}

	parseDamageTypes(inToParse: Parseable, identifyer: string): string[] {
		var damageTypes: string[] = [];
		var parseableDamageTypes: any[] = (inToParse[identifyer] as any[]) ?? [];
		for (const toParse of parseableDamageTypes) {
			if (typeof toParse == 'string') {
				var stringToParse: string = toParse as string;
				damageTypes.push(stringToParse[0].toUpperCase() + stringToParse.slice(1));
			} else {
				var parseable: Parseable = toParse as Parseable;
				var conditionalResistances: string[] = (parseable[identifyer] as string[]) ?? [];
				for (const resistance of conditionalResistances) {
					damageTypes.push(resistance[0].toUpperCase() + resistance.slice(1) + '*');
				}
			}
		}
		return damageTypes;
	}

	parseConditions(inToParse: Parseable, identifyer: string): string[] {
		var conditions: string[] = (inToParse[identifyer] as string[]) ?? [];
		return conditions.map((c) => {
			return c[0].toUpperCase() + c.slice(1);
		});
	}

	parseActions(inToParse: Parseable): Action[] {
		var parsedActions: Action[] = [];

		var actionsToParse: Parseable[] = (inToParse['action'] as Parseable[]) ?? [];

		var traitsToParse: Parseable[] = (inToParse['trait'] as Parseable[]) ?? [];

		for (const actionToParse of traitsToParse.concat(actionsToParse)) {
			var name: string = (actionToParse['name'] as string) ?? '?';
			var entries: string[] = (actionToParse['entries'] as string[]) ?? [];
			var newAction: Action = new Action(0, name, entries.join('\n'));
			parsedActions.push(newAction);
		}

		var spellcastingEntries: Parseable[] = (inToParse['spellcasting'] as Parseable[]) ?? [];
		parsedActions.concat(this.parseSpells(spellcastingEntries));

		return parsedActions;
	}

	parseSpells(inToParse: Parseable[]): Action[] {
		var spellcastingActions: Action[] = [];
		for (const spellcasting of inToParse) {
			//todo
			//sometimes the entries for level null are labelled "will" see Alex Jadescales
			//sometimes the entries are labelled "1e" - see unicorn

			var spellcastingAction = new Action(0, 'Spellcasting');
			var descriptions: string[] = (spellcasting['headerEntries'] as string[]) ?? [];
			spellcastingAction.description = descriptions.join('\n');

			var spells: Parseable = (spellcasting['spells'] as Parseable) ?? undefined;
			if (spells != undefined) {
				spellcastingAction.description += '\n';

				//iterate through spell levels
				for (var i = 0; i < 10; i++) {
					var levelSpells: Parseable | undefined =
						(spells[i.toString()] as Parseable) ?? undefined;
					if (levelSpells == undefined) {
						break;
					}
					var slots: string | undefined = (levelSpells!['slots'] as string) ?? undefined;
					spellcastingAction.description += `\nLevel ${i} (${slots ?? 'unlimited'}): `;
					var spellsList: string[] = (levelSpells['spells'] as string[]) ?? [];
					spellcastingAction.description += spellsList.join(', ');
				}
			}

			//parse at will spells for innate spellcasting
			var atWill: string[] = (spellcasting['will'] as string[]) ?? [];
			if (atWill.length > 0) {
				spellcastingAction.description += `\nAt will: ${atWill.join(', ')}`;
			}

			//parse daily spells for innate spellcasting
			var daily: Parseable = (spellcasting['daily'] as Parseable) ?? undefined;
			if (daily != null) {
				for (var i = 1; i < 5; i++) {
					var spellList: string[] =
						(daily[i.toString() + 'e'] as string[]) ??
						(daily[i.toString()] as string[]) ??
						[];
					if (spellList.length > 0) {
						spellcastingAction.description += `\n${i}/day: ${spellList.join(', ')}`;
					}
				}
			}

			spellcastingActions.push(spellcastingAction);
		}
		return spellcastingActions;
	}

	parseLanguages(inToParse: Parseable): string {
		var languages: string[] = (inToParse['languages'] as string[]) ?? [];
		var languageString: string = languages.join(', ');
		return languageString;
	}

	parseSenses(inToParse: Parseable): string {
		var senses: string = '';

		var passive: number = (inToParse['passive'] as number) ?? 0;
		if (passive != null) {
			senses += `Passive Perception: ${passive}`;
		}

		var other: string[] = (inToParse['senses'] as string[]) ?? [];
		senses += '; ' + other.join(',');

		return senses;
	}

	parseSkills(inToParse: Parseable): Skill[] {
		var skills: Skill[] = [];

		if (inToParse == null) {
			return [];
		}

		for (const skill of this.nodeOptions.skills) {
			var skillName: string = skill.toLowerCase();
			if (inToParse[skillName] != undefined) {
				var newSkill = new Skill(0, skill, (inToParse[skillName] as string) ?? '?');
				skills.push(newSkill);
			}
		}

		return skills;
	}

	parseSpeed(inToParse: Parseable, inStatName: string): string {
		if (inToParse[inStatName] == null) {
			return '0';
		}

		if (typeof inToParse[inStatName] == 'number') {
			return inToParse[inStatName].toString();
		}

		//sometimes there is a subobject with conditions
		var container = inToParse[inStatName] as Parseable;
		return (container['number'] as number).toString() ?? "0";
	}

	parseBestiaryType(inToParse: any): string {
		var creatureType: string = '';

		if (typeof inToParse === 'string') {
			creatureType = inToParse as string;
		} else {
			creatureType = ((inToParse as Parseable)['type'] as string) ?? 'humanoid';
		}

		//First letter to upper case
		return creatureType.charAt(0).toUpperCase() + creatureType.slice(1);
	}

	parseBestiarySize(inToParse: string): string {
		switch (inToParse) {
			case 'T':
				return 'Tiny';
			case 'S':
				return 'Small';
			case 'M':
				return 'Medium';
			case 'L':
				return 'Large';
			case 'H':
				return 'Huge';
			case 'G':
				return 'Gargantuan';
		}

		return 'Medium';
	}

	parseBestiaryAlignment(inToParse: string[]): string {
		var alignment: string = '';

		if (inToParse[0] == 'A' || inToParse[0] == 'U') {
			return '';
		}

		switch (inToParse[0]) {
			case 'L':
				alignment += 'Lawful ';
				break;
			case 'N':
				alignment += 'Neutral ';
				break;
			case 'C':
				alignment += 'Chaotic ';
				break;
		}

		switch (inToParse[1]) {
			case 'G':
				alignment += 'Good';
				break;
			case 'N':
				alignment += 'Neutral';
				break;
			case 'E':
				alignment += 'Evil';
				break;
		}

		if (alignment == 'Neutral Neutral') {
			alignment = 'True Neutral';
		}

		return alignment;
	}
}

interface Parseable {
	[key: string]: String | Object | undefined;
}
