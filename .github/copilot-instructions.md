# GitHub Copilot Instructions: User Dashboard with Analytics

**Feature**: User Dashboard with Analytics
**Branch**: 001-build-a-user
**Date**: 2025-09-20
**Version**: 1.0.0

## Context Overview
You are implementing a user dashboard with analytics charts and real-time data using Next.js 15, Shadcn UI, and TanStack Query. This feature must comply with strict accessibility standards (WCAG 2.1 AA) and performance requirements (Lighthouse >90).

## Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0+ with strict mode
- **UI Library**: Shadcn/ui components
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query for server state
- **Charts**: Recharts for accessibility-compliant visualizations
- **Testing**: Playwright for E2E, Jest for unit tests

## Architecture Principles
1. **Component-Driven**: Use Shadcn/ui as primary component library
2. **TypeScript First**: Strict typing for all interfaces and props
3. **Accessibility First**: WCAG 2.1 AA compliance required
4. **Performance Focused**: Lighthouse >90, Core Web Vitals "Good"
5. **Real-time Updates**: Polling-based with intelligent intervals

## Key Requirements

### Functional Requirements
- Display analytics in visual chart formats (bar, line, pie, area, scatter, gauge)
- Real-time data updates without manual refresh
- User-customizable dashboard metrics
- Data filtering and time range selection
- Full accessibility compliance
- Responsive design for all device sizes
- Data export in CSV, JSON, PDF formats
- Intelligent caching (5min real-time, 1hr historical)
- Significant change notifications (>20% threshold)

### Non-Functional Requirements
- **Performance**: <3s Time to Interactive, <200KB bundle
- **Accessibility**: WCAG 2.1 AA, keyboard navigation, screen reader support
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Real-time**: 5s active polling, 30s background polling
- **Caching**: TTL-based with manual invalidation

## Implementation Patterns

### Component Structure
```typescript
// Use this pattern for all components
interface ComponentProps {
  // Explicit prop types
  className?: string;
  // ... other props
}

export function ComponentName({ className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

### Data Fetching
```typescript
// Use TanStack Query for all data operations
const { data, isLoading, error } = useQuery({
  queryKey: ['dashboard', dashboardId],
  queryFn: () => fetchDashboard(dashboardId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: 30 * 1000, // 30 seconds
});
```

### Chart Implementation
```typescript
// Use Recharts with accessibility features
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data} accessibilityLayer>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="timestamp" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#3b82f6"
      strokeWidth={2}
      dot={{ fill: '#3b82f6' }}
    />
  </LineChart>
</ResponsiveContainer>
```

### Accessibility Patterns
```typescript
// Always include these accessibility attributes
<div
  role="region"
  aria-label="Dashboard metrics"
  aria-live="polite"
  aria-atomic="true"
>
  {/* Content */}
</div>

// For interactive elements
<button
  aria-label="Refresh dashboard data"
  aria-pressed={isRefreshing}
  onClick={handleRefresh}
>
  Refresh
</button>
```

## File Organization

### Source Structure
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/              # Shadcn/ui components
│   ├── charts/          # Chart components
│   └── dashboard/       # Dashboard-specific components
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client
│   ├── queries.ts       # TanStack Query hooks
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
    ├── api.ts          # API types
    ├── dashboard.ts    # Dashboard types
    └── index.ts        # Type exports
```

### Component Categories
- **Layout Components**: Dashboard grid, chart containers
- **Chart Components**: BarChart, LineChart, PieChart, etc.
- **Data Components**: DataTable, MetricCard, TimeRangePicker
- **Control Components**: FilterPanel, ExportButton, SettingsPanel

## Data Models

### Core Types
```typescript
interface Dashboard {
  id: string;
  name: string;
  layout: DashboardLayout;
  charts: Chart[];
  createdAt: Date;
  updatedAt: Date;
}

interface Chart {
  id: string;
  type: ChartType;
  title: string;
  metric: string;
  config: ChartConfig;
  position: GridPosition;
  size: GridSize;
  refreshInterval: number;
}

interface DataPoint {
  id: string;
  metricId: string;
  value: number;
  timestamp: Date;
  quality: DataQuality;
}
```

## Error Handling

### API Error Handling
```typescript
try {
  const response = await apiClient.get('/dashboard');
  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API errors
    toast.error(error.message);
  } else {
    // Handle network errors
    toast.error('Network error occurred');
  }
  throw error;
}
```

### Loading States
```typescript
if (isLoading) {
  return <ChartSkeleton />;
}

if (error) {
  return <ErrorState error={error} onRetry={refetch} />;
}

return <Chart data={data} />;
```

## Testing Strategy

### Unit Tests
```typescript
describe('Dashboard', () => {
  it('renders loading state', () => {
    render(<Dashboard />, { wrapper: QueryClientWrapper });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays chart data', async () => {
    const mockData = { /* mock data */ };
    render(<Dashboard />, { wrapper: QueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('Revenue')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)
```typescript
test('dashboard loads and displays charts', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();
  await expect(page.locator('[data-testid="chart-container"]')).toHaveCount(3);
});
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load chart components
const BarChart = lazy(() => import('../components/charts/BarChart'));
const LineChart = lazy(() => import('../components/charts/LineChart'));

// Use in component
<Suspense fallback={<ChartSkeleton />}>
  {chartType === 'bar' && <BarChart {...props} />}
  {chartType === 'line' && <LineChart {...props} />}
</Suspense>
```

### Memoization
```typescript
const ChartComponent = memo(function ChartComponent({ data, config }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} {...config} />
    </ResponsiveContainer>
  );
});
```

## Recent Changes
- Initial implementation plan created (2025-09-20)
- Data model and API contracts defined
- Research findings documented for cache strategy and notifications
- Quickstart guide completed with setup instructions

## Implementation Priority
1. **High Priority**: Core dashboard layout and chart rendering
2. **High Priority**: Real-time data updates and caching
3. **Medium Priority**: Customization and filtering features
4. **Medium Priority**: Export functionality
5. **Low Priority**: Advanced chart types and animations

## Quality Gates
- [ ] TypeScript compilation with zero errors
- [ ] ESLint and Prettier pass
- [ ] Lighthouse score >90 on all metrics
- [ ] Accessibility audit passes (WAVE, axe-core)
- [ ] All tests pass (unit + E2E)
- [ ] Bundle size <200KB
- [ ] Core Web Vitals in "Good" range

Remember: Accessibility is non-negotiable. Every component must meet WCAG 2.1 AA standards, including keyboard navigation, screen reader support, and proper color contrast ratios.</content>
<parameter name="filePath">/Users/mekdesyared/AI-Assisted-Web-UI-Starter/.github/copilot-instructions.md