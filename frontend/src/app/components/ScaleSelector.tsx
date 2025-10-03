import { useState } from 'react';

export type ScaleType = 'fibonacci' | 'powers-of-2' | 't-shirt' | 'custom';

export const PRESET_SCALES = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'],
  'powers-of-2': ['0', '1', '2', '4', '8', '16', '32', '64', '?', '☕'],
  't-shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
};

interface ScaleSelectorProps {
  currentScale: ScaleType;
  customValues: string[];
  onScaleChange: (scale: ScaleType) => void;
  onCustomValuesChange: (values: string[]) => void;
}

export function ScaleSelector({ 
  currentScale, 
  customValues, 
  onScaleChange, 
  onCustomValuesChange 
}: ScaleSelectorProps) {
  const [newValue, setNewValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddCustomValue = () => {
    if (newValue.trim() && !customValues.includes(newValue.trim())) {
      onCustomValuesChange([...customValues, newValue.trim()]);
      setNewValue('');
    }
  };

  const handleRemoveCustomValue = (value: string) => {
    onCustomValuesChange(customValues.filter(v => v !== value));
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Card Scale</h3>
          <p className="text-sm text-neutral-400 capitalize">
            {currentScale === 'powers-of-2' ? 'Powers of 2' : currentScale.replace('-', ' ')}
          </p>
        </div>
        <svg 
          className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {/* Preset Scales */}
          <div className="space-y-2">
            {(['fibonacci', 'powers-of-2', 't-shirt'] as ScaleType[]).map((scale) => (
              <button
                key={scale}
                onClick={() => onScaleChange(scale)}
                className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  currentScale === scale
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <div className="font-semibold capitalize">
                  {scale === 'powers-of-2' ? 'Powers of 2' : scale.replace('-', ' ')}
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {PRESET_SCALES[scale as keyof typeof PRESET_SCALES].join(', ')}
                </div>
              </button>
            ))}
            
            <button
              onClick={() => onScaleChange('custom')}
              className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                currentScale === 'custom'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <div className="font-semibold">Custom Scale</div>
              <div className="text-xs mt-1 opacity-75">
                Create your own values
              </div>
            </button>
          </div>

          {/* Custom Scale Editor */}
          {currentScale === 'custom' && (
            <div className="mt-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
              <h4 className="text-sm font-semibold text-white mb-3">Custom Values</h4>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomValue()}
                  placeholder="Add value..."
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleAddCustomValue}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {customValues.length === 0 ? (
                  <p className="text-sm text-neutral-500 italic">No custom values yet</p>
                ) : (
                  customValues.map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-2 px-3 py-1 bg-neutral-900 rounded-lg border border-neutral-600"
                    >
                      <span className="text-white">{value}</span>
                      <button
                        onClick={() => handleRemoveCustomValue(value)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
