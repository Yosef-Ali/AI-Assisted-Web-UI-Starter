# Project Management Feature – Phase 1 Tasks

Foundation: database schema, access control (RLS outline), typed service layer, initial API endpoints, tests, docs.

## Legend
- P0: Critical blocker / must-have for Phase 1 acceptance
- P1: Important for completeness
- P2: Nice to have / can slip

Each task lists: Acceptance, Dependencies, Est. Effort (relative), and Output Artifact.

---
## 1. Database & Access Layer

### 1.1 SQL Schema Draft (P0)
- Acceptance: SQL file defines tables: clients, contacts, projects, project_members, invoices, payments. Uses UUID PKs, created_at/updated_at defaults, indexes (status, client_id, project_id), enum simulation via check constraints.
- Dependencies: None
- Effort: S
- Output: `db/migrations/phase1.sql`

### 1.2 RLS Policy Outline (P1)
- Acceptance: Commented policy stubs in same SQL file (or separate `rls-policies.sql`) describing: owners (project_members.role='owner') full access; members read project + invoices; non-members denied.
- Dependencies: 1.1
- Effort: XS
- Output: Section comments

### 1.3 Migration Execution Guide (P1)
- Acceptance: README snippet or `docs/project-management-phase1.md` includes how to apply SQL in Supabase SQL editor & verify.
- Dependencies: 1.1
- Effort: XS
- Output: Doc section

---
## 2. Supabase Integration

### 2.1 Supabase Client Module (P0)
- Acceptance: `src/lib/supabase/client.ts` exports browser client; `src/lib/supabase/server.ts` exports service-role client lazy; env vars documented.
- Dependencies: 1.x
- Effort: S
- Output: 2 files + `.env.example`

### 2.2 Env Validation (P1)
- Acceptance: Add zod-based runtime check or simple throw if missing keys at module load.
- Dependencies: 2.1
- Effort: XS
- Output: Updated client module

---
## 3. Types & Validation

### 3.1 Shared Domain Types (P0)
- Acceptance: `src/types/project-management.ts` exports TS interfaces + zod schemas (Client, Project, Invoice, Payment) aligning with DB columns.
- Dependencies: 1.1
- Effort: S
- Output: Type file

### 3.2 DTO Schemas (P1)
- Acceptance: Create, Update input schemas (ProjectCreateInput, InvoiceCreateInput, etc.).
- Dependencies: 3.1
- Effort: XS
- Output: Same file additions

---
## 4. Service Layer

### 4.1 Project Service (P0)
- Acceptance: CRUD: listProjects({clientId?}), getProject(id), createProject(data), updateProject(id,data), archiveProject(id). Returns typed results w/ error normalization.
- Dependencies: 2.1, 3.1
- Effort: M
- Output: `src/services/projects.ts`

### 4.2 Client Service (P0)
- Acceptance: CRUD + listClients(search?).
- Dependencies: 4.1
- Effort: S
- Output: `src/services/clients.ts`

### 4.3 Invoice Service (P1)
- Acceptance: create, get, listByProject(projectId), markPaid(id, paymentData).
- Dependencies: 4.1
- Effort: M
- Output: `src/services/invoices.ts`

### 4.4 Error & Result Helpers (P1)
- Acceptance: Utility `result<T>()` and `ServiceError` enum; unify service returns.
- Dependencies: 4.1
- Effort: XS
- Output: `src/services/result.ts`

---
## 5. API Routes (Next.js App Router)

### 5.1 /api/projects (P0)
- Methods: GET (list), POST (create)
- Acceptance: Validates input via zod; returns 201 with project; handles errors with standardized JSON.
- Dependencies: 4.1
- Effort: S
- Output: `src/app/api/projects/route.ts`

### 5.2 /api/projects/[id] (P0)
- Methods: GET, PATCH (update), DELETE (archive)
- Dependencies: 5.1
- Effort: S
- Output: `[id]/route.ts`

### 5.3 /api/clients (P0)
- Methods: GET, POST
- Dependencies: 4.2
- Effort: S
- Output: `clients/route.ts`

### 5.4 /api/invoices (P1)
- Methods: POST, GET? (filtered by project)
- Dependencies: 4.3
- Effort: S
- Output: `invoices/route.ts`

---
## 6. Testing

### 6.1 Service Unit Tests (P0)
- Acceptance: Jest tests mocking Supabase client; cover success + error branches (≥80% statements for new files).
- Dependencies: 4.x
- Effort: M
- Output: `src/services/__tests__/*.test.ts`

### 6.2 API Integration Tests (P1)
- Acceptance: Invoke route handlers directly with mocked request + env; verify validation & status codes.
- Dependencies: 5.x
- Effort: M
- Output: `src/app/api/**/__tests__/*.test.ts`

### 6.3 Playwright Smoke (P2 placeholder)
- Acceptance: Placeholder spec referencing future UI to avoid failing suite (skipped test).
- Dependencies: None
- Effort: XS
- Output: `e2e/project-management.spec.ts`

---
## 7. Seed & Fixtures

### 7.1 Seed Script (P1)
- Acceptance: Node script using service layer to insert sample client + project + invoice (guarded not to duplicate).
- Dependencies: 4.x
- Effort: S
- Output: `scripts/seed-projects.ts`

### 7.2 Test Fixtures (P1)
- Acceptance: Reusable builders returning plain objects for create DTOs.
- Dependencies: 3.2
- Effort: XS
- Output: `tests/fixtures/pm/*.ts`

---
## 8. CI & Tooling

### 8.1 Jest Config Update (P1)
- Acceptance: Ensure ts-jest or SWC handles new path(s); collect coverage thresholds for new services.
- Dependencies: 6.x
- Effort: XS
- Output: `jest.config.*` change

### 8.2 Lint Rules (P2)
- Acceptance: Add rule exceptions if needed (e.g., no-console allow in seed script).
- Dependencies: 7.1
- Effort: XS
- Output: `.eslintrc.*` change

---
## 9. Documentation

### 9.1 Phase 1 Doc (P0)
- Acceptance: `docs/project-management-phase1.md` summarizing schema ERD (text), endpoints, example requests/responses, future phases placeholder.
- Dependencies: 5.x
- Effort: S
- Output: Doc file

### 9.2 README Section (P1)
- Acceptance: Add short section linking to above doc + status badge (manual text badge).
- Dependencies: 9.1
- Effort: XS
- Output: README diff

---
## 10. Acceptance Checklist
- All P0 tasks complete
- All new tests pass & coverage ≥ existing global threshold (or locally documented exception)
- Docs updated (9.1) & referenced in README (9.2 optional if time)
- Seed script runs without duplicate insertion
- API routes return validated, typed responses

---
## Execution Order Suggestion
1. (1.1) Schema SQL
2. (3.1) Domain Types (parallel outline of services)
3. (2.1) Supabase client
4. (4.1,4.2) Services core
5. (5.1-5.3) API routes
6. (6.1) Service tests
7. (7.1) Seed script
8. (9.1) Docs
9. Remaining P1 / P2 cleanup

---
## Risk Notes
- Without actual Supabase instance, services must be mock-driven; ensure abstraction for later real client injection.
- RLS not enforced yet; flag clearly in docs to avoid assumption of production security.

---
## Follow-Up (Outside Phase 1)
- Auth integration & per-user scoping
- Real-time channel subscriptions
- UI dashboards & forms
- Stripe payment webhooks
- GitHub repo linking workflow
