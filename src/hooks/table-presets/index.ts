import { useState, useEffect } from 'react';
import { TablePreset } from '../../components/table/component';

interface UseTablePresetsOptions {
  storageKey: string;
  defaultPresets?: TablePreset[];
}

export const useTablePresets = ({ storageKey, defaultPresets = [] }: UseTablePresetsOptions) => {
  const [presets, setPresets] = useState<TablePreset[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored presets:', error);
        setPresets(defaultPresets);
      }
    } else {
      setPresets(defaultPresets);
    }
  }, [storageKey, defaultPresets]);

  const savePreset = (preset: TablePreset) => {
    const newPresets = [...presets, preset];
    setPresets(newPresets);
    localStorage.setItem(storageKey, JSON.stringify(newPresets));
  };

  const deletePreset = (presetId: string) => {
    const newPresets = presets.filter(p => p.id !== presetId);
    setPresets(newPresets);
    localStorage.setItem(storageKey, JSON.stringify(newPresets));
  };

  const updatePreset = (presetId: string, updatedPreset: Partial<TablePreset>) => {
    const newPresets = presets.map(p => 
      p.id === presetId ? { ...p, ...updatedPreset } : p
    );
    setPresets(newPresets);
    localStorage.setItem(storageKey, JSON.stringify(newPresets));
  };

  return {
    presets,
    savePreset,
    deletePreset,
    updatePreset,
  };
};