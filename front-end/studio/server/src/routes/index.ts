import { FastifyInstance } from "fastify";
import { ISpectralService } from "../services/ISpectralService";
import { ErrorCode, SpectralRuleset, UpdateSpectralRuleset, Document, SpectralDiagnosticList, ApiResponse, ErrorTitle, NewSpectralRuleset } from "../models";
import HttpStatusCode from "../models/HttpStatusCodes";
import { InvalidRulesetError, RulesetNotFoundError } from "../errors/index";

export const configureRoutes = (
  fastify: FastifyInstance,
  spectralService: ISpectralService
) => {

  fastify
    .get("/", async (_, reply) => {
      const items = await spectralService.ListRulesets();

      reply.send({ items });
    })
    .post<{ Body: NewSpectralRuleset }>('/', async (req, reply) => {
      const requestBody = req.body;

      try {
        spectralService.CreateRuleset(requestBody);
        reply.code(HttpStatusCode.CREATED).send();
      } catch (err) {
        if (err instanceof InvalidRulesetError) {
          reply.code(HttpStatusCode.BAD_REQUEST).send({
            type: ErrorCode.INVALID_RULESET,
            title: ErrorTitle.INVALID_RULESET,
            detail: "The Spectral ruleset is invalid",
          });
        }
      }
    })
    .post<{ Params: { rulesetId: number }, Body: Document, Reply: ApiResponse<SpectralDiagnosticList> }>(
      "/:rulesetId/validate",
      {
        schema: {
          params: {
            rulesetId: {
              type: "integer",
            },
          },
        },
      },
      async (req, reply) => {
        const rulesetId = req.params.rulesetId;
        const requestBody = req.body;

        try {
          const results = await spectralService.ValidateDocument(
            rulesetId,
            requestBody.content
          );
          reply.send({ items: results });
        } catch (err) {
          if (err instanceof RulesetNotFoundError) {
            reply.code(HttpStatusCode.NOT_FOUND).send({
              type: ErrorCode.RULESET_NOT_FOUND,
              title: ErrorTitle.RULESET_NOT_FOUND,
              detail: "The Spectral ruleset was not found",
            });
          }
        }
      }
    )
    .get<{ Params: { rulesetId: number }, Reply: ApiResponse<SpectralRuleset> }>(
      "/:rulesetId",
      {
        schema: {
          params: {
            rulesetId: {
              type: "integer",
            },
          },
        },
      },
      async (req, reply) => {
        const rulesetId = req.params.rulesetId;

        try {
          const ruleset = await spectralService.GetRuleset(rulesetId);
          reply.send(ruleset);
        } catch (err) {
          if (err instanceof RulesetNotFoundError) {
            reply.code(HttpStatusCode.NOT_FOUND).send({
              type: ErrorCode.RULESET_NOT_FOUND,
              title: ErrorTitle.RULESET_NOT_FOUND,
              detail: "The Spectral ruleset was not found",
            });
          }
        }
      }
    )
    .patch<{ Params: { rulesetId: number }, Body: UpdateSpectralRuleset }>(
      "/:rulesetId",
      {
        schema: {
          params: {
            rulesetId: {
              type: "integer",
            },
          },
        },
      },
      async (req, reply) => {
        const rulesetId = req.params.rulesetId;
        const requestBody = req.body;

        try {
          spectralService.UpdateRuleset(rulesetId, requestBody);
        } catch (err) {
          if (err instanceof InvalidRulesetError) {
            reply.code(HttpStatusCode.BAD_REQUEST).send({
              type: ErrorCode.INVALID_RULESET,
              title: ErrorTitle.INVALID_RULESET,
              detail: "The Spectral ruleset is invalid",
            });
          } else if (err instanceof RulesetNotFoundError) {
            reply.code(HttpStatusCode.NOT_FOUND).send({
              type: ErrorCode.RULESET_NOT_FOUND,
              title: ErrorTitle.RULESET_NOT_FOUND,
              detail: "The Spectral ruleset was not found",
            });
          }
        }

        reply.send();
      }
    );
};