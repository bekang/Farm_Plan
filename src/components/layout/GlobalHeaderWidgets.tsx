import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Field } from '@/types/farm';
import { useFields } from '@/hooks/useFarmQueries';

import { WeatherWidget } from '@/features/dashboard/components/widgets/WeatherWidget';
import { PestWidget } from '@/features/dashboard/components/widgets/PestWidget';
import { MarketWidget } from '@/features/dashboard/components/widgets/MarketWidget';

interface GlobalHeaderWidgetsProps {
  fields?: Field[];
  selectedFieldId?: string | number | null;
  onFieldChange?: (id: string | number) => void;
}

export function GlobalHeaderWidgets({
  fields: propFields,
  selectedFieldId: propSelectedId,
  onFieldChange,
}: GlobalHeaderWidgetsProps = {}) {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook Data (Fallback if not controlled)
  const { data: hookFields = [] } = useFields();
  // State for internal selection (Weather Widget)
  const [internalSelectedId, setInternalSelectedId] = useState<string | number | null>(() => {
    // Initialize from LocalStorage or default to null (will be set to first field later)
    const saved = localStorage.getItem('mainFarmId');
    return saved ? Number(saved) : null;
  });
  
  // Track main farm ID explicitly to force re-renders when it changes
  const [mainFarmId, setMainFarmId] = useState<string | null>(() => localStorage.getItem('mainFarmId'));

  const handleSetMainFarm = (id: string | number) => {
    const strId = String(id);
    localStorage.setItem('mainFarmId', strId);
    setMainFarmId(strId);
    // If we're setting the main farm, we usually want to stay on that farm, so no change to selection needed strictly,
    // but the previous logic did setInternalSelectedId(id) which was redundant if already selected.
  };

  const isControlled = propFields !== undefined;
  const fields = isControlled ? propFields : hookFields;
  const selectedFieldId = isControlled ? propSelectedId : internalSelectedId;

  // Initialize selection if needed
  useEffect(() => {
    if (!isControlled && !selectedFieldId && fields.length > 0) {
      setInternalSelectedId(fields[0].id);
    }
  }, [isControlled, selectedFieldId, fields]);

  const handleFieldChange = (id: string | number) => {
    if (onFieldChange) {
      onFieldChange(id);
    } else {
      setInternalSelectedId(id);
    }
  };

  const toggleWidget = (widget: string) => {
    setActiveWidget(activeWidget === widget ? null : widget);
  };

  // Close on Route Change
  const location = useLocation();
  useEffect(() => {
    setActiveWidget(null);
  }, [location]);

  // Close on Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeWidget &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveWidget(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeWidget]);

  return (
    <div className="mr-4 flex items-center gap-3" ref={containerRef}>
      <WeatherWidget
        isActive={activeWidget === 'weather'}
        onToggle={() => toggleWidget('weather')}
        onClose={() => setActiveWidget(null)}
        fields={fields}
        selectedFieldId={selectedFieldId}
        onFieldChange={handleFieldChange}
        onSetMainFarm={handleSetMainFarm}
        isMainFarm={String(selectedFieldId) === mainFarmId}
      />

      {/* PestWidget might also benefit from refactoring, but leaving as is for now as per plan */}
      <PestWidget
        isActive={activeWidget === 'pest'}
        onToggle={() => toggleWidget('pest')}
        onClose={() => setActiveWidget(null)}
        fields={fields}
        selectedFieldId={selectedFieldId}
      />

      <MarketWidget
        isActive={activeWidget === 'market'}
        onToggle={() => toggleWidget('market')}
        onClose={() => setActiveWidget(null)}
      />
    </div>
  );
}
