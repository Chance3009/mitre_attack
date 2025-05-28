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
  setTacticFilters: (tactics: string[]) => void;
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

  // Renamed from setTactics to setTacticFilters to avoid conflict
  const setTacticFilters = (tacticIds: string[]) => {
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
        setTacticFilters,
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

  // Expanded list of severities with weighted probabilities
  const severityWeights = {
    Critical: 0.15,  // 15% chance
    High: 0.35,      // 35% chance
    Medium: 0.35,    // 35% chance
    Low: 0.15        // 15% chance
  };

  // Expanded list of statuses with weighted probabilities
  const statusWeights = {
    Detected: 0.3,      // 30% chance
    Investigating: 0.25, // 25% chance
    Contained: 0.2,     // 20% chance
    Remediated: 0.15,   // 15% chance
    Blocked: 0.1        // 10% chance
  };

  // Helper function to get random item based on weights
  const getRandomWeighted = (weights: Record<string, number>) => {
    const random = Math.random();
    let sum = 0;
    for (const [item, weight] of Object.entries(weights)) {
      sum += weight;
      if (random <= sum) return item;
    }
    return Object.keys(weights)[0];
  };

  // Helper function to generate more varied timestamps
  const getRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // Random day within last 30 days
    const hoursAgo = Math.floor(Math.random() * 24); // Random hour within that day
    const minutesAgo = Math.floor(Math.random() * 60); // Random minute within that hour
    return new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
  };

  // Enhanced description generation with more context and variety
  const generateDescription = (techniqueName: string, severity: string, status: string) => {
    const locations = [
      "internal network",
      "external endpoint",
      "cloud infrastructure",
      "development environment",
      "production server",
      "user workstation",
      "mobile device",
      "database server",
      "web application",
      "email system"
    ];

    const impacts = [
      "potential data exfiltration",
      "system compromise",
      "credential theft",
      "service disruption",
      "unauthorized access",
      "malware infection",
      "configuration change",
      "privilege escalation",
      "lateral movement",
      "data encryption"
    ];

    const indicators = [
      "unusual network traffic",
      "modified system files",
      "suspicious process execution",
      "unauthorized registry changes",
      "abnormal user behavior",
      "failed authentication attempts",
      "unexpected outbound connections",
      "modified security settings",
      "unusual API calls",
      "suspicious script execution"
    ];

    const actions = {
      Critical: [
        "CRITICAL ALERT: Detected active",
        "URGENT: Confirmed ongoing",
        "HIGH PRIORITY: Identified active",
        "IMMEDIATE ACTION: Observed active",
        "CRITICAL: Verified ongoing"
      ],
      High: [
        "HIGH ALERT: Detected potential",
        "WARNING: Identified suspicious",
        "ALERT: Observed possible",
        "ATTENTION: Detected suspicious",
        "WARNING: Verified potential"
      ],
      Medium: [
        "DETECTED: Possible",
        "ALERT: Suspected",
        "NOTIFICATION: Potential",
        "WARNING: Possible",
        "ALERT: Identified"
      ],
      Low: [
        "INFO: Detected low-priority",
        "NOTICE: Observed potential",
        "INFO: Identified possible",
        "NOTICE: Detected minor",
        "LOW: Possible"
      ]
    };

    const statusContext = {
      Detected: "Initial detection phase",
      Investigating: "Under active investigation",
      Contained: "Successfully contained",
      Remediated: "Remediation completed",
      Blocked: "Automatically blocked"
    };

    const location = locations[Math.floor(Math.random() * locations.length)];
    const impact = impacts[Math.floor(Math.random() * impacts.length)];
    const indicator = indicators[Math.floor(Math.random() * indicators.length)];
    const action = actions[severity as keyof typeof actions][Math.floor(Math.random() * actions[severity as keyof typeof actions].length)];

    return `${action} ${techniqueName} activity on ${location}. ${statusContext[status as keyof typeof statusContext]} based on ${indicator}. Risk of ${impact}.`;
  };

  // Generate threats for techniques and subtechniques with higher probabilities
  tactics.forEach(tactic => {
    tactic.techniques.forEach(technique => {
      // 80% chance this technique has threats (increased from 60%)
      if (Math.random() < 0.8) {
        // Generate 3-8 threats (increased from 1-5)
        const threatCount = Math.floor(Math.random() * 6) + 3;

        for (let i = 0; i < threatCount; i++) {
          const severity = getRandomWeighted(severityWeights);
          const status = getRandomWeighted(statusWeights);
          threats.push({
            id: `threat-${threats.length + 1}`,
            techniqueId: technique.id,
            timestamp: getRandomDate(),
            severity: severity as ThreatSeverity,
            status: status as ThreatStatus,
            description: generateDescription(technique.name, severity, status),
          });
        }
      }

      // Process subtechniques with higher probability
      technique.subtechniques.forEach(subtechnique => {
        // 65% chance this subtechnique has threats (increased from 45%)
        if (Math.random() < 0.65) {
          // Generate 2-6 threats (increased from 1-4)
          const threatCount = Math.floor(Math.random() * 5) + 2;

          for (let i = 0; i < threatCount; i++) {
            const severity = getRandomWeighted(severityWeights);
            const status = getRandomWeighted(statusWeights);
            threats.push({
              id: `threat-${threats.length + 1}`,
              techniqueId: subtechnique.id,
              timestamp: getRandomDate(),
              severity: severity as ThreatSeverity,
              status: status as ThreatStatus,
              description: generateDescription(subtechnique.name, severity, status),
            });
          }
        }
      });
    });
  });

  return threats;
}
