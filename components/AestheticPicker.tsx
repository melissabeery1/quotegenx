import React from 'react';
import { Check } from 'lucide-react';

interface Aesthetic {
    name: string;
    thumbnailStyle: React.CSSProperties;
    promptFragment: string;
}

interface AestheticPickerProps {
    aesthetics: Aesthetic[];
    selectedAesthetic: string;
    onSelect: (name: string) => void;
}

export const AestheticPicker: React.FC<AestheticPickerProps> = ({ aesthetics, selectedAesthetic, onSelect }) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {aesthetics.map(aesthetic => (
                <button
                    key={aesthetic.name}
                    onClick={() => onSelect(aesthetic.name)}
                    className="text-center group transition-all duration-200 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <div 
                        className={`aspect-square w-full rounded-md mb-2 relative overflow-hidden transform transition-transform duration-200 group-hover:scale-105 border-2 ${selectedAesthetic === aesthetic.name ? 'border-purple-500' : 'border-transparent'}`}
                        style={aesthetic.thumbnailStyle}
                    >
                         {selectedAesthetic === aesthetic.name && (
                            <div className="absolute inset-0 bg-purple-500/50 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        )}
                    </div>
                    <span className={`text-xs font-medium transition-colors ${selectedAesthetic === aesthetic.name ? 'text-purple-700 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{aesthetic.name}</span>
                </button>
            ))}
        </div>
    );
};