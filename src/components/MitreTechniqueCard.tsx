
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
  
  // Determine card style based on threat mapping
  const hasMappedThreats = threatCount > 0;
  
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
        p-3 rounded-md border transition-all 
        ${hasMappedThreats ? 'bg-gradient-to-r from-mitre-red-light to-mitre-red hover:from-mitre-red hover:to-mitre-red-dark text-white' : 'bg-gradient-to-r from-mitre-slate-dark to-mitre-slate bg-opacity-60 text-gray-800'}
        ${selectedThreat && selectedThreat.techniqueId === subtechnique.id ? 'ring-2 ring-blue-500' : ''}
        hover:shadow-md cursor-pointer
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {flatView && (
            <div className="mb-1 flex items-center">
              <Badge variant="secondary" className="bg-mitre-purple text-white mr-2">
                Subtechnique
              </Badge>
              <span className="text-xs opacity-80">
                Parent: {parentTechnique.name}
              </span>
            </div>
          )}
          
          <div className="font-medium text-sm">
            {subtechnique.name}
            <span className="text-xs ml-2 opacity-80">{subtechnique.id}</span>
          </div>
          
          {threatCount > 0 && (
            <Badge variant="secondary" className={`mt-1 ${hasMappedThreats ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200'}`}>
              {threatCount} {threatCount === 1 ? 'threat' : 'threats'}
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
  
  // Determine card style based on threat mapping
  const hasMappedThreats = directThreatCount > 0;
  
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
            p-4 rounded-md border transition-all mb-2 
            ${hasMappedThreats ? 'bg-gradient-to-r from-mitre-orange-light to-mitre-orange hover:from-mitre-orange hover:to-mitre-orange-dark text-white' : 'bg-gradient-to-r from-mitre-slate-light to-mitre-slate text-gray-800'}
            ${selectedThreat && selectedThreat.techniqueId === technique.id ? 'ring-2 ring-blue-500' : ''}
            hover:shadow-md cursor-pointer
          `}
          onClick={handleCardClick}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <Badge variant="secondary" className="bg-mitre-blue text-white mr-2">
                  Technique
                </Badge>
              </div>
              
              <div className="font-medium">
                {technique.name}
                <span className="text-xs ml-2 opacity-80">{technique.id}</span>
              </div>
              
              {directThreatCount > 0 && (
                <Badge variant="secondary" className={`mt-1 ${hasMappedThreats ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200'}`}>
                  {directThreatCount} {directThreatCount === 1 ? 'threat' : 'threats'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Subtechniques */}
        {technique.subtechniques.map((subtechnique) => (
          <div key={subtechnique.id} className="ml-4 mb-2">
            <MitreSubtechniqueCard 
              subtechnique={subtechnique} 
              parentTechnique={technique}
              flatView={true}
            />
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
          p-4 rounded-md border transition-all 
          ${hasMappedThreats ? 'bg-gradient-to-r from-mitre-orange-light to-mitre-orange hover:from-mitre-orange hover:to-mitre-orange-dark text-white' : 'bg-gradient-to-r from-mitre-slate-light to-mitre-slate text-gray-800'}
          ${selectedThreat && selectedThreat.techniqueId === technique.id ? 'ring-2 ring-blue-500' : ''}
          hover:shadow-md cursor-pointer
        `}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium">
              {technique.name}
              <span className="text-xs ml-2 opacity-80">{technique.id}</span>
            </div>
            
            <div className="flex items-center mt-1">
              {directThreatCount > 0 && (
                <Badge variant="secondary" className={`${hasMappedThreats ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200'}`}>
                  {directThreatCount} {directThreatCount === 1 ? 'threat' : 'threats'}
                </Badge>
              )}
              
              {subtechniqueThreatCount > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasMappedThreats ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200'}`}>
                  {subtechniqueThreatCount} in subtechniques
                </Badge>
              )}
            </div>
          </div>
          
          {hasSubtechniques && (
            <CollapsibleTrigger asChild onClick={handleExpandToggle}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-md ${hasMappedThreats ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer transition-all`}>
                <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
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
