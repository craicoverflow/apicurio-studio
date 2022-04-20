import { ConfigDisplayFormat, NewSpectralRuleset, SpectralRuleset, UpdateSpectralRuleset } from "../models";
import { DatabaseProvider } from "./DatabaseProvider";
import { Client } from "pg";

/**
 * Database provider for fetching and inserting rulesets to a PostgreSQL database
 */
export class PostgreSQLDatabaseProvider implements DatabaseProvider {
  private db: Client;
  constructor(client: Client) {
    this.db = client;
  }

  async ListRulesets(): Promise<SpectralRuleset[]> {
    const query = "SELECT * FROM rulesets";
    const results = await this.db.query(query);

    if (results.rowCount === 0) {
      return [];
    }

    const rulesets: SpectralRuleset[] = results.rows.map(
      (row: { id: number; display_name: string; config: string, format: ConfigDisplayFormat }) => {
        return {
          id: row.id,
          name: row.display_name,
          config: row.config,
          format: row.format
        };
      }
    );

    return Promise.resolve(rulesets);
  }

  async CreateRuleset(ruleset: NewSpectralRuleset) {
    const query =
      "INSERT INTO rulesets(display_name, config, format) VALUES($1, $2, $3) returning *";

    await this.db.query(query, [ruleset.name, ruleset.config, ruleset.format]);
  }

  async UpdateRuleset(id: number, ruleset: UpdateSpectralRuleset) {
    const query = `UPDATE rulesets SET
	display_name = COALESCE($1, display_name),
	config = COALESCE($2, config),
  format = COALESCE($3, format)
WHERE id = $4`;

    this.db.query(query, [ruleset.name, ruleset.config, ruleset.format, id]);
  }

  async GetRulesetById(id: number): Promise<SpectralRuleset> {
    const query = "SELECT * FROM rulesets WHERE id = $1 LIMIT 1";

    const results = await this.db.query(query, [id]);
    if (results.rowCount === 0) {
      return null;
    }

    const row = results.rows[0];

    const ruleset: SpectralRuleset = {
      id: row.id,
      name: row.display_name,
      config: row.config,
      format: row.format as ConfigDisplayFormat
    };

    return Promise.resolve(ruleset);
  }
}
