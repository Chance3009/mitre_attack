import React from 'react';
import { useMitre } from '../context/MitreContext';
import MitreTechniqueCard from './MitreTechniqueCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import HeatmapLegend from './HeatmapLegend';

const MitreMatrix: React.FC = () => {
  const { tactics, filters, isLoading } = useMitre();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <HeatmapLegend />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {tactics.map((tactic) => {
          // Filter out tactics if tactic filter is active
          if (filters.tactics.length > 0 && !filters.tactics.includes(tactic.id)) {
            return null;
          }

          return (
            <Card key={tactic.id} className="h-full">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm flex items-center">
                  {tactic.name}
                  <span className="text-xs text-gray-500 ml-2">{tactic.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[400px] p-2">
                <div className="space-y-2">
                  {tactic.techniques.map((technique) => (
                    <MitreTechniqueCard
                      key={technique.id}
                      technique={technique}
                      tacticId={tactic.id}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i} className="h-full">
          <CardHeader className="py-2 px-3">
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="p-2">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-16 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MitreMatrix;
