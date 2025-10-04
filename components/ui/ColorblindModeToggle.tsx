'use client';

import { useAppStore } from '@/store/useAppStore';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const colorblindModes = [
  { value: 'none' as const, label: 'Default', description: 'Normal color vision' },
  { value: 'deuteranopia' as const, label: 'Deuteranopia', description: 'Red-green color blindness (most common)' },
  { value: 'protanopia' as const, label: 'Protanopia', description: 'Red-weak color blindness' },
  { value: 'tritanopia' as const, label: 'Tritanopia', description: 'Blue-yellow color blindness' },
];

export default function ColorblindModeToggle() {
  const { colorblindMode, setColorblindMode } = useAppStore();

  const currentModeIndex = colorblindModes.findIndex(m => m.value === colorblindMode);
  const currentMode = colorblindModes[currentModeIndex];

  const cycleMode = () => {
    const nextIndex = (currentModeIndex + 1) % colorblindModes.length;
    setColorblindMode(colorblindModes[nextIndex].value);
  };

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="sm"
        onClick={cycleMode}
        className="flex items-center gap-2"
        aria-label={`Colorblind mode: ${currentMode.label}. Click to cycle.`}
        title={currentMode.description}
      >
        {colorblindMode === 'none' ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4 text-space-cyan" />
        )}
        <span className="hidden sm:inline text-xs">{currentMode.label}</span>
      </Button>

      {/* Tooltip */}
      <div className="absolute right-0 mt-2 w-64 p-3 bg-black/90 border border-white/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
        <div className="space-y-2">
          <div className="text-xs font-medium text-white border-b border-white/10 pb-2">
            Colorblind Modes
          </div>
          {colorblindModes.map((mode) => (
            <div
              key={mode.value}
              className={`text-xs ${
                mode.value === colorblindMode
                  ? 'text-space-cyan font-medium'
                  : 'text-gray-400'
              }`}
            >
              <span className="font-medium">{mode.label}:</span> {mode.description}
            </div>
          ))}
          <div className="text-xs text-gray-500 pt-2 border-t border-white/10">
            Click to cycle through modes
          </div>
        </div>
      </div>
    </div>
  );
}
