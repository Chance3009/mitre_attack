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

const FilterBar: React.FC = () => {
  const {
    filters,
    setTimeRange,
    setSeverities,
    setStatuses,
    setTacticFilters, // Updated from setTactics to setTacticFilters
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
      setTacticFilters(filters.tactics.filter(id => id !== tacticId)); // Updated from setTactics to setTacticFilters
    } else {
      setTacticFilters([...filters.tactics, tacticId]); // Updated from setTactics to setTacticFilters
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
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold mb-2">MITRE ATT&CK Matrix</h2>
          <p className="text-gray-500 text-sm">
            Filter and view threat mappings across the MITRE ATT&CK framework
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <FilterX className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="time-range">
            Time Range
          </label>
          <Select
            value={filters.timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Severity
          </label>
          <div className="flex flex-wrap gap-2">
            {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
              <div key={severity} className="flex items-center">
                <Checkbox
                  id={`severity-${severity}`}
                  checked={filters.severities.includes(severity as ThreatSeverity)}
                  onCheckedChange={() => handleSeverityChange(severity as ThreatSeverity)}
                  className="mr-1"
                />
                <Label
                  htmlFor={`severity-${severity}`}
                  className="flex items-center text-sm cursor-pointer"
                >
                  <span 
                    className={`inline-block w-2 h-2 rounded-full ${severityColors[severity as ThreatSeverity]} mr-1`}
                  ></span>
                  {severity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {['Detected', 'Investigating', 'Contained', 'Remediated', 'Blocked'].map((status) => (
              <div key={status} className="flex items-center">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.statuses.includes(status as ThreatStatus)}
                  onCheckedChange={() => handleStatusChange(status as ThreatStatus)}
                  className="mr-1"
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="flex items-center text-sm cursor-pointer"
                >
                  <span 
                    className={`inline-block w-2 h-2 rounded-full ${statusColors[status as ThreatStatus]} mr-1`}
                  ></span>
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* View Options */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            View Options
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mapped-toggle" className="cursor-pointer">
                Show mapped threats only
              </Label>
              <Switch
                id="mapped-toggle"
                checked={filters.showMappedOnly}
                onCheckedChange={setShowMappedOnly}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="flat-toggle" className="cursor-pointer">
                Flat view
              </Label>
              <Switch
                id="flat-toggle"
                checked={filters.flatView}
                onCheckedChange={setFlatView}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tactics Filter */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">
          Tactics
        </label>
        <div className="flex flex-wrap gap-2">
          {tactics.map((tactic) => (
            <Badge
              key={tactic.id}
              variant={filters.tactics.includes(tactic.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTacticChange(tactic.id)}
            >
              {tactic.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
