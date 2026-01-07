import React, { useState } from 'react';

const IMAGES = {
    discoveryHero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000",
    residentialHero: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
};

const SplitLanding = ({ onChoose, onAuthClick }) => {
    const [hoveredSide, setHoveredSide] = useState(null);

    return (
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row font-sans overflow-hidden bg-black">

            {/* --- LEFT SIDE: DISCOVERY (THE WAVE) --- */}
            <div
                className={`relative h-1/2 md:h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group overflow-hidden
          ${hoveredSide === 'right' ? 'md:w-[40%]' : hoveredSide === 'left' ? 'md:w-[60%]' : 'md:w-[50%]'}
          w-full
        `}
                onMouseEnter={() => setHoveredSide('left')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => onChoose('discovery')}
            >
                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                    style={{ backgroundImage: `url(${IMAGES.discoveryHero})` }}
                />
                <div className="absolute inset-0 bg-teal-900/20 group-hover:bg-teal-900/10 transition-colors duration-500" />

                {/* The "Continuous Wave" Animation at the edge */}
                <div className="absolute top-0 bottom-0 right-[-10%] w-[20%] hidden md:block opacity-80 animate-tide-sway">
                    <div className="w-full h-full bg-gradient-to-l from-white/40 to-transparent blur-xl transform scale-x-150"></div>
                </div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-lg mb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                        Local <br /> <span className="text-[#FFEaa7]">Discovery</span>
                    </h2>
                    <p className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-sm">
                        Ride the wave of local experiences. <br /> Hidden gems, raw vibes.
                    </p>
                    <div className="mt-8 px-8 py-3 bg-white/20 backdrop-blur border border-white/40 rounded-full text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-teal-600 transition-all">
                        Dive In
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: RESIDENTIAL (THE HOME) --- */}
            <div
                className={`relative h-1/2 md:h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group overflow-hidden bg-slate-900
          ${hoveredSide === 'left' ? 'md:w-[40%]' : hoveredSide === 'right' ? 'md:w-[60%]' : 'md:w-[50%]'}
          w-full border-t md:border-t-0 md:border-l border-white/10
        `}
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => onChoose('rentals')}
            >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                    style={{ backgroundImage: `url(${IMAGES.residentialHero})` }}
                />
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors duration-500" />

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-lg mb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                        Residential <br /> <span className="text-[#74b9ff]">Living</span>
                    </h2>
                    <p className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-sm">
                        Find your sanctuary. <br /> Long-term stays, curated comfort.
                    </p>
                    <div className="mt-8 px-8 py-3 bg-white/20 backdrop-blur border border-white/40 rounded-full text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-slate-900 transition-all">
                        Move In
                    </div>
                </div>
            </div>

            {/* Floating Center Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-difference text-white opacity-50 hidden md:block">
                <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center font-bold text-xl animate-pulse">
                    VS
                </div>
            </div>

            {/* Top Right Auth Controls */}
            <div className="absolute top-0 right-0 p-6 z-30 flex gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onAuthClick('register'); }}
                    className="text-white font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4"
                >
                    Register
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onAuthClick('login'); }}
                    className="px-5 py-2 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition-transform"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default SplitLanding;
