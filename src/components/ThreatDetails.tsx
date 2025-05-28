import React from 'react';
import { useMitre } from '../context/MitreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const ThreatDetails: React.FC = () => {
  const { selectedThreat, setSelectedThreat, filteredThreats, tactics } = useMitre();

  // Find technique or subtechnique info
  let techniqueInfo: any = null;
  let subtechniqueInfo: any = null;
  let tacticInfo: any = null;

  // Get all threats for the current technique/subtechnique
  const relatedThreats = selectedThreat
    ? filteredThreats.filter(threat => threat.techniqueId === selectedThreat.techniqueId)
    : [];

  // Search through all tactics and techniques to find the matching one
  if (selectedThreat) {
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
  }

  // Updated color scheme with better contrast and visual hierarchy
  const severityColors: Record<string, { bg: string; text: string }> = {
    Critical: { bg: 'bg-red-100', text: 'text-red-800' },
    High: { bg: 'bg-orange-100', text: 'text-orange-800' },
    Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    Low: { bg: 'bg-blue-100', text: 'text-blue-800' },
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    Detected: { bg: 'bg-rose-100', text: 'text-rose-800' },
    Investigating: { bg: 'bg-amber-100', text: 'text-amber-800' },
    Contained: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    Remediated: { bg: 'bg-green-100', text: 'text-green-800' },
    Blocked: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  };

  if (!selectedThreat) {
    return (
      <Card className="mb-4 border-slate-200">
        <CardHeader className="py-2 bg-slate-50">
          <CardTitle className="text-sm text-slate-700">Threat Details</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <p className="text-gray-500 text-xs text-center">
            Select a technique to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Technique Info */}
      <Card className="border-slate-200">
        <CardHeader className="py-1.5 px-3 bg-slate-50">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
            <Badge variant="outline" className="text-xs bg-white truncate max-w-[120px]">
              {tacticInfo?.name}
            </Badge>
            <span className="text-xs truncate">
              {subtechniqueInfo ? techniqueInfo?.name + ' > ' + subtechniqueInfo?.name : techniqueInfo?.name}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Events Panel */}
      <Card className="overflow-hidden border-slate-200">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-100px)]">
          {/* Events List */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
            <div className="h-full flex flex-col">
              <CardHeader className="py-1 px-2 bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-xs text-slate-700">
                  Events ({relatedThreats.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {relatedThreats.map((threat) => (
                    <div
                      key={threat.id}
                      className={`px-2 py-1.5 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 transition-colors
                        ${threat.id === selectedThreat.id ? 'bg-slate-50 shadow-sm' : ''}`}
                      onClick={() => setSelectedThreat(threat)}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <Badge
                          className={`${severityColors[threat.severity].bg} ${severityColors[threat.severity].text} border-0 text-[10px] px-1 py-0 h-auto`}
                        >
                          {threat.severity}
                        </Badge>
                        <Badge
                          className={`${statusColors[threat.status].bg} ${statusColors[threat.status].text} border-0 text-[10px] px-1 py-0 h-auto truncate max-w-[80px]`}
                        >
                          {threat.status}
                        </Badge>
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {new Date(threat.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-1">
                        {threat.description}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-slate-200 hover:bg-slate-300" />

          {/* Event Details */}
          <ResizablePanel defaultSize={60} minSize={50}>
            <div className="h-full flex flex-col">
              <CardHeader className="py-1 px-2 bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-xs text-slate-700">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="p-2 text-sm space-y-2 flex-1 overflow-auto">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge
                        className={`${severityColors[selectedThreat.severity].bg} ${severityColors[selectedThreat.severity].text} border-0 text-[10px] px-1 py-0 h-auto`}
                      >
                        {selectedThreat.severity}
                      </Badge>
                      <Badge
                        className={`${statusColors[selectedThreat.status].bg} ${statusColors[selectedThreat.status].text} border-0 text-[10px] px-1 py-0 h-auto`}
                      >
                        {selectedThreat.status}
                      </Badge>
                      <span className="text-[10px] text-slate-500 ml-auto">
                        {new Date(selectedThreat.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">ID: </span>
                      <span className="text-slate-700 text-[10px] font-medium">{selectedThreat.id}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-md">
                    <div className="text-slate-500 mb-1 text-[10px] font-medium">Description</div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-normal break-words">
                      {selectedThreat.description}
                    </p>
                  </div>

                  {selectedThreat.details && (
                    <div className="bg-slate-50 p-2 rounded-md">
                      <div className="text-slate-500 mb-1 text-[10px] font-medium">Additional Details</div>
                      <pre className="text-[10px] text-slate-700 whitespace-pre-wrap break-words">
                        {JSON.stringify(selectedThreat.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </div>
  );
};

export default ThreatDetails;
