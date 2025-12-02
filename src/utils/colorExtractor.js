// Tailwind 颜色映射表 (常用颜色)
const TAILWIND_COLORS = {
    // Blues
    'blue-900': '#1e3a8a',
    'blue-800': '#1e40af',
    'blue-700': '#1d4ed8',
    'blue-600': '#2563eb',
    'blue-500': '#3b82f6',
    'blue-400': '#60a5fa',
    'blue-300': '#93c5fd',

    // Slate
    'slate-900': '#0f172a',
    'slate-800': '#1e293b',
    'slate-700': '#334155',
    'slate-600': '#475569',
    'slate-500': '#64748b',
    'slate-400': '#94a3b8',
    'slate-300': '#cbd5e1',
    'slate-200': '#e2e8f0',

    // Gray
    'gray-900': '#111827',
    'gray-800': '#1f2937',
    'gray-700': '#374151',
    'gray-600': '#4b5563',
    'gray-500': '#6b7280',
    'gray-400': '#9ca3af',
    'gray-300': '#d1d5db',
    'gray-200': '#e5e7eb',

    // Red
    'red-900': '#7f1d1d',
    'red-800': '#991b1b',
    'red-700': '#b91c1c',
    'red-600': '#dc2626',
    'red-500': '#ef4444',
    'red-400': '#f87171',

    // Green
    'green-900': '#14532d',
    'green-800': '#166534',
    'green-700': '#15803d',
    'green-600': '#16a34a',
    'green-500': '#22c55e',

    // Amber
    'amber-900': '#78350f',
    'amber-800': '#92400e',
    'amber-700': '#b45309',
    'amber-600': '#d97706',

    // Purple
    'purple-900': '#581c87',
    'purple-800': '#6b21a8',
    'purple-700': '#7e22ce',

    // Pink
    'pink-900': '#831843',
    'pink-800': '#9f1239',
    'pink-700': '#be123c',

    // Emerald
    'emerald-900': '#064e3b',
    'emerald-800': '#065f46',
    'emerald-700': '#047857',
    'emerald-600': '#059669',
    'emerald-500': '#10b981',

    // Orange
    'orange-900': '#7c2d12',
    'orange-800': '#9a3412',
    'orange-700': '#c2410c',
    'orange-600': '#ea580c',

    // Black
    'black': '#000000'
};

// 从 Tailwind 类名中提取颜色
const extractColorFromClass = (className) => {
    // 匹配 from-*, via-*, to-* 等模式
    const matches = className.match(/(from|via|to)-(\[#[0-9a-fA-F]{6}\]|[\w-]+)/g);
    if (!matches) return [];

    return matches.map(match => {
        // 处理自定义颜色 [#hex]
        const customColor = match.match(/\[#([0-9a-fA-F]{6})\]/);
        if (customColor) {
            return `#${customColor[1]}`;
        }

        // 处理 Tailwind 颜色
        const tailwindColor = match.replace(/^(from|via|to)-/, '');
        return TAILWIND_COLORS[tailwindColor] || null;
    }).filter(Boolean);
};

// 将 hex 转换为 RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// 将 RGB 转换为 HSL
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

// 将 HSL 转换为 RGB
const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

// 将 RGB 转换为 hex
const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

// 优化颜色用于卡片背景
const optimizeColorForCard = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // 调整亮度和饱和度，使其适合作为卡片背景
    // 确保颜色不会太亮或太暗
    let { h, s, l } = hsl;

    // 降低饱和度，使颜色更加柔和
    s = Math.min(s * 0.6, 40);

    // 调整亮度到合适范围 (15-25%)
    l = Math.max(15, Math.min(l * 0.8, 25));

    const newRgb = hslToRgb(h, s, l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

// 从渐变类名中提取并优化主色调
export const extractDominantColor = (gradientClassName) => {
    console.log('📊 Extracting color from gradient:', gradientClassName);

    const colors = extractColorFromClass(gradientClassName);
    console.log('📊 Extracted colors:', colors);

    if (colors.length === 0) {
        console.log('📊 No colors found, using default #1c1c1e');
        return '#1c1c1e'; // 默认颜色
    }

    // 使用第一个颜色作为主色调（通常是 from- 颜色）
    const dominantColor = colors[0];
    console.log('📊 Dominant color (raw):', dominantColor);

    // 优化颜色
    const optimized = optimizeColorForCard(dominantColor);
    console.log('📊 Optimized color:', optimized);

    return optimized;
};

// 混合多个颜色（可选，用于更复杂的颜色提取）
export const mixColors = (colors, weights = null) => {
    if (!colors || colors.length === 0) return '#1c1c1e';

    if (!weights) {
        weights = colors.map(() => 1 / colors.length);
    }

    let totalR = 0, totalG = 0, totalB = 0;
    let totalWeight = 0;

    colors.forEach((color, i) => {
        const rgb = hexToRgb(color);
        if (rgb) {
            const weight = weights[i] || 0;
            totalR += rgb.r * weight;
            totalG += rgb.g * weight;
            totalB += rgb.b * weight;
            totalWeight += weight;
        }
    });

    if (totalWeight === 0) return '#1c1c1e';

    const avgR = Math.round(totalR / totalWeight);
    const avgG = Math.round(totalG / totalWeight);
    const avgB = Math.round(totalB / totalWeight);

    return rgbToHex(avgR, avgG, avgB);
};
