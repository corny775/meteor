/**
 * Keyboard Navigation Handler
 * Provides keyboard shortcuts for accessibility
 */

export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
};

export class KeyboardHandler {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  register(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  unregister(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow arrow keys for sliders even in focused state
      if (target.getAttribute('role') === 'slider' && 
          (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
           event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        // Let the slider handle it
        return;
      }
      // Allow Escape to unfocus
      if (event.key !== 'Escape') return;
    }

    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    parts.push(event.key.toLowerCase());
    
    const key = parts.join('+');
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    this.shortcuts.clear();
  }
}

// Global keyboard handler instance
export const keyboardHandler = new KeyboardHandler();

// Helper hook for React components
export function useKeyboardShortcut(shortcut: KeyboardShortcut): void {
  if (typeof window === 'undefined') return;

  const register = () => keyboardHandler.register(shortcut);
  const unregister = () => keyboardHandler.unregister(shortcut);

  // Register on mount
  register();

  // Cleanup on unmount
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', unregister);
  }

  return;
}
