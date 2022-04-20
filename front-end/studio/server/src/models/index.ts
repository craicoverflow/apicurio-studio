export interface Ruleset {
	id: number;
	name: string;
	config: string;
}

export interface NewRuleset {
	name: string;
	config: string;
}

export interface UpdateRuleset {
	name?: string;
	config?: string;
}

export interface ValidationRequest {
	document: string;
}

export enum ErrorCode {
  RULESET_NOT_FOUND = "RULESET_NOT_FOUND",
}