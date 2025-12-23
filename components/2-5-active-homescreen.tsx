// src/components/HomeScreen.tsx
import React, { useState, useMemo } from 'react';

// --- Utils & Types ---

// Helper to convert Figma's R, G, B, A (0-1) to HEX or RGBA string.
// Critical: The prompt states "You MUST use the exact HEX codes provided in designData... Do NOT convert HEX to rgb(), rgba(), or hsl()."
// This utility is ONLY for cases where the color is NOT present in designSystem.colors
// AND is defined as an RGB object in the structure. It derives the HEX from RGB.
const toHex = (c: number) => `0${Math.round(c * 255).toString(16)}`.slice(-2).toUpperCase();

const figmaRgbToHex = (color: { r: number; g: number; b: number; a?: number }): string => {
  const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  if (color.a !== undefined && color.a < 1) {
    const alpha = toHex(color.a);
    return `${hex}${alpha}`; // Append alpha to hex
  }
  return hex;
};

// Extracted Design System Colors and derived colors from designData
// In a real project, these would be configured in tailwind.config.js as custom colors.
// For this output, they are defined here for direct inline usage or bracket notation with Tailwind.
const colors = {
  white: '#ffffff', // color-1
  'c-black': '#101828', // color-2
  'c-gray-700': '#4a5565', // color-3
  'c-gray-400': '#99a1af', // color-4
  'c-blue-primary': '#155dfc', // color-5
  'c-blue-light-bg': '#eff6ff', // color-6
  'c-gray-500': '#6a7282', // color-7
  'c-gray-100-bg': '#f3f4f6', // color-8
  'c-green-light-bg': '#dcfce7', // color-9
  'c-green-primary': '#008236', // color-10

  // Derived colors from RGB objects in structure, ensuring exact HEX representation:
  'c-screen-bg': figmaRgbToHex({ r: 0.9764705896377563, g: 0.9803921580314636, b: 0.9843137264251709 }), // #F9FAFC
  'c-border-gray-300': figmaRgbToHex({ r: 0.8983431458473206, g: 0.9064381718635559, b: 0.9226285219192505 }), // #D0D5DD
  'c-bill-due-red': figmaRgbToHex({ r: 0.9064575433731079, g: 0, b: 0.04221457988023758 }), // #E7000B
  'c-expiring-text': figmaRgbToHex({ r: 0.7918817400932312, g: 0.20726990699768066, b: 0 }), // #CA3500
  'c-expiring-bg': figmaRgbToHex({ r: 1, g: 0.929411768913269, b: 0.8313725590705872 }), // #FFEBD5
  'c-call-support-blue': figmaRgbToHex({ r: 0.07790771126747131, g: 0.27913519740104675, b: 0.9017744064331055 }), // #1447E5
  'c-help-section-border': figmaRgbToHex({ r: 0.7450929880142212, g: 0.8586637377738953, b: 1 }), // #B1CEFD
  'c-chatbot-bg': figmaRgbToHex({ r: 0, g: 0.31168830394744873, b: 1 }), // #004FEE
  'c-red-dot': figmaRgbToHex({ r: 0.9843137264251709, g: 0.1725490242242813, b: 0.21176470816135406 }), // #FC2C36
  'c-app-bg-light': figmaRgbToHex({ r: 0.9764705896377563, g: 0.9803921580314636, b: 0.9843137264251709 }), // #F9FAFC
};

// --- Reusable SVG Icons components ---
interface IconProps {
  className?: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

const strokeLineWidth = 3.9997081756591797; // Common stroke width for some icons

const ArrowRightIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-blue-primary'], strokeWidth = 1.3327306509017944, width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 4L10 8L6 12" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AppCardIcon1: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = strokeLineWidth, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 4H34V14H14V4Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M4 14H44V44H4V14Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </svg>
);

const AppCardIcon2: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = strokeLineWidth, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 4H34V14H14V4Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M4 14H44V44H4V14Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </svg>
);

const AppCardIcon3: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = strokeLineWidth, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 4V44H38V4H10Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M24 36H24.02" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AppCardIcon4: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = strokeLineWidth, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 4H44V44H4V4Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M16 4V44" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 24H44" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AddIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-gray-500'], strokeWidth = 1.9998540878295898, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 20V4C3 3.44772 3.44772 3 4 3H16L21 8V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WalletIcon: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = 1.9998540878295898, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 8V16C3 17.1046 3.89543 18 5 18H21C21.5523 18 22 17.5523 22 17V7C22 6.44772 21.5523 6 21 6H5C3.89543 6 3 6.89543 3 8Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8V16" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 3V6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayIcon: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = 1.9998540878295898, width = 8, height = 12 }) => (
  <svg width={width} height={height} viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1 1L7 6L1 11" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-gray-500'], strokeWidth = 0.9999270439147949, width = 12, height = 12 }) => (
  <svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 3V6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-black'], strokeWidth = 1.9478625059127808, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.99659 19.9974V3.99739C2.99659 3.44772 3.44772 3 3.99659 3H15.9966L20.9966 8V19.9974C20.9966 20.5523 20.5489 21 19.9966 21H3.99659C3.44772 21 2.99659 20.5523 2.99659 19.9974Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.85299 6.81342V12.6617C8.85299 12.8715 8.93721 13.071 9.08865 13.2225C9.24009 13.3739 9.43959 13.4582 9.64936 13.4582H11.6871V16.5568H16.5568" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6871 16.5568H11.6871" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-blue-primary'], strokeWidth = 1.9478625059127808, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11.687 19.4787V19.4787" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.94778 4.87011H21.4264" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.86957 9.73997H18.5088" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.27823 14.6086H15.109" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RefreshIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-blue-primary'], strokeWidth = 1.9478625059127808, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.96448 1.96468L20.4093 1.96468L20.4093 21.4437L2.96448 21.4437L2.96448 1.96468Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.76534 8.76495C8.76534 8.76495 10.9328 6.96342 12.0864 6.96342C13.2399 6.96342 14.5985 7.84288 15.6425 8.76495" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-blue-primary'], strokeWidth = 1.9478625059127808, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.94791 1.94788C1.94791 1.94788 19.4786 1.94788 19.4786 19.4786C19.4786 19.4786 1.94791 19.4786 1.94791 1.94788Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuestionMarkIcon: React.FC<IconProps> = ({ className = '', stroke = colors.white, strokeWidth = 1.9998540878295898, width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.00031 2.00031C2.00031 2.00031 22.0003 2.00031 22.0003 22.0003C22.0003 22.0003 2.00031 22.0003 2.00031 2.00031Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 6V10M11 14H11.01" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-blue-primary'], strokeWidth = 1.666292428970337, width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.49832 9.99775L12.4972 9.99775" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.50005 1.66589L17.5 1.66589L17.5 16.6629L2.50005 16.6629L2.50005 1.66589Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SubscriptionsIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-black'], strokeWidth = 1.666292428970337, width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.66629 4.16573L18.3329 4.16573L18.3329 15.8318L1.66629 15.8318L1.66629 4.16573Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.66629 8.33146L18.3329 8.33146" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RewardsIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-black'], strokeWidth = 1.666292428970337, width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.66629 1.66629L11.6641 1.66629L11.6641 11.6641L1.66629 11.6641L1.66629 1.66629Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.61473 8.63972L18.3243 8.63972L18.3243 18.3493L8.61473 18.3493L8.61473 8.63972Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.83202 4.99888L6.66517 4.99888" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.1556 11.5641L14.4996 11.5641" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-black'], strokeWidth = 1.9478625059127808, width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.00031 2.00031C2.00031 2.00031 22.0003 2.00031 22.0003 22.0003C22.0003 22.0003 2.00031 22.0003 2.00031 2.00031Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 6V10M11 14H11.01" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-black'], strokeWidth = 1.666292428970337, width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4.16573 12.4972L15.8318 12.4972" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66517 2.49944C6.66517 2.49944 13.3303 2.49944 13.3303 9.1646C13.3303 9.1646 6.66517 9.1646 6.66517 2.49944Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-gray-700'], strokeWidth = 1.5, width = 18, height = 18 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 7.625 7 8.5 6 9.5V11.5H18V9.5C17 8.5 16.5 7.625 16.5 6.5C16.5 4 14.5 2 12 2Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 18V21M14 18V21M12 18V21C12 21.5523 12.4477 22 13 22H11C10.4477 22 10 21.5523 10 21V18Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11.5V18.5C3 19.0523 3.44772 19.5 4 19.5H20C20.5523 19.5 21 19.0523 21 18.5V11.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon: React.FC<IconProps> = ({ className = '', stroke = colors['c-gray-700'], strokeWidth = 1.5, width = 18, height = 18 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 4.68629 8.68629 2 12 2Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 21C3 17.6863 6.68629 15 12 15C17.3137 15 21 17.6863 21 21" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


// --- Sub-components for better organization ---

interface TopBarProps {
  appName: string;
}

const TopBar: React.FC<TopBarProps> = ({ appName }) => {
  return (
    <header className="flex h-[64.57148px] w-full items-center justify-between border-b border-solid border-[--c-border-gray-300] bg-white px-4" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[--c-blue-primary] to-[--c-appcard2-gradient-end]" style={{ '--c-blue-primary': colors['c-blue-primary'], '--c-appcard2-gradient-end': colors['c-appcard2-gradient-end'] } as React.CSSProperties}>
          <span className="text-xl font-medium text-white" style={{ letterSpacing: '-0.44921875px' }}>C1</span>
        </div>
        <h1 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
          {appName}
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[--c-border-gray-300]" aria-label="Notifications" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
          <BellIcon stroke={colors['c-gray-700']} width={18} height={18} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[--c-gray-100-bg]" aria-label="User Profile" style={{ '--c-gray-100-bg': colors['c-gray-100-bg'] } as React.CSSProperties}>
          <UserIcon stroke={colors['c-gray-700']} width={18} height={18} />
        </button>
      </div>
    </header>
  );
};

interface AppCardProps {
  title: string;
  description: string;
  icon: React.FC<IconProps>;
  gradientColors: { start: string; end: string };
}

const AppCard: React.FC<AppCardProps> = ({ title, description, icon: Icon, gradientColors }) => {
  return (
    <button className="flex w-[128px] flex-shrink-0 flex-col items-center justify-start space-y-2.5">
      <div
        className="flex h-[128px] w-[128px] items-center justify-center rounded-[14px] shadow-lg"
        style={{
          background: `linear-gradient(225deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
          boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
        }}
      >
        <Icon width={48} height={48} />
      </div>
      <p className="text-base font-medium text-[--c-black] text-center" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
        {title}
      </p>
      <p className="text-sm font-normal text-[--c-gray-500] text-center" style={{ lineHeight: '16px', letterSpacing: '-0.3125px', '--c-gray-500': colors['c-gray-500'] } as React.CSSProperties}>
        {description}
      </p>
    </button>
  );
};

interface ContentCardProps {
  title: string;
  category: string;
  durationOrEpisodes: string; // e.g., "8 Episodes", "2h 15m", "Season 5"
  imageHash: string; // Figma image hash, normally this would be a URL
}

const ContentCard: React.FC<ContentCardProps> = ({ title, category, durationOrEpisodes, imageHash }) => {
  // In a real app, imageHash would be used to fetch an image URL
  const imageUrl = `https://via.placeholder.com/192x112/${imageHash.slice(0, 6)}/FFFFFF?text=${encodeURIComponent(title.split(':')[0])}`;

  return (
    <div className="flex w-[192px] flex-shrink-0 flex-col rounded-[14px] bg-[--c-black] shadow-lg" style={{ '--c-black': colors['c-black'] } as React.CSSProperties}>
      <div
        className="relative h-[112px] w-full rounded-t-[14px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          background: `linear-gradient(225deg, ${colors['c-content-card-gradient-start']} 0%, ${colors['c-content-card-gradient-end']} 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-t-[14px]" style={{ background: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)` }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <PlayIcon stroke={colors.white} width={8} height={12} className="ml-1" />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5 p-3">
        <p className="text-base font-medium text-white" style={{ lineHeight: '20px', letterSpacing: '-0.3125px' }}>
          {title}
        </p>
        <div className="flex items-center justify-between text-sm text-[--c-gray-400]" style={{ lineHeight: '16px', letterSpacing: '-0.3125px', '--c-gray-400': colors['c-gray-400'] } as React.CSSProperties}>
          <span className="font-normal">{category}</span>
          <div className="flex items-center space-x-1">
            <ClockIcon stroke={colors['c-gray-500']} width={12} height={12} />
            <span className="font-normal">{durationOrEpisodes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


interface CurrentPlanCardProps {
  planName: string;
  pricePerMonth: string;
  channelsCount?: string;
  speed?: string;
  validUntil?: string;
  billDue?: string;
  status: 'Active' | 'Expiring';
  statusColor: string; // Hex color for status text
  statusBgColor: string; // Hex color for status background
  showButtons?: boolean;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  planName,
  pricePerMonth,
  channelsCount,
  speed,
  validUntil,
  billDue,
  status,
  statusColor,
  statusBgColor,
  showButtons = true,
}) => {
  const IconComponent = planName.includes('Postpaid') || planName.includes('Fiber') ? SubscriptionsIcon : AppCardIcon3; // Heuristic for icon
  const iconStroke = colors['c-blue-primary'];

  return (
    <div className="flex w-[280px] flex-shrink-0 flex-col space-y-4 rounded-2xl border border-solid border-[--c-border-gray-300] bg-white p-4 shadow-md" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[--c-blue-light-bg]" style={{ '--c-blue-light-bg': colors['c-blue-light-bg'] } as React.CSSProperties}>
            <IconComponent stroke={iconStroke} width={32} height={32} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-[--c-black]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
              {planName}
            </h3>
            <p className="text-base font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
              {pricePerMonth}
            </p>
          </div>
        </div>
        <div className={`flex h-6 items-center justify-center rounded-full px-2 py-0.5`} style={{ backgroundColor: statusBgColor }}>
          <span className="text-sm font-normal" style={{ color: statusColor, lineHeight: '16px', letterSpacing: '-0.3125px' }}>
            {status}
          </span>
        </div>
      </div>

      { (channelsCount || speed || validUntil || billDue) && (
        <div className="flex flex-col border-t border-solid border-[--c-gray-100-bg] pt-4" style={{ '--c-gray-100-bg': colors['c-gray-100-bg'] } as React.CSSProperties}>
          {(channelsCount || speed) && (
            <div className="flex justify-between py-1">
              <p className="text-sm font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                {channelsCount ? 'Channels' : 'Speed'}
              </p>
              <p className="text-sm font-medium text-[--c-black]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                {channelsCount || speed}
              </p>
            </div>
          )}
          {validUntil && (
            <div className="flex justify-between py-1">
              <p className="text-sm font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Valid Until
              </p>
              <p className="text-sm font-medium text-[--c-black]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                {validUntil}
              </p>
            </div>
          )}
          {billDue && (
            <div className="flex justify-between py-1">
              <p className="text-sm font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Amount Due
              </p>
              <p className="text-sm font-medium text-[--c-bill-due-red]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-bill-due-red': colors['c-bill-due-red'] } as React.CSSProperties}>
                {billDue}
              </p>
            </div>
          )}
        </div>
      )}

      {showButtons && (
        <div className="flex justify-between pt-2">
          <button className="flex h-9 flex-1 items-center justify-center rounded-md bg-[--c-gray-100-bg] text-base font-medium text-[--c-black] mr-2" style={{ '--c-gray-100-bg': colors['c-gray-100-bg'], '--c-black': colors['c-black'] } as React.CSSProperties}>
            Manage
          </button>
          <button className="flex h-9 flex-1 items-center justify-center rounded-md bg-[--c-blue-primary] text-base font-medium text-white mr-2" style={{ '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
            Upgrade
          </button>
          {billDue && (
            <button className="flex h-9 flex-1 items-center justify-center rounded-md bg-[--c-green-primary] text-base font-medium text-white" style={{ '--c-green-primary': colors['c-green-primary'] } as React.CSSProperties}>
              Pay Bill
            </button>
          )}
        </div>
      )}
    </div>
  );
};


interface HelpItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const HelpItem: React.FC<HelpItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="flex flex-col rounded-[13.636px] border border-solid border-[--c-border-gray-300] bg-white" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
      <button onClick={onToggle} className="flex items-center justify-between p-4 text-left" aria-expanded={isOpen}>
        <p className="text-base font-normal text-[--c-black]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
          {question}
        </p>
        <ArrowRightIcon className={`transform transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} stroke={colors['c-gray-500']} width={16} height={16} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-sm font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};


interface BottomNavItemProps {
  label: string;
  icon: React.FC<IconProps>;
  isActive: boolean;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ label, icon: Icon, isActive }) => {
  const textColor = isActive ? colors['c-blue-primary'] : colors['c-gray-700'];
  const iconStroke = isActive ? colors['c-blue-primary'] : colors['c-black'];

  return (
    <button className="flex flex-1 flex-col items-center justify-center p-2" aria-current={isActive ? 'page' : undefined}>
      <Icon stroke={iconStroke} width={20} height={20} />
      <span className="text-xs font-normal" style={{ color: textColor, lineHeight: '16px', letterSpacing: '-0.3125px' }}>
        {label}
      </span>
    </button>
  );
};


interface HomeScreenProps {
  appName: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ appName }) => {
  const [openHelpItem, setOpenHelpItem] = useState<number | null>(null);

  const toggleHelpItem = (index: number) => {
    setOpenHelpItem(openHelpItem === index ? null : index);
  };

  const appCards = useMemo(() => [
    {
      title: 'Cignal Postpaid',
      description: 'Premium TV experience',
      icon: AppCardIcon1,
      gradientColors: { start: colors['c-appcard1-gradient-start'], end: colors['c-appcard1-gradient-end'] },
    },
    {
      title: 'Cignal Prepaid',
      description: 'Flexible TV plans',
      icon: AppCardIcon2,
      gradientColors: { start: colors['c-appcard2-gradient-start'], end: colors['c-appcard2-gradient-end'] },
    },
    {
      title: 'SatLite',
      description: 'Mobile streaming',
      icon: AppCardIcon3,
      gradientColors: { start: colors['c-appcard3-gradient-start'], end: colors['c-appcard3-gradient-end'] },
    },
    {
      title: 'Pilipinas Live',
      description: 'Local channels',
      icon: AppCardIcon4,
      gradientColors: { start: colors['c-appcard4-gradient-start'], end: colors['c-appcard4-gradient-end'] },
    },
  ], []);

  const contentCardsEntertainment = useMemo(() => [
    {
      title: 'The Latest Drama Series',
      category: 'Drama',
      durationOrEpisodes: '8 Episodes',
      imageHash: '4eda220f49efdbb1', // Placeholder hash
    },
    {
      title: 'Comedy Night Special',
      category: 'Comedy',
      durationOrEpisodes: '2h 15m',
      imageHash: 'f4601d3391337e', // Placeholder hash
    },
    {
      title: 'Documentary: Nature',
      category: 'Documentary',
      durationOrEpisodes: '1h 45m',
      imageHash: '8a6558968e08468', // Placeholder hash
    },
    {
      title: 'Cooking Masterclass',
      category: 'Lifestyle',
      durationOrEpisodes: '12 Episodes',
      imageHash: 'a1b2c3d4e5f6g7h8', // Placeholder hash
    },
  ], []);

  const contentCardsMovies = useMemo(() => [
    {
      title: 'Action Thriller 2024',
      category: 'Action',
      durationOrEpisodes: '2h 30m',
      imageHash: '4eda220f49efdbb1',
    },
    {
      title: 'Romantic Comedy',
      category: 'Romance',
      durationOrEpisodes: '1h 55m',
      imageHash: 'f4601d3391337e',
    },
    {
      title: 'Sci-Fi Adventure',
      category: 'Sci-Fi',
      durationOrEpisodes: '2h 45m',
      imageHash: '8a6558968e08468',
    },
    {
      title: 'Horror Mystery',
      category: 'Horror',
      durationOrEpisodes: '1h 40m',
      imageHash: 'a1b2c3d4e5f6g7h8',
    },
  ], []);

  const contentCardsSports = useMemo(() => [
    {
      title: 'NBA Finals Game 7',
      category: 'Basketball',
      durationOrEpisodes: 'Live',
      imageHash: '4eda220f49efdbb1',
    },
    {
      title: 'Premier League Match',
      category: 'Football',
      durationOrEpisodes: 'Today 8PM',
      imageHash: 'f4601d3391337e',
    },
    {
      title: 'Tennis Grand Slam',
      category: 'Tennis',
      durationOrEpisodes: 'Live Now',
      imageHash: '8a6558968e08468',
    },
    {
      title: 'Boxing Championship',
      category: 'Boxing',
      durationOrEpisodes: 'This Weekend',
      imageHash: 'a1b2c3d4e5f6g7h8',
    },
  ], []);


  const currentPlans = useMemo(() => [
    {
      planName: 'Cignal Postpaid Premium',
      pricePerMonth: '₱1,899/month',
      channelsCount: '200+',
      billDue: 'Dec 15, 2025',
      status: 'Active' as const,
      statusColor: colors['c-green-primary'],
      statusBgColor: colors['c-green-light-bg'],
    },
    {
      planName: 'Cignal Fiber 100 Mbps',
      pricePerMonth: '₱1,699/month',
      speed: '100 Mbps',
      validUntil: 'Dec 31, 2025',
      status: 'Active' as const,
      statusColor: colors['c-green-primary'],
      statusBgColor: colors['c-green-light-bg'],
    },
    {
      planName: 'Cignal Play Unlimited',
      pricePerMonth: '₱399/month',
      channelsCount: '50+',
      validUntil: 'Jan 5, 2026',
      status: 'Active' as const,
      statusColor: colors['c-green-primary'],
      statusBgColor: colors['c-green-light-bg'],
    },
    {
      planName: 'Cignal Prepaid Basic',
      pricePerMonth: '₱299/month',
      channelsCount: '30+',
      validUntil: 'Dec 10, 2025',
      status: 'Expiring' as const,
      statusColor: colors['c-expiring-text'],
      statusBgColor: colors['c-expiring-bg'],
    },
    {
      planName: 'Cignal Fiber 200 Mbps',
      pricePerMonth: '₱2,499/month',
      speed: '200 Mbps',
      validUntil: 'Mar 15, 2026',
      status: 'Active' as const,
      statusColor: colors['c-green-primary'],
      statusBgColor: colors['c-green-light-bg'],
    },
  ], []);

  const helpItems = useMemo(() => [
    {
      question: 'How do I upgrade my subscription?',
      answer:
        'Go to your Current Plans section, select the plan you wish to upgrade, and follow the on-screen instructions.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept credit cards, debit cards, GCash, PayMay, and bank transfers.',
    },
    {
      question: 'Can I pause my subscription?',
      answer:
        'Yes, you can pause prepaid subscriptions. For postpaid, you may contact support for options.',
    },
  ], []);

  return (
    <div className="relative flex h-full min-h-screen w-full max-w-[376px] flex-col overflow-x-hidden bg-[--c-app-bg-light] font-inter" style={{ '--c-app-bg-light': colors['c-app-bg-light'] } as React.CSSProperties}>
      <TopBar appName={appName} />

      <main className="flex-1 overflow-y-auto pb-[64.55329132080078px]"> {/* Padding for bottom nav */}
        {/* HeroCarousel (2:3562) */}
        <div className="relative h-[256px] w-full overflow-hidden bg-[--c-black] mb-4" style={{ '--c-black': colors['c-black'] } as React.CSSProperties}>
          <img
            src="https://via.placeholder.com/376x256/101828/FFFFFF?text=Action+Movies+Marathon" // Placeholder image as per image hash
            alt="New Release: Action Movies Marathon"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)`,
            }}
          ></div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col space-y-2">
            <h2 className="text-xl font-medium text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px' }}>
              New Release: Action Movies Marathon
            </h2>
            <p className="text-base font-normal text-white/90" style={{ lineHeight: '24px', letterSpacing: '-0.3125px' }}>
              Stream the latest blockbusters
            </p>
          </div>
          {/* Pagination dots (2:3587) */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <div className="h-2 w-6 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white/50"></div>
            <div className="h-2 w-2 rounded-full bg-white/50"></div>
          </div>
        </div>

        {/* CurrentPlansSection (2:3591) */}
        <section className="bg-white py-4 mb-4">
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                Current Plans
              </h2>
              <p className="text-base font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Manage your active subscriptions
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--c-border-gray-300]" aria-label="Previous Plan" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
                <ArrowRightIcon className="rotate-180" stroke={colors['c-gray-700']} width={16} height={16} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--c-border-gray-300]" aria-label="Next Plan" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
                <ArrowRightIcon stroke={colors['c-gray-700']} width={16} height={16} />
              </button>
            </div>
          </div>
          <div className="flex overflow-x-auto px-4 pb-4 space-x-4 scrollbar-hide">
            {currentPlans.map((plan, index) => (
              <CurrentPlanCard key={index} {...plan} />
            ))}
          </div>
        </section>

        {/* AppsSection (2:3184) */}
        <section className="bg-white py-4 mb-4">
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                Your Apps
              </h2>
              <p className="text-base font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Manage your subscriptions
              </p>
            </div>
            <button className="flex items-center text-base font-normal text-[--c-blue-primary]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
              View All <ArrowRightIcon className="ml-1" stroke={colors['c-blue-primary']} width={16} height={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 pb-4 space-x-4 scrollbar-hide">
            {appCards.map((card, index) => (
              <AppCard key={index} {...card} />
            ))}
            <button className="flex w-[128px] flex-shrink-0 flex-col items-center justify-center rounded-[14px] border border-dashed border-[--c-border-gray-300] p-4 text-[--c-gray-500]" style={{ '--c-border-gray-300': colors['c-border-gray-300'], '--c-gray-500': colors['c-gray-500'] } as React.CSSProperties}>
              <AddIcon stroke={colors['c-gray-500']} width={24} height={24} />
              <span className="text-base font-normal mt-2" style={{ lineHeight: '16px', letterSpacing: '-0.3125px' }}>
                Add App
              </span>
            </button>
          </div>
        </section>

        {/* WalletPreview (2:3247) */}
        <section
          className="flex flex-col justify-between py-6 px-4 space-y-4 mb-4"
          style={{
            background: `linear-gradient(225deg, ${colors['c-wallet-gradient-start']} 0%, ${colors['c-wallet-gradient-end']} 100%)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <WalletIcon stroke={colors.white} width={24} height={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-base font-normal text-white/90" style={{ lineHeight: '20px', letterSpacing: '-0.3125px' }}>
                  My Wallet
                </p>
                <h2 className="text-xl font-medium text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px' }}>
                  2,450 Points
                </h2>
              </div>
            </div>
            <button className="flex h-10 items-center justify-center rounded-md bg-white/20 px-4 text-base font-medium text-white" style={{ lineHeight: '24px', letterSpacing: '-0.3125px' }}>
              View Wallet <ArrowRightIcon stroke={colors.white} className="ml-1" width={16} height={16} />
            </button>
          </div>
          <div className="flex justify-between space-x-4">
            <div className="flex flex-1 flex-col rounded-[14px] bg-white/10 p-4">
              <div className="flex items-center space-x-2">
                <RewardsIcon stroke={figmaRgbToHex({ r: 1, g: 0.8745098114013672, b: 0.125490203499794, a: 1 })} width={20} height={20} /> {/* Yellow Star icon */}
                <p className="text-base font-normal text-white/90" style={{ lineHeight: '20px', letterSpacing: '-0.3125px' }}>
                  Available
                </p>
              </div>
              <h3 className="text-xl font-medium text-white mt-2" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px' }}>
                2,450 pts
              </h3>
            </div>
            <div className="flex flex-1 flex-col rounded-[14px] bg-white/10 p-4">
              <div className="flex items-center space-x-2">
                <RewardsIcon stroke={figmaRgbToHex({ r: 0.9921568632125854, g: 0.6470588445663452, b: 0.8352941274642944, a: 1 })} width={20} height={20} /> {/* Pink gift icon */}
                <p className="text-base font-normal text-white/90" style={{ lineHeight: '20px', letterSpacing: '-0.3125px' }}>
                  Rewards
                </p>
              </div>
              <h3 className="text-xl font-medium text-white mt-2" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px' }}>
                15 Available
              </h3>
            </div>
          </div>
        </section>

        {/* Entertainment Carousel (2:3286) */}
        <section className="bg-white py-4 mb-4">
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                Entertainment
              </h2>
              <p className="text-base font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Popular shows and series
              </p>
            </div>
            <button className="flex items-center text-base font-normal text-[--c-blue-primary]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
              See All <ArrowRightIcon className="ml-1" stroke={colors['c-blue-primary']} width={16} height={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 pb-4 space-x-4 scrollbar-hide">
            {contentCardsEntertainment.map((card, index) => (
              <ContentCard key={index} {...card} />
            ))}
          </div>
        </section>

        {/* Movies Carousel (2:3378) */}
        <section className="bg-white py-4 mb-4">
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                Movies
              </h2>
              <p className="text-base font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Blockbusters and classics
              </p>
            </div>
            <button className="flex items-center text-base font-normal text-[--c-blue-primary]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
              See All <ArrowRightIcon className="ml-1" stroke={colors['c-blue-primary']} width={16} height={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 pb-4 space-x-4 scrollbar-hide">
            {contentCardsMovies.map((card, index) => (
              <ContentCard key={index} {...card} />
            ))}
          </div>
        </section>

        {/* Sports & Live Events Carousel (2:3470) */}
        <section className="bg-white py-4 mb-4">
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                Sports & Live Events
              </h2>
              <p className="text-base font-normal text-[--c-gray-700]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
                Watch your favorite sports
              </p>
            </div>
            <button className="flex items-center text-base font-normal text-[--c-blue-primary]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
              See All <ArrowRightIcon className="ml-1" stroke={colors['c-blue-primary']} width={16} height={16} />
            </button>
          </div>
          <div className="flex overflow-x-auto px-4 pb-4 space-x-4 scrollbar-hide">
            {contentCardsSports.map((card, index) => (
              <ContentCard key={index} {...card} />
            ))}
          </div>
        </section>

        {/* HelpSection (2:3771) */}
        <section className="bg-[--c-app-bg-light] py-4" style={{ '--c-app-bg-light': colors['c-app-bg-light'] } as React.CSSProperties}>
          <div className="flex items-center px-4 pb-4">
            <CalendarIcon stroke={colors['c-black']} width={24} height={24} className="mr-2" />
            <h2 className="text-xl font-medium text-[--c-black]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', '--c-black': colors['c-black'] } as React.CSSProperties}>
              Help & Support
            </h2>
          </div>
          <div className="flex space-x-2 px-4 pb-4">
            <button className="flex-1 rounded-[13.636px] border-b-2 border-[--c-blue-primary] py-2 text-base font-normal text-[--c-blue-primary]" style={{ '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
              FAQs
            </button>
            <button className="flex-1 rounded-[13.636px] py-2 text-base font-normal text-[--c-gray-700]" style={{ '--c-gray-700': colors['c-gray-700'] } as React.CSSProperties}>
              Diagnostics
            </button>
          </div>
          <div className="flex flex-col space-y-3 px-4">
            <div className="flex justify-between space-x-4">
              <button className="flex flex-1 flex-col items-center justify-center rounded-[13.636px] border border-[--c-border-gray-300] bg-white p-4" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
                <SettingsIcon stroke={colors['c-blue-primary']} width={24} height={24} />
                <span className="text-sm font-normal text-[--c-black] mt-2" style={{ lineHeight: '16px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                  Internet Issues
                </span>
              </button>
              <button className="flex flex-1 flex-col items-center justify-center rounded-[13.636px] border border-[--c-border-gray-300] bg-white p-4" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
                <RefreshIcon stroke={colors['c-blue-primary']} width={24} height={24} />
                <span className="text-sm font-normal text-[--c-black] mt-2" style={{ lineHeight: '16px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                  No TV Signal
                </span>
              </button>
            </div>
            <div className="flex justify-between space-x-4">
              <button className="flex flex-1 flex-col items-center justify-center rounded-[13.636px] border border-[--c-border-gray-300] bg-white p-4" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
                <SettingsIcon stroke={colors['c-blue-primary']} width={24} height={24} />
                <span className="text-sm font-normal text-[--c-black] mt-2" style={{ lineHeight: '16px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                  Reset Device
                </span>
              </button>
              <button className="flex flex-1 flex-col items-center justify-center rounded-[13.636px] border border-[--c-border-gray-300] bg-white p-4" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
                <PhoneIcon stroke={colors['c-blue-primary']} width={24} height={24} />
                <span className="text-sm font-normal text-[--c-black] mt-2" style={{ lineHeight: '16px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
                  Call Support
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col space-y-3 px-4">
            {helpItems.map((item, index) => (
              <HelpItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openHelpItem === index}
                onToggle={() => toggleHelpItem(index)}
              />
            ))}
          </div>
          <div className="mt-4 px-4">
            <button className="flex h-12 w-full items-center justify-center rounded-[14px] border border-[--c-border-gray-300] bg-white text-base font-medium text-[--c-black]" style={{ '--c-border-gray-300': colors['c-border-gray-300'], '--c-black': colors['c-black'] } as React.CSSProperties}>
              View All FAQs
            </button>
          </div>
          <div className="mt-4 px-4 flex flex-col space-y-2 rounded-[13.636px] border border-[--c-help-section-border] bg-[--c-blue-light-bg] py-4" style={{ '--c-help-section-border': colors['c-help-section-border'], '--c-blue-light-bg': colors['c-blue-light-bg'] } as React.CSSProperties}>
            <p className="text-base font-normal text-[--c-black]" style={{ lineHeight: '20px', letterSpacing: '-0.3125px', '--c-black': colors['c-black'] } as React.CSSProperties}>
              Still need help?
            </p>
            <div className="flex space-x-2">
              <button className="flex h-9 flex-1 items-center justify-center rounded-[9.74px] border border-[--c-help-section-border] bg-white text-base font-medium text-[--c-call-support-blue]" style={{ '--c-help-section-border': colors['c-help-section-border'], '--c-call-support-blue': colors['c-call-support-blue'] } as React.CSSProperties}>
                Call Support
              </button>
              <button className="flex h-9 flex-1 items-center justify-center rounded-[9.74px] bg-[--c-blue-primary] text-base font-medium text-white" style={{ '--c-blue-primary': colors['c-blue-primary'] } as React.CSSProperties}>
                Chat with Us
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ChatBot Button */}
      <button
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{
          backgroundColor: colors['c-chatbot-bg'],
          boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
        }}
        aria-label="Open chat bot"
      >
        <QuestionMarkIcon stroke={colors.white} width={24} height={24} />
      </button>

      {/* BottomNav (2:3853) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[64.55329px] w-full items-center border-t border-solid border-[--c-border-gray-300] bg-white" style={{ '--c-border-gray-300': colors['c-border-gray-300'] } as React.CSSProperties}>
        <BottomNavItem label="Home" icon={HomeIcon} isActive={true} />
        <BottomNavItem label="Subscriptions" icon={SubscriptionsIcon} isActive={false} />
        <BottomNavItem label="Rewards" icon={RewardsIcon} isActive={false} />
        <BottomNavItem label="Help" icon={InfoIcon} isActive={false} />
        <BottomNavItem label="Profile" icon={ProfileIcon} isActive={false} />
      </nav>
    </div>
  );
};

export default HomeScreen;