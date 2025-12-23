// src/components/ActiveSubscriptionsScreen.tsx
import { useState, useMemo } from 'react';

// --- Utility Functions ---
// Function to convert Figma RGBA to Hex
// Note: This is an internal utility to derive exact HEX from the JSON structure's RGB values.
// The output component will use these derived HEX values directly in Tailwind classes.
const figmaColorToHex = (color: { r: number; g: number; b: number; a?: number }): string => {
  const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
  let hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  if (color.a !== undefined && color.a < 1) {
    hex += Math.round(color.a * 255).toString(16).padStart(2, '0');
  }
  return hex.toUpperCase();
};

// --- Design System Colors & Typography (Mapped to Tailwind or custom values) ---
const COLORS = {
  white: '#FFFFFF',
  darkGrayMedium: '#4A5565',
  darkGrayDarkest: '#101828',
  black: '#0A0A0A',
  lightGrayBg: '#F9FAFB',
  greenPrimary: '#008236',
  bluePrimary: '#155DFC',
  lightGrayStroke: '#F3F3F5',
  lightGreenBg: '#F0FDF4',
  darkGreenText: '#0D542B',
  // Derived from structure where not explicitly in designSystem.colors
  borderGrayLight: '#E5E7EB',
  iconGrayMedium: '#717182',
  blueActiveTabBorder: '#155DFB', // Very close to bluePrimary
  greenCardBg: '#F0FDEF', // Very close to lightGreenBg
  greenCardBorder: '#B9F7CF',
  badgeBg: '#DCFCED',
  blueCardBg: '#EFF6FF',
  blueCardBorder: '#BEE2FF',
  darkGrayIcon: '#364153',
  notificationDot: '#FC2C36',
  gradientBlueStart: '#155DFB',
  gradientBlueEnd: '#4F39F7',
};

// Typography classes using arbitrary values for pixel-perfect matching
const TYPOGRAPHY = {
  h2: `font-['Inter'] font-medium text-[20px] leading-[30px] tracking-[-0.44921875px]`,
  pRegular: `font-['Inter'] font-normal text-[16px] leading-[24px] tracking-[-0.3125px]`,
  badgeText: `font-['Inter'] font-normal text-[14px] leading-[16px] tracking-[-0.25px]`, // Inferred for small text
  bottomNavText: `font-['Inter'] font-normal text-[14px] leading-[16px] tracking-[-0.25px]`, // Inferred for small text
  h1: `font-['Inter'] font-medium text-[28px] leading-[36px] tracking-[-0.64px]`, // Inferred for Cignal One
};

// --- Icons (Simplified SVG placeholders based on common interpretation and dimensions) ---
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  strokeWidth?: number;
}

const FolderIcon: React.FC<IconProps> = ({ color = COLORS.iconGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66699 4.66667V12C2.66699 12.3533 2.8091 12.6924 3.05915 12.9424C3.3092 13.1925 3.64828 13.3346 4.00163 13.3346H12.0016C12.355 13.3346 12.6941 13.1925 12.9441 12.9424C13.1942 12.6924 13.3363 12.3533 13.3363 12V4.66667C13.3363 4.31332 13.1942 3.97424 12.9441 3.72419C12.6941 3.47414 12.355 3.33203 12.0016 3.33203H6.00163C5.64828 3.33203 5.3092 3.18992 5.05915 2.93987C4.8091 2.68982 4.66699 2.35074 4.66699 1.99739H4.00163C3.64828 1.99739 3.3092 2.1395 3.05915 2.38955C2.8091 2.6396 2.66699 2.97868 2.66699 3.33203V4.66667Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon: React.FC<IconProps> = ({ color = COLORS.iconGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon: React.FC<IconProps> = ({ color = COLORS.greenPrimary, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckSquareIcon: React.FC<IconProps> = ({ color = COLORS.bluePrimary, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8.5L7.5 10L10 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6663 2.66797H3.33299C2.59561 2.66797 1.99963 3.26395 1.99963 4.00132V12.668C1.99963 13.4054 2.59561 14.0013 3.33299 14.0013H12.6663C13.4037 14.0013 13.9996 13.4054 13.9996 12.668V4.00132C13.9996 3.26395 13.4037 2.66797 12.6663 2.66797Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6663 1.33203V4.0007" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.33299 1.33203V4.0007" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.99963 6.66797H13.9996" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Generic App Icon (simplified to a device/screen)
const GenericAppIcon: React.FC<IconProps> = ({ color = COLORS.iconGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="1.5" width="11" height="12" rx="1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14.5H10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HomeIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33301 8.33333L9.99967 3.33333L16.6663 8.33333V16.6667H3.33301V8.33333Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 16.6667V10H12.5V16.6667" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SubscriptionsIcon: React.FC<IconProps> = ({ color = COLORS.bluePrimary, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="4.5" width="17" height="11" rx="2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 8.5H18.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RewardsIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6663 11.6663C16.6663 13.9048 14.9048 15.6663 12.6663 15.6663C10.4278 15.6663 8.66634 13.9048 8.66634 11.6663C8.66634 9.4278 10.4278 7.66634 12.6663 7.66634C14.9048 7.66634 16.6663 9.4278 16.6663 11.6663Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.333 11.6663L11.6663 13.333L10 11.6663" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 11.6663C2.5 9.4278 4.26142 7.66634 6.5 7.66634" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 7.66634V5.83301C18.5 4.88788 18.1313 3.98031 17.4746 3.32362C16.8179 2.66693 15.9103 2.29821 14.9652 2.29821H5.0348C4.08967 2.29821 3.1821 2.66693 2.52541 3.32362C1.86872 3.98031 1.5 4.88788 1.5 5.83301V7.66634" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 5L7.5 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 13V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 7H10.01" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayMedium, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 17.5C17.5 14.8776 15.8291 12.6394 13.5678 11.8394C12.1866 11.3506 10.8242 11.1663 9.46191 11.2996C7.94071 11.4496 6.55948 11.8996 5.51865 12.6663C4.19532 13.6506 3.33301 14.8776 3.33301 16.2996" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayIcon, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.0007 18.3333C10.0007 18.3333 11.2507 16.6667 11.2507 14.1667C11.2507 12.5108 10.0007 11.6667 10.0007 11.6667C10.0007 11.6667 8.75073 12.5108 8.75073 14.1667C8.75073 16.6667 10.0007 18.3333 10.0007 18.3333Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 1.66667C10 1.66667 15 3.33333 15 7.5C15 9.73858 13.9048 11.6667 12.5 11.6667H7.5C6.09523 11.6667 5 9.73858 5 7.5C5 3.33333 10 1.66667 10 1.66667Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayIcon, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8333 15.8333L18.3333 18.3333" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 9.16667C17.5 13.7849 13.7849 17.5 9.16667 17.5C4.54844 17.5 0.833333 13.7849 0.833333 9.16667C0.833333 4.54844 4.54844 0.833333 9.16667 0.833333C13.7849 0.833333 17.5 4.54844 17.5 9.16667Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon: React.FC<IconProps> = ({ color = COLORS.darkGrayIcon, strokeWidth = 1.5, ...props }) => (
  <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 17.5V15.8333C16.6667 14.3732 16.0709 12.9739 15.0118 11.9148C13.9527 10.8557 12.5534 10.2599 11.0933 10.2599H5.57333C4.11326 10.2599 2.71396 10.8557 1.65487 11.9148C0.595782 12.9739 0 14.3732 0 15.8333V17.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33301 7.5C8.33301 9.34091 6.84091 10.833 5.00001 10.833C3.1591 10.833 1.66699 9.34091 1.66699 7.5C1.66699 5.65909 3.1591 4.16699 5.00001 4.16699C6.84091 4.16699 8.33301 5.65909 8.33301 7.5Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Sub-Components ---

interface TopBarProps {
  appName: string;
  initials: string;
}

const TopBar: React.FC<TopBarProps> = ({ appName, initials }) => (
  <div className={`w-full flex justify-center items-center h-[64.57px] bg-[${COLORS.white}] border-b border-[${COLORS.borderGrayLight}]`}>
    <div className="w-[381.39px] h-[39.99px] flex justify-between items-center px-[16px] py-[12px]">
      <div className="flex items-center gap-[12px]">
        <div
          className="w-[39.99px] h-[39.99px] rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(225deg, ${COLORS.gradientBlueStart} 0%, ${COLORS.gradientBlueEnd} 100%)` }}
        >
          <span className={`text-[${COLORS.white}] ${TYPOGRAPHY.pRegular}`}>
            {initials}
          </span>
        </div>
        <h1 className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.h1}`}>
          {appName}
        </h1>
      </div>
      <div className="flex items-center gap-[12px]">
        <button className="w-[35.99px] h-[35.99px] rounded-full flex items-center justify-center">
          <SearchIcon width="20" height="20" />
        </button>
        <button className="relative w-[35.99px] h-[35.99px] rounded-full flex items-center justify-center">
          <BellIcon width="20" height="20" />
          <span className={`absolute top-[4px] right-[4px] w-[8px] h-[8px] rounded-full bg-[${COLORS.notificationDot}]`} />
        </button>
      </div>
    </div>
  </div>
);

interface SubscriptionHeaderProps {
  title: string;
  description: string;
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ title, description }) => (
  <div className={`w-full bg-[${COLORS.white}] border-b border-[${COLORS.borderGrayLight}] py-[24px] px-[16px] space-y-[8px]`}>
    <h2 className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.h2}`}>
      {title}
    </h2>
    <p className={`text-[${COLORS.darkGrayMedium}] ${TYPOGRAPHY.pRegular}`}>
      {description}
    </p>
  </div>
);

interface AppSelectionProps {
  label: string;
  selectedApp: string;
  onSelectApp: (app: string) => void; // Placeholder for functionality
}

const AppSelection: React.FC<AppSelectionProps> = ({ label, selectedApp }) => (
  <div className={`w-full bg-[${COLORS.white}] border-b border-[${COLORS.borderGrayLight}] py-[16px] px-[16px] space-y-[8px]`}>
    <p className={`text-[${COLORS.darkGrayMedium}] ${TYPOGRAPHY.pRegular}`}>
      {label}
    </p>
    <button className={`w-full flex items-center justify-between h-[36px] rounded-lg bg-[${COLORS.lightGrayStroke}] border-none px-[12px]`}>
      <div className="flex items-center gap-[8px]">
        <FolderIcon width="16" height="16" />
        <span className={`text-[${COLORS.black}] ${TYPOGRAPHY.pRegular}`}>
          {selectedApp}
        </span>
      </div>
      <ChevronDownIcon width="16" height="16" />
    </button>
  </div>
);

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    className={`flex-1 flex justify-center items-center py-[8px] border-b-2 transition-colors duration-200 
                ${isActive ? `border-[${COLORS.blueActiveTabBorder}] bg-[${COLORS.white}]` : `border-transparent bg-transparent`}`}
    onClick={onClick}
    aria-selected={isActive}
    role="tab"
  >
    <span className={`text-[${COLORS.black}] ${TYPOGRAPHY.pRegular}`}>{label}</span>
  </button>
);

interface ActiveSubscriptionCardProps {
  planName: string;
  status: string;
  price: string;
  billingDate: string;
  features: string[];
  onManagePlan: () => void;
  onUpgrade: () => void;
}

const ActiveSubscriptionCard: React.FC<ActiveSubscriptionCardProps> = ({
  planName,
  status,
  price,
  billingDate,
  features,
  onManagePlan,
  onUpgrade,
}) => {
  const customShadow = "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";

  return (
    <div className={`w-full rounded-2xl bg-[${COLORS.greenCardBg}] border border-[${COLORS.greenCardBorder}] ${customShadow}`}>
      <div className="p-[24px] flex flex-col gap-[24px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <h3 className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>{planName}</h3>
              <span className={`inline-flex items-center rounded-lg bg-[${COLORS.badgeBg}] px-[8px] py-[4px]`} aria-label={`Status: ${status}`}>
                <span className={`text-[${COLORS.greenPrimary}] ${TYPOGRAPHY.badgeText}`}>{status}</span>
              </span>
            </div>
            <p className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>{price}</p>
          </div>
          <CheckCircleIcon color={COLORS.bluePrimary} width="24" height="24" />
        </div>

        {/* Features */}
        <div className="flex flex-col gap-[8px]">
          <p className={`text-[${COLORS.darkGreenText}] ${TYPOGRAPHY.pRegular}`}>Your subscription is active</p>
          <p className={`text-[${COLORS.greenPrimary}] ${TYPOGRAPHY.pRegular}`}>{billingDate}</p>

          <div className="flex flex-col gap-[8px] mt-[8px]">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-[8px]">
                <CheckSquareIcon />
                <span className={`text-[${COLORS.darkGrayMedium}] ${TYPOGRAPHY.pRegular}`}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-[12px] pt-[16px] border-t border-[${COLORS.lightGrayStroke}]">
          <button
            onClick={onManagePlan}
            className={`flex-1 h-[36px] rounded-lg bg-[${COLORS.white}] border border-[rgba(0,0,0,0.1)] flex items-center justify-center`}
          >
            <span className={`text-[${COLORS.black}] ${TYPOGRAPHY.pRegular}`}>Manage Plan</span>
          </button>
          <button
            onClick={onUpgrade}
            className={`flex-1 h-[36px] rounded-lg bg-[${COLORS.bluePrimary}] flex items-center justify-center`}
          >
            <span className={`text-[${COLORS.white}] ${TYPOGRAPHY.pRegular}`}>Upgrade</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface OtherAppsCardProps {
  onCheckApp: (app: string) => void;
}

const OtherAppsCard: React.FC<OtherAppsCardProps> = ({ onCheckApp }) => (
  <div className={`w-full rounded-2xl bg-[${COLORS.blueCardBg}] border border-[${COLORS.blueCardBorder}] p-[16px] flex flex-col gap-[12px]`}>
    <p className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>Check subscriptions for other apps</p>
    <div className="flex overflow-x-auto gap-[8px] pb-2">
      <button onClick={() => onCheckApp('Cignal Postpaid')} className={`flex-shrink-0 flex items-center gap-[8px] px-[12px] py-[8px] bg-[${COLORS.white}] rounded-xl`}>
        <GenericAppIcon />
        <span className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>Cignal Postpaid</span>
      </button>
      <button onClick={() => onCheckApp('Cignal Prepaid')} className={`flex-shrink-0 flex items-center gap-[8px] px-[12px] py-[8px] bg-[${COLORS.white}] rounded-xl`}>
        <GenericAppIcon />
        <span className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>Cignal Prepaid</span>
      </button>
      <button onClick={() => onCheckApp('SatLite')} className={`flex-shrink-0 flex items-center gap-[8px] px-[12px] py-[8px] bg-[${COLORS.white}] rounded-xl`}>
        <GenericAppIcon />
        <span className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>SatLite</span>
      </button>
      <button onClick={() => onCheckApp('Pilipinas Live')} className={`flex-shrink-0 flex items-center gap-[8px] px-[12px] py-[8px] bg-[${COLORS.white}] rounded-xl`}>
        <GenericAppIcon />
        <span className={`text-[${COLORS.darkGrayDarkest}] ${TYPOGRAPHY.pRegular}`}>Pilipinas Live</span>
      </button>
    </div>
  </div>
);

interface BottomNavBarProps {
  activeItem: 'Home' | 'Subscriptions' | 'Rewards' | 'Help' | 'Profile';
  onNavigate: (item: 'Home' | 'Subscriptions' | 'Rewards' | 'Help' | 'Profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeItem, onNavigate }) => (
  <nav className={`fixed bottom-0 left-0 right-0 w-full max-w-[414px] mx-auto h-[64.55px] bg-[${COLORS.white}] border-t border-[${COLORS.borderGrayLight}]`}>
    <div className="flex justify-around items-center h-full px-[8px] py-[8px]">
      <button
        className="flex flex-col items-center justify-center p-[4px] rounded-lg"
        onClick={() => onNavigate('Home')}
        aria-current={activeItem === 'Home' ? 'page' : undefined}
      >
        <HomeIcon color={activeItem === 'Home' ? COLORS.bluePrimary : COLORS.darkGrayMedium} width="20" height="20" />
        <span className={`${TYPOGRAPHY.bottomNavText} ${activeItem === 'Home' ? `text-[${COLORS.bluePrimary}]` : `text-[${COLORS.darkGrayMedium}]`}`}>Home</span>
      </button>
      <button
        className="flex flex-col items-center justify-center p-[4px] rounded-lg"
        onClick={() => onNavigate('Subscriptions')}
        aria-current={activeItem === 'Subscriptions' ? 'page' : undefined}
      >
        <SubscriptionsIcon color={activeItem === 'Subscriptions' ? COLORS.bluePrimary : COLORS.darkGrayMedium} width="20" height="20" />
        <span className={`${TYPOGRAPHY.bottomNavText} ${activeItem === 'Subscriptions' ? `text-[${COLORS.bluePrimary}]` : `text-[${COLORS.darkGrayMedium}]`}`}>Subscriptions</span>
      </button>
      <button
        className="flex flex-col items-center justify-center p-[4px] rounded-lg"
        onClick={() => onNavigate('Rewards')}
        aria-current={activeItem === 'Rewards' ? 'page' : undefined}
      >
        <RewardsIcon color={activeItem === 'Rewards' ? COLORS.bluePrimary : COLORS.darkGrayMedium} width="20" height="20" />
        <span className={`${TYPOGRAPHY.bottomNavText} ${activeItem === 'Rewards' ? `text-[${COLORS.bluePrimary}]` : `text-[${COLORS.darkGrayMedium}]`}`}>Rewards</span>
      </button>
      <button
        className="flex flex-col items-center justify-center p-[4px] rounded-lg"
        onClick={() => onNavigate('Help')}
        aria-current={activeItem === 'Help' ? 'page' : undefined}
      >
        <HelpIcon color={activeItem === 'Help' ? COLORS.bluePrimary : COLORS.darkGrayMedium} width="20" height="20" />
        <span className={`${TYPOGRAPHY.bottomNavText} ${activeItem === 'Help' ? `text-[${COLORS.bluePrimary}]` : `text-[${COLORS.darkGrayMedium}]`}`}>Help</span>
      </button>
      <button
        className="flex flex-col items-center justify-center p-[4px] rounded-lg"
        onClick={() => onNavigate('Profile')}
        aria-current={activeItem === 'Profile' ? 'page' : undefined}
      >
        <ProfileIcon color={activeItem === 'Profile' ? COLORS.bluePrimary : COLORS.darkGrayMedium} width="20" height="20" />
        <span className={`${TYPOGRAPHY.bottomNavText} ${activeItem === 'Profile' ? `text-[${COLORS.bluePrimary}]` : `text-[${COLORS.darkGrayMedium}]`}`}>Profile</span>
      </button>
    </div>
  </nav>
);

// --- Main Component ---
export interface ActiveSubscriptionsScreenProps {
  appName: string;
  userInitials: string;
  headerTitle: string;
  headerDescription: string;
  appSelectionLabel: string;
  defaultSelectedApp: string;
  activeSubscription: {
    planName: string;
    status: string;
    price: string;
    billingDate: string;
    features: string[];
  };
  otherAppsPrompt: string;
  availableApps: string[];
}

export const ActiveSubscriptionsScreen: React.FC<ActiveSubscriptionsScreenProps> = ({
  appName,
  userInitials,
  headerTitle,
  headerDescription,
  appSelectionLabel,
  defaultSelectedApp,
  activeSubscription,
  otherAppsPrompt,
  availableApps,
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'History' | 'All Offerings'>('Active');
  const [selectedApp, setSelectedApp] = useState(defaultSelectedApp);
  const [activeBottomNav, setActiveBottomNav] = useState<'Home' | 'Subscriptions' | 'Rewards' | 'Help' | 'Profile'>('Subscriptions');

  // Memoize handlers for performance
  const handleSelectApp = useMemo(() => (app: string) => {
    setSelectedApp(app);
    // In a real app, this would trigger data fetching for the selected app's subscriptions
  }, []);

  const handleManagePlan = useMemo(() => () => {
    console.log('Manage Plan clicked');
    // Implement navigation or modal for managing the plan
  }, []);

  const handleUpgrade = useMemo(() => () => {
    console.log('Upgrade clicked');
    // Implement navigation or modal for upgrading
  }, []);

  const handleCheckOtherApp = useMemo(() => (app: string) => {
    console.log(`Checking subscriptions for ${app}`);
    // Implement navigation or action for checking other app subscriptions
  }, []);

  const handleBottomNav = useMemo(() => (item: 'Home' | 'Subscriptions' | 'Rewards' | 'Help' | 'Profile') => {
    setActiveBottomNav(item);
    console.log(`Navigated to: ${item}`);
  }, []);

  return (
    <div className={`relative w-full max-w-[414px] mx-auto min-h-screen bg-[${COLORS.lightGrayBg}] overflow-y-auto`}>
      {/* Top Bar */}
      <TopBar appName={appName} initials={userInitials} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-[70px]"> {/* Added padding for bottom nav */}
        {/* Header Section */}
        <SubscriptionHeader title={headerTitle} description={headerDescription} />

        {/* App Selection Section */}
        <AppSelection label={appSelectionLabel} selectedApp={selectedApp} onSelectApp={handleSelectApp} />

        {/* Tab Navigation */}
        <div className={`w-full flex justify-between bg-[${COLORS.white}] border-b border-[${COLORS.borderGrayLight}] mt-[16px]`}>
          <div role="tablist" aria-label="Subscription Views" className="flex w-full px-[16px] py-[8px] rounded-xl overflow-hidden gap-[24px]">
            <Tab label="Active" isActive={activeTab === 'Active'} onClick={() => setActiveTab('Active')} />
            <Tab label="History" isActive={activeTab === 'History'} onClick={() => setActiveTab('History')} />
            <Tab label="All Offerings" isActive={activeTab === 'All Offerings'} onClick={() => setActiveTab('All Offerings')} />
          </div>
        </div>

        {/* Tab Panel Content */}
        <div className="p-[16px] flex flex-col gap-[16px]">
          {activeTab === 'Active' && (
            <>
              <ActiveSubscriptionCard
                planName={activeSubscription.planName}
                status={activeSubscription.status}
                price={activeSubscription.price}
                billingDate={activeSubscription.billingDate}
                features={activeSubscription.features}
                onManagePlan={handleManagePlan}
                onUpgrade={handleUpgrade}
              />
              <OtherAppsCard
                onCheckApp={handleCheckOtherApp}
              />
            </>
          )}
          {activeTab === 'History' && (
            <div className={`p-4 bg-[${COLORS.white}] rounded-lg ${TYPOGRAPHY.pRegular}`}>
              History content goes here.
            </div>
          )}
          {activeTab === 'All Offerings' && (
            <div className={`p-4 bg-[${COLORS.white}] rounded-lg ${TYPOGRAPHY.pRegular}`}>
              All Offerings content goes here.
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar activeItem={activeBottomNav} onNavigate={handleBottomNav} />
    </div>
  );
};

// Example usage data for demonstration
// const exampleProps: ActiveSubscriptionsScreenProps = {
//   appName: 'Cignal One',
//   userInitials: 'C1',
//   headerTitle: 'My Subscriptions',
//   headerDescription: 'Manage all your active subscriptions',
//   appSelectionLabel: 'Select App',
//   defaultSelectedApp: 'Cignal Play',
//   activeSubscription: {
//     planName: 'Premium Monthly',
//     status: 'Active',
//     price: '₱399/month',
//     billingDate: 'Next billing on Dec 15, 2024',
//     features: ['4K Streaming', 'Download Content', '2 Devices'],
//   },
//   otherAppsPrompt: 'Check subscriptions for other apps',
//   availableApps: ['Cignal Postpaid', 'Cignal Prepaid', 'SatLite', 'Pilipinas Live'],
// };

// // To use the component:
// // <ActiveSubscriptionsScreen {...exampleProps} />