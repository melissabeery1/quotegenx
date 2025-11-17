import React, { useRef } from 'react';
import { AppState, WatermarkOptions, QuoteOptions } from '../types';
import { FontSelector } from './FontSelector';
import { MOODS, PHILOSOPHERS, MODERN_THINKERS, LUMINARIES, REBELS, MYSTICS_AND_MANIFESTORS, STRATEGIC_MINDS, AUTHORS_AND_STORYTELLERS, COLOR_SCHEMES, VISUAL_THEMES, INITIAL_STATE, ASPECT_RATIOS } from '../constants';
import { Sparkles, Image as ImageIcon, Wand2, Upload, FileCheck, X, RefreshCw, Shield, Info, BookOpen } from 'lucide-react';
import { ActionButton, Checkbox, CustomSelect, CustomTextarea, RadioButton, Section } from './common';

interface QuoteCustomizerProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
  onFieldChange: (section: 'quote' | 'image' | 'style' | 'watermark', field: string, value: any) => void;
  onGenerateQuote: () => void;
  onGenerateImage: () => void;
  onReset: () => void;
  onShowPantheon: () => void;
}

const PositionButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
}> = ({ onClick, isActive }) => (
  <button
    type="button"
    onClick={onClick}
    className={`aspect-square w-full rounded-md flex items-center justify-center transition-colors ${isActive ? 'bg-violet-600' : 'bg-gray-200 hover:bg-gray-300'}`}
  >
    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`}></div>
  </button>
);

const AspectRatioButton: React.FC<{
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, value, isActive, onClick }) => {
  const [w, h] = value.split(':').map(Number);

  const containerSize = 24;
  let boxWidth, boxHeight;

  if (w > h) {
    boxWidth = containerSize;
    boxHeight = (containerSize * h) / w;
  } else {
    boxHeight = containerSize;
    boxWidth = (containerSize * w) / h;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg transition-all w-full h-24 ${isActive ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      aria-pressed={isActive}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        <div style={{ width: `${boxWidth}px`, height: `${boxHeight}px` }} className={`transition-all duration-200 ${isActive ? 'bg-violet-600' : 'bg-gray-500'}`}></div>
      </div>
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-[10px] text-gray-500">{value}</span>
    </button>
  );
};


export const QuoteCustomizer: React.FC<QuoteCustomizerProps> = ({ state, dispatch, onFieldChange, onGenerateQuote, onGenerateImage, onReset, onShowPantheon }) => {
  const { quote, image, style, watermark } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const defaultOwnQuote = INITIAL_STATE.quote.ownQuote;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        dispatch({ type: 'SET_UPLOADED_IMAGE', payload: e.target.files[0] });
    }
  };
  
  const handleRemoveUploadedImage = () => {
    dispatch({ type: 'SET_UPLOADED_IMAGE', payload: null });
    // This is crucial to allow re-uploading the same file.
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWatermarkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        onFieldChange('watermark', 'image', e.target.files[0]);
    }
  };

  const handleRemoveWatermarkImage = () => {
    onFieldChange('watermark', 'image', null);
    // This is crucial to allow re-uploading the same file.
    if (watermarkInputRef.current) {
      watermarkInputRef.current.value = '';
    }
  };

  const handleInspirationChange = (type: keyof Omit<QuoteOptions, 'useCustom' | 'customThinker'>, checked: boolean) => {
    const currentSources = [quote.usePhilosopher, quote.useModernThinker, quote.useLuminary, quote.useRebel, quote.useMystic, quote.useStrategicMind, quote.useAuthor];
    const numChecked = currentSources.filter(Boolean).length;

    if (numChecked === 1 && !checked) {
        return; // Prevent unchecking the last source
    }
    
    onFieldChange('quote', type, checked);
  };

  const positions: WatermarkOptions['position'][] = [
    'topLeft', 'topCenter', 'topRight',
    'centerLeft', 'center', 'centerRight',
    'bottomLeft', 'bottomCenter', 'bottomRight'
  ];

  const numSourcesSelected = [quote.usePhilosopher, quote.useModernThinker, quote.useLuminary, quote.useRebel, quote.useMystic, quote.useStrategicMind, quote.useAuthor].filter(Boolean).length;
  const isGenerateImageDisabled = !!image.uploadedImage && image.colorScheme === 'None' && image.backdrop === 'None' && !image.prompt.trim();

  return (
    <div className="space-y-6">
      <div id="craft-quote-section">
        <Section icon={<Sparkles size={24} />} title="Craft Your Quote">
          <div className="flex space-x-6">
               <RadioButton 
                  id="generate-quote"
                  name="quoteSource"
                  value="generate"
                  checked={quote.source === 'generate'}
                  onChange={(e) => onFieldChange('quote', 'source', e.target.value)}
                  label="Generate Quote"
              />
               <RadioButton 
                  id="own-quote"
                  name="quoteSource"
                  value="own"
                  checked={quote.source === 'own'}
                  onChange={(e) => onFieldChange('quote', 'source', e.target.value)}
                  label="Use My Own"
              />
          </div>
          {quote.source === 'generate' ? (
              <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="quote-vibe-select" className="block text-sm font-medium text-gray-600">Quote Vibe</label>
                        <div className="relative group flex items-center">
                            <Info size={16} className="text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                                Select a vibe to guide the AI in generating a quote with the right tone and emotional resonance.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                            </div>
                        </div>
                    </div>
                    <CustomSelect id="quote-vibe-select" value={quote.mood} onChange={e => onFieldChange('quote', 'mood', e.target.value)}>
                        {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </CustomSelect>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-600">Inspiration Source</label>
                          <div className="relative group flex items-center">
                              <Info size={16} className="text-gray-400 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-sm bg-gray-800 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                                  Select one source for a real quote, or multiple to merge their ideas into a unique, new quote.
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                              </div>
                          </div>
                        </div>
                        <button
                          id="pantheon-button"
                          onClick={onShowPantheon}
                          type="button"
                          className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 hover:underline"
                        >
                          <BookOpen size={16} />
                          <span>Pantheon</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-gray-100 rounded-lg">
                       <Checkbox 
                          id="philosopher-source"
                          label="Philosophers"
                          checked={quote.usePhilosopher}
                          onChange={(e) => handleInspirationChange('usePhilosopher', e.target.checked)}
                      />
                       <Checkbox 
                          id="modern-source"
                          label="Modern Thinkers"
                          checked={quote.useModernThinker}
                          onChange={(e) => handleInspirationChange('useModernThinker', e.target.checked)}
                      />
                      <Checkbox 
                          id="mystic-source"
                          label="Mystics & Manifestors"
                          checked={quote.useMystic}
                          onChange={(e) => handleInspirationChange('useMystic', e.target.checked)}
                      />
                       <Checkbox 
                          id="strategic-source"
                          label="Strategic Minds"
                          checked={quote.useStrategicMind}
                          onChange={(e) => handleInspirationChange('useStrategicMind', e.target.checked)}
                      />
                      <Checkbox 
                          id="rebel-source"
                          label="Rebels"
                          checked={quote.useRebel}
                          onChange={(e) => handleInspirationChange('useRebel', e.target.checked)}
                      />
                       <Checkbox 
                          id="luminary-source"
                          label="Luminaries"
                          checked={quote.useLuminary}
                          onChange={(e) => handleInspirationChange('useLuminary', e.target.checked)}
                      />
                      <Checkbox 
                          id="author-source"
                          label="Authors & Storytellers"
                          checked={quote.useAuthor}
                          onChange={(e) => handleInspirationChange('useAuthor', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  {numSourcesSelected === 1 && (
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          You've selected a single source. The AI will find a real, attributable quote.
                      </p>
                  )}
                  {numSourcesSelected > 1 && (
                      <p className="text-sm text-gray-600 bg-violet-50 p-3 rounded-lg border border-violet-200">
                          You've selected multiple sources. A unique, brand-new quote will be generated by merging their ideas.
                      </p>
                  )}

                  {quote.usePhilosopher && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Philosopher</label>
                        <CustomSelect value={quote.philosopher} onChange={e => onFieldChange('quote', 'philosopher', e.target.value)}>
                            {PHILOSOPHERS.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}
                  
                  {quote.useModernThinker && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Modern Thinker</label>
                        <CustomSelect 
                            value={quote.modernThinker} 
                            onChange={e => onFieldChange('quote', 'modernThinker', e.target.value)}
                        >
                            {MODERN_THINKERS.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}

                  {quote.useMystic && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Mystics & Manifestors</label>
                        <CustomSelect value={quote.mystic} onChange={e => onFieldChange('quote', 'mystic', e.target.value)}>
                            {MYSTICS_AND_MANIFESTORS.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}
                  
                  {quote.useStrategicMind && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Strategic Mind</label>
                        <CustomSelect value={quote.strategicMind} onChange={e => onFieldChange('quote', 'strategicMind', e.target.value)}>
                            {STRATEGIC_MINDS.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}

                  {quote.useRebel && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Rebel</label>
                        <CustomSelect value={quote.rebel} onChange={e => onFieldChange('quote', 'rebel', e.target.value)}>
                            {REBELS.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}

                  {quote.useLuminary && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Luminary</label>
                        <CustomSelect value={quote.luminary} onChange={e => onFieldChange('quote', 'luminary', e.target.value)}>
                            {LUMINARIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}
                  
                  {quote.useAuthor && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Authors & Storytellers</label>
                        <CustomSelect value={quote.author} onChange={e => onFieldChange('quote', 'author', e.target.value)}>
                            {AUTHORS_AND_STORYTELLERS.map(p => <option key={p} value={p}>{p}</option>)}
                        </CustomSelect>
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <ActionButton 
                      onClick={onGenerateQuote} 
                      isLoading={state.loading.quote} 
                      className="bg-[linear-gradient(90deg,#8A2BE2,#FF8C00)] hover:brightness-105"
                     >
                      Generate Quote
                     </ActionButton>
                    <button
                        onClick={onReset}
                        type="button"
                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-bold text-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-400 transition-all duration-200"
                    >
                        Reset
                    </button>
                  </div>
              </div>
          ) : (
            <div>
              <div className="relative">
                  <CustomTextarea 
                      placeholder="Type your own quote here..." 
                      value={quote.ownQuote} 
                      onChange={(e) => onFieldChange('quote', 'ownQuote', e.target.value)}
                      onFocus={() => {
                          if (quote.ownQuote === defaultOwnQuote) {
                              onFieldChange('quote', 'ownQuote', '');
                          }
                      }}
                      onBlur={() => {
                          if (quote.ownQuote.trim() === '') {
                              onFieldChange('quote', 'ownQuote', defaultOwnQuote);
                          }
                      }}
                      rows={4}
                  />
                  {quote.generatedQuote && (
                      <button
                          onClick={onGenerateQuote}
                          disabled={state.loading.quote}
                          className="absolute top-3 right-3 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 hover:text-gray-800 transition-colors z-10"
                          aria-label="Generate new quote"
                      >
                          {state.loading.quote ? (
                              <div className="w-5 h-5 border-2 border-gray-400/50 border-t-gray-600 rounded-full animate-spin"></div>
                          ) : (
                              <RefreshCw size={18} />
                          )}
                      </button>
                  )}
              </div>
              {quote.inspirationSources && quote.inspirationSources.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600 bg-gray-100 p-2.5 rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-800">Inspired by:</span> {quote.inspirationSources.join(', ')}
                  </div>
              )}
            </div>
          )}
        </Section>
      </div>
      
      <div id="design-image-section">
        <Section icon={<ImageIcon size={24} />} title="Design Your Image">
          <div className="grid sm:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Colour Palette</label>
                  <CustomSelect value={image.colorScheme} onChange={e => onFieldChange('image', 'colorScheme', e.target.value)}>
                      {COLOR_SCHEMES.map(s => <option key={s} value={s}>{s}</option>)}
                  </CustomSelect>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Visual Themes</label>
                  <CustomSelect value={image.backdrop} onChange={e => onFieldChange('image', 'backdrop', e.target.value)}>
                      <option value="None">None</option>
                      {VISUAL_THEMES.map(group => (
                          <optgroup key={group.category} label={group.category}>
                              {group.options.map(option => (
                                  <option key={option} value={option}>{option}</option>
                              ))}
                          </optgroup>
                      ))}
                  </CustomSelect>
              </div>
          </div>
          <CustomTextarea 
              placeholder="Describe the image you want to generate... (e.g., 'A lone wolf howling at a galaxy moon')"
              value={image.prompt}
              onChange={e => onFieldChange('image', 'prompt', e.target.value)}
              rows={3}
          />
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-3">
              {ASPECT_RATIOS.map((ratio) => (
                <AspectRatioButton
                  key={ratio.value}
                  label={ratio.label}
                  value={ratio.value}
                  isActive={image.aspectRatio === ratio.value}
                  onClick={() => onFieldChange('image', 'aspectRatio', ratio.value)}
                />
              ))}
            </div>
          </div>
          <div>
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              {!image.uploadedImage ? (
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                  >
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="font-semibold text-sm">Upload an image (optional)</span>
                  </button>
              ) : (
                  <div className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                      <div className="flex items-center gap-3 text-sm min-w-0">
                          <FileCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="font-medium text-gray-700 truncate">{image.uploadedImage.name}</span>
                      </div>
                      <button onClick={handleRemoveUploadedImage} className="flex-shrink-0 ml-2" aria-label="Remove image">
                          <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                      </button>
                  </div>
              )}
          </div>
           <ActionButton onClick={onGenerateImage} isLoading={state.loading.image} disabled={isGenerateImageDisabled} className="bg-[linear-gradient(90deg,#8A2BE2,#FF8C00)] hover:brightness-105">Generate Background</ActionButton>
        </Section>
      </div>
      
      <div id="customize-style-section">
        <Section icon={<Wand2 size={24} />} title="Customize Style">
          <FontSelector
              fontFamily={style.fontFamily}
              onFontChange={(font) => onFieldChange('style', 'fontFamily', font)}
              fontWeight={style.fontWeight}
              onFontWeightChange={(weight) => onFieldChange('style', 'fontWeight', weight)}
              isBold={style.isBold}
              onIsBoldChange={(bold) => onFieldChange('style', 'isBold', bold)}
              isItalic={style.isItalic}
              onIsItalicChange={(italic) => onFieldChange('style', 'isItalic', italic)}
              fontSize={style.fontSize}
              onFontSizeChange={(size) => onFieldChange('style', 'fontSize', size)}
              fontColor={style.fontColor}
              onFontColorChange={(color) => onFieldChange('style', 'fontColor', color)}
              position={style.position}
              onPositionChange={(pos) => onFieldChange('style', 'position', pos)}
              textAlign={style.textAlign}
              onTextAlignChange={(align) => onFieldChange('style', 'textAlign', align)}
              textOutlineEnabled={style.textOutlineEnabled}
              onTextOutlineEnabledChange={(enabled) => onFieldChange('style', 'textOutlineEnabled', enabled)}
              textOutlineColor={style.textOutlineColor}
              onTextOutlineColorChange={(color) => onFieldChange('style', 'textOutlineColor', color)}
              textOutlineWidth={style.textOutlineWidth}
              onTextOutlineWidthChange={(width) => onFieldChange('style', 'textOutlineWidth', width)}
              textBackgroundEnabled={style.textBackgroundEnabled}
              onTextBackgroundEnabledChange={(enabled) => onFieldChange('style', 'textBackgroundEnabled', enabled)}
              textBackgroundColor={style.textBackgroundColor}
              onTextBackgroundColorChange={(color) => onFieldChange('style', 'textBackgroundColor', color)}
              textBackgroundOpacity={style.textBackgroundOpacity}
              onTextBackgroundOpacityChange={(opacity) => onFieldChange('style', 'textBackgroundOpacity', opacity)}
              textBackgroundPadding={style.textBackgroundPadding}
              onTextBackgroundPaddingChange={(padding) => onFieldChange('style', 'textBackgroundPadding', padding)}
              textBackgroundBorderRadius={style.textBackgroundBorderRadius}
              onTextBackgroundBorderRadiusChange={(radius) => onFieldChange('style', 'textBackgroundBorderRadius', radius)}
          />
        </Section>
      </div>

      <div id="watermark-section">
        <Section icon={<Shield size={24} />} title="Watermark / Logo">
          <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleWatermarkFileChange} ref={watermarkInputRef} className="hidden" />
          {!watermark.image ? (
              <button
                  onClick={() => watermarkInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-sm">Upload Logo (optional)</span>
              </button>
          ) : (
              <div className="space-y-4">
                  <div className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                      <div className="flex items-center gap-3 text-sm min-w-0">
                          <FileCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="font-medium text-gray-700 truncate">{watermark.image.name}</span>
                      </div>
                      <button onClick={handleRemoveWatermarkImage} className="flex-shrink-0 ml-2" aria-label="Remove logo">
                          <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                      </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                      <label htmlFor="watermark-enabled" className="text-sm font-medium text-gray-700">
                          Show Watermark
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                              type="checkbox" 
                              id="watermark-enabled"
                              checked={watermark.enabled}
                              onChange={(e) => onFieldChange('watermark', 'enabled', e.target.checked)}
                              className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                  </div>
                  
                  <fieldset disabled={!watermark.enabled} className="space-y-4 transition-opacity duration-300" style={{ opacity: watermark.enabled ? 1 : 0.5 }}>
                      <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">Position</label>
                          <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg w-24 mx-auto">
                              {positions.map(p => (
                                  <PositionButton 
                                      key={p} 
                                      onClick={() => onFieldChange('watermark', 'position', p)}
                                      isActive={watermark.position === p} 
                                  />
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                              <span>Opacity</span>
                              <span className="font-semibold text-gray-800">{Math.round(watermark.opacity * 100)}%</span>
                          </label>
                          <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.05"
                              value={watermark.opacity}
                              onChange={(e) => onFieldChange('watermark', 'opacity', parseFloat(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                          />
                      </div>
                      
                      <div>
                          <label className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                              <span>Size</span>
                              <span className="font-semibold text-gray-800">{watermark.size}%</span>
                          </label>
                          <input
                              type="range"
                              min="5"
                              max="100"
                              step="1"
                              value={watermark.size}
                              onChange={(e) => onFieldChange('watermark', 'size', parseInt(e.target.value, 10))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                          />
                      </div>
                  </fieldset>
              </div>
          )}
      </Section>
    </div>
    </div>
  );
};