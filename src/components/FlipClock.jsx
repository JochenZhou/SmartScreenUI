import React, { useEffect, useState } from 'react';

const FlipCard = ({ digit, cardColor, cardOpacity }) => {
    const [prevDigit, setPrevDigit] = useState(digit);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (digit !== prevDigit) {
            setIsFlipping(true);

            const timer = setTimeout(() => {
                setPrevDigit(digit);
                setIsFlipping(false);
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [digit, prevDigit]);

    // Convert hex color to rgba for opacity support if needed, 
    // but here we use opacity style on the container or background directly.
    // Ideally cardColor is a hex string like "#1c1c1e".

    const cardStyle = {
        backgroundColor: cardColor,
        opacity: cardOpacity,
    };

    // We apply the background color to the card layers. 
    // The opacity is tricky because we don't want to make the text transparent, just the background.
    // So we use a helper to inject opacity into the background color if it's hex.
    const getBgStyle = () => {
        // Simple hex to rgba conversion or just use the color and apply opacity to the div
        // If we apply opacity to the div, text also becomes transparent.
        // Let's assume the user wants the whole card (bg) transparent but text opaque?
        // Usually "background opacity" implies rgba. 
        // For simplicity, let's apply opacity to the background element if possible, 
        // or just use the opacity prop on the style if the user wants the whole card semi-transparent.
        // Given the request "modify number background color and transparency", likely means RGBA background.

        // Let's use a style object that applies the color. 
        // If we want independent background opacity, we'd need to convert hex to rgba.
        // For now, let's apply opacity to the card container's background color using a utility or inline style.

        // Actually, the easiest way to handle "background transparency" without affecting text 
        // is to use `rgba` or `hex8`. 
        // But the input is likely a color picker (hex) and a slider (0-1).
        // Let's construct the color string.

        // Helper to convert hex to rgb
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 28, g: 28, b: 30 }; // Default #1c1c1e
        };

        const rgb = hexToRgb(cardColor);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${cardOpacity})`;
    };

    const bgStyle = { backgroundColor: getBgStyle() };

    return (
        <div className="flip-card-container relative w-[140px] h-[220px]" style={{ perspective: '2000px' }}>
            <div className="relative w-full h-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden" style={bgStyle}>

                {/* Static Upper Half - shows current digit top */}
                <div className="absolute top-0 left-0 w-full h-[110px] overflow-hidden z-20" style={bgStyle}>
                    <div className="absolute w-full h-[220px] top-0 flex items-center justify-center text-[160px] font-mono font-bold text-[#e5e5e5] leading-[220px]">
                        {digit}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Static Lower Half - shows previous digit bottom */}
                <div className="absolute bottom-0 left-0 w-full h-[110px] overflow-hidden z-10" style={{ ...bgStyle, filter: 'brightness(0.85)' }}>
                    <div className="absolute w-full h-[220px] bottom-0 flex items-center justify-center text-[160px] font-mono font-bold text-[#e5e5e5] leading-[220px]">
                        {prevDigit}
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>

                {/* Flipping Upper Half */}
                {isFlipping && (
                    <div className="flip-upper absolute top-0 left-0 w-full h-[110px] overflow-hidden origin-bottom z-30 rounded-t-2xl"
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', ...bgStyle }}>
                        <div className="absolute inset-0" style={bgStyle}></div>
                        <div className="absolute w-full h-[220px] top-0 flex items-center justify-center text-[160px] font-mono font-bold text-[#e5e5e5] leading-[220px] z-10">
                            {prevDigit}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/40 to-transparent z-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20"></div>
                        <div className="flip-shadow absolute inset-0 bg-black pointer-events-none z-30"></div>
                    </div>
                )}

                {/* Flipping Lower Half */}
                {isFlipping && (
                    <div className="flip-lower absolute bottom-0 left-0 w-full h-[110px] overflow-hidden origin-top z-40 rounded-b-2xl"
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
                        <div className="absolute inset-0" style={{ ...bgStyle, filter: 'brightness(0.85)' }}></div>
                        <div className="absolute w-full h-[220px] bottom-0 flex items-center justify-center text-[160px] font-mono font-bold text-[#e5e5e5] leading-[220px] z-10">
                            {digit}
                        </div>
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/40 to-transparent z-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-20"></div>
                        <div className="flip-shadow absolute inset-0 bg-black pointer-events-none z-30"></div>
                    </div>
                )}

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none z-50"></div>
            </div>
        </div>
    );
};

const FlipClock = ({ time, showSeconds = true, cardColor = '#1c1c1e', cardOpacity = 1 }) => {
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');

    useEffect(() => {
        if (!time) return;
        const h = time.getHours().toString().padStart(2, '0');
        const m = time.getMinutes().toString().padStart(2, '0');
        const s = time.getSeconds().toString().padStart(2, '0');
        setHours(h);
        setMinutes(m);
        setSeconds(s);
    }, [time]);

    return (
        <>
            <style>{`
                .flip-card-container {
                    perspective: 2000px;
                }

                .flip-upper {
                    animation: flipDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                .flip-lower {
                    animation: flipUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                @keyframes flipDown {
                    0% {
                        transform: rotateX(0deg);
                    }
                    100% {
                        transform: rotateX(-180deg);
                    }
                }

                @keyframes flipUp {
                    0% {
                        transform: rotateX(180deg);
                    }
                    100% {
                        transform: rotateX(0deg);
                    }
                }

                .flip-upper .flip-shadow {
                    animation: shadowTop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                .flip-lower .flip-shadow {
                    animation: shadowBottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                @keyframes shadowTop {
                    0% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.3;
                    }
                    100% {
                        opacity: 0;
                    }
                }

                @keyframes shadowBottom {
                    0% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.3;
                    }
                    100% {
                        opacity: 0;
                    }
                }
            `}</style>
            <div className={`flex items-center justify-center gap-4 sm:gap-6 origin-center transition-all duration-500 ${showSeconds ? 'scale-75 sm:scale-100' : 'scale-100 sm:scale-125'}`}>
                {/* Hours */}
                <div className="flex gap-1 sm:gap-2">
                    <FlipCard digit={hours[0]} cardColor={cardColor} cardOpacity={cardOpacity} />
                    <FlipCard digit={hours[1]} cardColor={cardColor} cardOpacity={cardOpacity} />
                </div>

                {/* Minutes */}
                <div className="flex gap-1 sm:gap-2">
                    <FlipCard digit={minutes[0]} cardColor={cardColor} cardOpacity={cardOpacity} />
                    <FlipCard digit={minutes[1]} cardColor={cardColor} cardOpacity={cardOpacity} />
                </div>

                {/* Seconds */}
                {showSeconds && (
                    <div className="flex gap-1 sm:gap-2">
                        <FlipCard digit={seconds[0]} cardColor={cardColor} cardOpacity={cardOpacity} />
                        <FlipCard digit={seconds[1]} cardColor={cardColor} cardOpacity={cardOpacity} />
                    </div>
                )}
            </div>
        </>
    );
};

export default FlipClock;
