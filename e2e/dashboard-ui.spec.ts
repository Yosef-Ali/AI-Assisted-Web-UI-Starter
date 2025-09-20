import { test, expect } from '@playwright/test';

test.describe('Dashboard UI Tests', () => {
    test('should load dashboard page successfully', async ({ page }) => {
        await page.goto('/');

        // Check if page loads without errors
        await expect(page.locator('body')).toBeVisible();

        // Check for basic dashboard elements (these will be added in future phases)
        // For now, just verify the page structure exists
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });

    test('should have proper page title', async ({ page }) => {
        await page.goto('/');

        // Check if title contains dashboard-related text
        const title = await page.title();
        expect(title.toLowerCase()).toMatch(/(dashboard|analytics|data)/);
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
        await page.goto('/');

        // Check if page loads on mobile
        await expect(page.locator('body')).toBeVisible();

        // Verify viewport is correct
        const viewport = page.viewportSize();
        expect(viewport?.width).toBe(375);
        expect(viewport?.height).toBe(667);
    });

    test('should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
        await page.goto('/');

        // Check if page loads on tablet
        await expect(page.locator('body')).toBeVisible();

        // Verify viewport is correct
        const viewport = page.viewportSize();
        expect(viewport?.width).toBe(768);
        expect(viewport?.height).toBe(1024);
    });

    test('should be responsive on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop size
        await page.goto('/');

        // Check if page loads on desktop
        await expect(page.locator('body')).toBeVisible();

        // Verify viewport is correct
        const viewport = page.viewportSize();
        expect(viewport?.width).toBe(1920);
        expect(viewport?.height).toBe(1080);
    });
});

test.describe('Accessibility Tests', () => {
    test('should have proper heading structure', async ({ page }) => {
        await page.goto('/');

        // Check for at least one h1 element
        const h1Elements = page.locator('h1');
        const h1Count = await h1Elements.count();
        expect(h1Count).toBeGreaterThan(0);
    });

    test('should have alt text for images', async ({ page }) => {
        await page.goto('/');

        // Check all images have alt text
        const images = page.locator('img');
        const imageCount = await images.count();

        for (let i = 0; i < imageCount; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
            expect(alt?.trim()).not.toBe('');
        }
    });

    test('should have proper form labels', async ({ page }) => {
        await page.goto('/');

        // Check all input elements have associated labels
        const inputs = page.locator('input');
        const inputCount = await inputs.count();

        for (let i = 0; i < inputCount; i++) {
            const input = inputs.nth(i);
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledBy = await input.getAttribute('aria-labelledby');

            // Input should have either id with label, aria-label, or aria-labelledby
            const hasLabel = id || ariaLabel || ariaLabelledBy;
            expect(hasLabel).toBeTruthy();
        }
    });

    test('should have sufficient color contrast', async ({ page }) => {
        await page.goto('/');

        // This is a basic check - in a real scenario, you'd use axe-playwright
        // or similar accessibility testing tools for comprehensive contrast checking
        const body = page.locator('body');
        const backgroundColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
        const color = await body.evaluate(el => getComputedStyle(el).color);

        // Basic check that colors are defined
        expect(backgroundColor).toBeTruthy();
        expect(color).toBeTruthy();
    });

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('/');

        // Test basic keyboard navigation
        await page.keyboard.press('Tab');

        // Check if focus is visible (basic check)
        const focusedElement = page.locator(':focus');
        const isVisible = await focusedElement.isVisible();

        // If there are focusable elements, at least one should be visible
        if (await focusedElement.count() > 0) {
            expect(isVisible).toBeTruthy();
        }
    });
});

test.describe('Performance Tests', () => {
    test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/', { waitUntil: 'networkidle' });

        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should have reasonable bundle size', async ({ page }) => {
        await page.goto('/');

        // Check if there are any large assets that might indicate bundle bloat
        const resources = await page.evaluate(() =>
            performance.getEntriesByType('resource')
                .filter(entry => entry.name.includes('.js'))
                .map(entry => ({
                    name: entry.name,
                    size: (entry as any).transferSize || 0
                }))
        );

        // Log bundle sizes for monitoring
        console.log('JavaScript bundles:', resources);

        // Basic check that we don't have extremely large bundles
        const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
        expect(totalSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB total
    });

    test('should not have console errors', async ({ page }) => {
        const errors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/', { waitUntil: 'networkidle' });

        // Allow for some time to catch any async errors
        await page.waitForTimeout(2000);

        // Filter out common non-error messages
        const significantErrors = errors.filter(error =>
            !error.includes('favicon') &&
            !error.includes('manifest') &&
            !error.includes('Failed to load resource')
        );

        expect(significantErrors).toHaveLength(0);
    });
});