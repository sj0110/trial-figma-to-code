// components/2-4-tour-diagnosis.tsx
import React, { useState, useMemo, useEffect } from 'react';

// --- Utils & Types (Adapted from existing project context for consistency) ---

// Assuming figmaColorToCss from existing context returns an rgba() string.
// Reconstructing it here for completeness based on common Figma parsing patterns.
const figmaColorToCss = (color: { r: number; g: number; b: number; a?: number }): string => {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a === undefined ? 1 : color.a;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Helper to convert Figma RGB (0-1 range) to a pure opaque hex string (e.g., #RRGGBB) for comparison.
const figmaRgbToPureHex = (color: { r: number; g: number; b: number }): string => {
  const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
};

// Utility to get the CSS color value, prioritizing exact HEX matches from the design system.
// For colors not matching a design system HEX or having transparency, it falls back to rgba().
const getCssColorValue = (figmaColor: FigmaColor | undefined, designSystemColors: Record<string, string>): string => {
  if (!figmaColor) return 'transparent';

  // Check if the RGB color (converted to pure hex) matches any of the designSystem.colors (pure opaque hex)
  const pureHexFromRgb = figmaRgbToPureHex(figmaColor);
  for (const key in designSystemColors) {
    if (designSystemColors[key].toLowerCase() === pureHexFromRgb.toLowerCase() && (figmaColor.a === undefined || figmaColor.a === 1)) {
      return designSystemColors[key]; // Return the original design system HEX value
    }
  }

  // If no match or has transparency, use rgba conversion from the inferred existing utility.
  return figmaColorToCss(figmaColor);
};

// Utility to convert Figma typography letter spacing (pixels) to CSS em unit.
const getLetterSpacingEm = (letterSpacingPx: number, fontSizePx: number): string => {
  if (fontSizePx === 0) return '0em'; // Avoid division by zero
  return `${letterSpacingPx / fontSizePx}em`;
};

// Utility to generate linear gradient CSS value from Figma's gradient object.
interface FigmaGradientStop {
  color: FigmaColor;
  position: number;
}
interface FigmaGradient {
  type: "GRADIENT_LINEAR";
  gradientStops: FigmaGradientStop[];
  gradientTransform: number[][];
}

const figmaGradientToCssValue = (gradient: FigmaGradient, designSystemColors: Record<string, string>): string => {
  const stops = gradient.gradientStops
    .map(stop => `${getCssColorValue(stop.color, designSystemColors)} ${Math.round(stop.position * 100)}%`)
    .join(', ');

  let direction = 'to bottom right'; // Default diagonal approximation

  // Specific gradient transform mappings based on common Figma export patterns
  if (JSON.stringify(gradient.gradientTransform) === JSON.stringify([[0, -1, 1], [0.5, 0, 0.25]])) {
    direction = 'to top'; // For vertical fade (e.g., overlay)
  } else if (gradient.gradientTransform[0][0] === 0.5 && gradient.gradientTransform[0][1] === 0.5) {
    // This is a common diagonal transform, angle usually around 45deg
    direction = 'to bottom right';
  } else if (gradient.gradientTransform[0][0] === 0 && gradient.gradientTransform[0][1] === -1) {
    direction = 'to top'; // Vertical gradient pointing upwards
  }

  return `linear-gradient(${direction}, ${stops})`;
};

// Function to generate CSS for box-shadow from Figma effects.
interface FigmaEffect {
  type: "DROP_SHADOW";
  radius: number;
  offset: { x: number; y: number };
  spread: number;
  color: FigmaColor;
  visible: boolean;
  blendMode: string;
  // Other effect types like INNER_SHADOW, LAYER_BLUR, BACKGROUND_BLUR are ignored as per context
}

const getBoxShadowCss = (effects: FigmaEffect[] | undefined, designSystemColors: Record<string, string>): string => {
  if (!effects || effects.length === 0) return 'none';

  const shadows = effects
    .filter(effect => effect.type === "DROP_SHADOW" && effect.visible)
    .map(effect => {
      const color = getCssColorValue(effect.color, designSystemColors);
      const x = effect.offset.x;
      const y = effect.offset.y;
      const blur = effect.radius;
      const spread = effect.spread;
      return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
    })
    .join(', ');

  return shadows || 'none';
};

// --- Component Interfaces ---
interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface TourDiagnosisScreenProps {
  // Props to control modal visibility, aligned with "Robustness" requirement
  isHelpModalOpen?: boolean;
  onCloseHelpModal?: () => void;
}

// --- Design System Constants ---
const designSystemColors: Record<string, string> = {
  "color-1": "#ffffff",
  "color-2": "#101828",
  "color-3": "#4a5565",
  "color-4": "#99a1af",
  "color-5": "#155dfc",
  "color-6": "#eff6ff",
  "color-7": "#6a7282",
  "color-8": "#f3f4f6",
  "color-9": "#dcfce7",
  "color-10": "#008236"
};

// Simplified typography mapping for Tailwind classes and inline styles
const typographyStyles = {
  // Based on Inter Regular 16/24 -0.3125px from designSystem.typography[0]
  bodyText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "24px",
    letterSpacing: getLetterSpacingEm(-0.3125, 16),
  },
  // Based on Inter Medium 20/30 -0.44921875px from designSystem.typography[1]
  heading3: {
    fontFamily: "Inter, sans-serif",
    fontSize: "20px",
    fontWeight: "500",
    lineHeight: "30px",
    letterSpacing: getLetterSpacingEm(-0.44921875, 20),
  },
  // Additional derived/inferred styles
  heading2: { // For New Release / Live Sports headers
    fontFamily: "Inter, sans-serif",
    fontSize: "30px", // Inferred from Figma values 2:6583, 2:6591
    fontWeight: "700", // Inferred as bold for headings
    lineHeight: "36px", // Inferred
    letterSpacing: getLetterSpacingEm(-0.625, 30), // Inferred
  },
  subHeading: { // For "Manage your subscriptions"
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "24px",
    letterSpacing: getLetterSpacingEm(-0.3125, 16),
  },
  smallText: { // For "Premium TV experience", "Drama", "8 Episodes" etc.
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "20px",
    letterSpacing: getLetterSpacingEm(-0.3125, 14),
  },
  smallMediumText: { // For "Active", "Expiring" badges
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "500", // Medium
    lineHeight: "16px", // tighter line height
    letterSpacing: getLetterSpacingEm(-0.3125, 16),
  },
  largeTextWhite: { // For "2,450 Points" in Wallet
    fontFamily: "Inter, sans-serif",
    fontSize: "24px",
    fontWeight: "500",
    lineHeight: "30px",
    letterSpacing: getLetterSpacingEm(-0.44921875, 24),
    color: designSystemColors["color-1"],
  },
  appCardTitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "20px",
    fontWeight: "500",
    lineHeight: "30px",
    letterSpacing: getLetterSpacingEm(-0.44921875, 20),
  },
  appCardDescription: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "24px",
    letterSpacing: getLetterSpacingEm(-0.3125, 16),
  }
};


// --- Sub-components ---

// Generic Icon component placeholder (since SVG path data is not in JSON)
interface IconProps {
  strokeColor?: FigmaColor;
  strokeWeight?: number;
  width: number;
  height: number;
  // Add position styles if needed, or assume flex layout
  className?: string;
}

const GenericIcon: React.FC<IconProps> = ({ strokeColor, strokeWeight = 1, width, height, className }) => {
  const color = useMemo(() => getCssColorValue(strokeColor, designSystemColors), [strokeColor]);
  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: strokeColor ? `${strokeWeight}px solid ${color}` : 'none',
        borderRadius: '50%', // Assuming some circular icons from context
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
      }}
      role="img"
      aria-label="Generic Icon"
    >
      {/* Placeholder for SVG content */}
      <div style={{ width: '40%', height: '40%', border: strokeColor ? `${strokeWeight}px solid ${color}` : 'none', borderRadius: '2px' }}></div>
    </div>
  );
};

interface AppCardProps {
  id: string;
  title: string;
  description: string;
  iconBgGradient: FigmaGradient;
  iconStrokeColor: FigmaColor;
}

const AppCard: React.FC<AppCardProps> = ({ title, description, iconBgGradient, iconStrokeColor }) => {
  const gradientStyle = useMemo(() => figmaGradientToCssValue(iconBgGradient, designSystemColors), [iconBgGradient]);
  const boxShadow = useMemo(() => getBoxShadowCss(
    [
      { type: "DROP_SHADOW", visible: true, radius: 6, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, spread: -4, blendMode: "NORMAL", showShadowBehindNode: false },
      { type: "DROP_SHADOW", visible: true, radius: 15, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 10 }, spread: -3, blendMode: "NORMAL", showShadowBehindNode: false }
    ],
    designSystemColors
  ), []);

  return (
    <div
      className="flex flex-col items-center flex-shrink-0 p-0"
      style={{
        width: '128px',
        height: '172px',
        gap: '8px',
      }}
      role="region"
      aria-label={`${title} App Card`}
    >
      <div
        className="flex justify-center items-center rounded-[14px]"
        style={{
          width: '128px',
          height: '128px',
          background: gradientStyle,
          boxShadow: boxShadow,
        }}
      >
        {/* Placeholder for app icon. Figma data only has vector stroke info without path. */}
        <div
          className="w-12 h-12 flex justify-center items-center"
          style={{
            border: `${3.9997081756591797}px solid ${designSystemColors['color-1']}`,
            borderRadius: '2px', // Placeholder for complex icon structure
          }}
        >
          {/* Example icon structure from 2:6214, 2:6215 - a simple rectangle with lines */}
          <div className="absolute" style={{ borderTop: `${3.9997081756591797}px solid ${designSystemColors['color-1']}`, width: '20px', top: 'calc(50% - 15px)' }}></div>
          <div className="absolute" style={{ borderLeft: `${3.9997081756591797}px solid ${designSystemColors['color-1']}`, borderRight: `${3.9997081756591797}px solid ${designSystemColors['color-1']}`, height: '30px', top: 'calc(50% - 5px)' }}></div>
        </div>
      </div>
      <p className="text-center" style={{ ...typographyStyles.appCardTitle, color: designSystemColors['color-2'] }}>
        {title}
      </p>
      <p className="text-center" style={{ ...typographyStyles.appCardDescription, color: designSystemColors['color-7'] }}>
        {description}
      </p>
    </div>
  );
};


interface ContentCardProps {
  id: string;
  title: string;
  category: string;
  details: string; // e.g., "8 Episodes" or "2h 15m"
  imagePlaceholder?: string; // Image hash from Figma
}

const ContentCard: React.FC<ContentCardProps> = ({ title, category, details, imagePlaceholder }) => {
  const boxShadow = useMemo(() => getBoxShadowCss(
    [
      { type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode: false },
      { type: "DROP_SHADOW", visible: true, radius: 3, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: 0, blendMode: "NORMAL", showShadowBehindNode: false }
    ],
    designSystemColors
  ), []);

  const gradientFill = useMemo(() => figmaGradientToCssValue({
      type: "GRADIENT_LINEAR",
      gradientStops: [
        { color: { r: 0.211532324552536, g: 0.2550295889377594, b: 0.32470521330833435, a: 1 }, position: 0 },
        { color: { r: 0.11697349697351456, g: 0.1607542783021927, b: 0.22201550006866455, a: 1 }, position: 1 }
      ],
      gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
    }, designSystemColors), []);

  return (
    <div
      className="flex flex-col flex-shrink-0 rounded-[14px] bg-white overflow-hidden"
      style={{
        width: '192px',
        height: '176px',
        boxShadow: boxShadow,
        background: designSystemColors['color-2'] // Fallback solid background
      }}
      role="article"
      aria-label={`${title} Content Card`}
    >
      <div
        className="flex-shrink-0 flex justify-center items-center w-full h-[112px] rounded-t-[14px]"
        style={{ background: gradientFill }}
      >
        {/* Placeholder for content image / icon */}
        <div
          className="rounded-full flex justify-center items-center"
          style={{ width: '48px', height: '48px', background: getCssColorValue({r:1,g:1,b:1,a:0.2}, designSystemColors) }}
        >
          {/* Simple play icon placeholder */}
          <div style={{ borderLeft: `8px solid ${designSystemColors['color-1']}`, borderTop: `5px solid transparent`, borderBottom: `5px solid transparent`, width: 0, height: 0, marginLeft: '4px' }}></div>
        </div>
      </div>
      <div className="flex flex-col p-[12px]" style={{ gap: '4px' }}>
        <p className="text-sm font-semibold" style={{ color: designSystemColors['color-1'], ...typographyStyles.smallMediumText, lineHeight: '20px' }}>
          {title}
        </p>
        <div className="flex justify-between items-center w-full">
          <p className="text-xs" style={{ color: designSystemColors['color-4'], ...typographyStyles.smallText, fontSize: '12px', lineHeight: '16px' }}>
            {category}
          </p>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <GenericIcon width={12} height={12} strokeColor={{ r: 0.6, g: 0.63, b: 0.68, a: 1 }} strokeWeight={1} className="!w-[12px] !h-[12px]" />
            <p className="text-xs" style={{ color: designSystemColors['color-4'], ...typographyStyles.smallText, fontSize: '12px', lineHeight: '16px' }}>
              {details}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


interface CurrentPlanCardProps {
  id: string;
  title: string;
  price: string;
  status: 'Active' | 'Expiring';
  channels?: string;
  speed?: string;
  validUntil: string;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ title, price, status, channels, speed, validUntil }) => {
  const boxShadow = useMemo(() => getBoxShadowCss(
    [
      { type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode: false },
      { type: "DROP_SHADOW", visible: true, radius: 3, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: 0, blendMode: "NORMAL", showShadowBehindNode: false }
    ],
    designSystemColors
  ), []);

  const statusBgColor = status === 'Active' ? designSystemColors['color-9'] : getCssColorValue({ r: 1, g: 0.929, b: 0.831, a: 1 }, designSystemColors);
  const statusTextColor = status === 'Active' ? designSystemColors['color-10'] : getCssColorValue({ r: 0.791, g: 0.207, b: 0, a: 1 }, designSystemColors);

  return (
    <div
      className="flex flex-col flex-shrink-0 p-4 rounded-2xl bg-white border border-solid"
      style={{
        width: '280px',
        height: '258px',
        gap: '16px',
        borderColor: designSystemColors['color-8'],
        boxShadow: boxShadow,
      }}
      role="article"
      aria-label={`${title} Current Plan`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start" style={{ gap: '12px' }}>
          <div
            className="flex justify-center items-center rounded-[14px] p-2"
            style={{ width: '48px', height: '48px', background: designSystemColors['color-6'] }}
          >
            {/* Placeholder icon. Complex vector structure. */}
            <div style={{ border: `${2.666219472885132}px solid ${designSystemColors['color-5']}`, width: '32px', height: '24px', borderRadius: '4px' }}></div>
          </div>
          <div className="flex flex-col" style={{ maxWidth: '136px' }}>
            <h3 className="font-medium text-lg leading-6" style={{ ...typographyStyles.heading3, fontSize: '18px', lineHeight: '24px', letterSpacing: typographyStyles.bodyText.letterSpacing, color: designSystemColors['color-2'] }}>
              {title}
            </h3>
            <p className="text-base leading-5" style={{ ...typographyStyles.bodyText, lineHeight: '20px', letterSpacing: typographyStyles.bodyText.letterSpacing, color: designSystemColors['color-3'] }}>
              {price}
            </p>
          </div>
        </div>
        <div
          className="rounded-full px-2 py-1 flex-shrink-0"
          style={{ background: statusBgColor }}
        >
          <span className="text-sm font-medium" style={{ ...typographyStyles.smallMediumText, fontSize: '14px', lineHeight: '16px', letterSpacing: typographyStyles.smallText.letterSpacing, color: statusTextColor }}>
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full border-t border-solid pt-4" style={{ borderColor: designSystemColors['color-8'], gap: '8px' }}>
        {channels && (
          <div className="flex justify-between w-full">
            <span style={{ ...typographyStyles.subHeading, color: designSystemColors['color-3'], fontSize: '16px' }}>Channels</span>
            <span style={{ ...typographyStyles.subHeading, color: designSystemColors['color-2'], fontSize: '16px' }}>{channels}</span>
          </div>
        )}
        {speed && (
          <div className="flex justify-between w-full">
            <span style={{ ...typographyStyles.subHeading, color: designSystemColors['color-3'], fontSize: '16px' }}>Speed</span>
            <span style={{ ...typographyStyles.subHeading, color: designSystemColors['color-2'], fontSize: '16px' }}>{speed}</span>
          </div>
        )}
        <div className="flex justify-between w-full">
          <span style={{ ...typographyStyles.subHeading, color: designSystemColors['color-3'], fontSize: '16px' }}>Valid Until</span>
          <span style={{ ...typographyStyles.subHeading, color: designSystemColors['color-2'], fontSize: '16px' }}>{validUntil}</span>
        </div>
      </div>

      <div className="flex justify-between w-full" style={{ gap: '8px' }}>
        <button
          className="flex-1 rounded-xl py-2 px-3 text-center"
          style={{ background: designSystemColors['color-8'], color: designSystemColors['color-2'], ...typographyStyles.bodyText, fontWeight: 500 }}
          aria-label="Manage Plan"
        >
          Manage
        </button>
        <button
          className="flex-1 rounded-xl py-2 px-3 text-center"
          style={{ background: designSystemColors['color-5'], color: designSystemColors['color-1'], ...typographyStyles.bodyText, fontWeight: 500 }}
          aria-label="Upgrade Plan"
        >
          Upgrade
        </button>
        {title.includes('Postpaid') && ( // Only show Pay Bill for Postpaid, inferred from design
          <button
            className="flex-1 rounded-xl py-2 px-3 text-center"
            style={{ background: designSystemColors['color-10'], color: designSystemColors['color-1'], ...typographyStyles.bodyText, fontWeight: 500 }}
            aria-label="Pay Bill"
          >
            Pay Bill
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
const TourDiagnosisScreen: React.FC<TourDiagnosisScreenProps> = ({ isHelpModalOpen = false, onCloseHelpModal }) => {
  const [activeCarousel, setActiveCarousel] = useState(0); // For the main image carousel

  const handleCarouselDotClick = (index: number) => {
    setActiveCarousel(index);
    // In a real implementation, you'd scroll a carousel here
  };

  const carouselImages = useMemo(() => [
    {
      id: '2:6579',
      title: 'New Release: Action Movies Marathon',
      description: 'Stream the latest blockbusters',
      imageHash: '4eda220f49efdbb1ad4b1a5c9ead0b901dc88c43', // Placeholder
      imageUrl: 'https://via.placeholder.com/376x256/111827/ffffff?text=Action+Movies'
    },
    {
      id: '2:6587',
      title: 'Live Sports: Premier League',
      description: 'Watch your favorite teams live',
      imageHash: 'f4601d3391337eed910f0c51a0cffe14718ee87a', // Placeholder
      imageUrl: 'https://via.placeholder.com/376x256/111827/ffffff?text=Premier+League'
    },
    {
      id: '2:6595',
      title: 'Breaking News Coverage',
      description: '24/7 news and updates',
      imageHash: '8a6558968e08468118b791792df41cb25d126728', // Placeholder
      imageUrl: 'https://via.placeholder.com/376x256/111827/ffffff?text=Breaking+News'
    }
  ], []);

  const currentCarouselItem = carouselImages[activeCarousel];

  const modalOverlayBackground = useMemo(() => getCssColorValue({ r: 0, g: 0, b: 0, a: 0.7 }, designSystemColors), []);

  const modalContentBoxShadow = useMemo(() => getBoxShadowCss(
    [
      { type: "DROP_SHADOW", visible: true, radius: 50, color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: 25 }, spread: -12, blendMode: "NORMAL", showShadowBehindNode: false }
    ],
    designSystemColors
  ), []);

  // For `2:6954` component, the blue circle with border.
  const blueCircleBorderColor = useMemo(() => getCssColorValue({ r: 0.08235294371843338, g: 0.364705890417099, b: 0.9882352948188782, a: 1 }, designSystemColors), []);


  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ background: designSystemColors['color-8'] }}
      role="main"
      aria-label="Cignal One Tour Diagnosis Screen"
    >
      {/* TopBar (2:6904) */}
      <div
        className="flex-shrink-0 w-full bg-white border-b border-solid flex items-center px-4 py-3 sticky top-0 z-20"
        style={{ height: '64.57px', borderColor: designSystemColors['color-8'] }}
        role="navigation"
        aria-label="Top Navigation Bar"
      >
        <div className="flex items-center flex-grow" style={{ gap: '12px' }}>
          <div
            className="flex justify-center items-center rounded-full"
            style={{ width: '40px', height: '40px', background: figmaGradientToCssValue({
              type: "GRADIENT_LINEAR",
              gradientStops: [
                { color: { r: 0.08361906558275223, g: 0.3644171357154846, b: 0.9863430261611938, a: 1 }, position: 0 },
                { color: { r: 0.3108854591846466, g: 0.22440451383590698, b: 0.9662612080574036, a: 1 }, position: 1 }
              ],
              gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
            }, designSystemColors) }}
          >
            <span style={{ ...typographyStyles.heading3, color: designSystemColors['color-1'], fontSize: '18px', lineHeight: '24px', letterSpacing: typographyStyles.bodyText.letterSpacing }}>C1</span>
          </div>
          <h1 className="font-semibold text-xl leading-8" style={{ ...typographyStyles.heading2, fontSize: '24px', fontWeight: 600, lineHeight: '30px', letterSpacing: typographyStyles.heading3.letterSpacing, color: designSystemColors['color-2'] }}>
            Cignal One
          </h1>
        </div>
        <button className="flex justify-center items-center rounded-full" style={{ width: '36px', height: '36px', border: `1.666292428970337px solid ${getCssColorValue({ r: 0.21176470816135406, g: 0.2549019753932953, b: 0.32549020648002625 }, designSystemColors)}` }} aria-label="Search">
            <span className="text-xl" style={{color: getCssColorValue({ r: 0.21176470816135406, g: 0.2549019753932953, b: 0.32549020648002625 }, designSystemColors)}}>&#x1F50D;</span>
        </button>
        <button className="ml-2 flex justify-center items-center rounded-full" style={{ width: '36px', height: '36px', border: `1.666292428970337px solid ${getCssColorValue({ r: 0.21176470816135406, g: 0.2549019753932953, b: 0.32549020648002625 }, designSystemColors)}` }} aria-label="Notifications">
            <span className="text-xl" style={{color: getCssColorValue({ r: 0.21176470816135406, g: 0.2549019753932953, b: 0.32549020648002625 }, designSystemColors)}}>&#x1F514;</span>
            <span className="absolute top-[3px] right-[3px] w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Main content scrollable area */}
      <div className="flex-grow overflow-y-auto pb-[64.55px] bg-white" role="region" aria-label="Home Screen Content">
        {/* Main Content Container (2:6198 relative transform implies Y-offset of 64.57) */}
        <div className="flex flex-col w-full" style={{ paddingTop: '64.57px' }}>

          {/* Carousel Section (Image (New Release: Action Movies Marathon)) */}
          <section className="relative w-full h-[256px] overflow-hidden mb-6" style={{ marginBottom: '24px' }}>
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${currentCarouselItem.imageUrl})` }}
              role="img"
              aria-label={currentCarouselItem.title}
            ></div>
            <div
              className="absolute inset-0 w-full h-full"
              style={{ background: figmaGradientToCssValue({
                type: "GRADIENT_LINEAR",
                gradientStops: [
                  { color: { r: 0, g: 0, b: 0, a: 0.8 }, position: 0 },
                  { color: { r: 0, g: 0, b: 0, a: 0.4 }, position: 0.5 },
                  { color: { r: 0, g: 0, b: 0, a: 0 } , position: 1 }
                ],
                gradientTransform: [[0, -1, 1], [0.5, 0, 0.25]]
              }, designSystemColors) }}
            ></div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-col" style={{ gap: '8px' }}>
              <h2 className="text-white text-3xl font-bold" style={{ ...typographyStyles.heading2, color: designSystemColors['color-1'] }}>
                {currentCarouselItem.title}
              </h2>
              <p className="text-white text-lg" style={{ ...typographyStyles.bodyText, fontSize: '20px', lineHeight: '24px', letterSpacing: typographyStyles.bodyText.letterSpacing, color: getCssColorValue({ r: 1, g: 1, b: 1, a: 0.9 }, designSystemColors) }}>
                {currentCarouselItem.description}
              </p>
            </div>
            <div className="absolute bottom-6 right-6 flex" style={{ gap: '8px' }}>
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeCarousel === index ? 'w-6 bg-white' : 'bg-white/50'}`}
                  onClick={() => handleCarouselDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </section>

          {/* Current Plans Section (2:6606) */}
          <section
            className="flex flex-col w-full bg-white pt-4 px-4"
            style={{
              paddingTop: '16px',
              borderBottom: `1px solid ${designSystemColors['color-8']}`,
              gap: '16px',
            }}
            role="region"
            aria-label="Your Current Plans"
          >
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <h2 className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                  Current Plans
                </h2>
                <p className="text-base" style={{ ...typographyStyles.bodyText, color: designSystemColors['color-3'] }}>
                  Manage your active subscriptions
                </p>
              </div>
              <div className="flex" style={{ gap: '8px' }}>
                <button className="flex justify-center items-center w-8 h-8 rounded-xl border border-solid" style={{ borderColor: designSystemColors['color-8'] }} aria-label="Previous Plan">
                  <span className="text-color-3">&#x276E;</span>
                </button>
                <button className="flex justify-center items-center w-8 h-8 rounded-xl border border-solid" style={{ borderColor: designSystemColors['color-8'] }} aria-label="Next Plan">
                  <span className="text-color-3">&#x276F;</span>
                </button>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              <CurrentPlanCard
                id="cignal-postpaid"
                title="Cignal Postpaid Premium"
                price="₱1,899/month"
                status="Active"
                channels="200+"
                validUntil="Dec 15, 2025"
              />
              <CurrentPlanCard
                id="cignal-fiber-100"
                title="Cignal Fiber 100 Mbps"
                price="₱1,699/month"
                status="Active"
                speed="100 Mbps"
                validUntil="Dec 31, 2025"
              />
              <CurrentPlanCard
                id="cignal-prepaid-basic"
                title="Cignal Prepaid Basic"
                price="₱299/month"
                status="Expiring"
                channels="30+"
                validUntil="Dec 10, 2025"
              />
              <CurrentPlanCard
                id="cignal-fiber-200"
                title="Cignal Fiber 200 Mbps"
                price="₱2,499/month"
                status="Active"
                speed="200 Mbps"
                validUntil="Mar 15, 2026"
              />
            </div>
          </section>

          {/* Your Apps Section (2:6199) */}
          <section
            className="flex flex-col w-full bg-white pt-6 pb-4 px-4"
            style={{
              paddingTop: '24px',
              paddingBottom: '16px',
              gap: '16px',
              borderBottom: `1px solid ${designSystemColors['color-8']}` // Inferred separator
            }}
            role="region"
            aria-label="Your Apps"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                  Your Apps
                </h2>
                <p className="text-base" style={{ ...typographyStyles.bodyText, color: designSystemColors['color-3'] }}>
                  Manage your subscriptions
                </p>
              </div>
              <button className="flex items-center" style={{ gap: '4px' }} aria-label="View All Apps">
                <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-5'] }}>
                  View All
                </span>
                <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-5'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
              </button>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              <AppCard
                id="cignal-postpaid"
                title="Cignal Postpaid"
                description="Premium TV experience"
                iconBgGradient={{
                  type: "GRADIENT_LINEAR",
                  gradientStops: [
                    { color: { r: 0.16933250427246094, g: 0.49804946780204773, b: 1, a: 1 }, position: 0 },
                    { color: { r: 0.08361906558275223, g: 0.3644171357154846, b: 0.9863430261611938, a: 1 }, position: 1 }
                  ],
                  gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                }}
                iconStrokeColor={designSystemColors['color-1'] as any}
              />
              <AppCard
                id="cignal-prepaid"
                title="Cignal Prepaid"
                description="Flexible TV plans"
                iconBgGradient={{
                  type: "GRADIENT_LINEAR",
                  gradientStops: [
                    { color: { r: 0.3821760416030884, g: 0.37188830971717834, b: 1, a: 1 }, position: 0 },
                    { color: { r: 0.3108854591846466, g: 0.22440451383590698, b: 0.9662612080574036, a: 1 }, position: 1 }
                  ],
                  gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                }}
                iconStrokeColor={designSystemColors['color-1'] as any}
              />
              <AppCard
                id="satlite"
                title="SatLite"
                description="Mobile streaming"
                iconBgGradient={{
                  type: "GRADIENT_LINEAR",
                  gradientStops: [
                    { color: { r: 0.6779096126556396, g: 0.27594196796417236, b: 1, a: 1 }, position: 0 },
                    { color: { r: 0.596839427947998, g: 0.061729513108730316, b: 0.981357753276825, a: 1 }, position: 1 }
                  ],
                  gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                }}
                iconStrokeColor={designSystemColors['color-1'] as any}
              />
              <AppCard
                id="pilipinas-live"
                title="Pilipinas Live"
                description="Local channels"
                iconBgGradient={{
                  type: "GRADIENT_LINEAR",
                  gradientStops: [
                    { color: { r: 0.9658054709434509, g: 0.19813881814479828, b: 0.6043243408203125, a: 1 }, position: 0 },
                    { color: { r: 0.901336133480072, g: 0, b: 0.46341004967689514, a: 1 }, position: 1 }
                  ],
                  gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                }}
                iconStrokeColor={designSystemColors['color-1'] as any}
              />
              {/* "Cignal Super" card (2:6256) - A generic card with a simple icon and text */}
              <div
                className="flex-shrink-0 flex justify-center items-center rounded-[14px] border border-solid"
                style={{
                  width: '128px',
                  height: '160px',
                  borderColor: designSystemColors['color-8'],
                  borderWidth: '1.75px',
                }}
              >
                <div className="flex flex-col items-center justify-center" style={{ gap: '8px' }}>
                  <GenericIcon width={24} height={24} strokeColor={designSystemColors['color-4'] as any} strokeWeight={2} className="!w-6 !h-6" />
                  <p className="text-sm" style={{ ...typographyStyles.smallText, color: designSystemColors['color-3'] }}>Cignal Super</p>
                </div>
              </div>
            </div>
          </section>

          {/* Wallet Preview Section (2:6262) */}
          <section
            className="flex flex-col w-full py-6 px-4"
            style={{
              gap: '16px',
              background: figmaGradientToCssValue({
                type: "GRADIENT_LINEAR",
                gradientStops: [
                  { color: { r: 0.08361906558275223, g: 0.3644171357154846, b: 0.9863430261611938, a: 1 }, position: 0 },
                  { color: { r: 0.3108854591846466, g: 0.22440451383590698, b: 0.9662612080574036, a: 1 }, position: 1 }
                ],
                gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
              }, designSystemColors)
            }}
            role="region"
            aria-label="My Wallet and Rewards"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div
                  className="flex justify-center items-center rounded-full"
                  style={{ width: '48px', height: '48px', background: getCssColorValue({r:1,g:1,b:1,a:0.2}, designSystemColors) }}
                >
                  <GenericIcon width={24} height={24} strokeColor={designSystemColors['color-1'] as any} strokeWeight={2} className="!w-6 !h-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base text-white/90" style={{ ...typographyStyles.bodyText, color: getCssColorValue({ r: 1, g: 0.999947190284729, b: 0.9999300241470337, a: 0.9 }, designSystemColors) }}>
                    My Wallet
                  </p>
                  <h3 className="text-xl font-medium text-white" style={{ ...typographyStyles.largeTextWhite }}>
                    2,450 Points
                  </h3>
                </div>
              </div>
              <button
                className="rounded-xl py-2 px-4 flex items-center justify-center"
                style={{ background: getCssColorValue({r:1,g:1,b:1,a:0.2}, designSystemColors), gap: '4px' }}
                aria-label="View Wallet"
              >
                <span className="text-base font-medium text-white" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-1'] }}>
                  View Wallet
                </span>
                <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-1'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center" style={{ gap: '8px' }}>
              <div
                className="flex-1 rounded-xl p-4 flex flex-col"
                style={{
                  background: getCssColorValue({r:1,g:1,b:1,a:0.1}, designSystemColors),
                  height: '104px',
                  gap: '4px'
                }}
                role="article"
                aria-label="Available Points"
              >
                <div className="flex items-center justify-start" style={{ gap: '8px' }}>
                  <GenericIcon width={20} height={20} strokeColor={getCssColorValue({ r: 1, g: 0.874, b: 0.125, a: 1 }, designSystemColors) as any} strokeWeight={1.66} className="!w-5 !h-5" />
                  <p className="text-base text-white/90" style={{ ...typographyStyles.bodyText, color: getCssColorValue({ r: 1, g: 0.999947190284729, b: 0.9999300241470337, a: 0.9 }, designSystemColors) }}>
                    Available
                  </p>
                </div>
                <h3 className="text-xl font-medium text-white" style={{ ...typographyStyles.largeTextWhite, fontSize: '20px', lineHeight: '24px' }}>
                  2,450 pts
                </h3>
              </div>
              <div
                className="flex-1 rounded-xl p-4 flex flex-col"
                style={{
                  background: getCssColorValue({r:1,g:1,b:1,a:0.1}, designSystemColors),
                  height: '104px',
                  gap: '4px'
                }}
                role="article"
                aria-label="Rewards"
              >
                <div className="flex items-center justify-start" style={{ gap: '8px' }}>
                  <GenericIcon width={20} height={20} strokeColor={getCssColorValue({ r: 0.992, g: 0.647, b: 0.835, a: 1 }, designSystemColors) as any} strokeWeight={1.66} className="!w-5 !h-5" />
                  <p className="text-base text-white/90" style={{ ...typographyStyles.bodyText, color: getCssColorValue({ r: 1, g: 0.999947190284729, b: 0.9999300241470337, a: 0.9 }, designSystemColors) }}>
                    Rewards
                  </p>
                </div>
                <h3 className="text-xl font-medium text-white" style={{ ...typographyStyles.largeTextWhite, fontSize: '20px', lineHeight: '24px' }}>
                  15 Available
                </h3>
              </div>
            </div>
          </section>

          {/* Entertainment Content Carousel (2:6301) */}
          <section
            className="flex flex-col w-full bg-white pt-6 pb-4 px-4"
            style={{
              paddingTop: '24px',
              paddingBottom: '16px',
              gap: '16px',
              borderBottom: `1px solid ${designSystemColors['color-8']}` // Inferred separator
            }}
            role="region"
            aria-label="Entertainment Shows"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                  Entertainment
                </h2>
                <p className="text-base" style={{ ...typographyStyles.bodyText, color: designSystemColors['color-3'] }}>
                  Popular shows and series
                </p>
              </div>
              <button className="flex items-center" style={{ gap: '4px' }} aria-label="See All Entertainment">
                <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-5'] }}>
                  See All
                </span>
                <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-5'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
              </button>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              <ContentCard title="The Latest Drama Series" category="Drama" details="8 Episodes" />
              <ContentCard title="Comedy Night Special" category="Comedy" details="2h 15m" />
              <ContentCard title="Documentary: Nature" category="Documentary" details="1h 45m" />
              <ContentCard title="Cooking Masterclass" category="Lifestyle" details="12 Episodes" />
            </div>
          </section>

          {/* Movies Content Carousel (2:6393) - Similar to Entertainment */}
          <section
            className="flex flex-col w-full bg-white pt-6 pb-4 px-4"
            style={{
              paddingTop: '24px',
              paddingBottom: '16px',
              gap: '16px',
              borderBottom: `1px solid ${designSystemColors['color-8']}` // Inferred separator
            }}
            role="region"
            aria-label="Movie Titles"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                  Movies
                </h2>
                <p className="text-base" style={{ ...typographyStyles.bodyText, color: designSystemColors['color-3'] }}>
                  Blockbusters and classics
                </p>
              </div>
              <button className="flex items-center" style={{ gap: '4px' }} aria-label="See All Movies">
                <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-5'] }}>
                  See All
                </span>
                <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-5'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
              </button>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              <ContentCard title="Action Thriller 2024" category="Action" details="2h 30m" />
              <ContentCard title="Romantic Comedy" category="Romance" details="1h 55m" />
              <ContentCard title="Sci-Fi Adventure" category="Sci-Fi" details="2h 45m" />
              <ContentCard title="Horror Mystery" category="Horror" details="1h 40m" />
            </div>
          </section>

          {/* Sports & Live Events Carousel (2:6485) - Similar to Entertainment */}
          <section
            className="flex flex-col w-full bg-white pt-6 pb-4 px-4"
            style={{
              paddingTop: '24px',
              paddingBottom: '16px',
              gap: '16px',
              borderBottom: `1px solid ${designSystemColors['color-8']}` // Inferred separator
            }}
            role="region"
            aria-label="Sports & Live Events"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                  Sports & Live Events
                </h2>
                <p className="text-base" style={{ ...typographyStyles.bodyText, color: designSystemColors['color-3'] }}>
                  Watch your favorite sports
                </p>
              </div>
              <button className="flex items-center" style={{ gap: '4px' }} aria-label="See All Sports & Live Events">
                <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-5'] }}>
                  See All
                </span>
                <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-5'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
              </button>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              <ContentCard title="NBA Finals Game 7" category="Basketball" details="Live" />
              <ContentCard title="Premier League Match" category="Football" details="Today 8PM" />
              <ContentCard title="Tennis Grand Slam" category="Tennis" details="Live Now" />
              <ContentCard title="UFC Fight Night" category="MMA" details="This Weekend" />
            </div>
          </section>

          {/* Help Section (2:6787) */}
          <section
            className="flex flex-col w-full bg-white pt-6 pb-8 px-4"
            style={{ paddingTop: '24px', paddingBottom: '32px', gap: '16px' }}
            role="region"
            aria-label="Help and Support"
          >
            <div className="flex items-center" style={{ gap: '8px' }}>
              <GenericIcon width={24} height={24} strokeColor={designSystemColors['color-2'] as any} strokeWeight={2} className="!w-6 !h-6" />
              <h2 className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                Help & Support
              </h2>
            </div>

            <div className="flex w-full border-b border-solid" style={{ borderColor: designSystemColors['color-8'] }}>
              <button
                className="flex-1 py-3 text-center border-b-2 border-solid"
                style={{
                  color: designSystemColors['color-5'],
                  borderColor: designSystemColors['color-5'],
                  ...typographyStyles.heading3,
                  fontSize: '18px',
                  lineHeight: '24px',
                  letterSpacing: typographyStyles.bodyText.letterSpacing,
                  fontWeight: 500
                }}
                aria-selected="true"
                role="tab"
              >
                FAQs
              </button>
              <button
                className="flex-1 py-3 text-center border-b-2 border-solid"
                style={{
                  color: designSystemColors['color-3'],
                  borderColor: 'transparent', // Inactive tab
                  ...typographyStyles.heading3,
                  fontSize: '18px',
                  lineHeight: '24px',
                  letterSpacing: typographyStyles.bodyText.letterSpacing,
                  fontWeight: 500
                }}
                aria-selected="false"
                role="tab"
              >
                Diagnostics
              </button>
            </div>

            <div className="flex flex-col w-full" style={{ gap: '12px' }}>
              {/* Accordion Item 1 */}
              <div
                className="rounded-xl border border-solid overflow-hidden"
                style={{ borderColor: designSystemColors['color-8'], boxShadow: getBoxShadowCss([{ type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode: false }], designSystemColors) }}
              >
                <button className="flex justify-between items-center w-full p-4" aria-expanded="false" aria-controls="faq-content-1">
                  <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-2'] }}>
                    How do I upgrade my subscription?
                  </span>
                  <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-4'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
                </button>
                {/* Content could be toggled here */}
              </div>

              {/* Accordion Item 2 */}
              <div
                className="rounded-xl border border-solid overflow-hidden"
                style={{ borderColor: designSystemColors['color-8'], boxShadow: getBoxShadowCss([{ type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode": false }], designSystemColors) }}
              >
                <button className="flex justify-between items-center w-full p-4" aria-expanded="false" aria-controls="faq-content-2">
                  <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-2'] }}>
                    What payment methods are accepted?
                  </span>
                  <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-4'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
                </button>
                {/* Content could be toggled here */}
              </div>

              {/* Accordion Item 3 */}
              <div
                className="rounded-xl border border-solid overflow-hidden"
                style={{ borderColor: designSystemColors['color-8'], boxShadow: getBoxShadowCss([{ type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode": false }], designSystemColors) }}
              >
                <button className="flex justify-between items-center w-full p-4" aria-expanded="false" aria-controls="faq-content-3">
                  <span className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-2'] }}>
                    Can I pause my subscription?
                  </span>
                  <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-4'] as any} strokeWeight={1.33} className="!w-4 !h-4" />
                </button>
                {/* Content could be toggled here */}
              </div>

              <button
                className="w-full py-3 rounded-xl border border-solid"
                style={{ borderColor: designSystemColors['color-8'], color: designSystemColors['color-2'], ...typographyStyles.heading3, fontSize: '18px', lineHeight: '24px', letterSpacing: typographyStyles.bodyText.letterSpacing, fontWeight: 500 }}
                aria-label="View All FAQs"
              >
                View All FAQs
              </button>
            </div>

            {/* Still need help? Box */}
            <div
              className="rounded-xl p-4 flex flex-col"
              style={{
                background: designSystemColors['color-6'],
                border: `0.5670807361602783px solid ${getCssColorValue({ r: 0.7450929880142212, g: 0.8586637377738953, b: 1, a: 1 }, designSystemColors)}`,
                gap: '8px'
              }}
              role="complementary"
              aria-label="Contact Support Options"
            >
              <p className="text-base font-medium" style={{ ...typographyStyles.bodyText, fontWeight: 500, color: designSystemColors['color-2'] }}>
                Still need help?
              </p>
              <div className="flex" style={{ gap: '8px' }}>
                <button
                  className="flex-1 py-2 px-3 rounded-xl border border-solid"
                  style={{
                    borderColor: getCssColorValue({ r: 0.7450929880142212, g: 0.8586637377738953, b: 1, a: 1 }, designSystemColors),
                    color: getCssColorValue({ r: 0.07790771126747131, g: 0.27913519740104675, b: 0.9017744064331055, a: 1 }, designSystemColors),
                    ...typographyStyles.bodyText,
                    fontWeight: 500
                  }}
                  aria-label="Call Support"
                >
                  Call Support
                </button>
                <button
                  className="flex-1 py-2 px-3 rounded-xl"
                  style={{
                    background: designSystemColors['color-5'],
                    color: designSystemColors['color-1'],
                    ...typographyStyles.bodyText,
                    fontWeight: 500
                  }}
                  aria-label="Chat with Us"
                >
                  Chat with Us
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* BottomNav (2:6869) */}
      <div
        className="fixed bottom-0 w-full bg-white border-t border-solid flex justify-around items-center px-2 py-2 z-20"
        style={{ height: '64.55px', borderColor: designSystemColors['color-8'] }}
        role="navigation"
        aria-label="Bottom Navigation Bar"
      >
        <button className="flex flex-col items-center flex-1 py-1 px-2" style={{ gap: '4px' }} aria-label="Home">
          <GenericIcon width={20} height={20} strokeColor={designSystemColors['color-5'] as any} strokeWeight={1.66} className="!w-5 !h-5" />
          <span className="text-sm font-medium" style={{ ...typographyStyles.smallText, fontWeight: 500, color: designSystemColors['color-5'] }}>Home</span>
        </button>
        <button className="flex flex-col items-center flex-1 py-1 px-2" style={{ gap: '4px' }} aria-label="Subscriptions">
          <GenericIcon width={20} height={20} strokeColor={designSystemColors['color-3'] as any} strokeWeight={1.66} className="!w-5 !h-5" />
          <span className="text-sm" style={{ ...typographyStyles.smallText, color: designSystemColors['color-3'] }}>Subscriptions</span>
        </button>
        <button className="relative flex flex-col items-center flex-1 py-1 px-2" style={{ gap: '4px' }} aria-label="Rewards">
          <GenericIcon width={20} height={20} strokeColor={designSystemColors['color-3'] as any} strokeWeight={1.66} className="!w-5 !h-5" />
          <span className="text-sm" style={{ ...typographyStyles.smallText, color: designSystemColors['color-3'] }}>Rewards</span>
          <div className="absolute -top-1 right-5 w-2 h-2 rounded-full bg-red-500" aria-label="New Rewards Notification"></div>
        </button>
        <button className="flex flex-col items-center flex-1 py-1 px-2" style={{ gap: '4px' }} aria-label="Help">
          <GenericIcon width={20} height={20} strokeColor={designSystemColors['color-3'] as any} strokeWeight={1.66} className="!w-5 !h-5" />
          <span className="text-sm" style={{ ...typographyStyles.smallText, color: designSystemColors['color-3'] }}>Help</span>
        </button>
        <button className="flex flex-col items-center flex-1 py-1 px-2" style={{ gap: '4px' }} aria-label="Profile">
          <GenericIcon width={20} height={20} strokeColor={designSystemColors['color-3'] as any} strokeWeight={1.66} className="!w-5 !h-5" />
          <span className="text-sm" style={{ ...typographyStyles.smallText, color: designSystemColors['color-3'] }}>Profile</span>
        </button>
      </div>

      {/* ChatBot Floating Action Button (2:6926) */}
      <button
        className="fixed right-4 bottom-20 flex justify-center items-center rounded-full"
        style={{
          width: '56px',
          height: '56px',
          background: getCssColorValue({ r: 0, g: 0.31168830394744873, b: 1, a: 1 }, designSystemColors),
          boxShadow: getBoxShadowCss([
            { type: "DROP_SHADOW", visible: true, radius: 6, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, spread: -4, blendMode: "NORMAL", showShadowBehindNode: false },
            { type: "DROP_SHADOW", visible: true, radius: 15, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 10 }, spread: -3, blendMode: "NORMAL", showShadowBehindNode: false }
          ], designSystemColors)
        }}
        aria-label="Open Chatbot"
      >
        <GenericIcon width={24} height={24} strokeColor={designSystemColors['color-1'] as any} strokeWeight={2} className="!w-6 !h-6" />
      </button>

      {/* Help & Diagnosis Modal (2:6786 & 2:6929) */}
      {isHelpModalOpen && (
        <div
          className="fixed inset-0 w-full h-full flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-diagnosis-title"
        >
          {/* Modal Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ background: modalOverlayBackground }}
            onClick={onCloseHelpModal}
            aria-label="Close modal"
          ></div>

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-xl p-6 flex flex-col"
            style={{
              width: '320px',
              height: 'auto', // Adjust height based on content
              boxShadow: modalContentBoxShadow,
              gap: '24px',
              top: '-100px' // Offset to position correctly in Figma
            }}
          >
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <p className="text-sm font-medium" style={{ ...typographyStyles.smallText, fontWeight: 500, color: designSystemColors['color-5'] }}>
                Step 4 of 4
              </p>
              <h3 id="help-diagnosis-title" className="text-xl font-medium" style={{ ...typographyStyles.heading3, color: designSystemColors['color-2'] }}>
                Help & Diagnosis
              </h3>
              <p className="text-base" style={{ ...typographyStyles.bodyText, color: designSystemColors['color-3'] }}>
                Access our comprehensive help center. Run diagnostics, view FAQs, and chat with support for any issues.
              </p>
            </div>

            <div className="flex justify-between items-center" style={{ gap: '8px' }}>
              <div className="flex" style={{ gap: '10px' }}>
                <div className="w-[6px] h-[6px] rounded-full bg-gray-300"></div>
                <div className="w-[6px] h-[6px] rounded-full bg-gray-300"></div>
                <div className="w-[6px] h-[6px] rounded-full bg-gray-300"></div>
                <div className="w-6 h-[6px] rounded-full" style={{ background: designSystemColors['color-5'] }}></div>
              </div>

              <div className="flex" style={{ gap: '8px' }}>
                <button
                  className="rounded-lg py-2 px-4 flex items-center justify-center border border-solid"
                  style={{
                    borderColor: getCssColorValue({ r: 0, g: 0, b: 0, a: 0.1 }, designSystemColors),
                    color: designSystemColors['color-2'],
                    ...typographyStyles.bodyText,
                    fontWeight: 500
                  }}
                  onClick={onCloseHelpModal} // Close modal action
                  aria-label="Back"
                >
                  <GenericIcon width={16} height={16} strokeColor={designSystemColors['color-2'] as any} strokeWeight={1.33} className="mr-2 !w-4 !h-4" />
                  Back
                </button>
                <button
                  className="rounded-lg py-2 px-4 flex items-center justify-center"
                  style={{
                    background: designSystemColors['color-5'],
                    color: designSystemColors['color-1'],
                    ...typographyStyles.bodyText,
                    fontWeight: 500
                  }}
                  aria-label="Get Started"
                >
                  Get Started
                </button>
              </div>
            </div>

            <button
              className="absolute top-4 right-4 flex justify-center items-center w-5 h-5 rounded-full"
              style={{ background: getCssColorValue({r: 0.9843137264251709, g: 0.1725490242242813, b: 0.21176470816135406, a: 1}, designSystemColors) }}
              onClick={onCloseHelpModal}
              aria-label="Close modal"
            >
              <span className="text-white text-xs font-bold">X</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDiagnosisScreen;