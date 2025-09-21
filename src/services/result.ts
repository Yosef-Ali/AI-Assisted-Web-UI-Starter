export type ServiceSuccess<T> = { ok: true; data: T };
export type ServiceFailure = { ok: false; error: string; cause?: unknown };
export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure;

export function success<T>(data: T): ServiceResult<T> { return { ok: true, data }; }
export function failure(error: string, cause?: unknown): ServiceResult<never> { return { ok: false, error, cause }; }
