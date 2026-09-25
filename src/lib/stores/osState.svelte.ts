export type WindowConfig = {
  id: string;
  title: string;
  icon?: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
};

export function createOSState() {
  let windows = $state<WindowConfig[]>([]);
  let activeWindowId = $state<string | null>(null);
  let nextZIndex = $state(10);
  let startMenuOpen = $state(false);
  let selectedIconId = $state<string | null>(null);

  function selectIcon(id: string | null) {
      selectedIconId = id;
  }

  function openWindow(config: Omit<WindowConfig, 'isOpen' | 'isMinimized' | 'zIndex'>) {
    const existing = windows.find((w) => w.id === config.id);
    if (existing) {
      existing.isOpen = true;
      existing.isMinimized = false;
      focusWindow(config.id);
    } else {
      windows.push({
        ...config,
        isOpen: true,
        isMinimized: false,
        zIndex: nextZIndex++
      });
      activeWindowId = config.id;
    }
    startMenuOpen = false;
  }

  function closeWindow(id: string) {
    const window = windows.find((w) => w.id === id);
    if (window) {
      window.isOpen = false;
      if (activeWindowId === id) {
        activeWindowId = null;
      }
    }
  }

  function minimizeWindow(id: string) {
    const window = windows.find((w) => w.id === id);
    if (window) {
      window.isMinimized = true;
      if (activeWindowId === id) {
        activeWindowId = null;
      }
    }
  }

  function toggleMinimize(id: string) {
      const window = windows.find((w) => w.id === id);
      if (window) {
          if (window.isMinimized) {
              window.isMinimized = false;
              focusWindow(id);
          } else if (activeWindowId === id) {
              window.isMinimized = true;
              activeWindowId = null;
          } else {
              focusWindow(id);
          }
      }
  }

  function focusWindow(id: string) {
    const window = windows.find((w) => w.id === id);
    if (window && (!window.isMinimized)) {
      window.zIndex = nextZIndex++;
      activeWindowId = id;
    }
    startMenuOpen = false;
  }
  
  function toggleStartMenu() {
      startMenuOpen = !startMenuOpen;
  }

  return {
    get windows() { return windows; },
    get activeWindowId() { return activeWindowId; },
    get startMenuOpen() { return startMenuOpen; },
    get selectedIconId() { return selectedIconId; },
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMinimize,
    focusWindow,
    toggleStartMenu,
    selectIcon
  };
}

// Global singleton
export const osState = createOSState();
