export class GmNode {
	constructor(
		public id: number,
		public name: string,
		public description: string = '',
		public mapIconPath: string = '',
		public portraitPath: string = '',
		public mapIconSize: string = '',
		public creatureInfo: CreatureInfo | null = null,
		public locationInfo: LocationInfo | null = null,
		public secrets: Secret[] = [],
		public links: NodeLink[] = [],
	) {}
}

export class MapNode {
	constructor(
		public id: number,
		public node: GmNode,
		public locationX: number,
		public locationY: number,
	) {}
}

export class CreatureInfo {
	constructor(
		public id: number = 0,
		public creatureType: string = 'Humanoid',
		public size: string = 'Medium',
		public ac: string = '14',
		public hp: string = '10',
		public speed: string = '30',
		public speedFlying: string = '0',
		public speedSwimming: string = '0',
		public alignment: string = 'Neutral Good',
		public languages: string = 'Common',
		public senses: string = 'Passive perception: 12',
		public damageResistances: string[] = [],
		public damageImmunities: string[] = [],
		public conditionImmunities: string[] = [],
		public damageVulnerabilities: string[] = [],
		public skills: Skill[] = [],
		public actions: Action[] = [],
		public cha: string = '10',
		public con: string = '10',
		public dex: string = '10',
		public int: string = '10',
		public str: string = '10',
		public wis: string = '10',
		public cr: string = '1',
	) {}
}

export class LocationInfo {
	constructor(
		public id: number = 0,
		public population: string = 'No one lives here.',
	) {}
}

export class Secret {
	constructor(
		public id: number,
		public description: string,
		public testSkill: string = 'None',
		public testDifficulty: string = '10',
	) {}
}

export class NodeLink {
	constructor(
		public id: number,
		public nodeTo: GmNode,
	) {}
}

export class Skill {
	constructor(
		public id: number,
		public skillName: string,
		public bonus: string,
	) {}
}

export class Action {
	constructor(
		public id: number,
		public name: string,
		public description: string = '',
	) {}
}
