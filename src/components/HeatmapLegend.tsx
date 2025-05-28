import React from 'react';

// Helper function to generate the same heatmap color as used in MitreTechniqueCard
const getHeatmapColor = (threatCount: number) => {
    const maxThreats = 10;
    const intensity = Math.min(threatCount / maxThreats, 1);

    if (threatCount === 0) {
        return '#f8fafc';
    }

    const colorStops = [
        { r: 237, g: 248, b: 255 }, // Very light blue (#edf8ff)
        { r: 179, g: 215, b: 255 }, // Light blue (#b3d7ff)
        { r: 110, g: 168, b: 255 }, // Medium blue (#6ea8ff)
        { r: 41, g: 121, b: 255 },  // Bright blue (#2979ff)
        { r: 0, g: 84, b: 255 }     // Deep blue (#0054ff)
    ];

    const segments = colorStops.length - 1;
    const segment = Math.min(Math.floor(intensity * segments), segments - 1);
    const segmentIntensity = (intensity * segments) - segment;

    const c1 = colorStops[segment];
    const c2 = colorStops[segment + 1];

    const r = Math.round(c1.r + (c2.r - c1.r) * segmentIntensity);
    const g = Math.round(c1.g + (c2.g - c1.g) * segmentIntensity);
    const b = Math.round(c1.b + (c2.b - c1.b) * segmentIntensity);

    return `rgb(${r}, ${g}, ${b})`;
};

const HeatmapLegend: React.FC = () => {
    const ranges = [
        { min: 0, max: 0, label: 'None' },
        { min: 1, max: 2, label: 'Low' },
        { min: 3, max: 5, label: 'Medium' },
        { min: 6, max: 8, label: 'High' },
        { min: 9, max: 10, label: 'Very High' },
    ];

    return (
        <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="font-medium text-slate-700">Threat Activity:</span>
            <div className="flex items-center gap-4">
                {ranges.map(({ min, max, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded border border-slate-200 shadow-sm"
                            style={{
                                backgroundColor: min === 0 ? '#f8fafc' : getHeatmapColor(min + (max - min) / 2)
                            }}
                        />
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{label}</span>
                            <span className="text-slate-500">{min === max ? min : `${min}-${max}`}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeatmapLegend; 