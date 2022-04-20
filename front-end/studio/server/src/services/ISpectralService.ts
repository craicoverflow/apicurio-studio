import { ISpectralDiagnostic } from "@stoplight/spectral-core";
import { NewSpectralRuleset, SpectralRuleset, UpdateSpectralRuleset } from "../models/index";

export interface ISpectralService {
  ListRulesets(): Promise<SpectralRuleset[]>;
  CreateRuleset(newRuleset: NewSpectralRuleset): void;
  UpdateRuleset(id: number, spectralConfig: UpdateSpectralRuleset): void;
  GetRuleset(id: number): Promise<SpectralRuleset>;
  ValidateDocument(
    id: number,
    document: string
  ): Promise<ISpectralDiagnostic[]>;
}