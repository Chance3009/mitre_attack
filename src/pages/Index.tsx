import React from 'react';
import { MitreProvider } from '../context/MitreContext';
import FilterBar from '../components/FilterBar';
import MitreMatrix from '../components/MitreMatrix';
import ThreatDetails from '../components/ThreatDetails';

const Index: React.FC = () => {
  return (
    <MitreProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <h1 className="text-lg font-semibold">MITRE ATT&CK Matrix</h1>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <FilterBar />

          <div className="flex gap-4">
            <div className="flex-1">
              <MitreMatrix />
            </div>
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-4">
                <ThreatDetails />
              </div>
            </div>
          </div>
        </main>
      </div>
    </MitreProvider>
  );
};

export default Index;
