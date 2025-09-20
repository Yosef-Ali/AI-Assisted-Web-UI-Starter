/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliance utilities and helpers
 */

import React, { useEffect, useRef } from 'react';

export const a11yUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Focus management
  focusFirstFocusable: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  },

  // Trap focus within a container (for modals, etc.)
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  },

  // Announce content to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Skip link functionality
  createSkipLink: (targetId: string, text: string = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
      border-radius: 4px;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    return skipLink;
  },
};

// Custom hooks for accessibility
export function useA11yAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    a11yUtils.announce(message, priority);
  };

  return { announce };
}

export function useFocusTrap(active: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const cleanup = a11yUtils.trapFocus(containerRef.current);
    return cleanup;
  }, [active]);

  return containerRef;
}

export function useKeyboardNavigation(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        onEnter?.();
        break;
      case 'Escape':
        onEscape?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onArrowRight?.();
        break;
    }
  };

  return { handleKeyDown };
}

// Color contrast utilities
export const colorUtils = {
  // Calculate relative luminance
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1: string, color2: string): number => {
    // This is a simplified version - in production, you'd parse actual colors
    const lum1 = colorUtils.getRelativeLuminance(255, 255, 255); // Assume white
    const lum2 = colorUtils.getRelativeLuminance(0, 0, 0); // Assume black

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsContrastRequirement: (
    ratio: number,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): boolean => {
    if (level === 'AAA') {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    }
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  },
};

// ARIA live region component
interface LiveRegionProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  priority = 'polite',
  atomic = true,
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={className}
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

// Accessible button component with enhanced features
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  expanded?: boolean;
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  controls?: string;
  describedBy?: string;
  labelledBy?: string;
}

export function AccessibleButton({
  pressed,
  expanded,
  hasPopup,
  controls,
  describedBy,
  labelledBy,
  children,
  ...props
}: AccessibleButtonProps) {
  const ariaProps: Record<string, any> = {};

  if (pressed !== undefined) {
    ariaProps['aria-pressed'] = pressed;
  }

  if (expanded !== undefined) {
    ariaProps['aria-expanded'] = expanded;
  }

  if (hasPopup) {
    ariaProps['aria-haspopup'] = hasPopup === true ? 'menu' : hasPopup;
  }

  if (controls) {
    ariaProps['aria-controls'] = controls;
  }

  if (describedBy) {
    ariaProps['aria-describedby'] = describedBy;
  }

  if (labelledBy) {
    ariaProps['aria-labelledby'] = labelledBy;
  }

  return (
    <button {...props} {...ariaProps}>
      {children}
    </button>
  );
}

// Screen reader only text component
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenReaderOnly({ children, className }: ScreenReaderOnlyProps) {
  return (
    <span
      className={className}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
}