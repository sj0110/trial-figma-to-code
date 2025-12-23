// File Path Comment: src/components/ChatbotTour.tsx
// CRITICAL: Ensure all imports, APIs, and syntax match React 19, TypeScript 5.6+, and Tailwind 3.4+

import React, { useState, useMemo } from 'react';

// --- Utility Functions ---
const hexToRgb = (hex: string, alpha?: number): string => {
  let r = 0, g = 0, b = 0;
  if (!hex || typeof hex !== 'string') return `rgba(0, 0, 0, ${alpha !== undefined ? alpha : 1})`;

  // Handle 3-digit hex (e.g., #F00) and 6-digit hex (e.g., #FF0000)
  const cleanedHex = hex.startsWith('#') ? hex.slice(1) : hex;
  if (cleanedHex.length === 3) {
    r = parseInt(cleanedHex[0] + cleanedHex[0], 16);
    g = parseInt(cleanedHex[1] + cleanedHex[1], 16);
    b = parseInt(cleanedHex[2] + cleanedHex[2], 16);
  } else if (cleanedHex.length === 6) {
    r = parseInt(cleanedHex.substring(0, 2), 16);
    g = parseInt(cleanedHex.substring(2, 4), 16);
    b = parseInt(cleanedHex.substring(4, 6), 16);
  } else {
    // Fallback for invalid hex
    return `rgba(0, 0, 0, ${alpha !== undefined ? alpha : 1})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha !== undefined ? alpha : 1})`;
};

// Helper for linear gradients from Figma data
const getLinearGradient = (stops: Array<{ color: { r: number, g: number, b: number, a: number }, position: number }>, transform: number[][]): string => {
  let angle = 270; // Default to top-to-bottom

  // A pragmatic approach for common Figma gradient transformations to CSS angles
  // For [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]] (diagonal)
  // For [[0, -1, 1], [0.5, 0, 0.25]] (top to bottom based on relative transform Y increasing)
  if (transform && transform.length === 2 && transform[0].length === 3 && transform[1].length === 3) {
      const a = transform[0][0];
      const b = transform[0][1];
      const c = transform[1][0];
      const d = transform[1][1];

      // Detect common angles
      if (a === 1 && b === 0 && c === 0 && d === 1) angle = 90; // Left to right
      else if (a === -1 && b === 0 && c === 0 && d === -1) angle = 270; // Right to left
      else if (a === 0 && b === 1 && c === -1 && d === 0) angle = 180; // Bottom to top
      else if (a === 0 && b === -1 && c === 1 && d === 0) angle = 0; // Top to bottom

      // More complex diagonal handling, e.g., atan2(b, a)
      if (a !== 0 || b !== 0) {
          const calculatedAngle = Math.atan2(b, a) * (180 / Math.PI);
          angle = Math.round((calculatedAngle + 360) % 360);
      }
  }

  const gradientStops = stops.map(stop => {
    const { r, g, b, a } = stop.color;
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a}) ${Math.round(stop.position * 100)}%`;
  }).join(', ');
  return `linear-gradient(${angle}deg, ${gradientStops})`;
};

// Helper for box shadows from Figma effects
const getBoxShadow = (effects: any[]): string => {
  return effects
    .filter(effect => effect?.type === 'DROP_SHADOW' && effect.visible)
    .map(effect => {
      const { x, y } = effect.offset || { x: 0, y: 0 };
      const radius = effect.radius || 0;
      const spread = effect.spread || 0;
      const { r, g, b, a } = effect.color || { r: 0, g: 0, b: 0, a: 0 };
      return `${x}px ${y}px ${radius}px ${spread}px rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    })
    .join(', ');
};

// --- Design System Mappings ---
const colors = {
  'color-1': '#ffffff',
  'color-2': '#101828',
  'color-3': '#4a5565',
  'color-4': '#99a1af',
  'color-5': '#155dfc',
  'color-6': '#eff6ff',
  'color-7': '#6a7282',
  'color-8': '#f3f4f6',
  'color-9': '#dcfce7', // Light green for active status
  'color-10': '#008236', // Dark green for active status text
  'status-expiring-bg': '#fef3f2', // Inferred light red/orange for expiring status
  'status-expiring-text': '#c70a00', // From designData for text `2:5126` in `CurrentPlanCard` (r:0.9064575433731079, g:0, b:0.04221457988023758)
  'cignal-blue': '#004FFC', // From designData for Chatbot FAB background (r:0,g:0.31168830394744873,b:1)
  'cignal-accent': '#FFDD20', // From designData for Wallet icon color
  'cignal-pink': '#FC62D5', // From designData for Rewards icon color
};

const typography = {
  'body-text': {
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    letterSpacing: '-0.3125px',
    color: colors['color-3'],
  },
  'heading-main': {
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '30px',
    letterSpacing: '-0.44921875px',
    color: colors['color-2'],
  },
  'heading-xl': { // Used for "Cignal One" in TopBar, and "AI Chatbot Assistant" in overlay
    fontFamily: 'Inter',
    fontSize: '24px',
    fontWeight: '500',
    lineHeight: '24px',
    letterSpacing: '-0.44921875px',
    color: colors['color-2'],
  },
  'heading-2xl': { // Used for "New Release: Action Movies Marathon"
    fontFamily: 'Inter',
    fontSize: '30px',
    fontWeight: '500',
    lineHeight: '30px',
    letterSpacing: '-0.54921875px',
    color: colors['color-1'],
  },
  'text-sm-regular': { // for descriptions like "Premium TV experience" (16px, but smaller line height)
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '16px',
    letterSpacing: '-0.3125px',
    color: colors['color-7'],
  },
  'text-sm-medium': { // for small text with medium weight like "8 Episodes", "Drama"
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '16px',
    letterSpacing: '-0.3125px',
    color: colors['color-7'],
  },
  'text-base-medium': { // for "View All", "Manage", "Upgrade", "Next" etc.
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '20px', // Adjusted to common button text line-height
    letterSpacing: '-0.3125px',
    color: colors['color-5'], // Default to primary blue for links/buttons
  },
};

// Helper function for inline styles from typography
const getTypographyStyle = (type: keyof typeof typography, overrides?: React.CSSProperties): React.CSSProperties => {
  const baseStyle = typography[type];
  return {
    fontFamily: baseStyle.fontFamily,
    fontSize: baseStyle.fontSize,
    fontWeight: baseStyle.fontWeight,
    lineHeight: baseStyle.lineHeight,
    letterSpacing: baseStyle.letterSpacing,
    color: baseStyle.color,
    ...overrides,
  };
};

// --- SVG Icons (Simplified for brevity, assuming they are available or generated) ---
// Example:
interface IconProps {
  color: string;
  style?: React.CSSProperties;
}

const ChevronRightIcon: React.FC<IconProps> = ({ color, style }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M6 12L10 8L6 4" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10H21V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V10H3V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 6V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RewardsIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33331 3.33333L10 10L16.6666 3.33333" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.6666 16.6667L10 10L3.33331 16.6667" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.83203 4.99888V8.33146" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.1556 11.5641L14.5051 14.5051" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 6L1 11.1962L1 0.803848L7 6Z" fill={color}/>
  </svg>
);

const ClockIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3V6L8 7" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 16.6667V5C2.5 4.53043 2.68453 4.07828 3.01184 3.75097C3.33915 3.42366 3.7913 3.23914 4.25 3.23914H15.75C16.2087 3.23914 16.6609 3.42366 16.9882 3.75097C17.3155 4.07828 17.5 4.53043 17.5 5V16.6667C17.5 17.1253 17.3155 17.5775 16.9882 17.9048C16.6609 18.2321 16.2087 18.4167 15.75 18.4167H4.25C3.7913 18.4167 3.33915 18.2321 3.01184 17.9048C2.68453 17.5775 2.5 17.1253 2.5 16.6667Z" stroke={color} strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.49969 1.94795V5.84381" stroke={color} strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.4997 1.94795V5.84381" stroke={color} strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 9.73969H17.5" stroke={color} strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6213 3.44772 15.143 4.23724 16.4465L3 21L7.55355 19.7628C8.85705 20.5523 10.3787 21 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HomeIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 16.6667V10C7.5 9.53043 7.68453 9.07828 8.01184 8.75097C8.33915 8.42366 8.7913 8.23914 9.25 8.23914H10.75C11.2087 8.23914 11.6609 8.42366 11.9882 8.75097C12.3155 9.07828 12.5 9.53043 12.5 10V16.6667" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 10L10 3.33333L17.5 10" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SubscriptionsIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.16669 8.33333H15.8334V15.8333C15.8334 16.292 15.6489 16.7442 15.3216 17.0715C14.9943 17.3988 14.5421 17.5833 14.0834 17.5833H5.91669C5.45795 17.5833 5.00580 17.3988 4.67849 17.0715C4.35118 16.7442 4.16669 16.292 4.16669 15.8333V8.33333Z" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33331 4.16667H11.6666V8.33334H4.16669V5C4.16669 4.54131 4.35118 4.08916 4.67849 3.76185C5.00580 3.43454 5.45795 3.25 5.91669 3.25H14.0834C14.5421 3.25 14.9943 3.43454 15.3216 3.76185C15.6489 4.08916 15.8334 4.54131 15.8334 5V8.33334H11.6666" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 11.6213 3.03369 13.143 4.05359 14.4465L2.5 17.5L5.55355 16.4465C6.85705 17.4663 8.3787 17.5 10 17.5Z" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.16669 16.6667V15C4.16669 13.9189 4.60599 12.8826 5.38555 12.103C6.16511 11.3235 7.20146 10.8842 8.28257 10.8842H11.7174C12.7985 10.8842 13.8349 11.3235 14.6145 12.103C15.394 12.8826 15.8334 13.9189 15.8334 15V16.6667" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99996 9.16667C11.9329 9.16667 13.5 7.59959 13.5 5.66667C13.5 3.73375 11.9329 2.16667 9.99996 2.16667C8.06704 2.16667 6.49996 3.73375 6.49996 5.66667C6.49996 7.59959 8.06704 9.16667 9.99996 9.16667Z" stroke={color} strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InternetIssuesIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6213 3.44772 15.143 4.23724 16.4465L3 21L7.55355 19.7628C8.85705 20.5523 10.3787 21 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10C9 10.5523 9.44772 11 10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10Z" fill={color}/>
    <path d="M13 10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10C15 9.44772 14.5523 9 14 9C13.4477 9 13 9.44772 13 10Z" fill={color}/>
  </svg>
);

const NoTvSignalIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6C18 3.79086 16.2091 2 14 2H10C7.79086 2 6 3.79086 6 6V18C6 20.2091 7.79086 22 10 22H14C16.2091 22 18 20.2091 18 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 6H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ResetDeviceIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8H22V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 15L12 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15L12 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CallSupportIcon: React.FC<IconProps> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.50005 8.5C5.50005 7.94772 5.94777 7.5 6.50005 7.5H17.5C18.0523 7.5 18.5001 7.94772 18.5001 8.5V15.5C18.5001 16.0523 18.0523 16.5 17.5001 16.5H6.50005C5.94777 16.5 5.50005 16.0523 5.50005 15.5V8.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5.5V7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16.5V18.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18.5V20.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3.5V5.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2.5V3.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Helper for generic icon rendering based on name
const renderIcon = (iconName: string, color: string, style?: React.CSSProperties) => {
  switch (iconName) {
    case 'ChevronRight': return <ChevronRightIcon color={color} style={style} />;
    case 'Wallet': return <WalletIcon color={color} />;
    case 'Rewards': return <RewardsIcon color={color} />;
    case 'Play': return <PlayIcon color={color} />;
    case 'Clock': return <ClockIcon color={color} />;
    case 'Calendar': return <CalendarIcon color={color} />;
    case 'Chat': return <ChatIcon color={color} />;
    case 'Home': return <HomeIcon color={color} />;
    case 'Subscriptions': return <SubscriptionsIcon color={color} />;
    case 'Help': return <HelpIcon color={color} />;
    case 'Profile': return <ProfileIcon color={color} />;
    case 'InternetIssues': return <InternetIssuesIcon color={color} />;
    case 'NoTvSignal': return <NoTvSignalIcon color={color} />;
    case 'ResetDevice': return <ResetDeviceIcon color={color} />;
    case 'CallSupport': return <CallSupportIcon color={color} />;
    default: return null;
  }
};

// --- Sub-components for better organization ---

interface AppCardProps {
  gradient?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  customBorder?: string;
  customBorderWidth?: string;
  customPadding?: string;
  customTextMarginTop?: string;
}

const AppCard: React.FC<AppCardProps> = ({ gradient, icon, title, description, customBorder, customBorderWidth, customPadding, customTextMarginTop }) => (
  <div className="flex flex-col items-center flex-shrink-0 w-[128px] rounded-[14px]"
       style={{
         boxShadow: customBorder ? 'none' : getBoxShadow([
           { type: "DROP_SHADOW", visible: true, radius: 6, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, spread: -4, blendMode: "NORMAL", showShadowBehindNode: false },
           { type: "DROP_SHADOW", visible: true, radius: 15, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 10 }, spread: -3, blendMode: "NORMAL", showShadowBehindNode: false }
         ]),
         border: customBorder || 'none',
         borderWidth: customBorderWidth || '0',
         padding: customPadding || '0',
       }}
  >
    <div className="w-[128px] h-[128px] flex items-center justify-center rounded-[14px]" style={{ background: gradient || 'transparent' }}>
      {icon}
    </div>
    <h4 className={`w-full text-center ${customTextMarginTop || 'mt-2.5'}`} style={getTypographyStyle('heading-main', {fontSize: '18px', lineHeight: '20px', letterSpacing: typography['body-text'].letterSpacing, color: colors['color-2']})}>
      {title}
    </h4>
    <p className="w-full text-center" style={getTypographyStyle('text-sm-regular', {fontSize: '16px', lineHeight: '16px'})}>
      {description}
    </p>
  </div>
);

interface ContentCardProps {
  imageSrc: string;
  title: string;
  category: string;
  metadata: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ imageSrc, title, category, metadata }) => (
  <div className="flex flex-col flex-shrink-0 w-[192px] h-[176px] rounded-[14px] bg-color-2 overflow-hidden"
    style={{
      boxShadow: getBoxShadow([
        { type: "DROP_SHADOW", visible: true, radius: 6, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, spread: -4, blendMode: "NORMAL", showShadowBehindNode: false },
        { type: "DROP_SHADOW", visible: true, radius: 15, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 10 }, spread: -3, blendMode: "NORMAL", showShadowBehindNode: false }
      ])
    }}
  >
    <div className="relative w-full h-[112px]">
      <img src={imageSrc} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: getLinearGradient(
            [
              { color: { r: 0.211532324552536, g: 0.2550295889377594, b: 0.32470521330833435, a: 1 }, position: 0 },
              { color: { r: 0.11697349697351456, g: 0.1607542783021927, b: 0.22201550006866455, a: 1 }, position: 1 },
            ],
            [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
          )
        }}
      />
      <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
           aria-label={`Play ${title}`}
      >
        <PlayIcon color={colors['color-1']} />
      </button>
    </div>
    <div className="flex flex-col p-3 gap-1 w-full h-[64px]">
      <h4 style={getTypographyStyle('body-text', { fontSize: '16px', lineHeight: '20px', color: colors['color-1'], fontWeight: '500' })}>
        {title}
      </h4>
      <div className="flex items-center gap-1.5" style={getTypographyStyle('text-sm-medium', {fontWeight: '400', fontSize: '14px', lineHeight: '16px'})}>
        <span>{category}</span>
        <span>•</span>
        <div className="flex items-center gap-1">
          <ClockIcon color={colors['color-7']} />
          <span>{metadata}</span>
        </div>
      </div>
    </div>
  </div>
);

interface CurrentPlanCardProps {
  icon: React.ReactNode;
  title: string;
  monthlyFee: string;
  status: 'Active' | 'Expiring';
  statusBgColor: string;
  statusTextColor: string;
  details: { label: string; value: string }[];
  showPayBillButton?: boolean;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  icon,
  title,
  monthlyFee,
  status,
  statusBgColor,
  statusTextColor,
  details,
  showPayBillButton = false,
}) => (
  <div className="flex flex-col flex-shrink-0 w-[280px] h-[258px] bg-color-1 border border-color-8 rounded-2xl p-4 gap-4"
    style={{
      boxShadow: getBoxShadow([
        { type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode: false },
        { type: "DROP_SHADOW", visible: true, radius: 3, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: 0, blendMode: "NORMAL", showShadowBehindNode: false }
      ])
    }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-color-6">
          {icon}
        </div>
        <div className="flex flex-col w-[136px]">
          <h4 style={getTypographyStyle('heading-main', { fontSize: '16px', lineHeight: '24px', color: colors['color-2'] })}>
            {title}
          </h4>
          <p style={getTypographyStyle('body-text', { fontSize: '14px', lineHeight: '20px', color: colors['color-3'] })}>
            {monthlyFee}
          </p>
        </div>
      </div>
      <div className="px-2.5 py-1 rounded-full text-center" style={{ backgroundColor: statusBgColor, color: statusTextColor, ...getTypographyStyle('text-sm-medium', {fontSize: '14px'})}}>
        {status}
      </div>
    </div>

    <div className="flex flex-col gap-2.5 w-full pt-4 border-t border-color-8">
      {details.map((detail, index) => (
        <div key={index} className="flex justify-between items-center w-full">
          <span style={getTypographyStyle('body-text', { fontSize: '14px', lineHeight: '20px', color: colors['color-3'] })}>
            {detail.label}
          </span>
          <span style={getTypographyStyle('body-text', { fontSize: '14px', lineHeight: '20px', color: colors['color-2'] })}>
            {detail.value}
          </span>
        </div>
      ))}
    </div>

    <div className="flex gap-2.5 w-full">
      <button className={`flex-1 px-4 py-2.5 rounded-lg bg-color-8`} style={getTypographyStyle('text-base-medium', { color: colors['color-2'], lineHeight: '20px' })}>
        Manage
      </button>
      <button className={`flex-1 px-4 py-2.5 rounded-lg bg-color-5 text-color-1`} style={getTypographyStyle('text-base-medium', { color: colors['color-1'], lineHeight: '20px' })}>
        Upgrade
      </button>
      {showPayBillButton && (
        <button className={`flex-1 px-4 py-2.5 rounded-lg bg-color-10 text-color-1`} style={getTypographyStyle('text-base-medium', { color: colors['color-1'], lineHeight: '20px' })}>
          Pay Bill
        </button>
      )}
    </div>
  </div>
);

interface HelpDetailItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const HelpDetailItem: React.FC<HelpDetailItemProps> = ({ question, answer, isOpen, onToggle }) => (
  <div className="flex flex-col w-full bg-color-1 border border-color-8 rounded-2xl overflow-hidden"
    style={{
      boxShadow: getBoxShadow([
        { type: "DROP_SHADOW", visible: true, radius: 2, color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, spread: -1, blendMode: "NORMAL", showShadowBehindNode: false },
        { type: "DROP_SHADOW", visible: true, radius: 3, color: