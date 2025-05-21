
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
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">MITRE ATT&CK Matrix</h1>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          <FilterBar />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 xl:col-span-1">
              <ThreatDetails />
            </div>
            <div className="lg:col-span-3 xl:col-span-2">
              <MitreMatrix />
            </div>
          </div>
        </main>
      </div>
    </MitreProvider>
  );
};

export default Index;
