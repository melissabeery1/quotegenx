

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { X, Sparkles, ArrowRight, BookOpen, Shield } from 'lucide-react';

interface TourModalProps {
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    title: 'Welcome to QuoteGenX!',
    description: "Let's take a quick tour of the features that will help you turn words into masterpieces.",
    icon: <Sparkles size={24} className="text-violet-500" />
  },
  {
    title: '1. Craft Your Quote',
    description: "Start here. Choose to generate a unique quote with AI or type your own. Use 'Quote Vibe' and 'Inspiration Source' to guide the AI.",
    targetId: 'craft-quote-section',
    placement: 'right',
    arrow: 'left'
  },
  {
    title: '2. Need Inspiration?',
    description: "Feeling stuck? Explore our curated Pantheon of Thinkers for inspiration. Click here to discover timeless ideas from philosophers, rebels, and visionaries.",
    targetId: 'pantheon-button',
    icon: <BookOpen size={24} className="text-violet-500" />,
    placement: 'right',
    arrow: 'left'
  },
  {
    title: '3. Design Your Image',
    description: "Next, bring your background to life. Generate a visual with AI or upload your own image. This unlocks the 'Quote Journey' section below, your one-click tool to explore four creative variations of your design.",
    targetId: 'design-image-section',
    placement: 'right',
    arrow: 'left'
  },
  {
    title: '4. Customize Your Style',
    description: "Fine-tune the look. Select from a curated list of professional fonts, adjust the size, color, position, and alignment. Outline your text or add a background to make your quote pop from the background.",
    targetId: 'customize-style-section',
    placement: 'right',
    arrow: 'left'
  },
  {
    title: '5. Add Your Watermark',
    description: "Brand your creation by uploading your own logo or watermark. Control its position, size, and opacity for a professional finish.",
    targetId: 'watermark-section',
    icon: <Shield size={24} className="text-violet-500" />,
    placement: 'right',
    arrow: 'left'
  },
  {
    title: '6. Download & Share',
    description: "Once you're happy with your creation, download the high-resolution image or share it directly with your audience.",
    targetId: 'download-share-section',
    placement: 'left',
    arrow: 'right'
  },
];


export const TourModal: React.FC<TourModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    useLayoutEffect(() => {
        const currentStep = TOUR_STEPS[step];
        const { targetId, placement } = currentStep;
        const modal = modalRef.current;
        if (!modal) return;
        
        const gutter = 16;

        if (!targetId) {
            // Center it for welcome screen
            setModalStyle({
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            });
            return;
        }
        
        const target = document.getElementById(targetId);
        if (!target) {
            console.warn(`Tour target element with ID "${targetId}" not found.`);
            return;
        }

        // Scroll the target into view first
        target.scrollIntoView({ behavior: 'instant', block: 'center' });

        const calculateAndSetPosition = () => {
             // Re-check for modal and target inside the RAF callback
            const modal = modalRef.current;
            if (!modal || !document.body.contains(target)) return;

            const targetRect = target.getBoundingClientRect();
            const modalWidth = modal.offsetWidth;
            const modalHeight = modal.offsetHeight;
            
            let newStyle: React.CSSProperties = {};

            switch (placement) {
                case 'right':
                    newStyle = {
                        top: targetRect.top + targetRect.height / 2 - modalHeight / 2,
                        left: targetRect.right + gutter,
                    };
                    break;
                case 'left':
                    newStyle = {
                        top: targetRect.top + targetRect.height / 2 - modalHeight / 2,
                        left: targetRect.left - modalWidth - gutter,
                    };
                    break;
            }

            // Boundary checks to keep modal on screen
            // FIX: Cast `newStyle.top` to `number` for comparison. `React.CSSProperties` allows strings,
            // but we are working with numerical pixel values here, which causes a TypeScript error.
            if ((newStyle.top as number) < gutter) newStyle.top = gutter;
            // FIX: Cast `newStyle.left` to `number` for comparison. `React.CSSProperties` allows strings,
            // but we are working with numerical pixel values here, which causes a TypeScript error.
            if ((newStyle.left as number) < gutter) newStyle.left = gutter;
            if ((newStyle.left as number) + modalWidth > window.innerWidth - gutter) {
                newStyle.left = window.innerWidth - modalWidth - gutter;
            }
            if ((newStyle.top as number) + modalHeight > window.innerHeight - gutter) {
                newStyle.top = window.innerHeight - modalHeight - gutter;
            }
            
            setModalStyle(newStyle);
        };
        
        // Defer position calculation to the next animation frame
        // to ensure the scroll has completed and new layout is painted.
        const frameId = requestAnimationFrame(calculateAndSetPosition);
        
        return () => {
            cancelAnimationFrame(frameId);
        };

    }, [step]);


    const currentStep = TOUR_STEPS[step];

    const nextStep = () => {
        if (step < TOUR_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };
    
    const getArrowClass = (arrow: string | undefined) => {
        if (!arrow) return '';
        const baseClass = "absolute w-0 h-0 border-solid border-transparent";
        switch (arrow) {
            case 'left':
                 return `${baseClass} -left-3 top-1/2 -translate-y-1/2 border-r-white border-r-[12px] border-t-[12px] border-b-[12px]`;
            case 'right':
                return `${baseClass} -right-3 top-1/2 -translate-y-1/2 border-l-white border-l-[12px] border-t-[12px] border-b-[12px]`;
            default:
                return '';
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[100] animate-fade-in"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="absolute bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 transition-all duration-150"
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {currentStep.arrow && <div className={getArrowClass(currentStep.arrow)}></div>}

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                         {currentStep.icon && <div className="w-10 h-10 flex items-center justify-center bg-violet-100 rounded-full">{currentStep.icon}</div>}
                        <h2 className="text-xl font-bold text-gray-900">{currentStep.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 -mt-2 -mr-2">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-600 text-sm mb-6">{currentStep.description}</p>
                
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {TOUR_STEPS.map((_, index) => (
                             <div key={index} className={`w-2 h-2 rounded-full transition-colors ${step === index ? 'bg-violet-600' : 'bg-gray-300'}`}></div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {step > 0 && (
                            <button onClick={prevStep} className="font-semibold text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                Back
                            </button>
                        )}
                        <button 
                           onClick={nextStep}
                           className="font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                        >
                            {step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                            {step < TOUR_STEPS.length - 1 && <ArrowRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    )
}