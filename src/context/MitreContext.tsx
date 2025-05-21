
import { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { Tactic, Technique, Subtechnique, Threat, FilterState, TimeRange, ThreatSeverity, ThreatStatus } from '../types/mitre';
import { mockTactics } from '../data/mockData';

interface MitreContextType {
  tactics: Tactic[];
  threats: Threat[];
  filters: FilterState;
  setTimeRange: (range: TimeRange) => void;
  setSeverities: (severities: ThreatSeverity[]) => void;
  setStatuses: (statuses: ThreatStatus[]) => void;
  setTactics: (tactics: string[]) => void;
  setShowMappedOnly: (show: boolean) => void;
  setFlatView: (flat: boolean) => void;
  resetFilters: () => void;
  filteredThreats: Threat[];
  expandedTechniques: string[];
  toggleTechniqueExpanded: (techniqueId: string) => void;
  selectedThreat: Threat | null;
  setSelectedThreat: (threat: Threat | null) => void;
  isLoading: boolean;
}

const defaultFilters: FilterState = {
  timeRange: '7d',
  severities: ['Critical', 'High', 'Medium', 'Low'],
  statuses: ['Detected', 'Investigating', 'Contained', 'Remediated', 'Blocked'],
  tactics: [],
  showMappedOnly: false,
  flatView: false,
};

const MitreContext = createContext<MitreContextType | undefined>(undefined);

export const MitreProvider = ({ children }: { children: ReactNode }) => {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [expandedTechniques, setExpandedTechniques] = useState<string[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Use mock data in this example
        setTactics(mockTactics);
        
        // Generate some mock threats based on the techniques
        const mockThreats = generateMockThreats(mockTactics);
        setThreats(mockThreats);
      } catch (error) {
        console.error('Error loading MITRE data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter threats based on current filter settings
  const filteredThreats = useMemo(() => {
    return threats.filter(threat => {
      // Time range filter
      if (filters.timeRange !== 'all') {
        const threatDate = new Date(threat.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - threatDate.getTime()) / (1000 * 60 * 60);
        
        switch (filters.timeRange) {
          case '24h':
            if (hoursDiff > 24) return false;
            break;
          case '7d':
            if (hoursDiff > 24 * 7) return false;
            break;
          case '30d':
            if (hoursDiff > 24 * 30) return false;
            break;
        }
      }
      
      // Severity filter
      if (!filters.severities.includes(threat.severity)) return false;
      
      // Status filter
      if (!filters.statuses.includes(threat.status)) return false;
      
      // Tactic filter
      if (filters.tactics.length > 0) {
        // Find the technique associated with this threat
        let techniqueFound = false;
        for (const tactic of tactics) {
          if (filters.tactics.includes(tactic.id)) {
            for (const technique of tactic.techniques) {
              if (technique.id === threat.techniqueId) {
                techniqueFound = true;
                break;
              }
              
              // Check subtechniques
              for (const subtechnique of technique.subtechniques) {
                if (subtechnique.id === threat.techniqueId) {
                  techniqueFound = true;
                  break;
                }
              }
              
              if (techniqueFound) break;
            }
          }
          if (techniqueFound) break;
        }
        
        if (!techniqueFound) return false;
      }
      
      return true;
    });
  }, [threats, filters, tactics]);

  const toggleTechniqueExpanded = (techniqueId: string) => {
    setExpandedTechniques(prev => 
      prev.includes(techniqueId)
        ? prev.filter(id => id !== techniqueId)
        : [...prev, techniqueId]
    );
  };

  const setTimeRange = (range: TimeRange) => {
    setFilters(prev => ({ ...prev, timeRange: range }));
  };

  const setSeverities = (severities: ThreatSeverity[]) => {
    setFilters(prev => ({ ...prev, severities }));
  };

  const setStatuses = (statuses: ThreatStatus[]) => {
    setFilters(prev => ({ ...prev, statuses }));
  };

  const setTactics = (tacticIds: string[]) => {
    setFilters(prev => ({ ...prev, tactics: tacticIds }));
  };

  const setShowMappedOnly = (show: boolean) => {
    setFilters(prev => ({ ...prev, showMappedOnly: show }));
  };

  const setFlatView = (flat: boolean) => {
    setFilters(prev => ({ ...prev, flatView: flat }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <MitreContext.Provider
      value={{
        tactics,
        threats,
        filters,
        setTimeRange,
        setSeverities,
        setStatuses,
        setTactics,
        setShowMappedOnly,
        setFlatView,
        resetFilters,
        filteredThreats,
        expandedTechniques,
        toggleTechniqueExpanded,
        selectedThreat,
        setSelectedThreat,
        isLoading,
      }}
    >
      {children}
    </MitreContext.Provider>
  );
};

export const useMitre = () => {
  const context = useContext(MitreContext);
  if (context === undefined) {
    throw new Error('useMitre must be used within a MitreProvider');
  }
  return context;
};

// Helper function to generate mock threats for testing
function generateMockThreats(tactics: Tactic[]): Threat[] {
  const threats: Threat[] = [];
  const statuses: ThreatStatus[] = ['Detected', 'Investigating', 'Contained', 'Remediated', 'Blocked'];
  const severities: ThreatSeverity[] = ['Critical', 'High', 'Medium', 'Low'];
  
  // Generate random dates within the last 30 days
  const getRandomDate = () => {
    const now = new Date();
    const days = Math.floor(Math.random() * 30); // Random days between 0-30
    const hours = Math.floor(Math.random() * 24); // Random hours
    const minutes = Math.floor(Math.random() * 60); // Random minutes
    now.setDate(now.getDate() - days);
    now.setHours(now.getHours() - hours);
    now.setMinutes(now.getMinutes() - minutes);
    return now.toISOString();
  };
  
  // Generate threats for a subset of techniques and subtechniques
  tactics.forEach(tactic => {
    tactic.techniques.forEach(technique => {
      // 40% chance this technique has threats
      if (Math.random() < 0.4) {
        const threatCount = Math.floor(Math.random() * 3) + 1; // 1-3 threats
        
        for (let i = 0; i < threatCount; i++) {
          threats.push({
            id: `threat-${threats.length + 1}`,
            techniqueId: technique.id,
            timestamp: getRandomDate(),
            severity: severities[Math.floor(Math.random() * severities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            description: `Detected ${technique.name} activity`,
          });
        }
      }
      
      // Process subtechniques
      technique.subtechniques.forEach(subtechnique => {
        // 30% chance this subtechnique has threats
        if (Math.random() < 0.3) {
          const threatCount = Math.floor(Math.random() * 2) + 1; // 1-2 threats
          
          for (let i = 0; i < threatCount; i++) {
            threats.push({
              id: `threat-${threats.length + 1}`,
              techniqueId: subtechnique.id,
              timestamp: getRandomDate(),
              severity: severities[Math.floor(Math.random() * severities.length)],
              status: statuses[Math.floor(Math.random() * statuses.length)],
              description: `Detected ${subtechnique.name} activity`,
            });
          }
        }
      });
    });
  });
  
  return threats;
}
