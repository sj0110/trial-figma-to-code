// src/components/05-2-diagnostics.tsx
import React, { useState, useMemo } from 'react';

// --- Types ---

interface DesignSystemColors {
  'color-1': string; // #101828
  'color-2': string; // #f9fafb
  'color-3': string; // #155dfc
  'color-4': string; // #ffffff
  'color-5': string; // #4a5565
}

interface TypographyStyle {
  fontFamily: { family: string; style: string };
  fontSize: number;
  fontWeight: number;
  lineHeight: { unit: 'PIXELS'; value: number };
  letterSpacing: { unit: 'PIXELS'; value: number };
}

export interface DiagnosticsScreenProps {
  colors: DesignSystemColors;
  typography: TypographyStyle[];
}

// --- Helper Components for Icons ---

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number; // Assumed square icon for simplicity
  color?: string;
  strokeWidth?: number;
}

// Back Arrow Icon (from 3:9524)
const BackArrowIcon: React.FC<SvgIconProps> = ({ size = 20.975, color = '#101828', strokeWidth = 1.7479, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.1114 5.2438L7.86756 10.4884L13.1114 15.733"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Device List Icon (from 3:9535-3:9548)
const DeviceListIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#ffffff', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Concentric squares with radiating lines, simplified to visually represent "devices" or "settings" */}
    <rect x="3.332" y="3.332" width="13.33" height="13.33" stroke={color} strokeWidth={strokeWidth} rx="1"/>
    <circle cx="9.997" cy="9.997" r="3.332" stroke={color} strokeWidth={strokeWidth} />
    <line x1="9.997" y1="1.666" x2="9.997" y2="3.332" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <line x1="16.662" y1="9.997" x2="18.33" y2="9.997" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <line x1="9.997" y1="16.662" x2="9.997" y2="18.33" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <line x1="1.666" y1="9.997" x2="3.332" y2="9.997" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </svg>
);

// STB Diagnostics Icon (from 3:9556-3:9558)
const StbDiagnosticsIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#ffffff', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* A set-top box or monitor outline with a connection point */}
    <rect x="1.666" y="2.499" width="16.662" height="11.664" stroke={color} strokeWidth={strokeWidth} rx="2"/>
    <line x1="6.665" y1="17.496" x2="13.33" y2="17.496" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <line x1="9.997" y1="14.163" x2="9.997" y2="17.496" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </svg>
);

// Speed Test Icon (from 3:9566-3:9567)
const SpeedTestIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#ffffff', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* A speedometer dial, simplified to arcs and a central pointer */}
    <path
      d="M1.666 8.331C1.666 4.678 4.678 1.666 8.331 1.666C11.984 1.666 14.996 4.678 14.996 8.331"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.33 8.331C18.33 11.984 15.318 14.996 11.665 14.996C8.012 14.996 5.000 11.984 5.000 8.331"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.997 8.331L13.33 8.331" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <circle cx="9.997" cy="8.331" r="1.666" fill={color}/>
  </svg>
);

// Ping & Traceroute Icon (from 3:9583-3:9587)
const PingTracerouteIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#ffffff', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Network nodes with connections */}
    <circle cx="15.829" cy="15.829" r="2.5" fill={color}/>
    <circle cx="4.166" cy="15.829" r="2.5" fill={color}/>
    <circle cx="9.997" cy="4.166" r="2.5" fill={color}/>
    <line x1="4.166" y1="15.829" x2="9.997" y2="4.166" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <line x1="15.829" y1="15.829" x2="9.997" y2="4.166" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <line x1="4.166" y1="15.829" x2="15.829" y2="15.829" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </svg>
);

// Remote Reboot Icon (from 3:9595-3:9596)
const RemoteRebootIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#ffffff', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* A power symbol or refresh icon, with cross lines to indicate a "remote" action */}
    <path
      d="M10 1.666c-4.602 0-8.331 3.729-8.331 8.331s3.729 8.331 8.331 8.331 8.331-3.729 8.331-8.331"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 5V1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10.833V15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.166 10H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.999 10H5.833" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Troubleshooting Wizard Icon (from 3:9604-3:9606)
const TroubleshootingWizardIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#ffffff', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* A document or checklist icon with a checkmark */}
    <rect x="1.666" y="1.666" width="16.662" height="16.662" stroke={color} strokeWidth={strokeWidth} rx="2"/>
    <path d="M7.573 11.668L9.997 14.092L14.996 9.093" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Right Arrow Icon (from 3:9552, 3:9562, etc.)
const RightArrowIcon: React.FC<SvgIconProps> = ({ size = 20, color = '#99a1af', strokeWidth = 1.6663, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.49832 4.99888L12.4972 9.99775L7.49832 14.9966"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Sub-components for better composition ---

interface HeaderProps {
  colors: DesignSystemColors;
  typography: TypographyStyle[];
}

const Header: React.FC<HeaderProps> = ({ colors, typography }) => {
  const primaryTextConfig = typography[0]; // Assuming common typography applies
  const textColor1 = colors['color-1'];
  const textColor5 = colors['color-5'];
  const borderColor = '#e5e7eb'; // Derived from Figma color 0.898...

  // Custom typography styles based on design data
  const primaryTitleStyle = useMemo(() => ({
    fontFamily: primaryTextConfig.fontFamily.family,
    fontSize: `${primaryTextConfig.fontSize}px`,
    lineHeight: `${primaryTextConfig.lineHeight.value}px`,
    letterSpacing: `${primaryTextConfig.letterSpacing.value}px`,
    fontWeight: primaryTextConfig.fontWeight,
  }), [primaryTextConfig]);

  // For the secondary text, Figma shows 18px height for a 16px font size, implying a tighter line height
  const secondaryDetailStyle = useMemo(() => ({
    fontFamily: primaryTextConfig.fontFamily.family,
    fontSize: `${primaryTextConfig.fontSize}px`, // Keep font size consistent with design system
    lineHeight: `18px`, // Adjust line height to match given height (18px)
    letterSpacing: `${primaryTextConfig.letterSpacing.value}px`,
    fontWeight: primaryTextConfig.fontWeight,
  }), [primaryTextConfig]);

  return (
    <div className="flex flex-col w-[344px] h-[86.159px] bg-[#ffffff] border-b border-[#e5e7eb]" role="banner">
      <div className="flex items-center w-full h-full px-[14px] py-[21px] space-x-[10.4876px]">
        {/* Back Button */}
        <button
          className="flex items-center justify-center w-[27.956px] h-[27.956px] focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-opacity-50"
          aria-label="Go back to previous screen"
        >
          <BackArrowIcon color={textColor1} />
        </button>

        {/* Title and Subtitle Container */}
        <div className="flex flex-col justify-start min-w-[151.39px] h-[43.6997px] flex-grow">
          <span className="text-base" style={{ ...primaryTitleStyle, color: textColor1 }}>
            Diagnostic Tools
          </span>
          <span className="text-sm" style={{ ...secondaryDetailStyle, color: textColor5 }}>
            lorem ipsum dolor sit
          </span>
        </div>
      </div>
    </div>
  );
};

interface ToolButtonProps {
  Icon: React.FC<SvgIconProps>;
  title: string;
  colors: DesignSystemColors;
  typography: TypographyStyle[];
  onClick?: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ Icon, title, colors, typography, onClick }) => {
  const primaryTextConfig = typography[0];
  const textColor1 = colors['color-1'];
  const bgColor2 = colors['color-2'];
  const bgColor3 = colors['color-3'];
  const borderColor = '#e5e7eb'; // Derived from Figma color 0.898...

  const titleTextStyle = useMemo(() => ({
    fontFamily: primaryTextConfig.fontFamily.family,
    fontSize: `${primaryTextConfig.fontSize}px`,
    lineHeight: `${primaryTextConfig.lineHeight.value}px`,
    letterSpacing: `${primaryTextConfig.letterSpacing.value}px`,
    fontWeight: primaryTextConfig.fontWeight,
  }), [primaryTextConfig]);

  return (
    <button
      className="flex items-center w-full min-h-[73.14px] px-[16.575px] py-[16.575px] rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-opacity-50"
      style={{
        backgroundColor: bgColor2,
        borderColor: borderColor,
        borderWidth: '0.5822169780731201px', // Exact stroke weight from Figma
        gap: '15.992767333984375px', // Item spacing for children
      }}
      onClick={onClick}
      aria-label={`${title} button`}
    >
      {/* Icon Container with blue background */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-[39.991px] h-[39.991px] rounded-[10px]"
        style={{ backgroundColor: bgColor3 }}
      >
        <Icon color={colors['color-4']} />
      </div>

      {/* Title Text */}
      <span
        className="flex-grow text-left"
        style={{ ...titleTextStyle, color: textColor1 }}
      >
        {title}
      </span>

      {/* Right Arrow Icon */}
      <RightArrowIcon color="#99a1af" />
    </button>
  );
};

// --- Main Component ---

const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({ colors, typography }) => {
  // Memoize the main frame styles for pixel-perfect match
  const mainFrameStyle = useMemo(() => ({
    width: '344.12652587890625px',
    height: '727.9529418945312px',
    backgroundColor: colors['color-4'], // White background for the entire panel
    // Combined shadows from Figma data
    boxShadow: '0 8px 10px -6px rgba(0,0,0,0.1), 0 20px 25px -5px rgba(0,0,0,0.1)',
  }), [colors]);

  return (
    <div
      className="flex flex-col overflow-hidden" // overflow-hidden to respect border-radius if added
      style={mainFrameStyle}
      role="region"
      aria-label="Diagnostic Tools Panel"
    >
      <Header colors={colors} typography={typography} />

      {/* Diagnostic Tools List Container */}
      <div
        className="flex flex-col flex-grow px-[15.992767333984375px] py-[15.992767333984375px] overflow-y-auto"
        style={{ gap: '15.99276351928711px' }} // Exact vertical spacing between buttons
      >
        <ToolButton
          Icon={DeviceListIcon}
          title="Device List"
          colors={colors}
          typography={typography}
          onClick={() => console.log('Navigating to Device List')}
        />
        <ToolButton
          Icon={StbDiagnosticsIcon}
          title="STB Diagnostics"
          colors={colors}
          typography={typography}
          onClick={() => console.log('Navigating to STB Diagnostics')}
        />
        <ToolButton
          Icon={SpeedTestIcon}
          title="Speed Test"
          colors={colors}
          typography={typography}
          onClick={() => console.log('Navigating to Speed Test')}
        />
        <ToolButton
          Icon={PingTracerouteIcon}
          title="Ping & Traceroute"
          colors={colors}
          typography={typography}
          onClick={() => console.log('Navigating to Ping & Traceroute')}
        />
        <ToolButton
          Icon={RemoteRebootIcon}
          title="Remote Reboot"
          colors={colors}
          typography={typography}
          onClick={() => console.log('Executing Remote Reboot')}
        />
        <ToolButton
          Icon={TroubleshootingWizardIcon}
          title="Troubleshooting Wizard"
          colors={colors}
          typography={typography}
          onClick={() => console.log('Starting Troubleshooting Wizard')}
        />
      </div>
    </div>
  );
};

export default DiagnosticsScreen;