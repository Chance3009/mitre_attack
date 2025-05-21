
import React from 'react';
import { useMitre } from '../context/MitreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ThreatDetails: React.FC = () => {
  const { selectedThreat, tactics } = useMitre();
  
  if (!selectedThreat) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Threat Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-6">
            Select a technique or subtechnique with threats to view details
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Find technique or subtechnique info
  let techniqueInfo: any = null;
  let subtechniqueInfo: any = null;
  let tacticInfo: any = null;

  // Search through all tactics and techniques to find the matching one
  for (const tactic of tactics) {
    for (const technique of tactic.techniques) {
      if (technique.id === selectedThreat.techniqueId) {
        techniqueInfo = technique;
        tacticInfo = tactic;
        break;
      }
      
      for (const subtechnique of technique.subtechniques) {
        if (subtechnique.id === selectedThreat.techniqueId) {
          subtechniqueInfo = subtechnique;
          techniqueInfo = technique;
          tacticInfo = tactic;
          break;
        }
      }
      
      if (techniqueInfo) break;
    }
    if (tacticInfo) break;
  }
  
  const severityColors: Record<string, string> = {
    Critical: 'bg-red-600',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
  };
  
  const statusColors: Record<string, string> = {
    Detected: 'bg-red-500',
    Investigating: 'bg-orange-500',
    Contained: 'bg-yellow-500',
    Remediated: 'bg-green-500',
    Blocked: 'bg-blue-500',
  };
  
  // Format date for better readability
  const formattedDate = new Date(selectedThreat.timestamp).toLocaleString();
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Threat Details</span>
          <Badge className={severityColors[selectedThreat.severity]}>
            {selectedThreat.severity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-500">Threat ID</h3>
          <p>{selectedThreat.id}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-500">Description</h3>
          <p className="text-lg">{selectedThreat.description}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-500">Status</h3>
          <Badge className={statusColors[selectedThreat.status]}>
            {selectedThreat.status}
          </Badge>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-500">Timestamp</h3>
          <p>{formattedDate}</p>
        </div>
        
        <Separator className="my-4" />
        
        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-500">Associated Technique</h3>
          <div className="mt-2">
            <Badge variant="outline" className="mr-2">
              {tacticInfo?.name}
            </Badge>
            <span className="font-medium">
              {subtechniqueInfo ? techniqueInfo?.name + ' > ' + subtechniqueInfo?.name : techniqueInfo?.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {subtechniqueInfo ? subtechniqueInfo.id : techniqueInfo?.id}
            </span>
          </div>
        </div>
        
        <div className="mb-2">
          <h3 className="font-medium text-sm text-gray-500">Description</h3>
          <p className="text-sm mt-1">
            {subtechniqueInfo ? subtechniqueInfo.description : techniqueInfo?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatDetails;
