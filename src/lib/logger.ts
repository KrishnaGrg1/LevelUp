// Lightweight dev-only logger.
// In production builds this becomes a no-op to avoid noisy logs and reduce overhead.

export function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}

export function devWarn(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(...args);
  }
}

export function devError(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...args);
  }
}
