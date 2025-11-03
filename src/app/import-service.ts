import { Injectable } from '@angular/core';
import { Action, CreatureInfo, GmNode, Skill } from './models/map-node';
import { GmNodeOptions } from './utils/gm-node-options';
import { filter } from 'rxjs';


//Service allows parsing of clipboard contents. Tries to fit the string into a GmNode Object.
@Injectable({
	providedIn: 'root',
})
export class ImportService {
	constructor(private nodeOptions: GmNodeOptions) {}

	async parseClipboard(): Promise<GmNode | null> {
		try {
			const clipboard: ClipboardItems = await navigator.clipboard.read();
			const item: Blob = await clipboard[0].getType('text/plain');
			const content = await item.text();
			return this.tryParse(content);
		} catch (e) {
			return null;
		}
	}

	tryParse(text: string): GmNode | null {
		console.log('Try parse ');
		const splitLines: string[] = text.split(/\r?\n/);
		const filteredLines: string[] = splitLines.filter((line) => line.length > 1);
		console.log(filteredLines);
		if (filteredLines.length < 3) {
			return null;
		}

		var parsedNode: GmNode = new GmNode(0, filteredLines[0]);
		parsedNode.creatureInfo = new CreatureInfo();
		this.parseSizeTypeAlignment(filteredLines[1], parsedNode);
		parsedNode.creatureInfo.hp = this.getStat('Hit Points', filteredLines) || '0';
		parsedNode.creatureInfo.ac = this.getStat('Armor Class', filteredLines) || '0';
		parsedNode.creatureInfo.speed = this.getStat('Speed', filteredLines) || '0';
		parsedNode.creatureInfo.speedSwimming = this.getStat('swim', filteredLines) || '0';
		parsedNode.creatureInfo.speedFlying = this.getStat('fly', filteredLines) || '0';
		parsedNode.creatureInfo.str = this.getStat('STR', filteredLines) || '0';
		parsedNode.creatureInfo.dex = this.getStat('DEX', filteredLines) || '0';
		parsedNode.creatureInfo.con = this.getStat('CON', filteredLines) || '0';
		parsedNode.creatureInfo.int = this.getStat('INT', filteredLines) || '0';
		parsedNode.creatureInfo.wis = this.getStat('WIS', filteredLines) || '0';
		parsedNode.creatureInfo.cha = this.getStat('CHA', filteredLines) || '0';
		parsedNode.creatureInfo.languages = this.getProperty('Languages', filteredLines) || '';
		parsedNode.creatureInfo.senses = this.getProperty('Senses', filteredLines) || '';
		parsedNode.creatureInfo.damageImmunities = this.getMultiStringProperty(
			'Damage Immunities',
			this.nodeOptions.damageTypes,
			filteredLines,
		);
		parsedNode.creatureInfo.damageResistances = this.getMultiStringProperty(
			'Damage Resistance',
			this.nodeOptions.damageTypes,
			filteredLines,
		);
		parsedNode.creatureInfo.damageVulnerabilities = this.getMultiStringProperty(
			'Vulnerabilities',
			this.nodeOptions.damageTypes,
			filteredLines,
		);
		parsedNode.creatureInfo.conditionImmunities = this.getMultiStringProperty(
			'Condition Immunities',
			this.nodeOptions.conditions,
			filteredLines,
		);
		parsedNode.creatureInfo.skills = this.parseSkills(filteredLines);
		parsedNode.creatureInfo.actions = this.parseActions(filteredLines);

		return parsedNode;
	}

	parseSizeTypeAlignment(string: string, node: GmNode) {
		if (node.creatureInfo == null) {
			throw new Error('Creature info cannot be null!');
		}

		string = string.replaceAll(',', '');
		const separated: string[] = string.split(' ');
		var filtered: string[] = separated.filter((s) => !s.includes('(') && !s.includes(')'));

		//first letter should be upper case
		filtered = filtered.map<string>((s) => {
			return s[0].toUpperCase() + s.slice(1);
		});

		console.log('Found Size/Type/Alignment');
		console.log(filtered);

		node.creatureInfo.size = filtered[0];
		node.creatureInfo.creatureType = filtered[1];
		node.creatureInfo.alignment = [filtered[2], filtered[3]].join(' ');
	}

	getStat(statName: string, toParse: string[]): string | null {
		for (var i: number = 0; i < toParse.length; i++) {
			const line = toParse[i];

			if (line.includes(statName)) {
				console.log(`found stat ${statName}:`);
				var filteredLine = line.substring(line.indexOf(statName) + statName.length + 1);
				var filteredArray: string[] = [];
				if (filteredLine.length > 0) {
					filteredArray = filteredLine.split(' ');
				} else {
					filteredArray = toParse[i + 1].split(' ');
				}
				console.log(filteredArray);
				console.log(filteredArray[0]);
				return filteredArray[0];
			}
		}

		return null;
	}

	getProperty(name: string, toParse: string[]): string | null {
		for (var i: number = 0; i < toParse.length; i++) {
			const line = toParse[i];

			if (line.includes(name)) {
				console.log(`found characteristic ${name}:`);
				var filteredLine = line.substring(line.indexOf(name) + name.length + 1);

				console.log(filteredLine);
				return filteredLine;
			}
		}

		return null;
	}

	getMultiStringProperty(name: string, options: string[], toParse: string[]): string[] {
		for (var i: number = 0; i < toParse.length; i++) {
			const line = toParse[i];

			if (line.includes(name)) {
				console.log(`found characteristic ${name}:`);
				var filteredLine = line.substring(line.indexOf(name) + name.length + 1);
				console.log(filteredLine);
				filteredLine = filteredLine.replaceAll(',', '');
				filteredLine = filteredLine.replaceAll(';', '');
				const potentialOptions: string[] = filteredLine.split(' ');
				var foundOptions: string[] = [];

				for (const option of potentialOptions) {
					if (options.includes(option)) {
						foundOptions.push(option);
					}
				}

				return foundOptions;
			}
		}

		return [];
	}

	parseSkills(toParse: string[]): Skill[] {
		var skillsLine: string | null = null;

		//find skills line to parse
		for (const line of toParse) {
			if (line.includes('Skills')) {
				skillsLine = line.substring(line.indexOf('Skills') + 7);
				break;
			}
		}

		if (skillsLine == null) {
			return [];
		}
		skillsLine = skillsLine.replaceAll(' ', '');
		console.log(skillsLine);

		var skillStrings: string[] = skillsLine.split(',');

		console.log('Skills line found');
		console.log(skillStrings);

		var skills: Skill[] = [];

		for (const skill of skillStrings) {
			var split: string[] = skill.split('+');
			if (this.nodeOptions.skills.includes(split[0])) {
				skills.push(new Skill(0, split[0], split[1]));
			}
		}

		return skills;
	}

	parseActions(toParse: string[]): Action[] {
		var startReached: boolean = false;
		var actions: Action[] = [];

		for (var i: number = 0; i < toParse.length; i++) {
			if (startReached) {
				//Skip parsing on lines that include keywords
				var skipLine = ['Actions', 'Traits', 'Legendary Actions'].some((keyword) =>
					toParse[i].startsWith(keyword)
				);
				if (!skipLine) {
					var splitAction: string[] = toParse[i].split('.');
					var description: string = splitAction.slice(1, splitAction.length).join('.');
					actions.push(new Action(0, splitAction[0], description));
				}
			}

			if (toParse[i].includes('Challenge')) {
				startReached = true;
			}
		}

		return actions;
	}
}
