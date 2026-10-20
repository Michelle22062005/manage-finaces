type PgError = { code?: string; cause?: unknown };

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Devuelve el código de error de Postgres (por ejemplo "23505"), si existe. */
export function pgCode(e: unknown): string | undefined {
  if (!esObjeto(e)) return undefined;
  const err = e as PgError;
  if (typeof err.code === "string") return err.code;
  return esObjeto(err.cause) && typeof err.cause.code === "string"
    ? err.cause.code
    : undefined;
}

export const esDuplicado = (e: unknown) => pgCode(e) === "23505";