import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Thinker {
    name: string;
    bio: string;
    quote: string;
}

interface PantheonCategory {
    name: string;
    description: string;
    thinkers: Thinker[];
}

interface PantheonData {
    ethicalStatement: string;
    categories: PantheonCategory[];
}

interface PantheonModalProps {
    pantheonData: PantheonData;
    onClose: () => void;
}

export const PantheonModal: React.FC<PantheonModalProps> = ({ pantheonData, onClose }) => {
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

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
                    <h2 className="text-xl font-bold text-gray-900">Pantheon of Thinkers</h2>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </header>
                <main className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Ethical Curation Statement</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{pantheonData.ethicalStatement}</p>
                    </section>

                    {pantheonData.categories.map((group) => (
                        <section key={group.name}>
                             <h3 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h3>
                             <p className="text-md text-gray-500 italic mb-4 pb-2 border-b-2 border-violet-200">{group.description}</p>
                             <div className="space-y-6">
                                {group.thinkers.map((thinker) => (
                                    <div key={thinker.name} className="border-b border-gray-100 pb-4 last:border-b-0">
                                        <h4 className="font-bold text-lg text-gray-800">{thinker.name}</h4>
                                        <p className="text-sm text-gray-500 italic mb-2">{thinker.bio}</p>
                                        <blockquote className="border-l-4 border-violet-200 pl-4">
                                            <p className="text-gray-700 font-serif">"{thinker.quote}"</p>
                                        </blockquote>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </main>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};
