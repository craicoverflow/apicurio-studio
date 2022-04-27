import { FastifyInstance } from "fastify";
import { ISpectralService } from "../services/ISpectralService";
import { DocumentValidationRequest, ErrorCode, ErrorTitle } from "../models";
import { NodePath, ValidationProblem, ValidationProblemSeverity } from "@apicurio/data-models";
import { ISpectralDiagnostic } from "@stoplight/spectral-core";
import { DiagnosticSeverity } from "@stoplight/types";
import { RulesetNotFoundError } from "../errors/index";
import HttpStatusCode from "../models/HttpStatusCodes";

export const configureRoutes = (
  fastify: FastifyInstance,
  spectralService: ISpectralService
) => {

  fastify
    .post<{ Body: DocumentValidationRequest }>("/validate", async (req, reply) => {
      if (req.body.document == null || req.body.ruleset === null) {
          reply.code(HttpStatusCode.BAD_REQUEST).send({
              code: ErrorCode.INVALID_VALIDATION_BODY,
              title: ErrorTitle.INVALID_VALIDATION_BODY,
              statusCode:  HttpStatusCode.BAD_REQUEST
          });
      }
      const { document, ruleset } = req.body;

      let results: ISpectralDiagnostic[];
      try {
        results = await spectralService.ValidateDocument(document, ruleset);
      } catch (err) {
        if (err instanceof RulesetNotFoundError) {
          fastify.log.info(err);
          reply.code(HttpStatusCode.NOT_FOUND).send({
            code: ErrorCode.RULESET_NOT_FOUND,
            detail: err.message,
            title: ErrorTitle.RULESET_NOT_FOUND,
            statusCode: HttpStatusCode.NOT_FOUND
          })
        } else {
          fastify.log.error(err);
          reply.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
            code: ErrorCode.SERVER_ERROR,
            title: ErrorTitle.SERVER_ERROR,
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
          })
        }
      }

      const problems: ValidationProblem[] = results.map((d: ISpectralDiagnostic) => {
        return {
          errorCode: d.code.toString(),
          nodePath: new NodePath("/" + d.path.join("/")),
          message: d.message,
          severity: severityCodeMapConfig[d.severity],
          property: d.path[d.path.length-1].toString(),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          accept: () => { },
        }
      });

      reply.send({ items: problems });
    });
};

// map severity codes from Spectral to Apicurio severity codes
const severityCodeMapConfig: { [key in DiagnosticSeverity]: ValidationProblemSeverity } = {
  0: ValidationProblemSeverity.high,
  1: ValidationProblemSeverity.medium,
  2: ValidationProblemSeverity.low,
  3: ValidationProblemSeverity.ignore,
};