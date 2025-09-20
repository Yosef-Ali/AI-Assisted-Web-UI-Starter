# Data Model: User Dashboard with Analytics

**Feature**: User Dashboard with Analytics
**Date**: 2025-09-20
**Version**: 1.0.0

## Overview
The dashboard data model supports real-time analytics visualization with user-customizable metrics, time-based filtering, and performance-optimized caching.

## Core Entities

### Dashboard
**Purpose**: User's personalized view configuration and layout
**Fields**:
- `id`: string (UUID) - Primary identifier
- `userId`: string - Associated user identifier
- `name`: string - Dashboard display name
- `description`: string? - Optional description
- `layout`: DashboardLayout - Grid layout configuration
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last modification timestamp
- `isActive`: boolean - Whether dashboard is currently active

**Validation Rules**:
- `name` must be 1-100 characters
- `layout` must have valid grid dimensions
- `userId` must reference existing user

**Relationships**:
- One-to-many with Chart entities
- One-to-one with User entity

### Chart
**Purpose**: Individual chart configuration and data binding
**Fields**:
- `id`: string (UUID) - Primary identifier
- `dashboardId`: string - Parent dashboard reference
- `type`: ChartType - Chart visualization type (bar, line, pie, etc.)
- `title`: string - Chart display title
- `metric`: string - Data metric identifier
- `dataSource`: DataSource - Data source configuration
- `config`: ChartConfig - Chart-specific configuration
- `position`: GridPosition - Layout position in dashboard
- `size`: GridSize - Chart dimensions
- `refreshInterval`: number - Auto-refresh interval in seconds
- `lastUpdated`: DateTime - Last data refresh timestamp

**Validation Rules**:
- `type` must be valid ChartType enum value
- `metric` must reference valid metric identifier
- `refreshInterval` must be 5-3600 seconds
- `position` and `size` must fit within dashboard grid

**Relationships**:
- Many-to-one with Dashboard entity
- One-to-one with DataSource entity

### Metric
**Purpose**: Individual data point or KPI definition
**Fields**:
- `id`: string - Metric identifier (e.g., "revenue", "users")
- `name`: string - Human-readable name
- `description`: string - Metric description
- `unit`: string - Unit of measurement (e.g., "$", "%", "count")
- `dataType`: DataType - Data type (number, percentage, currency)
- `aggregation`: AggregationType - How to aggregate data (sum, avg, count)
- `format`: string - Display format pattern
- `thresholds`: Threshold[] - Alert threshold definitions

**Validation Rules**:
- `id` must be unique, lowercase, alphanumeric with underscores
- `dataType` must be valid DataType enum
- `aggregation` must be valid AggregationType enum

**Relationships**:
- Referenced by Chart entities
- One-to-many with DataPoint entities

### DataPoint
**Purpose**: Individual data measurement with timestamp
**Fields**:
- `id`: string (UUID) - Primary identifier
- `metricId`: string - Associated metric identifier
- `value`: number - Measured value
- `timestamp`: DateTime - When measurement was taken
- `metadata`: Record<string, any> - Additional context data
- `quality`: DataQuality - Data quality indicator

**Validation Rules**:
- `value` must be finite number
- `timestamp` must be valid DateTime
- `quality` must be valid DataQuality enum

**Relationships**:
- Many-to-one with Metric entity

### DataSource
**Purpose**: External data provider configuration
**Fields**:
- `id`: string - Data source identifier
- `type`: DataSourceType - API, database, file, etc.
- `endpoint`: string - Data source URL or connection string
- `authConfig`: AuthConfig - Authentication configuration
- `queryTemplate`: string - Query template for data fetching
- `cacheConfig`: CacheConfig - Caching configuration
- `rateLimit`: RateLimit - API rate limiting configuration

**Validation Rules**:
- `endpoint` must be valid URL or connection string
- `type` must be valid DataSourceType enum
- `cacheConfig` must have valid TTL values

**Relationships**:
- Referenced by Chart entities

### TimeRange
**Purpose**: User-defined time period for data filtering
**Fields**:
- `id`: string (UUID) - Primary identifier
- `name`: string - Human-readable name (e.g., "Last 7 days")
- `preset`: TimePreset? - Predefined time range
- `startDate`: DateTime - Range start
- `endDate`: DateTime - Range end
- `timezone`: string - Timezone identifier
- `isRelative`: boolean - Whether dates are relative to now

**Validation Rules**:
- `startDate` must be before `endDate`
- `timezone` must be valid IANA timezone identifier
- If `isRelative`, dates are calculated from current time

**Relationships**:
- Referenced by Dashboard and Chart entities

## Supporting Types

### Enums
```typescript
enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  AREA = 'area',
  SCATTER = 'scatter',
  GAUGE = 'gauge'
}

enum DataType {
  NUMBER = 'number',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  DURATION = 'duration'
}

enum AggregationType {
  SUM = 'sum',
  AVERAGE = 'avg',
  COUNT = 'count',
  MIN = 'min',
  MAX = 'max'
}

enum DataQuality {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INVALID = 'invalid'
}

enum DataSourceType {
  REST_API = 'rest_api',
  GRAPHQL = 'graphql',
  WEBSOCKET = 'websocket',
  DATABASE = 'database'
}
```

### Complex Types
```typescript
interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  responsive: boolean;
}

interface ChartConfig {
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
  animation: boolean;
  interactive: boolean;
}

interface GridPosition {
  x: number;
  y: number;
}

interface GridSize {
  width: number;
  height: number;
}

interface Threshold {
  value: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  severity: 'info' | 'warning' | 'error';
  message: string;
}

interface AuthConfig {
  type: 'bearer' | 'basic' | 'api_key' | 'oauth';
  credentials: Record<string, string>;
}

interface CacheConfig {
  ttl: number; // seconds
  maxAge: number; // seconds
  strategy: 'time_based' | 'version_based';
}

interface RateLimit {
  requests: number;
  period: number; // seconds
  strategy: 'fixed_window' | 'sliding_window';
}
```

## Data Flow Patterns

### Real-time Updates
1. DataSource polls external API at configured interval
2. New DataPoints created and stored in cache
3. Charts automatically update via React Query invalidation
4. Significant changes trigger user notifications

### Caching Strategy
1. Browser localStorage for client-side caching
2. TTL-based expiration (5min real-time, 1hr historical)
3. Manual invalidation via refresh actions
4. Background sync for offline capability

### Error Handling
1. Network failures: Retry with exponential backoff
2. Data quality issues: Fallback to cached data
3. Authentication errors: Redirect to login
4. Rate limiting: Queue requests and retry

## Performance Considerations

### Indexing Strategy
- Primary keys on all entities
- Composite index on (metricId, timestamp) for time-series queries
- Foreign key indexes for relationship queries

### Query Optimization
- Pagination for large datasets
- Aggregation at data source level when possible
- Lazy loading of chart data
- Background prefetching for predicted user actions

### Memory Management
- Limit cached data points per chart (max 1000)
- Automatic cleanup of expired cache entries
- Virtual scrolling for large time ranges
- Memory usage monitoring and alerts</content>
<parameter name="filePath">/Users/mekdesyared/AI-Assisted-Web-UI-Starter/specs/001-build-a-user/data-model.md