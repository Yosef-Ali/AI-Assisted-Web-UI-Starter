/* eslint-disable @typescript-eslint/no-explicit-any */
// Thenable query builder mock that mirrors Supabase chaining style.
function createChain() {
    const chain: any = {
        _single: false,
        _data: [],
        _error: null,
        select: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        update: jest.fn(() => chain),
        delete: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        ilike: jest.fn(() => chain),
        single: jest.fn(() => { chain._single = true; return chain; }),
        // Promise/thenable interface so `await` works at end of chain
        then: (resolve: any, reject?: any) => {
            const payload = chain._single
                ? { data: null, error: chain._error }
                : { data: chain._data, error: chain._error };
            try { return Promise.resolve(resolve(payload)); } catch (e) { return Promise.resolve(reject && reject(e)); }
        },
        catch: () => chain,
        finally: () => chain,
    };
    return chain;
}

export let supabaseChain = createChain();

export function resetSupabaseStub() { supabaseChain = createChain(); }
/* eslint-enable @typescript-eslint/no-explicit-any */