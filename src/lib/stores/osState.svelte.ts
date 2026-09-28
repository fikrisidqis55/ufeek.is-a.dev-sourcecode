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
  center?: boolean;
};

export interface DesktopIconItem {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
}

export const DEFAULT_DESKTOP_ICONS: DesktopIconItem[] = [
  { id: 'welcome', title: 'My Computer', icon: '/icons/win98/computer.png', x: 20, y: 20 },
  { id: 'about', title: 'About Me', icon: '/icons/win98/about.png', x: 20, y: 120 },
  { id: 'experience', title: 'Experience', icon: '/icons/win98/experience.png', x: 20, y: 220 },
  { id: 'techstack', title: 'Tech Stack', icon: '/icons/win98/techstack.png', x: 20, y: 320 },
  { id: 'projects', title: 'Projects', icon: '/icons/win98/projects.png', x: 20, y: 420 },
  { id: 'contact', title: 'Contact', icon: '/icons/win98/contact.png', x: 20, y: 520 },
  { id: 'doom', title: 'DOOM.EXE', icon: '/icons/win98/doom.png', x: 20, y: 620 },
  { id: 'will-remember', title: 'will-remember', icon: '/icons/win98/notepad.png', x: 120, y: 20 },
  { id: 'app-cirrust-lite', title: 'Cirrust Lite.exe', icon: '/icons/win98/executable.png', x: 120, y: 120 },
  { id: 'app-liriq-rfid', title: 'Liriq RFID.exe', icon: '/icons/win98/executable.png', x: 120, y: 220 },
  { id: 'app-kansai-custom', title: 'Kansai.exe', icon: '/icons/win98/executable.png', x: 120, y: 320 },
  { id: 'app-bpn-ekantah', title: 'E-Kantah.exe', icon: '/icons/win98/executable.png', x: 120, y: 420 },
];

const ICONS_STORAGE_KEY = 'ufeek_os_desktop_icons_v1';

function clampCoordinate(x: number, y: number): { x: number; y: number } {
  if (typeof window === 'undefined') return { x, y };
  const maxX = Math.max(20, window.innerWidth - 88);
  const maxY = Math.max(20, window.innerHeight - 40 - 88);
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY)
  };
}

function loadSavedIcons(): DesktopIconItem[] {
  if (typeof window === 'undefined') {
    return DEFAULT_DESKTOP_ICONS.map((i) => ({ ...i }));
  }
  try {
    const raw = localStorage.getItem(ICONS_STORAGE_KEY);
    if (!raw) return DEFAULT_DESKTOP_ICONS.map((i) => ({ ...i }));
    const saved = JSON.parse(raw) as Record<string, { x: number; y: number }>;
    return DEFAULT_DESKTOP_ICONS.map((def) => {
      if (saved[def.id] && typeof saved[def.id].x === 'number' && typeof saved[def.id].y === 'number') {
        const clamped = clampCoordinate(saved[def.id].x, saved[def.id].y);
        return {
          ...def,
          x: clamped.x,
          y: clamped.y
        };
      }
      return { ...def };
    });
  } catch (err) {
    console.error('Failed to parse saved desktop icons:', err);
    return DEFAULT_DESKTOP_ICONS.map((i) => ({ ...i }));
  }
}

function persistIcons(icons: DesktopIconItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const toSave: Record<string, { x: number; y: number }> = {};
    for (const icon of icons) {
      toSave[icon.id] = { x: icon.x, y: icon.y };
    }
    localStorage.setItem(ICONS_STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save desktop icons:', err);
  }
}

export function createOSState() {
  let windows = $state<WindowConfig[]>([]);
  let activeWindowId = $state<string | null>(null);
  let nextZIndex = $state(10);
  let startMenuOpen = $state(false);
  let selectedIconId = $state<string | null>(null);
  let isMobile = $state(false);

  // Desktop Icons State
  let desktopIcons = $state<DesktopIconItem[]>(loadSavedIcons());
  let draggedIconId = $state<string | null>(null);
  let snapPreview = $state<{ x: number; y: number } | null>(null);

  // Desktop Context Menu State
  let desktopContextMenu = $state<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0
  });

  if (typeof window !== 'undefined') {
    const handleViewportResize = () => {
      isMobile = window.innerWidth < 768;
      // Clamp all desktop icons to keep them within viewport
      for (const icon of desktopIcons) {
        const clamped = clampCoordinate(icon.x, icon.y);
        icon.x = clamped.x;
        icon.y = clamped.y;
      }
    };
    handleViewportResize();
    window.addEventListener('resize', handleViewportResize);
  }

  function selectIcon(id: string | null) {
    selectedIconId = id;
  }

  function calculateSnapPosition(x: number, y: number, currentIconId: string): { x: number; y: number } {
    const col = Math.max(0, Math.round((x - 20) / 100));
    const row = Math.max(0, Math.round((y - 20) / 100));
    const targetX = 20 + col * 100;
    const targetY = 20 + row * 100;

    const isCellOccupied = (checkX: number, checkY: number) => {
      return desktopIcons.some(
        (item) => item.id !== currentIconId && Math.abs(item.x - checkX) < 45 && Math.abs(item.y - checkY) < 45
      );
    };

    if (!isCellOccupied(targetX, targetY)) {
      return clampCoordinate(targetX, targetY);
    }

    // Find nearest unoccupied cell
    const maxRow = typeof window !== 'undefined' ? Math.max(1, Math.floor((window.innerHeight - 130) / 100)) : 6;
    for (let c = 0; c < 15; c++) {
      for (let r = 0; r <= maxRow; r++) {
        const candCol = col + c;
        const candRow = (row + r) % (maxRow + 1);
        const candX = 20 + candCol * 100;
        const candY = 20 + candRow * 100;
        if (!isCellOccupied(candX, candY)) {
          return clampCoordinate(candX, candY);
        }
      }
    }

    return clampCoordinate(targetX, targetY);
  }

  function setDraggingState(id: string | null, rawX?: number, rawY?: number) {
    draggedIconId = id;
    if (id !== null && rawX !== undefined && rawY !== undefined) {
      snapPreview = calculateSnapPosition(rawX, rawY, id);
    } else {
      snapPreview = null;
    }
  }

  function dropIcon(id: string, rawX: number, rawY: number) {
    const icon = desktopIcons.find((i) => i.id === id);
    if (icon) {
      const snapped = calculateSnapPosition(rawX, rawY, id);
      icon.x = snapped.x;
      icon.y = snapped.y;
      persistIcons(desktopIcons);
    }
    draggedIconId = null;
    snapPreview = null;
  }

  function autoArrangeIcons() {
    if (typeof window === 'undefined') return;
    const maxRow = Math.max(1, Math.floor((window.innerHeight - 130) / 100));
    let col = 0;
    let row = 0;

    for (const icon of desktopIcons) {
      icon.x = 20 + col * 100;
      icon.y = 20 + row * 100;
      row++;
      if (row > maxRow) {
        row = 0;
        col++;
      }
    }
    persistIcons(desktopIcons);
    closeDesktopContextMenu();
  }

  function lineUpIcons() {
    for (const icon of desktopIcons) {
      const snapped = calculateSnapPosition(icon.x, icon.y, icon.id);
      icon.x = snapped.x;
      icon.y = snapped.y;
    }
    persistIcons(desktopIcons);
    closeDesktopContextMenu();
  }

  function resetDesktopIcons() {
    for (const def of DEFAULT_DESKTOP_ICONS) {
      const icon = desktopIcons.find((i) => i.id === def.id);
      if (icon) {
        icon.x = def.x;
        icon.y = def.y;
      }
    }
    persistIcons(desktopIcons);
    closeDesktopContextMenu();
  }

  function openDesktopContextMenu(x: number, y: number) {
    startMenuOpen = false;
    selectedIconId = null;
    desktopContextMenu = { isOpen: true, x, y };
  }

  function closeDesktopContextMenu() {
    if (desktopContextMenu.isOpen) {
      desktopContextMenu = { isOpen: false, x: 0, y: 0 };
    }
  }

  function openWindow(config: Omit<WindowConfig, 'isOpen' | 'isMinimized' | 'zIndex'>) {
    closeDesktopContextMenu();
    const existing = windows.find((w) => w.id === config.id);
    if (existing) {
      existing.isOpen = true;
      existing.isMinimized = false;
      if (config.center !== undefined) existing.center = config.center;
      if (config.width !== undefined) existing.width = config.width;
      if (config.height !== undefined) existing.height = config.height;
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
    closeDesktopContextMenu();
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
    closeDesktopContextMenu();
    const window = windows.find((w) => w.id === id);
    if (window && (!window.isMinimized)) {
      window.zIndex = nextZIndex++;
      activeWindowId = id;
    }
    startMenuOpen = false;
  }
  
  function toggleStartMenu() {
    closeDesktopContextMenu();
    startMenuOpen = !startMenuOpen;
  }

  return {
    get windows() { return windows; },
    get activeWindowId() { return activeWindowId; },
    get startMenuOpen() { return startMenuOpen; },
    get selectedIconId() { return selectedIconId; },
    get isMobile() { return isMobile; },
    get desktopIcons() { return desktopIcons; },
    get draggedIconId() { return draggedIconId; },
    get snapPreview() { return snapPreview; },
    get desktopContextMenu() { return desktopContextMenu; },
    clampCoordinate,
    calculateSnapPosition,
    setDraggingState,
    dropIcon,
    autoArrangeIcons,
    lineUpIcons,
    resetDesktopIcons,
    openDesktopContextMenu,
    closeDesktopContextMenu,
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

