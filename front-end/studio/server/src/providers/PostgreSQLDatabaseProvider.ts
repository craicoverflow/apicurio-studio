import { NewRuleset, Ruleset, UpdateRuleset } from "../models";
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

  async ListRulesets(): Promise<Ruleset[]> {
    const query = "SELECT * FROM rulesets";
    const results = await this.db.query(query);

    if (results.rowCount === 0) {
      return [];
    }

    const rulesets: Ruleset[] = results.rows.map(
      (row: { id: number; display_name: string; config: string }) => {
        return {
          id: row.id,
          name: row.display_name,
          config: row.config,
        };
      }
    );

    return Promise.resolve(rulesets);
  }

  async CreateRuleset(ruleset: NewRuleset) {
    const query =
      "INSERT INTO rulesets(display_name, config) VALUES($1, $2) returning *";

    await this.db.query(query, [ruleset.name, ruleset.config]);
  }

  async UpdateRuleset(id: number, ruleset: UpdateRuleset) {
    const query = `UPDATE rulesets SET
	display_name = COALESCE($1, display_name),
	config = COALESCE($2, config)
WHERE id = $3`;

    this.db.query(query, [ruleset.name, ruleset.config, id]);
  }

  async GetRulesetById(id: number): Promise<Ruleset> {
    const query = "SELECT * FROM rulesets WHERE id = $1 LIMIT 1";

    const results = await this.db.query(query, [id]);
    if (results.rowCount === 0) {
      return null;
    }

    const row = results.rows[0];
    
    const ruleset: Ruleset = {
      id: row.id,
      name: row.display_name,
      config: row.config,
    };

    return Promise.resolve(ruleset);
  }
}
