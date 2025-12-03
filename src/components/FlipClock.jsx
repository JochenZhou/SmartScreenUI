import React, { useEffect, useState } from 'react';

// 整体翻页卡片组件 - 显示两位数字作为一个单位
const FlipUnit = ({ value, cardColor, cardOpacity }) => {
    const [prevValue, setPrevValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== prevValue) {
            setIsFlipping(true);

            const timer = setTimeout(() => {
                setPrevValue(value);
                setIsFlipping(false);
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [value, prevValue]);

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 28, g: 28, b: 30 };
    };

    const rgb = hexToRgb(cardColor);
    const bgStyle = { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${cardOpacity})` };

    return (
        <div className="flip-unit-container relative w-[300px] h-[260px]" style={{ perspective: '2500px' }}>
            <div className="relative w-full h-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10" style={{ backgroundColor: 'transparent' }}>

                {/* Static Upper Half - shows current value top */}
                <div className="absolute top-0 left-0 w-full h-[128px] overflow-hidden z-20 rounded-t-2xl" style={bgStyle}>
                    <div className="absolute w-full h-[260px] top-0 flex items-center justify-center text-[180px] font-mono font-bold text-[#e5e5e5] leading-[260px] tracking-wider">
                        {value}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>

                {/* 中间透明间隙 */}
                <div className="absolute top-[128px] left-0 w-full h-[4px] z-15 bg-transparent"></div>

                {/* Static Lower Half - shows previous value bottom */}
                <div className="absolute bottom-0 left-0 w-full h-[128px] overflow-hidden z-10 rounded-b-2xl" style={{ ...bgStyle, filter: 'brightness(0.85)' }}>
                    <div className="absolute w-full h-[260px] bottom-0 flex items-center justify-center text-[180px] font-mono font-bold text-[#e5e5e5] leading-[260px] tracking-wider">
                        {prevValue}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>

                {/* Flipping Upper Half */}
                {isFlipping && (
                    <div className="flip-upper absolute top-0 left-0 w-full h-[128px] overflow-hidden origin-bottom z-30 rounded-t-2xl"
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', ...bgStyle }}>
                        <div className="absolute inset-0" style={bgStyle}></div>
                        <div className="absolute w-full h-[260px] top-0 flex items-center justify-center text-[180px] font-mono font-bold text-[#e5e5e5] leading-[260px] tracking-wider z-10">
                            {prevValue}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20"></div>
                        <div className="flip-shadow absolute inset-0 bg-black pointer-events-none z-30"></div>
                    </div>
                )}

                {/* Flipping Lower Half */}
                {isFlipping && (
                    <div className="flip-lower absolute bottom-0 left-0 w-full h-[128px] overflow-hidden origin-top z-40 rounded-b-2xl"
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
                        <div className="absolute inset-0" style={{ ...bgStyle, filter: 'brightness(0.85)' }}></div>
                        <div className="absolute w-full h-[260px] bottom-0 flex items-center justify-center text-[180px] font-mono font-bold text-[#e5e5e5] leading-[260px] tracking-wider z-10">
                            {value}
                        </div>
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
                .flip-unit-container {
                    perspective: 2500px;
                }

                .flip-upper {
                    animation: flipDown 0.7s cubic-bezier(0.4, 0.0, 0.6, 1.0) forwards;
                    transform-origin: center bottom;
                }

                .flip-lower {
                    animation: flipUp 0.7s cubic-bezier(0.4, 0.0, 0.6, 1.0) forwards;
                    transform-origin: center top;
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
                    animation: shadowTop 0.7s cubic-bezier(0.4, 0.0, 0.6, 1.0) forwards;
                }

                .flip-lower .flip-shadow {
                    animation: shadowBottom 0.7s cubic-bezier(0.4, 0.0, 0.6, 1.0) forwards;
                }

                @keyframes shadowTop {
                    0% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.6;
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
                        opacity: 0.6;
                    }
                    100% {
                        opacity: 0;
                    }
                }
            `}</style>
            <div className={`flex items-center justify-center gap-8 sm:gap-10 origin-center transition-all duration-500 ${showSeconds ? 'scale-75 sm:scale-90' : 'scale-100 sm:scale-125'}`}>
                {/* Hours */}
                <FlipUnit value={hours} cardColor={cardColor} cardOpacity={cardOpacity} />

                {/* Minutes */}
                <FlipUnit value={minutes} cardColor={cardColor} cardOpacity={cardOpacity} />

                {/* Seconds */}
                {showSeconds && (
                    <FlipUnit value={seconds} cardColor={cardColor} cardOpacity={cardOpacity} />
                )}
            </div>
        </>
    );
};

export default FlipClock;
