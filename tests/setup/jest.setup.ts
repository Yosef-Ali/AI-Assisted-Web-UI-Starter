// Suppress expected Supabase environment warnings during unit tests.
/* eslint-disable @typescript-eslint/no-explicit-any */
const originalWarn = console.warn;
const SUPABASE_PREFIX = '[supabase]';
console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].startsWith(SUPABASE_PREFIX)) return;
    originalWarn(...args);
};

// (Optional) expose helper to re-enable if needed in specific tests
export function restoreConsoleWarn() { console.warn = originalWarn; }
/* eslint-enable @typescript-eslint/no-explicit-any */
