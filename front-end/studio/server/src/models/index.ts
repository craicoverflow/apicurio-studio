import { ISpectralDiagnostic } from "@stoplight/spectral-core";

export interface SpectralDiagnosticList {
	items: ISpectralDiagnostic[];
}

export type ConfigDisplayFormat = 'json' | 'yaml';

export interface SpectralRuleset {
	id: number;
	name: string;
	config: string;
	format: ConfigDisplayFormat;
}

export interface NewSpectralRuleset {
	name: string;
	config: string;
	format: ConfigDisplayFormat;
}

export interface UpdateSpectralRuleset {
	name?: string;
	config?: string;
	format: ConfigDisplayFormat;
}

export interface Document {
	content: string;
}

type Error = {
	type: ErrorCode;
	title: string;
	detail: string;
};

export type ApiResponse<T = undefined> = Error | T;

export enum ErrorCode {
	RULESET_NOT_FOUND = "RULESET_NOT_FOUND",
	INVALID_RULESET = "INVALID_RULESET"
}

export type ErrorCodeTitle = {
	[key in ErrorCode]: string
}

export const ErrorTitle: ErrorCodeTitle = {
	RULESET_NOT_FOUND: 'Ruleset not found',
	INVALID_RULESET: "Invalid ruleset"
}