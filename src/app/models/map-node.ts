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
		public id : number,
		public creatureType : string,
		public size : string,
		public AC : string,
		public HP : string,
		public speed : string,
		public speedFlying : string,
		public speedSwimming : string,
		public alignment : string,
		public languages : string,
		public senses : string,
		public damageResistances : string[] = [],
		public damageImmunities : string[] = [],
		public conditionImmunities : string[] = [],
		public damageVulnerabilities : string[] = [],
		public skills : Skill[] = [],
		public Actions : Action[] = [],
		public CHA : string,
		public CON : string,
		public DEX : string,
		public INT : string,
		public STR : string,
		public WIS : string,
		public CR : string,
	) {}
}

export class LocationInfo{
	constructor(
		public id : number,
		public population : string,
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