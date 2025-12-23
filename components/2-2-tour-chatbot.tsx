// src/components/ChatbotTourPage.tsx
'use client'; // This component uses useState, so it must be a Client Component.

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// --- Design System Mappings (Colors & Typography) ---

// Strict adherence to provided HEX codes. Using arbitrary values for Tailwind CSS.
const designColors = {
  white: '#ffffff',
  darkBlue: '#101828', // color-2
  lightGrayText: '#4a5565', // color-3
  lighterGray: '#99a1af', // color-4
  bluePrimary: '#155dfc', // color-5
  lightBlueBackground: '#eff6ff', // color-6
  mediumGrayText: '#6a7282', // color-7
  offWhiteBackground: '#f3f4f6', // color-8
  lightGreenBackground: '#dcfce7', // color-9
  greenPrimary: '#008236', // color-10
  grayBorder: '#e5e7eb', // Inferred from fill color {r: 0.8983431458473206, g: 0.9064381718635559, b: 0.9226285219192505}
  blueGradientStart1: '#2b7dfc', // Inferred from gradient stop {r: 0.16933250427246094, g: 0.49804946780204773, b: 1, a: 1}
  blueGradientStart2: '#615ffc', // Inferred from gradient stop {r: 0.3821760416030884, g: 0.37188830971717834, b: 1, a: 1}
  pinkGradientStart: '#f6339a', // Inferred from gradient stop {r: 0.9658054709434509, g: 0.19813881814479828, b: 0.6043243408203125, a: 1}
  pinkGradientEnd: '#e40076', // Inferred from gradient stop {r: 0.901336133480072, g: 0, b: 0.46341004967689514, a: 1}
  greenGradientStart: '#00c850', // Inferred from gradient stop {r: 0, g: 0.7871556282043457, b: 0.3156217634677887, a: 1}
  greenGradientEnd: '#00a63e', // Inferred from gradient stop {r: 0, g: 0.6513022780418396, b: 0.24199256300926208, a: 1}
  darkGradientStart: '#364153', // Inferred from gradient stop {r: 0.211532324552536, g: 0.2550295889377594, b: 0.32470521330833435, a: 1}
  darkGradientEnd: '#1d293c', // Inferred from gradient stop {r: 0.11697349697351456, g: 0.1607542783021927, b: 0.22201550006866455, a: 1}
  redDot: '#fc2c36', // Inferred from fill color {r: 0.9843137264251709, g: 0.1725490242242813, b: 0.21176470816135406, a: 1}
  errorRed: '#e7000b', // Inferred from fill color {r: 0.9064575433731079, g: 0, b: 0.04221457988023758, a: 1}
  warningYellow: '#ffe7d4', // Inferred from fill color {r: 1, g: 0.929411768913269, b: 0.8313725590705872, a: 1}
  warningYellowText: '#c93400', // Inferred from fill color {r: 0.7918817400932312, g: 0.20726990699768066, b: 0, a: 1}
  lightBlueBorder: '#bee1ff', // Inferred from stroke color {r: 0.7450929880142212, g: 0.8586637377738953, b: 1, a: 1}
  darkGray: '#6a7282', // Inferred for user icon
  grayText: '#606a74', // Inferred from text {r: 0.6000087857246399, g: 0.631395161151886, b: 0.6852225661277771}
  blueAccent: '#004fff', // Inferred from fill color {r: 0, g: 0.31168830394744873, b: 1, a: 1}
};

// Mapped typography classes based on designSystem.typography and inferred styles.
// Assuming 'Inter' font family is configured in Tailwind or available globally.
const typographyClasses = {
  'heading-1': `font-inter text-[30px] font-medium leading-[36px] tracking-[-0.6px]`, // Adjusted to fit height
  'heading-2': `font-inter text-xl font-medium leading-[30px] tracking-[-0.45px]`, // Matches fontSize 20px, lineHeight 30px
  'heading-3': `font-inter text-base font-medium leading-[24px] tracking-[-0.31px]`, // Matches fontSize 16px, lineHeight 24px
  'paragraph-large': `font-inter text-xl font-normal leading-[30px] tracking-[-0.45px]`, // Inferred for larger paragraphs
  'paragraph-base': `font-inter text-base font-normal leading-[24px] tracking-[-0.31px]`, // Matches fontSize 16px, lineHeight 24px
  'paragraph-small': `font-inter text-sm font-normal leading-5 tracking-[-0.25px]`, // Inferred for smaller text (14px font, 20px line height)
};

// --- Icon Components ---
// These SVG paths are directly extracted and mapped to currentColor for easy styling via Tailwind text-color.

const ChevronRightIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6 12L10 8L6 4" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WalletIcon = ({ className = 'stroke-white' }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19 8H5C3.89543 8 3 8.89543 3 10V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V10C21 8.89543 20.1046 8 19 8Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 12H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V10Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = ({ className = 'stroke-[#FFDE20]' }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.99775 1.66634L12.4972 6.66634L17.4966 6.66634L13.3303 9.99967L14.9966 14.9989L9.99775 11.6655L4.99887 14.9989L6.66517 9.99967L2.49944 6.66634L7.49832 6.66634L9.99775 1.66634Z"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VideoPlayerIcon = ({ className = 'stroke-white' }: { className?: string }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M16 12L32 24L16 36V12Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.99956 2.99978V5.99956L7.99942 6.9995M11 5.99956C11 8.761 8.761 11 5.99956 11C3.23812 11 1 8.761 1 5.99956C1 3.23812 3.23812 1 5.99956 1C8.761 1 11 3.23812 11 5.99956Z"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WifiIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C8.68351 2.0526 5.56843 3.49397 3.32754 5.99996L12 15L20.6725 5.99996C18.4316 3.49397 15.3165 2.0526 12 2Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 19.5C12.8284 19.5 13.5 18.8284 13.5 18C13.5 17.1716 12.8284 16.5 12 16.5C11.1716 16.5 10.5 17.1716 10.5 18C10.5 18.8284 11.1716 19.5 12 19.5Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 11L12 16L17 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TVIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14 8V32C14 33.1046 14.8954 34 16 34H40C41.1046 34 42 33.1046 42 32V8C42 6.89543 41.1046 6 40 6H16C14.8954 6 14 6.89543 14 8Z"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 34L36 40"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 34L12 40"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 34L10 40"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28 34L32 40"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 20H40"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatbotIcon = ({ className = 'stroke-white' }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.64603 21 7.91572 20.4704 6.44474 19.5397L3 21L4.53974 17.5553C3.52924 16.0354 3 14.3032 3 11.5C3 6.2533 7.2533 2 11.5 2C16.7467 2 21 6.2533 21 11.5Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 11C12.7614 11 15 8.76142 15 6C15 3.23858 12.7614 1 10 1C7.23858 1 5 3.23858 5 6C5 8.76142 7.23858 11 10 11Z"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 19C17 15.134 13.866 12 10 12C6.13401 12 3 15.134 3 19"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2.5 7.5L10 1.25L17.5 7.5V17.5C17.5 17.8315 17.3683 18.1495 17.1339 18.3839C16.8995 18.6183 16.5815 18.75 16.25 18.75H3.75C3.41848 18.75 3.10054 18.6183 2.86612 18.3839C2.6317 18.1495 2.5 17.8315 2.5 17.5V7.5Z"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 18.75V11.25H12.5V18.75"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SubscriptionIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.75 16.25H16.25C16.5815 16.25 16.8995 16.1183 17.1339 15.8839C17.3683 15.6495 17.5 15.3315 17.5 15V6.25C17.5 5.91848 17.3683 5.60054 17.1339 5.36612C16.8995 5.1317 16.5815 5 16.25 5H3.75C3.41848 5 3.10054 5.1317 2.86612 5.36612C2.6317 5.60054 2.5 5.91848 2.5 6.25V15C2.5 15.3315 2.6317 15.6495 2.86612 15.8839C3.10054 16.1183 3.41848 16.25 3.75 16.25Z"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 2.5V5"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.25 2.5V5"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.75 2.5V5"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 8.75H17.5"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HelpIcon = ({ className = 'stroke-current' }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.85299 6.81342C9.4208 6.20853 10.1558 5.75389 11.002 5.5188C11.8482 5.2837 12.7667 5.28186 13.6133 5.52355C14.4599 5.76523 15.1979 6.22415 15.7686 6.83063C16.3393 7.43712 16.6976 8.16369 16.7906 8.93043C16.8837 9.69717 16.7077 10.4578 16.2917 11.1098C15.8757 11.7618 15.2471 12.2789 14.498 12.6053L12 14"
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6871 16.5568H11.6971"
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Reusable Sub-components ---

interface AppCardProps {
  title: string;
  description: string;
  gradientStart: string;
  gradientEnd: string;
  icon: React.ReactNode;
}

const AppCard: React.FC<AppCardProps> = ({ title, description, gradientStart, gradientEnd, icon }) => (
  <div className="flex flex-col gap-2 w-[128px] flex-shrink-0">
    <div
      className={`flex items-center justify-center w-[128px] h-[128px] rounded-[14px] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),_0px_10px_15px_-3px_rgba(0,0,0,0.1)]`}
      style={{
        background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
      }}
    >
      {icon}
    </div>
    <p className={`${typographyClasses['paragraph-base']} text-center text-[${designColors.darkBlue}] mt-2`}>
      {title}
    </p>
    <p className={`${typographyClasses['paragraph-small']} text-center text-[${designColors.lightGrayText}]`}>
      {description}
    </p>
  </div>
);

interface ContentCardProps {
  imageSrc: string;
  category: string;
  title: string;
  episodesOrDuration: string;
  showClockIcon?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  imageSrc,
  category,
  title,
  episodesOrDuration,
  showClockIcon = true,
}) => (
  <div className="w-[192px] h-[176px] rounded-[14px] bg-[${designColors.darkBlue}] flex flex-col overflow-hidden flex-shrink-0">
    <div
      className="relative w-full h-[112px] rounded-t-[14px] flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${designColors.darkGradientStart} 0%, ${designColors.darkGradientEnd} 100%)`,
      }}
    >
      <VideoPlayerIcon className="w-12 h-12" /> {/* Generic video player icon */}
    </div>
    <div className="p-3 flex flex-col flex-grow">
      <p className={`${typographyClasses['paragraph-base']} text-white mb-[4px]`}>{title}</p>
      <div className="flex items-center justify-between text-[${designColors.grayText}] text-xs leading-4">
        <span className={`${typographyClasses['paragraph-small']} text-[${designColors.grayText}]`}>{category}</span>
        <div className="flex items-center gap-1">
          {showClockIcon && <ClockIcon className="w-[12px] h-[12px] text-[${designColors.grayText}]" />}
          <span className={`${typographyClasses['paragraph-small']} text-[${designColors.grayText}]`}>
            {episodesOrDuration}
          </span>
        </div>
      </div>
    </div>
  </div>
);

interface CurrentPlanCardProps {
  title: string;
  price: string;
  status: 'Active' | 'Expiring';
  channels?: string;
  speed?: string;
  billDue?: string;
  validUntil?: string;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  title,
  price,
  status,
  channels,
  speed,
  billDue,
  validUntil,
}) => (
  <div className="flex flex-col gap-4 p-4 border border-[${designColors.grayBorder}] rounded-[16px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),_0px_1px_3px_0px_rgba(0,0,0,0.1)] min-w-[280px] flex-shrink-0">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-[48px] h-[48px] rounded-[14px] bg-[${designColors.lightBlueBackground}] flex items-center justify-center">
          <WifiIcon className="w-8 h-8 text-[${designColors.bluePrimary}]" />
        </div>
        <div className="flex flex-col">
          <h3 className={`${typographyClasses['heading-3']} text-[${designColors.darkBlue}]`}>{title}</h3>
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>{price}</p>
        </div>
      </div>
      <span
        className={`px-2 py-1 rounded-full ${typographyClasses['paragraph-small']} font-medium
          ${status === 'Active' ? `bg-[${designColors.lightGreenBackground}] text-[${designColors.greenPrimary}]` : `bg-[${designColors.warningYellow}] text-[${designColors.warningYellowText}]`}
        `}
      >
        {status}
      </span>
    </div>

    <div className="border-t border-[${designColors.grayBorder}] pt-4 flex flex-col gap-2">
      {channels && (
        <div className="flex justify-between items-center">
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>Channels</p>
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.darkBlue}]`}>{channels}</p>
        </div>
      )}
      {speed && (
        <div className="flex justify-between items-center">
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>Speed</p>
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.darkBlue}]`}>{speed}</p>
        </div>
      )}
      {billDue && (
        <div className="flex justify-between items-center">
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>Bill Due</p>
          <p className={`${typographyClasses.paragraph-base} text-[${designColors.errorRed}]`}>{billDue}</p>
        </div>
      )}
      {validUntil && (
        <div className="flex justify-between items-center">
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>Valid Until</p>
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.darkBlue}]`}>{validUntil}</p>
        </div>
      )}
    </div>

    <div className="flex gap-2 mt-auto">
      <button className={`flex-1 px-4 py-2 bg-[${designColors.offWhiteBackground}] rounded-[10px] text-[${designColors.darkBlue}] ${typographyClasses['paragraph-base']} font-medium`}>
        Manage
      </button>
      <button className={`flex-1 px-4 py-2 bg-[${designColors.bluePrimary}] rounded-[10px] text-white ${typographyClasses['paragraph-base']} font-medium`}>
        Upgrade
      </button>
      {billDue && (
        <button className={`flex-1 px-4 py-2 bg-[${designColors.greenPrimary}] rounded-[10px] text-white ${typographyClasses['paragraph-base']} font-medium`}>
          Pay Bill
        </button>
      )}
    </div>
  </div>
);

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-[14px] border border-[${designColors.grayBorder}] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden w-full">
      <button
        className="flex justify-between items-center w-full p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <p className={`${typographyClasses['paragraph-base']} text-[${designColors.darkBlue}]`}>{question}</p>
        <ChevronRightIcon className={`w-4 h-4 text-[${designColors.mediumGrayText}] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>{answer}</p>
        </div>
      )}
    </div>
  );
};


// --- Main Component ---

interface ChatbotTourPageProps {
  // Props for the main page component can be defined here if needed.
  // For this exercise, data is internal to simulate rendering from JSON.
}

const ChatbotTourPage: React.FC<ChatbotTourPageProps> = () => {
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);

  const carouselItems = [
    {
      id: '2:5054',
      imageSrc: 'https://via.placeholder.com/376x256/000000/FFFFFF?text=Action+Movies',
      title: 'New Release: Action Movies Marathon',
      description: 'Stream the latest blockbusters',
    },
    {
      id: '2:5062',
      imageSrc: 'https://via.placeholder.com/376x256/000000/FFFFFF?text=Premier+League',
      title: 'Live Sports: Premier League',
      description: 'Watch your favorite teams live',
    },
    {
      id: '2:5070',
      imageSrc: 'https://via.placeholder.com/376x256/000000/FFFFFF?text=Breaking+News',
      title: 'Breaking News Coverage',
      description: '24/7 news and updates',
    },
  ];

  return (
    <div className="relative w-[376px] min-h-[2786px] bg-white overflow-hidden font-inter">
      {/* TopBar */}
      <div className="sticky top-0 left-0 w-full h-[64.57px] bg-white border-b border-[${designColors.grayBorder}] flex items-center px-4 z-10">
        <div className="flex items-center gap-[12px]">
          <div
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${designColors.bluePrimary} 0%, ${designColors.blueGradientEnd} 100%)`,
            }}
          >
            <span className={`text-white ${typographyClasses['paragraph-base']} font-medium`}>C1</span>
          </div>
          <h1 className={`${typographyClasses['heading-1']} text-[${designColors.darkBlue}]`}>Cignal One</h1>
        </div>
        <div className="ml-auto flex items-center gap-[8px]">
          <button className="relative w-[36px] h-[36px] rounded-full flex items-center justify-center" aria-label="Notifications">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[${designColors.redDot}] absolute top-1 right-1" />
            {/* Placeholder for bell icon */}
            <Image src="/bell-icon.svg" alt="Notifications" width={20} height={20} />
          </button>
          <button className="w-[36px] h-[36px] rounded-full flex items-center justify-center" aria-label="User Profile">
            <UserIcon className="w-5 h-5 text-[${designColors.lightGrayText}]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[${designColors.offWhiteBackground}] min-h-[calc(100vh-64.57px)] pb-[80px]">
        {/* Main Hero Carousel */}
        <div className="relative w-full h-[256px]">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentCarouselSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h2 className={`${typographyClasses['heading-1']} text-white leading-[30px]`}>
                  {item.title}
                </h2>
                <p className={`${typographyClasses['paragraph-base']} text-white/90`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 right-6 flex gap-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`w-[8px] h-[8px] rounded-full transition-all duration-300 ${
                  index === currentCarouselSlide ? 'w-6 bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentCarouselSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content sections below carousel, adjusted to visually overlap slightly */}
        <div className="mt-[-57.07px] relative z-[1]">
          {/* Current Plans Section */}
          <div className="bg-white pt-4 pb-6 border-b border-[${designColors.grayBorder}] z-10 relative">
            <div className="flex justify-between items-start px-4">
              <div className="flex flex-col">
                <h2 className={`${typographyClasses['heading-2']} text-[${designColors.darkBlue}]`}>Current Plans</h2>
                <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>
                  Manage your active subscriptions
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-[33px] h-[33px] rounded-[10px] border border-[${designColors.grayBorder}] flex items-center justify-center" aria-label="Previous Plan">
                  <ChevronRightIcon className="w-4 h-4 text-[${designColors.lightGrayText}] rotate-180" />
                </button>
                <button className="w-[33px] h-[33px] rounded-[10px] border border-[${designColors.grayBorder}] flex items-center justify-center" aria-label="Next Plan">
                  <ChevronRightIcon className="w-4 h-4 text-[${designColors.lightGrayText}]" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 px-4 pt-6 overflow-x-auto scrollbar-hide">
              <CurrentPlanCard
                title="Cignal Postpaid Premium"
                price="₱1,899/month"
                status="Active"
                channels="200+"
                billDue="Dec 15, 2025"
              />
              <CurrentPlanCard
                title="Cignal Fiber 100 Mbps"
                price="₱1,699/month"
                status="Active"
                speed="100 Mbps"
                validUntil="Dec 31, 2025"
              />
              <CurrentPlanCard
                title="Cignal Play Unlimited"
                price="₱399/month"
                status="Expiring"
                channels="50+"
                validUntil="Jan 5, 2026"
              />
              <CurrentPlanCard
                title="Cignal Fiber 200 Mbps"
                price="₱2,499/month"
                status="Active"
                speed="200 Mbps"
                validUntil="Mar 15, 2026"
              />
            </div>
          </div>

          {/* Your Apps Section */}
          <div className="bg-white pt-4 pb-6 mt-4">
            <div className="flex justify-between items-start px-4">
              <div className="flex flex-col">
                <h2 className={`${typographyClasses['heading-2']} text-[${designColors.darkBlue}]`}>Your Apps</h2>
                <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>
                  Manage your subscriptions
                </p>
              </div>
              <Link href="/apps" className="flex items-center text-[${designColors.bluePrimary}]" aria-label="View All Apps">
                <span className={`${typographyClasses['paragraph-base']} font-medium`}>View All</span>
                <ChevronRightIcon className="ml-1 w-4 h-4 text-[${designColors.bluePrimary}]" />
              </Link>
            </div>

            <div className="flex gap-4 px-4 pt-6 overflow-x-auto scrollbar-hide">
              <AppCard
                title="Cignal Postpaid"
                description="Premium TV experience"
                gradientStart={designColors.blueGradientStart1}
                gradientEnd={designColors.blueGradientEnd}
                icon={<TVIcon className="w-12 h-12 stroke-white" />}
              />
              <AppCard
                title="Cignal Prepaid"
                description="Flexible TV plans"
                gradientStart={designColors.blueGradientStart2}
                gradientEnd={designColors.blueGradientEnd}
                icon={<TVIcon className="w-12 h-12 stroke-white" />}
              />
              <AppCard
                title="SatLite"
                description="Mobile streaming"
                gradientStart={designColors.pinkGradientStart}
                gradientEnd={designColors.pinkGradientEnd}
                icon={<Image src="/phone-icon.svg" alt="SatLite" width={48} height={48} className="stroke-white" />}
              />
              <AppCard
                title="Pilipinas Live"
                description="Local channels"
                gradientStart={designColors.greenGradientStart}
                gradientEnd={designColors.greenGradientEnd}
                icon={<Image src="/live-tv-icon.svg" alt="Pilipinas Live" width={48} height={48} className="stroke-white" />}
              />
              <div className="flex flex-col items-center justify-center p-4 rounded-[14px] border border-[${designColors.grayBorder}] w-[128px] h-[172px] flex-shrink-0">
                <PlusIcon className="w-6 h-6 text-[${designColors.lighterGray}] mb-2" />
                <p className={`${typographyClasses['paragraph-small']} text-[${designColors.lighterGray}]`}>Cignal Super</p>
              </div>
            </div>
          </div>

          {/* My Wallet Section */}
          <div
            className="flex flex-col gap-4 p-6 mt-4"
            style={{
              background: `linear-gradient(135deg, ${designColors.bluePrimary} 0%, ${designColors.blueGradientEnd} 100%)`,
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <WalletIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <p className={`${typographyClasses['paragraph-base']} text-white/90`}>My Wallet</p>
                  <h3 className={`${typographyClasses['heading-3']} text-white`}>2,450 Points</h3>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-white/20 rounded-lg text-white ${typographyClasses['paragraph-base']} font-medium" aria-label="View Wallet">
                <span>View Wallet</span>
                <ChevronRightIcon className="ml-2 w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              <div className="bg-white/10 rounded-[14px] p-4 flex-col justify-between items-start w-[166px] h-[104px] flex-shrink-0">
                <StarIcon className="w-5 h-5 stroke-[#FFDE20] mb-2" />
                <p className={`${typographyClasses['paragraph-base']} text-white/90`}>Available</p>
                <p className={`${typographyClasses['heading-3']} text-white`}>2,450 pts</p>
              </div>
              <div className="bg-white/10 rounded-[14px] p-4 flex-col justify-between items-start w-[166px] h-[104px] flex-shrink-0">
                <StarIcon className="w-5 h-5 stroke-[#f6339a] mb-2" /> {/* Inferred pink color */}
                <p className={`${typographyClasses['paragraph-base']} text-white/90`}>Rewards</p>
                <p className={`${typographyClasses['heading-3']} text-white`}>15 Available</p>
              </div>
            </div>
          </div>

          {/* Entertainment Carousel */}
          <div className="bg-white pt-4 pb-6 mt-4">
            <div className="flex justify-between items-start px-4">
              <div className="flex flex-col">
                <h2 className={`${typographyClasses['heading-2']} text-[${designColors.darkBlue}]`}>Entertainment</h2>
                <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>
                  Popular shows and series
                </p>
              </div>
              <Link href="/entertainment" className="flex items-center text-[${designColors.bluePrimary}]" aria-label="See All Entertainment">
                <span className={`${typographyClasses['paragraph-base']} font-medium`}>See All</span>
                <ChevronRightIcon className="ml-1 w-4 h-4 text-[${designColors.bluePrimary}]" />
              </Link>
            </div>

            <div className="flex gap-4 px-4 pt-6 overflow-x-auto scrollbar-hide">
              <ContentCard
                imageSrc="/drama-series.svg" // Placeholder, actual image not provided
                title="The Latest Drama Series"
                category="Drama"
                episodesOrDuration="8 Episodes"
              />
              <ContentCard
                imageSrc="/comedy-night.svg"
                title="Comedy Night Special"
                category="Comedy"
                episodesOrDuration="2h 15m"
                showClockIcon={true}
              />
              <ContentCard
                imageSrc="/reality-show.svg"
                title="Reality Show Finale"
                category="Reality"
                episodesOrDuration="Season 5"
                showClockIcon={false}
              />
              <ContentCard
                imageSrc="/documentary.svg"
                title="Documentary: Nature"
                category="Documentary"
                episodesOrDuration="1h 45m"
                showClockIcon={true}
              />
            </div>
          </div>

          {/* Movies Carousel */}
          <div className="bg-white pt-4 pb-6 mt-4">
            <div className="flex justify-between items-start px-4">
              <div className="flex flex-col">
                <h2 className={`${typographyClasses['heading-2']} text-[${designColors.darkBlue}]`}>Movies</h2>
                <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>
                  Blockbusters and classics
                </p>
              </div>
              <Link href="/movies" className="flex items-center text-[${designColors.bluePrimary}]" aria-label="See All Movies">
                <span className={`${typographyClasses['paragraph-base']} font-medium`}>See All</span>
                <ChevronRightIcon className="ml-1 w-4 h-4 text-[${designColors.bluePrimary}]" />
              </Link>
            </div>

            <div className="flex gap-4 px-4 pt-6 overflow-x-auto scrollbar-hide">
              <ContentCard
                imageSrc="/action-thriller.svg"
                title="Action Thriller 2024"
                category="Action"
                episodesOrDuration="2h 30m"
                showClockIcon={true}
              />
              <ContentCard
                imageSrc="/romantic-comedy.svg"
                title="Romantic Comedy"
                category="Romance"
                episodesOrDuration="1h 55m"
                showClockIcon={true}
              />
              <ContentCard
                imageSrc="/sci-fi-adventure.svg"
                title="Sci-Fi Adventure"
                category="Sci-Fi"
                episodesOrDuration="2h 45m"
                showClockIcon={true}
              />
              <ContentCard
                imageSrc="/horror-mystery.svg"
                title="Horror Mystery"
                category="Horror"
                episodesOrDuration="1h 40m"
                showClockIcon={true}
              />
            </div>
          </div>

          {/* Sports & Live Events Carousel */}
          <div className="bg-white pt-4 pb-6 mt-4">
            <div className="flex justify-between items-start px-4">
              <div className="flex flex-col">
                <h2 className={`${typographyClasses['heading-2']} text-[${designColors.darkBlue}]`}>Sports & Live Events</h2>
                <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}]`}>
                  Watch your favorite sports
                </p>
              </div>
              <Link href="/sports" className="flex items-center text-[${designColors.bluePrimary}]" aria-label="See All Sports">
                <span className={`${typographyClasses['paragraph-base']} font-medium`}>See All</span>
                <ChevronRightIcon className="ml-1 w-4 h-4 text-[${designColors.bluePrimary}]" />
              </Link>
            </div>

            <div className="flex gap-4 px-4 pt-6 overflow-x-auto scrollbar-hide">
              <ContentCard
                imageSrc="/nba-finals.svg"
                title="NBA Finals Game 7"
                category="Basketball"
                episodesOrDuration="Live"
                showClockIcon={false}
              />
              <ContentCard
                imageSrc="/premier-league.svg"
                title="Premier League Match"
                category="Football"
                episodesOrDuration="Today 8PM"
                showClockIcon={false}
              />
              <ContentCard
                imageSrc="/tennis-grand-slam.svg"
                title="Tennis Grand Slam"
                category="Tennis"
                episodesOrDuration="Live Now"
                showClockIcon={false}
              />
              <ContentCard
                imageSrc="/ufc-fight.svg"
                title="UFC Fight Night"
                category="MMA"
                episodesOrDuration="This Weekend"
                showClockIcon={false}
              />
            </div>
          </div>

          {/* Help & Support Section */}
          <div className="bg-[${designColors.offWhiteBackground}] pt-6 pb-6 mt-4">
            <div className="flex items-center gap-2 px-4 mb-4">
              <HelpIcon className="w-6 h-6 text-[${designColors.darkBlue}]" />
              <h2 className={`${typographyClasses['heading-2']} text-[${designColors.darkBlue}]`}>Help & Support</h2>
            </div>
            <div className="flex border-b border-[${designColors.grayBorder}] px-4 pb-2">
              <button className="py-2 px-4 border-b-2 border-[${designColors.bluePrimary}] text-[${designColors.bluePrimary}] ${typographyClasses['paragraph-base']} font-medium">
                FAQs
              </button>
              <button className="py-2 px-4 text-[${designColors.lightGrayText}] ${typographyClasses['paragraph-base']} font-medium">Diagnostics</button>
            </div>

            <div className="px-4 py-4 flex flex-col gap-3">
              <FaqItem
                question="How do I upgrade my subscription?"
                answer="Go to your Current Plans section, select the plan you wish to upgrade, and follow the prompts. You can also contact our customer support for assistance."
              />
              <FaqItem
                question="What payment methods are accepted?"
                answer="We accept credit cards, debit cards, GCash, PayMaya, and bank transfers. For more details, please visit our payment options page."
              />
              <FaqItem
                question="Can I pause my subscription?"
                answer="Yes, you can pause prepaid subscriptions. For postpaid subscriptions, please contact customer support for available options."
              />
            </div>
            <button className={`w-[344px] px-4 py-3 mx-4 mt-4 text-[${designColors.darkBlue}] bg-white border border-[${designColors.grayBorder}] rounded-[14px] ${typographyClasses['paragraph-base']} font-medium`}>
              View All FAQs
            </button>

            <div className={`bg-[${designColors.lightBlueBackground}] border border-[${designColors.lightBlueBorder}] rounded-[14px] p-4 mx-4 mt-6 flex flex-col gap-2`}>
              <p className={`${typographyClasses['paragraph-base']} text-[${designColors.darkBlue}]`}>Still need help?</p>
              <div className="flex gap-2">
                <button className={`flex-1 px-4 py-2 bg-white border border-[${designColors.lightBlueBorder}] rounded-lg text-[${designColors.bluePrimary}] ${typographyClasses['paragraph-base']} font-medium`}>
                  Call Support
                </button>
                <button className={`flex-1 px-4 py-2 bg-[${designColors.bluePrimary}] rounded-lg text-white ${typographyClasses['paragraph-base']} font-medium`}>
                  Chat with Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot Floating Button */}
      <button className={`fixed bottom-[140px] right-6 w-14 h-14 rounded-full flex items-center justify-center bg-[${designColors.blueAccent}] shadow-lg z-20`} aria-label="Open Chatbot">
        <ChatbotIcon className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 w-full h-[64.55px] bg-white border-t border-[${designColors.grayBorder}] flex justify-around items-center px-2 z-10`}>
        <button className="flex flex-col items-center gap-[4px] py-2 w-[65px]" aria-label="Home">
          <HomeIcon className="w-5 h-5 text-[${designColors.bluePrimary}]" />
          <span className={`${typographyClasses['paragraph-small']} text-[${designColors.bluePrimary}]`}>Home</span>
        </button>
        <button className="flex flex-col items-center gap-[4px] py-2 w-[110px]" aria-label="Subscriptions">
          <SubscriptionIcon className="w-5 h-5 text-[${designColors.lightGrayText}]" />
          <span className={`${typographyClasses['paragraph-small']} text-[${designColors.lightGrayText}]`}>Subscriptions</span>
        </button>
        <button className="flex flex-col items-center gap-[4px] py-2 w-[80px]" aria-label="Help">
          <HelpIcon className="w-5 h-5 text-[${designColors.lightGrayText}]" />
          <span className={`${typographyClasses['paragraph-small']} text-[${designColors.lightGrayText}]`}>Help</span>
        </button>
        <button className="relative flex flex-col items-center gap-[4px] py-2 w-[68px]" aria-label="Profile">
          <span className="absolute top-1 right-2 w-2 h-2 bg-[${designColors.redDot}] rounded-full" />
          <UserIcon className="w-5 h-5 text-[${designColors.lightGrayText}]" />
          <span className={`${typographyClasses['paragraph-small']} text-[${designColors.lightGrayText}]`}>Profile</span>
        </button>
      </div>

      {/* Overlay for Chatbot Tour */}
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
        <div className="bg-white rounded-[14px] p-6 mx-7 w-[320px] shadow-2xl flex flex-col items-start relative">
          <p className={`${typographyClasses['paragraph-small']} text-[${designColors.bluePrimary}] mb-2`}>Step 2 of 4</p>
          <h3 className={`${typographyClasses['heading-3']} text-[${designColors.darkBlue}] mb-2`}>AI Chatbot Assistant</h3>
          <p className={`${typographyClasses['paragraph-base']} text-[${designColors.lightGrayText}] mb-6`}>
            Get instant help with our AI chatbot. Ask questions, troubleshoot issues, and find solutions 24/7.
          </p>
          <div className="flex justify-between items-center w-full mb-4">
            <div className="flex gap-1">
              <div className="w-[6px] h-[6px] rounded-full bg-[${designColors.lighterGray}]" />
              <div className="w-[24px] h-[6px] rounded-full bg-[${designColors.bluePrimary}]" />
              <div className="w-[6px] h-[6px] rounded-full bg-[${designColors.lighterGray}]" />
              <div className="w-[6px] h-[6px] rounded-full bg-[${designColors.lighterGray}]" />
            </div>
            <div className="flex gap-2">
              <button className={`flex items-center px-4 py-2 border border-[${designColors.grayBorder}] rounded-[8px] text-[${designColors.darkBlue}] ${typographyClasses['paragraph-base']} font-medium`} aria-label="Back">
                <ChevronRightIcon className="rotate-180 w-4 h-4 mr-2 text-[${designColors.darkBlue}]" />
                Back
              </button>
              <button className={`flex items-center px-4 py-2 bg-[${designColors.bluePrimary}] rounded-[8px] text-white ${typographyClasses['paragraph-base']} font-medium`} aria-label="Next">
                Next
                <ChevronRightIcon className="ml-2 w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <button className="absolute top-4 right-4 text-[${designColors.mediumGrayText}]" aria-label="Close">
            {/* Placeholder for close icon */}
            <Image src="/close-icon.svg" alt="Close" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTourPage;