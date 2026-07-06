/**
 * Recursively removes keys that start with `$` or contain `.`
 * to prevent MongoDB operator injection (NoSQL injection).
 */
export function sanitizeObject<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item)) as T;
  }

  if (typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }

      sanitized[key] = sanitizeObject(value);
    }

    return sanitized as T;
  }

  return input;
}
