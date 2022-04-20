import { NewSpectralRuleset, SpectralRuleset, UpdateSpectralRuleset } from "../models/index";

export interface DatabaseProvider {
	ListRulesets(): Promise<SpectralRuleset[]>;
	CreateRuleset(ruleset: NewSpectralRuleset): void;
	UpdateRuleset(id: number, ruleset: UpdateSpectralRuleset): void;
	GetRulesetById(id: number): Promise<SpectralRuleset>;
}