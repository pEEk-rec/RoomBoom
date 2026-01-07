import React, { useState } from 'react';
import SplitLanding from './components/SplitLanding';
import AppContent from './components/AppContent';
import AuthModal from './components/AuthModal';

const IMAGES = {
    discoveryHero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000",
    residentialHero: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
};

const App = () => {
    const [hasChosen, setHasChosen] = useState(false);
    const [mode, setMode] = useState('discovery');
    const [transitionStage, setTransitionStage] = useState('idle');

    // Auth modal state
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');

    const handleChoice = (selectedMode) => {
        setMode(selectedMode);
        setTransitionStage('expanding');

        setTimeout(() => {
            setTransitionStage('washing');

            setTimeout(() => {
                setHasChosen(true);
                setTransitionStage('complete');
            }, 800);
        }, 800);
    };

    const handleAuthClick = (mode) => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };

    return (
        <>
            {/* TRANSITION LAYER */}
            {!hasChosen && (
                <div className={`fixed inset-0 z-50 flex transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]`}>

                    {/* LEFT LAYER (Discovery) */}
                    <div className={`
                relative h-full overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)]
                ${transitionStage === 'idle' ? 'w-[50%]' : ''}
                ${transitionStage === 'expanding' && mode === 'discovery' ? 'w-[100%]' : ''}
                ${transitionStage === 'expanding' && mode === 'rentals' ? 'w-[0%]' : ''}
                ${transitionStage === 'washing' ? 'transform -translate-y-full opacity-0' : ''}
            `}>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.discoveryHero})` }}></div>
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* RIGHT LAYER (Rentals) */}
                    <div className={`
                relative h-full overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] bg-slate-900
                ${transitionStage === 'idle' ? 'w-[50%]' : ''}
                ${transitionStage === 'expanding' && mode === 'rentals' ? 'w-[100%]' : ''}
                ${transitionStage === 'expanding' && mode === 'discovery' ? 'w-[0%]' : ''}
                ${transitionStage === 'washing' ? 'transform translate-y-full opacity-0' : ''}
            `}>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.residentialHero})` }}></div>
                    </div>

                    {/* The actual clickable Landing UI (only visible when idle) */}
                    {transitionStage === 'idle' && (
                        <div className="absolute inset-0">
                            <SplitLanding onChoose={handleChoice} onAuthClick={handleAuthClick} />
                        </div>
                    )}
                </div>
            )}

            {/* ACTUAL APP CONTENT */}
            <div className={`
          ${hasChosen ? 'opacity-100' : 'opacity-0'} 
          transition-opacity duration-1000 delay-500
      `}>
                <AppContent mode={mode} setMode={setMode} onAuthClick={handleAuthClick} />
            </div>

            {/* AUTH MODAL */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authModalMode}
            />
        </>
    );
};

export default App;
