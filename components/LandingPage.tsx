import React from 'react';
import { Palette, Zap, Star, Users, PenTool, TrendingUp, Sparkles, Wand, Download } from 'lucide-react';
import { image1, image2, image3, image4 } from './imageData';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-purple-600 rounded-lg h-12 w-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="landingLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8A2BE2" />
                                    <stop offset="100%" stopColor="#FF8C00" />
                                </linearGradient>
                            </defs>
                            <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" fill="url(#landingLogoGradient)"/>
                        </svg>
                        <span className="font-bold text-xl brand-gradient-text" style={{fontFamily: "'Poppins', sans-serif"}}>QuoteGenX</span>
                    </div>
                     <button 
                        onClick={onGetStarted}
                        className="hidden sm:inline-block text-white font-semibold py-2 px-5 rounded-lg transition-transform hover:scale-105"
                        style={{ background: 'linear-gradient(90deg, #8A2BE2, #FF8C00)' }}
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative text-center pt-32 pb-8 md:pt-40 overflow-hidden">
                <div className="absolute inset-0 bg-white z-0">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-50 to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 z-10 relative">
                    <p className="font-bold text-sm uppercase tracking-widest brand-gradient-text mb-4">
                        For Coaches, Influencers & Content Creators
                    </p>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900" style={{fontFamily: "'Poppins', sans-serif"}}>
                        Turn Words into <span className="brand-gradient-text">Masterpieces</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Effortlessly create scroll-stopping quote graphics with AI using iconic thinkers, mixed ideologies, or your own uploaded images.
                    </p>
                    <button 
                        onClick={onGetStarted}
                        className="text-white font-bold py-4 px-10 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg"
                        style={{ background: 'linear-gradient(90deg, #8A2BE2, #FF8C00)' }}
                    >
                        Start Creating for Free
                    </button>
                    <div className="mt-6 text-sm text-gray-500">
                        <span>Trusted by <strong>10,000+</strong> creators</span>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="pt-12 pb-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-4xl font-bold mb-12 text-gray-900" style={{fontFamily: "'Poppins', sans-serif"}}>Endless Possibilities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <img src={image1} alt="Quote from Jean-Paul Sartre on a scenic background" className="w-full aspect-[9/16] bg-gray-200 rounded-xl object-cover shadow-lg" />
                        <img src={image2} alt="Quote from Alan Watts with a dancer" className="w-full aspect-[9/16] bg-gray-200 rounded-xl object-cover shadow-lg" />
                        <img src={image3} alt="Inspirational quote about language on a cosmic background" className="w-full aspect-[9/16] bg-gray-200 rounded-xl object-cover shadow-lg" />
                        <img src={image4} alt="Motivational quote about being a champion on a mountain peak background" className="w-full aspect-[9/16] bg-gray-200 rounded-xl object-cover shadow-lg" />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900" style={{fontFamily: "'Poppins', sans-serif"}}>Create in 3 Simple Steps</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">From idea to Instagram-ready in under a minute.</p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                        <FeatureCard icon={<Sparkles className="w-8 h-8"/>} title="1. Choose Your Vibe">
                            Select a mood and aesthetic style from our curated library—from Stoic Wisdom to Cosmic Dream.
                        </FeatureCard>
                        <FeatureCard icon={<Wand className="w-8 h-8"/>} title="2. Add Your Quote">
                            Type your own message or let our AI generate an impactful quote for you instantly.
                        </FeatureCard>
                        <FeatureCard icon={<Download className="w-8 h-8"/>} title="3. Generate & Share">
                            Click 'Generate' and watch the magic happen. Download your high-quality graphic and share it with the world.
                        </FeatureCard>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container mx-auto py-16 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                             <div className="flex items-center gap-2 mb-4">
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" fill="url(#landingLogoGradient)"/>
                                </svg>
                                <span className="font-bold text-xl text-white" style={{fontFamily: "'Poppins', sans-serif"}}>QuoteGenX</span>
                            </div>
                            <p className="text-gray-400 text-sm">Transform words into visual masterpieces.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-4 tracking-wider uppercase">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-4 tracking-wider uppercase">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-200 mb-4 tracking-wider uppercase">Social</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">X / Twitter</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                         <p>© 2024 QuoteGenX. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};