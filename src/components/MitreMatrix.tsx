
import React from 'react';
import { useMitre } from '../context/MitreContext';
import MitreTechniqueCard from './MitreTechniqueCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MitreMatrix: React.FC = () => {
  const { tactics, filters, isLoading } = useMitre();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
      {tactics.map((tactic) => {
        // Filter out tactics if tactic filter is active
        if (filters.tactics.length > 0 && !filters.tactics.includes(tactic.id)) {
          return null;
        }

        return (
          <Card key={tactic.id} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {tactic.name}
                <span className="text-xs text-gray-500 ml-2">{tactic.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[500px]">
              {tactic.techniques.map((technique) => (
                <MitreTechniqueCard 
                  key={technique.id} 
                  technique={technique}
                  tacticId={tactic.id}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} className="h-20 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MitreMatrix;
