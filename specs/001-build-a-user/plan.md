
# Implementation Plan: User Dashboard with Analytics

**Branch**: `001-build-a-user` | **Date**: 2025-09-20 | **Spec**: specs/001-build-a-user/spec.md
**Input**: Feature specification from `/specs/001-build-a-user/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a user dashboard with analytics charts and real-time data using Next.js 15, Shadcn UI, and TanStack Query. The dashboard will display key metrics through visual charts, support real-time updates, and provide responsive design with full accessibility compliance.

## Technical Context
**Language/Version**: TypeScript 5.0+, JavaScript ES2022  
**Primary Dependencies**: Next.js 15+, React 18+, Shadcn/ui, TanStack Query, Tailwind CSS  
**Storage**: Browser localStorage for caching, external APIs for data sources  
**Testing**: Playwright for E2E, Jest for unit tests  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (frontend-focused)  
**Performance Goals**: Lighthouse >90, Core Web Vitals "Good", <3s Time to Interactive  
**Constraints**: WCAG 2.1 AA accessibility, responsive design, real-time updates  
**Scale/Scope**: Single user dashboard, 10+ chart types, real-time data polling

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Modern React Architecture Compliance
- [x] Uses React 18+ with modern hooks and functional components
- [x] Follows component composition patterns over inheritance
- [x] Implements proper state management (Context/Zustand for complex state)

### TypeScript Excellence Compliance
- [x] Strict TypeScript configuration enabled
- [x] All interfaces and types explicitly defined
- [x] Generic types used appropriately for reusability

### Accessibility First Compliance (NON-NEGOTIABLE)
- [x] WCAG 2.1 AA standards met for all UI elements
- [x] Semantic HTML used throughout
- [x] Keyboard navigation fully supported
- [x] Color contrast ratios meet requirements
- [x] Screen reader compatibility verified

### Component-Driven Development Compliance
- [x] Shadcn/ui components used as primary UI library
- [x] Components designed for reusability with comprehensive props
- [x] Storybook or similar documentation tool integrated

### Performance & Quality Compliance
- [x] Lighthouse scores targeted above 90 for all metrics
- [x] Bundle size optimization implemented
- [x] Core Web Vitals requirements met
- [x] ESLint and Prettier configuration applied
- [x] Comprehensive test coverage planned

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Web application (Option 2) - frontend-focused with external data sources

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each API endpoint → API integration task [P]
- Each entity → TypeScript interface task [P]
- Each chart type → Chart component task [P]
- Each user story → Integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: Types → API → Components → Pages
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 30-40 numbered, ordered tasks in tasks.md

**Task Categories**:
1. **Setup Tasks**: Project structure, dependencies, configuration
2. **Type Definition Tasks**: TypeScript interfaces from data model
3. **API Integration Tasks**: API client, query hooks, error handling
4. **Component Tasks**: Chart components, dashboard layout, UI components
5. **Page Tasks**: Dashboard pages, routing, layout
6. **Testing Tasks**: Unit tests, integration tests, accessibility tests
7. **Performance Tasks**: Optimization, caching, bundle analysis

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
