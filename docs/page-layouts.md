# Page Layout Components

## Overview
Reusable layout components for consistent page centering and spacing across the application.

## Components

### 1. `PageContainer`
A flexible container component for horizontally centered content with optional vertical centering.

#### Props
- `children`: ReactNode - The content to render
- `className?`: string - Additional CSS classes
- `maxWidth?`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full' - Maximum width (default: '7xl')
- `noPadding?`: boolean - Remove default padding (default: false)
- `centerContent?`: boolean - Vertically center content (default: false)

#### Usage Examples

**Basic usage (horizontally centered, top-aligned):**
```tsx
import { PageContainer } from '@/components/layouts';

export default function MyPage() {
  return (
    <PageContainer>
      <h1>My Page Title</h1>
      <p>Content goes here...</p>
    </PageContainer>
  );
}
```

**Vertically and horizontally centered (for empty states, loading, etc.):**
```tsx
import { PageContainer } from '@/components/layouts';

export default function EmptyState() {
  return (
    <PageContainer centerContent maxWidth="lg">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Icon className="h-16 w-16" />
        <h1>No items found</h1>
        <p>Try adjusting your filters</p>
      </div>
    </PageContainer>
  );
}
```

**Custom max width:**
```tsx
<PageContainer maxWidth="2xl">
  {/* Content constrained to 2xl width */}
</PageContainer>
```

**No padding (for custom layouts):**
```tsx
<PageContainer noPadding>
  {/* You handle padding yourself */}
</PageContainer>
```

### 2. `CenteredPageLayout`
A simpler component specifically for vertically and horizontally centered content.

#### Props
- `children`: ReactNode - The content to render
- `className?`: string - Additional CSS classes
- `maxWidth?`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full' - Maximum width (default: '7xl')
- `noPadding?`: boolean - Remove default padding (default: false)

#### Usage Example
```tsx
import { CenteredPageLayout } from '@/components/layouts';

export default function LoginPage() {
  return (
    <CenteredPageLayout maxWidth="md">
      <LoginForm />
    </CenteredPageLayout>
  );
}
```

## Max Width Options

| Value | Tailwind Class | Approx. Width |
|-------|----------------|---------------|
| `sm` | `max-w-screen-sm` | 640px |
| `md` | `max-w-screen-md` | 768px |
| `lg` | `max-w-screen-lg` | 1024px |
| `xl` | `max-w-screen-xl` | 1280px |
| `2xl` | `max-w-screen-2xl` | 1536px |
| `4xl` | `max-w-[1400px]` | 1400px |
| `7xl` | `max-w-7xl` | 1280px |
| `full` | `max-w-full` | 100% |

## When to Use Which Component

### Use `PageContainer`:
- ✅ Most pages (products, cart, checkout, etc.)
- ✅ When you need horizontal centering
- ✅ When content should start at the top
- ✅ When you might need optional vertical centering

### Use `CenteredPageLayout`:
- ✅ Login/signup pages
- ✅ Error pages (404, 500)
- ✅ Loading states
- ✅ Simple centered forms
- ✅ When content should always be vertically centered

## Migration Examples

### Before (old container approach):
```tsx
<div className="container py-10 px-4 md:px-6">
  <h1>My Page</h1>
  {/* content */}
</div>
```

### After (with PageContainer):
```tsx
<PageContainer maxWidth="7xl">
  <h1>My Page</h1>
  {/* content */}
</PageContainer>
```

### Before (empty state):
```tsx
<div className="container flex flex-col items-center justify-center py-24 space-y-4">
  <Icon />
  <h1>Empty State</h1>
</div>
```

### After (with PageContainer):
```tsx
<PageContainer centerContent maxWidth="lg">
  <div className="flex flex-col items-center space-y-4 text-center">
    <Icon />
    <h1>Empty State</h1>
  </div>
</PageContainer>
```

## Benefits
- ✅ Consistent spacing across all pages
- ✅ Proper horizontal centering
- ✅ Responsive padding
- ✅ Easy to maintain
- ✅ Reusable and composable
- ✅ TypeScript support
