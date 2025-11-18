import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { produce } from 'immer';
import { QuoteCustomizer } from './components/QuoteCustomizer';
import { ImagePreview } from './components/ImagePreview';
import { LandingPage } from './components/landingpageTEMP';
import { PantheonModal } from './components/PantheonModal';
import { TourModal } from './components/TourModal';
import { generateQuote, generateImage, editImage, generateJourneyVariations } from './services/geminiService';
import { AppState, JourneyItem, ImageTransform, JourneyType, StyleOptions } from './types';
import { INITIAL_STATE, PANTHEON_DATA } from './constants';
import { Info, Map, RefreshCw, Feather, Zap, Images, Wand2 } from 'lucide-react';
import { Section } from './components/common';


const appReducer = (state: AppState, action: { type: string; payload?: any }): AppState => {
  return produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_FIELD':
        const { section, field, value } = action.payload;
        if (section === 'quote' || section === 'image' || section === 'style' || section === 'watermark') {
          // 1. Update the main state
          (draft[section] as any)[field] = value;
          
          // 2. If a journey item is selected, update it as well
          if (draft.selectedJourneyItemIndex !== null) {
            const item = draft.journey[draft.selectedJourneyItemIndex];
            if (item) {
              if (section === 'style') {
                (item.style as any)[field] = value;
              } else if (section === 'quote' && field === 'ownQuote') {
                item.quote = value;
              }
            }
          }

          // 3. Clear inspiration sources if user starts typing a new quote
          if (section === 'quote' && (field === 'ownQuote' || (field === 'source' && value === 'generate'))) {
              if (draft.selectedJourneyItemIndex === null) {
                 draft.quote.inspirationSources = [];
              }
          }
        }
        break;
      case 'SET_GENERATED_QUOTE':
        draft.quote.generatedQuote = action.payload.quote;
        draft.quote.ownQuote = action.payload.quote;
        draft.quote.source = 'own';
        draft.quote.inspirationSources = action.payload.sources;
        break;
      case 'SET_GENERATED_IMAGE':
        draft.generatedImage = action.payload;
        draft.journey = [];
        draft.selectedJourneyItemIndex = null;
        draft.imageTransform = INITIAL_STATE.imageTransform;
        break;
      case 'SET_LOADING':
        draft.loading[action.payload.key] = action.payload.value;
        break;
      case 'SET_UPLOADED_IMAGE':
        draft.image.uploadedImage = action.payload;
        draft.generatedImage = null; // Clear generated image when new one is uploaded
        draft.imageTransform = INITIAL_STATE.imageTransform;
        break;
      case 'RESET_STATE':
        return INITIAL_STATE;
      case 'SET_JOURNEY_ITEMS':
          const { items, originalStyle } = action.payload;
          const [initialItem, ...newItems] = items;
          
          initialItem.style = originalStyle;
          
          const journeyWithStyles = [
            initialItem,
            ...newItems.map((item: Omit<JourneyItem, 'style'>) => ({
              ...item,
              style: { ...originalStyle } // New items inherit the original's style
            }))
          ];

          draft.journey = journeyWithStyles;
          draft.loading.journey = false;
          draft.selectedJourneyItemIndex = null;
        break;
      case 'SET_SELECTED_JOURNEY_ITEM':
        const { item, index } = action.payload;
        draft.selectedJourneyItemIndex = index;
        draft.quote.ownQuote = item.quote;
        draft.generatedImage = item.image;
        draft.style = item.style; // Load the item's specific style
        draft.quote.inspirationSources = item.inspirationSources || [];
        draft.imageTransform = INITIAL_STATE.imageTransform; // Reset zoom/pan
        break;
      case 'CLEAR_JOURNEY':
        draft.journey = [];
        draft.selectedJourneyItemIndex = null;
        break;
      case 'UPDATE_IMAGE_TRANSFORM':
        draft.imageTransform = { ...draft.imageTransform, ...action.payload };
        break;
    }
  });
};

const JourneyButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    disabled: boolean;
}> = ({ icon, label, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="relative flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-left group hover:bg-white hover:shadow-sm hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:border-gray-200"
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-violet-600 bg-violet-100 rounded-md">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-sm text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    </button>
);

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [showCreator, setShowCreator] = useState(false);
  const [isPantheonVisible, setIsPantheonVisible] = useState(false);
  const [isTourVisible, setIsTourVisible] = useState(false);

  useEffect(() => {
    if (showCreator) {
      const hasSeenTour = localStorage.getItem('hasSeenQuoteGenXTour');
      if (!hasSeenTour) {
        setIsTourVisible(true);
        localStorage.setItem('hasSeenQuoteGenXTour', 'true');
      }
    }
  }, [showCreator]);

  const handleApiError = (error: unknown, context: string) => {
    console.error(`Error ${context}:`, error);
    
    const errorString = (error instanceof Error) ? error.message : JSON.stringify(error);
    let errorMessage: string;

    if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
      errorMessage = 'You have exceeded your API quota. Please check your plan and billing details with Google AI Studio to continue.';
    } else if (errorString.includes('API_KEY_INVALID')) {
      errorMessage = 'Your API key is invalid. Please ensure it is configured correctly.';
    } else if (error instanceof Error) {
        errorMessage = error.message; // Use the specific error from the service
    } else {
        errorMessage = `An unexpected error occurred while trying to ${context}. Please try again.`;
    }
    
    alert(errorMessage);
  };

  const handleFieldChange = useCallback((section: 'quote' | 'image' | 'style' | 'watermark', field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { section, field, value } });
  }, []);

  const handleTransformChange = useCallback((transform: Partial<ImageTransform>) => {
    dispatch({ type: 'UPDATE_IMAGE_TRANSFORM', payload: transform });
  }, []);

  const handleGenerateQuote = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'quote', value: true } });
    try {
        const currentSources: string[] = [];
        if (state.quote.source === 'generate') {
            if (state.quote.usePhilosopher) currentSources.push(state.quote.philosopher);
            if (state.quote.useModernThinker) currentSources.push(state.quote.modernThinker);
            if (state.quote.useLuminary) currentSources.push(state.quote.luminary);
            if (state.quote.useRebel) currentSources.push(state.quote.rebel);
            if (state.quote.useMystic) currentSources.push(state.quote.mystic);
            if (state.quote.useStrategicMind) currentSources.push(state.quote.strategicMind);
            if (state.quote.useAuthor) currentSources.push(state.quote.author);
        }

        const quote = await generateQuote(state.quote);
        
        const finalSources = currentSources.length > 1 ? currentSources : [];

        dispatch({ type: 'SET_GENERATED_QUOTE', payload: { quote, sources: finalSources } });
    } catch (error) {
      handleApiError(error, 'generate quote');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'quote', value: false } });
    }
  }, [state.quote]);

  const handleGenerateImage = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'image', value: true } });
    try {
      let image;
      if (state.image.uploadedImage) {
        image = await editImage(state.image.uploadedImage, state.image);
      } else {
        image = await generateImage(state.image, state.quote.ownQuote);
      }
      dispatch({ type: 'SET_GENERATED_IMAGE', payload: image });
    } catch (error) {
      handleApiError(error, 'generate image');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'image', value: false } });
    }
  }, [state.image, state.quote.ownQuote]);
  
  const handleGenerateJourney = useCallback(async (journeyType: JourneyType) => {
    if (!state.generatedImage && !state.image.uploadedImage) return;
    dispatch({ type: 'SET_LOADING', payload: { key: 'journey', value: true } });
    try {
        let initialImageSrc: string;
        if (state.generatedImage) {
            initialImageSrc = state.generatedImage;
        } else if (state.image.uploadedImage) {
            initialImageSrc = await fileToDataUrl(state.image.uploadedImage);
        } else {
            throw new Error("No image available to start a journey.");
        }

        // The user's original creation is preserved
        const initialJourneyItem: Omit<JourneyItem, 'style'> = {
            quote: state.quote.ownQuote,
            image: initialImageSrc,
            inspirationSources: state.quote.inspirationSources,
        };
        
        const newJourneyItems = await generateJourneyVariations(state.quote.ownQuote, state.quote, state.image, journeyType);
        
        const fullJourney = [initialJourneyItem, ...newJourneyItems];
        
        dispatch({ type: 'SET_JOURNEY_ITEMS', payload: { items: fullJourney, originalStyle: state.style } });
        // The selection logic now happens inside the journey item click handler
        
    } catch (error) {
        handleApiError(error, 'generate journey');
    } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'journey', value: false } });
    }
  }, [state.quote, state.image, state.generatedImage, state.style, state.image.uploadedImage, state.quote.inspirationSources]);

  const handleSelectJourneyItem = useCallback((item: JourneyItem, index: number) => {
    dispatch({ type: 'SET_SELECTED_JOURNEY_ITEM', payload: { item, index } });
  }, []);

  const handleClearJourney = useCallback(() => {
      dispatch({ type: 'CLEAR_JOURNEY' });
  }, []);

  const handleGetStarted = () => {
    dispatch({ type: 'RESET_STATE' });
    setShowCreator(true);
  };
  
  const handleGoHome = () => {
    setShowCreator(false);
  }

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  if (!showCreator) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }


  return (
    <>
      {isPantheonVisible && <PantheonModal pantheonData={PANTHEON_DATA} onClose={() => setIsPantheonVisible(false)} />}
      {isTourVisible && <TourModal onClose={() => setIsTourVisible(false)} />}
      <div className="min-h-screen w-full bg-gray-50 text-gray-800 font-sans">
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="mx-auto px-8 flex justify-between items-center h-16">
            <button onClick={handleGoHome} className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 rounded-lg" aria-label="Go to homepage">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                      <linearGradient id="landingLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8A2BE2" />
                          <stop offset="100%" stopColor="#FF8C00" />
                      </linearGradient>
                  </defs>
                  <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" fill="url(#landingLogoGradient)"/>
              </svg>
              <span className="font-bold text-xl brand-gradient-text transition-all group-hover:brightness-110" style={{fontFamily: "'Poppins', sans-serif"}}>QuoteGenX</span>
            </button>

            <button
              onClick={() => setIsTourVisible(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-semibold"
              aria-label="Take a tour"
            >
              <Info size={18} />
              <span>Take a Tour</span>
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2 p-8 border-r border-gray-200">
            <QuoteCustomizer 
              state={state} 
              dispatch={dispatch} 
              onFieldChange={handleFieldChange}
              onGenerateQuote={handleGenerateQuote}
              onGenerateImage={handleGenerateImage}
              onReset={handleReset}
              onShowPantheon={() => setIsPantheonVisible(true)}
            />
          </div>
          <div className="lg:col-span-3 p-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-2xl mx-auto">
               <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Image Preview</h3>
              <ImagePreview
                quote={state.quote.ownQuote}
                generatedImage={state.generatedImage}
                uploadedImage={state.image.uploadedImage}
                styleOptions={state.style}
                watermarkOptions={state.watermark}
                isLoading={state.loading.image || state.loading.quote}
                imageTransform={state.imageTransform}
                onTransformChange={handleTransformChange}
                visualTheme={state.image.backdrop}
                aspectRatio={state.image.aspectRatio}
              />
               {(state.generatedImage || state.image.uploadedImage) && !state.loading.image && (
                <div id="quote-journey-section" className="mt-6">
                    <Section
                        icon={<Map size={24} />}
                        title="Creative Compass"
                        extraHeaderContent={state.journey.length > 0 && !state.loading.journey ? (
                            <button onClick={handleClearJourney} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Clear Journey">
                                <RefreshCw size={16} />
                            </button>
                        ) : null}
                    >
                        {state.loading.journey && (
                            <div className="flex flex-col items-center justify-center text-center text-gray-600 h-40">
                                <div className="w-10 h-10 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin"></div>
                                <p className="mt-4 font-semibold text-sm">Forging new paths...</p>
                            </div>
                        )}
                        {!state.loading.journey && state.journey.length === 0 && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 -mt-2">Choose a direction to explore variations of your creation.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <JourneyButton icon={<Feather size={18}/>} label="Poetic Journey" description="More lyrical & abstract" onClick={() => handleGenerateJourney('poetic')} disabled={state.loading.journey}/>
                                    <JourneyButton icon={<Zap size={18}/>} label="Direct Journey" description="More punchy & direct" onClick={() => handleGenerateJourney('direct')} disabled={state.loading.journey}/>
                                    <JourneyButton icon={<Images size={18}/>} label="Visual Remix" description="New images, same quote" onClick={() => handleGenerateJourney('visual')} disabled={state.loading.journey}/>
                                    <JourneyButton icon={<Wand2 size={18}/>} label="Wildcard" description="AI-driven surprise" onClick={() => handleGenerateJourney('wildcard')} disabled={state.loading.journey}/>
                                </div>
                            </div>
                        )}
                        {!state.loading.journey && state.journey.length > 0 && (
                            <div className={`grid grid-cols-${Math.min(state.journey.length, 5)} gap-3`}>
                                {state.journey.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectJourneyItem(item, index)}
                                        className={`relative aspect-square rounded-lg overflow-hidden group focus:outline-none transition-all duration-200 ring-2 ${state.selectedJourneyItemIndex === index ? 'ring-violet-500 ring-offset-2' : 'ring-transparent hover:ring-violet-300'}`}
                                        aria-label={`Select variation ${index + 1}`}
                                    >
                                        <img src={item.image} alt={`Variation: ${item.quote}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-white text-xs font-semibold text-center leading-tight" style={{fontFamily: "'Inter', sans-serif", textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                                            {item.quote}
                                            </p>
                                        </div>
                                         {index === 0 && (
                                            <div className="absolute top-1 left-1 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                Original
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;