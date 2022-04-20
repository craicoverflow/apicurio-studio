import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler/with-loader";
import { NewSpectralRuleset, SpectralRuleset, UpdateSpectralRuleset } from "../models/index";
import { ISpectralService as ISpectralService } from "./ISpectralService";
import { fetch } from "@stoplight/spectral-runtime";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { ISpectralDiagnostic, Ruleset, Spectral } from "@stoplight/spectral-core";
import { RulesetNotFoundError } from "../errors/index";

/**
 * Spectral Service
 */
export class SpectralService implements ISpectralService {
  private db: DatabaseProvider;
  constructor(db: DatabaseProvider) {
    this.db = db;
  }

  async ListRulesets(): Promise<SpectralRuleset[]> {
    return this.db.ListRulesets();
  }

  async CreateRuleset(newRuleset: NewSpectralRuleset): Promise<void> {
    this.db.CreateRuleset(newRuleset);
  }

  async UpdateRuleset(id: number, updateRuleset: UpdateSpectralRuleset): Promise<void> {
    this.db.UpdateRuleset(id, updateRuleset);
  }

  async GetRuleset(id: number): Promise<SpectralRuleset> {
    const ruleset = await this.db.GetRulesetById(id);
    if (ruleset === null) {
      throw new RulesetNotFoundError();
    }
    return ruleset;
  }

  async ValidateDocument(
    id: number,
    documentContent: string
  ): Promise<ISpectralDiagnostic[]> {
    const rulesetRow = await this.GetRuleset(id);
    if (rulesetRow === null) {
      throw new RulesetNotFoundError();
    }

    const ruleset = await loadRulesetFromString(rulesetRow.config);

    const spectral = new Spectral();
    spectral.setRuleset(ruleset);

    return spectral.run(documentContent);
  }
}

// mock a file system implementation
const createFs = (myRuleset: string) => ({
  promises: {
    async readFile(_?: string) {
      return myRuleset;
    },
  },
});

async function loadRulesetFromString(rulesetContent: string): Promise<Ruleset> {
  const fs: any = createFs(rulesetContent);

  return bundleAndLoadRuleset("/.spectral.json", {
    fs,
    fetch,
  });
}