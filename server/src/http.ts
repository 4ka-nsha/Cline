import { randomUUID } from 'node:crypto';
import type { ResponseMeta } from '../../shared/contracts/farm';

export function makeMeta(source: ResponseMeta['source'] = 'user-input'): ResponseMeta {
  return {
    requestId: randomUUID(),
    servedAt: new Date().toISOString(),
    source,
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: { field: string; message: string }[];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
