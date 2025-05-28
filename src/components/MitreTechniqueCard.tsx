import React from 'react';
import { useMitre } from '../context/MitreContext';
import { Technique, Subtechnique } from '../types/mitre';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

interface MitreTechniqueCardProps {
  technique: Technique;
  tacticId: string;
}

interface MitreSubtechniqueCardProps {
  subtechnique: Subtechnique;
  parentTechnique: Technique;
  flatView?: boolean;
}

// Helper function to calculate heatmap color based on threat count
const getHeatmapColor = (threatCount: number) => {
  // Define thresholds for different intensity levels
  const maxThreats = 10; // Maximum number of threats
  const intensity = Math.min(threatCount / maxThreats, 1);

  // Use a more intuitive color scheme that transitions from cool to warm colors
  if (threatCount === 0) {
    return '#f8fafc'; // Very light gray for no threats
  }

  // Color stops for gradient (from low to high intensity)
  const colorStops = [
    { r: 237, g: 248, b: 255 }, // Very light blue (#edf8ff)
    { r: 179, g: 215, b: 255 }, // Light blue (#b3d7ff)
    { r: 110, g: 168, b: 255 }, // Medium blue (#6ea8ff)
    { r: 41, g: 121, b: 255 },  // Bright blue (#2979ff)
    { r: 0, g: 84, b: 255 }     // Deep blue (#0054ff)
  ];

  // Find the appropriate color segment
  const segments = colorStops.length - 1;
  const segment = Math.min(Math.floor(intensity * segments), segments - 1);
  const segmentIntensity = (intensity * segments) - segment;

  // Interpolate between colors
  const c1 = colorStops[segment];
  const c2 = colorStops[segment + 1];

  const r = Math.round(c1.r + (c2.r - c1.r) * segmentIntensity);
  const g = Math.round(c1.g + (c2.g - c1.g) * segmentIntensity);
  const b = Math.round(c1.b + (c2.b - c1.b) * segmentIntensity);

  return `rgb(${r}, ${g}, ${b})`;
};

// Subtechnique card component
export const MitreSubtechniqueCard: React.FC<MitreSubtechniqueCardProps> = ({
  subtechnique,
  parentTechnique,
  flatView = false,
}) => {
  const { filteredThreats, selectedThreat, setSelectedThreat } = useMitre();

  // Count threats mapped to this subtechnique
  const threatCount = filteredThreats.filter(
    (threat) => threat.techniqueId === subtechnique.id
  ).length;

  // Calculate heatmap color
  const heatmapColor = getHeatmapColor(threatCount);

  const handleClick = () => {
    // If there are threats, select the first one
    if (threatCount > 0) {
      const threat = filteredThreats.find(
        (threat) => threat.techniqueId === subtechnique.id
      );
      setSelectedThreat(threat || null);
    }
  };

  return (
    <div
      className={`
        p-2 rounded-md border transition-all cursor-pointer hover:shadow-md
        ${selectedThreat && selectedThreat.techniqueId === subtechnique.id ? 'ring-2 ring-blue-500' : ''}
      `}
      onClick={handleClick}
      style={{
        backgroundColor: threatCount > 0 ? heatmapColor : '#f8fafc',
        color: '#1e293b'
      }}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          {flatView && (
            <div className="flex items-center gap-1 mb-0.5">
              <Badge variant="secondary" className="bg-mitre-purple text-white text-[10px] px-1 py-0">
                Sub
              </Badge>
              <span className="text-[10px] opacity-80 truncate">
                {parentTechnique.name}
              </span>
            </div>
          )}

          <div className="font-medium text-xs truncate">
            {subtechnique.name}
            <span className="text-[10px] ml-1 opacity-80">{subtechnique.id}</span>
          </div>

          {threatCount > 0 && (
            <Badge variant="secondary" className="mt-0.5 bg-white/20 hover:bg-white/30 text-[10px] px-1 py-0">
              {threatCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

// Main technique card component
const MitreTechniqueCard: React.FC<MitreTechniqueCardProps> = ({ technique, tacticId }) => {
  const {
    filteredThreats,
    expandedTechniques,
    toggleTechniqueExpanded,
    filters,
    selectedThreat,
    setSelectedThreat
  } = useMitre();

  const isExpanded = expandedTechniques.includes(technique.id);
  const hasSubtechniques = technique.subtechniques.length > 0;

  // Count threats mapped directly to this technique (not subtechniques)
  const directThreatCount = filteredThreats.filter(
    (threat) => threat.techniqueId === technique.id
  ).length;

  // Count threats mapped to subtechniques
  const subtechniqueThreatCount = filteredThreats.filter(
    (threat) => technique.subtechniques.some(sub => sub.id === threat.techniqueId)
  ).length;

  // Total threats including subtechniques
  const totalThreatCount = directThreatCount + subtechniqueThreatCount;

  // Calculate heatmap color for technique
  const heatmapColor = getHeatmapColor(totalThreatCount);

  const handleExpandToggle = (e: React.MouseEvent) => {
    // Only if there are subtechniques
    if (hasSubtechniques) {
      e.stopPropagation();
      toggleTechniqueExpanded(technique.id);
    }
  };

  const handleCardClick = () => {
    // If there are direct threats, select the first one
    if (directThreatCount > 0) {
      const threat = filteredThreats.find(
        (threat) => threat.techniqueId === technique.id
      );
      setSelectedThreat(threat || null);
    }
  };

  // Check if we should show this card in "show mapped only" mode
  if (filters.showMappedOnly && totalThreatCount === 0) {
    return null;
  }

  // In flat view, we render techniques and subtechniques separately
  if (filters.flatView) {
    return (
      <>
        {/* Technique Card */}
        <div
          className={`
            p-2 rounded-md border transition-all mb-1.5 
            ${selectedThreat && selectedThreat.techniqueId === technique.id ? 'ring-2 ring-blue-500' : ''}
            hover:shadow-md cursor-pointer
          `}
          onClick={handleCardClick}
          style={{
            backgroundColor: totalThreatCount > 0 ? heatmapColor : '#f8fafc',
            color: '#1e293b'
          }}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] px-1 py-0">
                  T
                </Badge>
                <div className="font-medium text-xs truncate">
                  {technique.name}
                  <span className="text-[10px] ml-1 opacity-60">{technique.id}</span>
                </div>
              </div>

              {directThreatCount > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-[10px] px-1 py-0">
                    {directThreatCount}
                  </Badge>
                  {subtechniqueThreatCount > 0 && (
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-[10px] px-1 py-0">
                      +{subtechniqueThreatCount} sub
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtechniques */}
        {technique.subtechniques.map((subtechnique) => (
          <div key={subtechnique.id} className="ml-3 mb-1.5">
            <div
              className={`
                p-2 rounded-md border transition-all cursor-pointer hover:shadow-md
                ${selectedThreat && selectedThreat.techniqueId === subtechnique.id ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => {
                const threat = filteredThreats.find(
                  (threat) => threat.techniqueId === subtechnique.id
                );
                setSelectedThreat(threat || null);
              }}
              style={{
                backgroundColor: filteredThreats.some(t => t.techniqueId === subtechnique.id) ? heatmapColor : '#f8fafc',
                color: '#1e293b'
              }}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] px-1 py-0">
                      S
                    </Badge>
                    <div className="font-medium text-xs truncate">
                      {subtechnique.name}
                      <span className="text-[10px] ml-1 opacity-60">{subtechnique.id}</span>
                    </div>
                  </div>

                  {filteredThreats.some(t => t.techniqueId === subtechnique.id) && (
                    <Badge variant="secondary" className="mt-1 bg-white/20 hover:bg-white/30 text-[10px] px-1 py-0">
                      {filteredThreats.filter(t => t.techniqueId === subtechnique.id).length}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Normal hierarchical view
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={() => hasSubtechniques && toggleTechniqueExpanded(technique.id)}
      className="mb-2"
    >
      <div
        className={`
          p-2 rounded-md border transition-all cursor-pointer hover:shadow-md
          ${selectedThreat && selectedThreat.techniqueId === technique.id ? 'ring-2 ring-blue-500' : ''}
        `}
        onClick={handleCardClick}
        style={{
          backgroundColor: totalThreatCount > 0 ? heatmapColor : '#f8fafc',
          color: '#1e293b'
        }}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs truncate">
              {technique.name}
              <span className="text-[10px] ml-1 opacity-80">{technique.id}</span>
            </div>

            <div className="flex items-center gap-1 mt-0.5">
              {directThreatCount > 0 && (
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-[10px] px-1 py-0">
                  {directThreatCount}
                </Badge>
              )}

              {subtechniqueThreatCount > 0 && (
                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-[10px] px-1 py-0">
                  +{subtechniqueThreatCount}
                </Badge>
              )}
            </div>
          </div>

          {hasSubtechniques && (
            <CollapsibleTrigger asChild onClick={handleExpandToggle}>
              <div className="flex items-center justify-center w-4 h-4">
                <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
          )}
        </div>
      </div>

      {hasSubtechniques && (
        <CollapsibleContent className="mt-2 ml-4 space-y-2">
          {technique.subtechniques.map((subtechnique) => (
            <MitreSubtechniqueCard
              key={subtechnique.id}
              subtechnique={subtechnique}
              parentTechnique={technique}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default MitreTechniqueCard;
