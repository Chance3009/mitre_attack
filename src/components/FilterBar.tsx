import React from 'react';
import { useMitre } from '../context/MitreContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreatSeverity, ThreatStatus } from '../types/mitre';
import { FilterX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";

const FilterBar: React.FC = () => {
  const {
    filters,
    setTimeRange,
    setSeverities,
    setStatuses,
    setTacticFilters,
    setShowMappedOnly,
    setFlatView,
    resetFilters,
    tactics,
  } = useMitre();

  const handleSeverityChange = (severity: ThreatSeverity) => {
    if (filters.severities.includes(severity)) {
      setSeverities(filters.severities.filter(s => s !== severity));
    } else {
      setSeverities([...filters.severities, severity]);
    }
  };

  const handleStatusChange = (status: ThreatStatus) => {
    if (filters.statuses.includes(status)) {
      setStatuses(filters.statuses.filter(s => s !== status));
    } else {
      setStatuses([...filters.statuses, status]);
    }
  };

  const handleTacticChange = (tacticId: string) => {
    if (filters.tactics.includes(tacticId)) {
      setTacticFilters(filters.tactics.filter(id => id !== tacticId));
    } else {
      setTacticFilters([...filters.tactics, tacticId]);
    }
  };

  const severityColors: Record<ThreatSeverity, string> = {
    Critical: 'bg-red-600',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
  };

  const statusColors: Record<ThreatStatus, string> = {
    Detected: 'bg-red-500',
    Investigating: 'bg-orange-500',
    Contained: 'bg-yellow-500',
    Remediated: 'bg-green-500',
    Blocked: 'bg-blue-500',
  };

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className="p-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Time:</Label>
              <Select value={filters.timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-7 text-xs w-[120px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-4" />

            <div className="flex items-center gap-2">
              <Label className="text-xs">Severity:</Label>
              {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
                <Badge
                  key={severity}
                  variant="outline"
                  className={`cursor-pointer flex items-center gap-1 h-5 text-[10px] ${filters.severities.includes(severity as ThreatSeverity)
                      ? 'bg-slate-100'
                      : 'opacity-50'
                    }`}
                  onClick={() => handleSeverityChange(severity as ThreatSeverity)}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${severityColors[severity as ThreatSeverity]}`} />
                  {severity}
                </Badge>
              ))}
            </div>

            <Separator orientation="vertical" className="h-4" />

            <div className="flex items-center gap-2">
              <Label className="text-xs">Status:</Label>
              {['Detected', 'Investigating', 'Contained', 'Remediated', 'Blocked'].map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={`cursor-pointer flex items-center gap-1 h-5 text-[10px] ${filters.statuses.includes(status as ThreatStatus)
                      ? 'bg-slate-100'
                      : 'opacity-50'
                    }`}
                  onClick={() => handleStatusChange(status as ThreatStatus)}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColors[status as ThreatStatus]}`} />
                  {status}
                </Badge>
              ))}
            </div>

            <Separator orientation="vertical" className="h-4" />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Switch
                  id="mapped-only"
                  checked={filters.showMappedOnly}
                  onCheckedChange={setShowMappedOnly}
                  className="h-4 w-7"
                />
                <Label htmlFor="mapped-only" className="text-xs">Mapped</Label>
              </div>
              <div className="flex items-center gap-1">
                <Switch
                  id="flat-view"
                  checked={filters.flatView}
                  onCheckedChange={setFlatView}
                  className="h-4 w-7"
                />
                <Label htmlFor="flat-view" className="text-xs">Flat</Label>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs ml-auto"
            >
              <FilterX className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50/50">
        <CardContent className="py-1.5 px-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">Categories:</Label>
            <div className="flex-1 flex flex-wrap gap-1">
              {tactics.map((tactic) => (
                <Badge
                  key={tactic.id}
                  variant="outline"
                  className={`cursor-pointer whitespace-nowrap text-[10px] h-5 ${filters.tactics.includes(tactic.id)
                      ? 'bg-slate-100'
                      : 'opacity-50'
                    }`}
                  onClick={() => handleTacticChange(tactic.id)}
                >
                  {tactic.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterBar;
