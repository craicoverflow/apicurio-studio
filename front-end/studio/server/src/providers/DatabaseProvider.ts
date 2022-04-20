import { NewRuleset, Ruleset, UpdateRuleset } from "../models/index";

export interface DatabaseProvider {
	ListRulesets(): Promise<Ruleset[]>;
	CreateRuleset(ruleset: NewRuleset): void;
	UpdateRuleset(id: number, ruleset: UpdateRuleset): void;
	GetRulesetById(id: number): Promise<Ruleset>;
}