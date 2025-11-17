import React, { useState, useRef, useEffect } from 'react';
import { GOOGLE_FONTS } from '../constants';
import { StyleOptions } from '../types';
import { AlignLeft, AlignCenter, AlignRight, ChevronDown, Bold, Italic } from 'lucide-react';
import { CustomSelect, PositionButton } from './common';

type Position = StyleOptions['position'];
type TextAlign = StyleOptions['textAlign'];

interface FontSelectorProps {
  fontFamily: string;
  onFontChange: (fontFamily: string) => void;
  fontWeight: string;
  onFontWeightChange: (fontWeight: string) => void;
  isBold: boolean;
  onIsBoldChange: (isBold: boolean) => void;
  isItalic: boolean;
  onIsItalicChange: (isItalic: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontColor: string;
  onFontColorChange: (color: string) => void;
  position: Position;
  onPositionChange: (position: Position) => void;
  textAlign: TextAlign;
  onTextAlignChange: (align: TextAlign) => void;
  textOutlineEnabled: boolean;
  onTextOutlineEnabledChange: (enabled: boolean) => void;
  textOutlineColor: string;
  onTextOutlineColorChange: (color: string) => void;
  textOutlineWidth: number;
  onTextOutlineWidthChange: (width: number) => void;
  textBackgroundEnabled: boolean;
  onTextBackgroundEnabledChange: (enabled: boolean) => void;
  textBackgroundColor: string;
  onTextBackgroundColorChange: (color: string) => void;
  textBackgroundOpacity: number;
  onTextBackgroundOpacityChange: (opacity: number) => void;
  textBackgroundPadding: number;
  onTextBackgroundPaddingChange: (padding: number) => void;
  textBackgroundBorderRadius: number;
  onTextBackgroundBorderRadiusChange: (radius: number) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ 
    fontFamily, 
    onFontChange, 
    fontWeight, 
    onFontWeightChange,
    isBold,
    onIsBoldChange,
    isItalic,
    onIsItalicChange,
    fontSize,
    onFontSizeChange,
    fontColor,
    onFontColorChange,
    position,
    onPositionChange,
    textAlign,
    onTextAlignChange,
    textOutlineEnabled,
    onTextOutlineEnabledChange,
    textOutlineColor,
    onTextOutlineColorChange,
    textOutlineWidth,
    onTextOutlineWidthChange,
    textBackgroundEnabled,
    onTextBackgroundEnabledChange,
    textBackgroundColor,
    onTextBackgroundColorChange,
    textBackgroundOpacity,
    onTextBackgroundOpacityChange,
    textBackgroundPadding,
    onTextBackgroundPaddingChange,
    textBackgroundBorderRadius,
    onTextBackgroundBorderRadiusChange,
}) => {
  const selectedFont = GOOGLE_FONTS.find(f => f.family === fontFamily);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectFont = (font: typeof GOOGLE_FONTS[0]) => {
    onFontChange(font.family);
    if (!font.weights.includes(fontWeight)) {
        onFontWeightChange(font.weights[0] || '400');
    }
    setIsFontDropdownOpen(false);
  };


  const positions: Position[] = [
    'topLeft', 'topCenter', 'topRight',
    'centerLeft', 'center', 'centerRight',
    'bottomLeft', 'bottomCenter', 'bottomRight'
  ];

  const alignmentOptions: { align: TextAlign, icon: React.ReactNode }[] = [
      { align: 'left', icon: <AlignLeft size={20}/> },
      { align: 'center', icon: <AlignCenter size={20}/> },
      { align: 'right', icon: <AlignRight size={20}/> },
  ];

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="block text-sm font-medium text-gray-600 mb-2">Font Family</label>
                 <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 flex justify-between items-center text-left"
                        aria-haspopup="listbox"
                        aria-expanded={isFontDropdownOpen}
                    >
                        <span style={{ fontFamily: selectedFont?.family, fontSize: '16px' }}>{selectedFont?.name || 'Select Font'}</span>
                        <ChevronDown size={20} className={`text-gray-500 transition-transform ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isFontDropdownOpen && (
                        <ul 
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[27.5rem] overflow-y-auto custom-scrollbar"
                            role="listbox"
                        >
                            {GOOGLE_FONTS.map(font => (
                                <li
                                    key={font.name}
                                    onClick={() => handleSelectFont(font)}
                                    className="px-4 py-2 hover:bg-violet-50 cursor-pointer text-gray-800"
                                    style={{ fontFamily: font.family, fontSize: '18px' }}
                                    role="option"
                                    aria-selected={font.family === fontFamily}
                                >
                                    {font.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Font Weight & Style</label>
                <div className="flex items-center gap-1">
                    <CustomSelect
                        value={fontWeight}
                        onChange={(e) => onFontWeightChange(e.target.value)}
                        disabled={!selectedFont || selectedFont.weights.length <= 1 || isBold}
                        className="flex-grow"
                    >
                        {selectedFont?.weights.map(weight => (
                            <option key={weight} value={weight}>{weight}</option>
                        ))}
                    </CustomSelect>
                    <button
                        type="button"
                        onClick={() => onIsBoldChange(!isBold)}
                        className={`p-2.5 rounded-md transition-colors ${isBold ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        aria-pressed={isBold}
                        aria-label="Toggle bold"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onIsItalicChange(!isItalic)}
                        className={`p-2.5 rounded-md transition-colors ${isItalic ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        aria-pressed={isItalic}
                        aria-label="Toggle italic"
                    >
                        <Italic size={18} />
                    </button>
                </div>
            </div>
        </div>

        <div>
            <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span>Font Size</span>
                <span className="font-semibold text-gray-800">{fontSize}px</span>
            </label>
            <input
                type="range"
                min="24"
                max="128"
                step="1"
                value={fontSize}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Font Color</label>
                <div className="relative flex items-center">
                    <div 
                        className="w-8 h-8 rounded-md border border-gray-300 absolute left-2 pointer-events-none"
                        style={{ backgroundColor: fontColor }}
                    ></div>
                    <input
                        type="color"
                        value={fontColor}
                        onChange={e => onFontColorChange(e.target.value)}
                        className="absolute left-2 w-8 h-8 opacity-0 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={fontColor.toUpperCase()}
                        onChange={e => onFontColorChange(e.target.value)}
                        className="w-full p-3 pl-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <div className="text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Position</label>
                    <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg w-24 mx-auto">
                        {positions.map(p => (
                            <PositionButton 
                                key={p} 
                                onClick={() => onPositionChange(p)}
                                isActive={position === p} 
                            />
                        ))}
                    </div>
                 </div>
                 <div className="text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Alignment</label>
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg w-24 mx-auto">
                        {alignmentOptions.map(({align, icon}) => (
                            <button
                                key={align}
                                type="button"
                                onClick={() => onTextAlignChange(align)}
                                className={`flex-1 p-1 rounded-md transition-colors ${textAlign === align ? 'bg-violet-600 text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                                aria-label={`Align ${align}`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                 </div>
            </div>
        </div>

         <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
                <label htmlFor="outline-enabled" className="text-sm font-medium text-gray-700">
                    Text Outline
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        id="outline-enabled"
                        checked={textOutlineEnabled}
                        onChange={(e) => onTextOutlineEnabledChange(e.target.checked)}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
            </div>

            <fieldset disabled={!textOutlineEnabled} className="space-y-4 transition-opacity duration-300" style={{ opacity: textOutlineEnabled ? 1 : 0.5 }}>
                 <div>
                    <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                        <span>Outline Width</span>
                        <span className="font-semibold text-gray-800">{textOutlineWidth}px</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={textOutlineWidth}
                        onChange={(e) => onTextOutlineWidthChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Outline Color</label>
                    <div className="relative flex items-center">
                        <div 
                            className="w-8 h-8 rounded-md border border-gray-300 absolute left-2 pointer-events-none"
                            style={{ backgroundColor: textOutlineColor }}
                        ></div>
                        <input
                            type="color"
                            value={textOutlineColor}
                            onChange={e => onTextOutlineColorChange(e.target.value)}
                            className="absolute left-2 w-8 h-8 opacity-0 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={textOutlineColor.toUpperCase()}
                            onChange={e => onTextOutlineColorChange(e.target.value)}
                            className="w-full p-3 pl-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>
                </div>
            </fieldset>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
                <label htmlFor="background-enabled" className="text-sm font-medium text-gray-700">
                    Text Background
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        id="background-enabled"
                        checked={textBackgroundEnabled}
                        onChange={(e) => onTextBackgroundEnabledChange(e.target.checked)}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
            </div>
             <fieldset disabled={!textBackgroundEnabled} className="space-y-4 transition-opacity duration-300" style={{ opacity: textBackgroundEnabled ? 1 : 0.5 }}>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Padding</span>
                            <span className="font-semibold text-gray-800">{textBackgroundPadding}px</span>
                        </label>
                        <input type="range" min="0" max="100" step="1" value={textBackgroundPadding} onChange={(e) => onTextBackgroundPaddingChange(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"/>
                    </div>
                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Opacity</span>
                             <span className="font-semibold text-gray-800">{Math.round(textBackgroundOpacity * 100)}%</span>
                        </label>
                        <input type="range" min="0" max="1" step="0.05" value={textBackgroundOpacity} onChange={(e) => onTextBackgroundOpacityChange(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                            <span>Corner Radius</span>
                            <span className="font-semibold text-gray-800">{textBackgroundBorderRadius}px</span>
                        </label>
                        <input type="range" min="0" max="100" step="1" value={textBackgroundBorderRadius} onChange={(e) => onTextBackgroundBorderRadiusChange(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">BG Color</label>
                        <div className="relative flex items-center">
                            <div className="w-8 h-8 rounded-md border border-gray-300 absolute left-2 pointer-events-none" style={{ backgroundColor: textBackgroundColor }}></div>
                            <input type="color" value={textBackgroundColor} onChange={e => onTextBackgroundColorChange(e.target.value)} className="absolute left-2 w-8 h-8 opacity-0 cursor-pointer" />
                            <input type="text" value={textBackgroundColor.toUpperCase()} onChange={e => onTextBackgroundColorChange(e.target.value)} className="w-full p-3 pl-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"/>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
  );
};