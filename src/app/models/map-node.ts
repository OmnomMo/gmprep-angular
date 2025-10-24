export class GmNode{
	constructor(
		public id : number,
		public name : string,
		public description : string = "",
		public mapIconPath : string = "",
		public portraitPath : string = "",
		public mapIconSize : string = "",
		public creatureInfo : CreatureInfo | null = null,
		public locationInfo : LocationInfo | null = null,
		public secrets : Secret[] = [],
		public links : NodeLink[] = [],
	){}
}

export class MapNode{
	constructor(
		public id : number,
		public node : GmNode,
		public locationX : number,
		public locationY : number,
	) {}
}

export class CreatureInfo{
	constructor(
		public id : number = 0,
		public creatureType : string = "Humanoid",
		public size : string = "Medium",
		public AC : string = "10",
		public HP : string = "10",
		public speed : string = "30",
		public speedFlying : string = "0",
		public speedSwimming : string = "0",
		public alignment : string = "Neutral Good",
		public languages : string = "Common",
		public senses : string = "Passive perception: 12",
		public damageResistances : string[] = [],
		public damageImmunities : string[] = [],
		public conditionImmunities : string[] = [],
		public damageVulnerabilities : string[] = [],
		public skills : Skill[] = [],
		public Actions : Action[] = [],
		public CHA : string = "10",
		public CON : string = "10",
		public DEX : string = "10",
		public INT : string = "10",
		public STR : string = "10",
		public WIS : string = "10",
		public CR : string = "1",
	) {}
}

export class LocationInfo{
	constructor(
		public id : number = 0,
		public population : string = "No one lives here.",
	) {}

}

export class Secret{
	constructor(
		public id : number,
		public description : string,
		public testSkill : string = "None",
		public testDifficulty : string = "10",
	) {}
}

export class NodeLink{
	constructor(
		public id : number,
		public nodeTo : GmNode
	) {}
}

export class Skill{
	constructor(
		public id : number,
		public skillName : string,
		public bonus : string,
	) {
	}
}

export class Action{
	constructor(
		public id : number,
		public name : string,
		public description : string = "",
	) {}
}