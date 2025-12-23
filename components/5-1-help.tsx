// src/components/5-1-help.tsx
import React from 'react'; // Ensure React 19 hooks

// --- Design System Data & Utils ---

// Design System Colors (directly from source JSON, no conversion)
const colors = {
  white: '#ffffff',
  darkText: '#101828',
  greyText: '#4a5565',
  lightBackground: '#f9fafb',
  blueAccent: '#155dfc',
  lightGreyInput: '#f3f3f5',
  placeholderGrey: '#717182',
  redDot: '#fb2c36',
  borderColor: '#e5e8ed', // Derived from r: 0.8983431458473206, g: 0.9064381718635559, b: 0.9226285219192505
};

// Design System Typography styles mapped to Tailwind classes and inline styles where needed
// Using 'font-inter' and assuming it's configured in tailwind.config.js or available system-wide.
const typography = {
  // Inferred from "Cignal One" (3:9502) height and common heading scales, as no 24px entry in metadata
  heading1: 'font-inter font-bold text-[24px] leading-[36px] tracking-[-0.54px]',
  // From metadata typography index 0
  heading2: 'font-inter font-medium text-[20px] leading-[30px] tracking-[-0.45px]',
  // From metadata typography index 1 (used for section titles and card titles)
  heading3: 'font-inter font-medium text-[16px] leading-[24px] tracking-[-0.31px]',
  heading4: 'font-inter font-medium text-[16px] leading-[24px] tracking-[-0.31px]', // Same as heading3 for card titles
  // From metadata typography index 1 (default paragraph)
  paragraph: 'font-inter font-normal text-[16px] leading-[24px] tracking-[-0.31px]',
  // For shorter descriptions, e.g., "24/7 Support", "Revert in 24h" - inferred from 16px font and smaller overall height
  smallParagraph: 'font-inter font-normal text-[14px] leading-[20px] tracking-[-0.28px]',
  // For bottom navigation text - inferred from 16px font and 16px line-height for 16px height
  bottomNavText: 'font-inter font-normal text-[16px] leading-[16px] tracking-[-0.31px]',
  // For input placeholder text - inferred from design data (16px font, 19px line height, -0.31px tracking)
  inputPlaceholder: 'font-inter font-normal text-[16px] leading-[19px] tracking-[-0.31px]',
};

// Helper function to generate SVG path for a rectangle
const rectPath = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y} H${x + w} V${y + h} H${x} Z`;

// Helper function to generate SVG path for a circle (cx, cy, r) - used by AccountIcon
const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${r * -2},0`;

// --- Icon Components (SVG paths extracted and simplified from JSON) ---

const EnvelopeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 7L12.0001 12L4 7"
      stroke={colors.blueAccent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 17H20V7L12.0001 12L4 7V17Z"
      stroke={colors.blueAccent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 12.0002C21 16.9708 16.9706 21.0002 12 21.0002C7.02944 21.0002 3 16.9708 3 12.0002C3 7.02967 7.02944 3.00024 12 3.00024C16.9706 3.00024 21 7.02967 21 12.0002Z"
      stroke={colors.blueAccent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.4851 16.1264L16.0591 14.8024L14.7351 14.2284L14.1611 15.5524C13.5871 16.8764 12.4111 17.4504 11.0871 16.8764L7.84712 15.5524C6.52312 14.9784 5.94912 13.8024 6.52312 12.4784L7.84712 9.23838C8.42112 7.91438 9.59712 7.34038 10.9211 7.91438L12.2451 8.48838C13.5691 9.06238 14.1431 10.2384 13.5691 11.5624L12.2451 12.0004"
      stroke={colors.blueAccent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.719 2.45558 15.3444 3.26767 16.786L2.9996 20.9996L7.21318 20.732C8.65476 21.5444 10.2797 22 12 22Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// BillingIcon (from 3:9344 children vectors)
const BillingIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={rectPath(1.99985, 4.99964, 19.99854, 13.99898)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.99985 9.99927H21.9984" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// AccountIcon (from 3:9355 children vectors)
const AccountIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={rectPath(4.99964, 14.9989, 13.99898, 5.99956)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d={circlePath(11.9994, 6.99978, 3.999635)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// TVSignalIcon (from 3:9366 children vectors)
const TVSignalIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={rectPath(6.99949, 1.99985, 9.99912, 5)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d={rectPath(1.99985, 6.99949, 19.99854, 14.99891)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// SubscriptionIcon (from 3:9377 children vectors)
const SubscriptionIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9991 1.99985V21.9984" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d={rectPath(5.99956, 4.99964, 11.99912, 13.99898)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ConnectivityIcon (from 3:9388 children vectors)
const ConnectivityIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={rectPath(1.99985, 5.00000, 19.99854, 3.81938)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d={rectPath(4.99964, 9.99970, 13.99898, 2.85836)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d={rectPath(8.49938, 14.99860, 7, 1.42929)} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// DiagnosticsIcon (No direct icon data, using a generic gear/cog icon for diagnostics)
const DiagnosticsIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

// Bell icon for top bar notifications (assuming standard bell icon)
const BellIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={colors.greyText}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

// Profile icon for top bar (assuming standard user icon)
const UserIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={colors.greyText}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 20a6 6 0 0 0-12 0"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Search icon for top bar
const SearchIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={colors.greyText}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);


// Bottom Navigation Icons
const HomeNavIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SubscriptionsNavIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9C20 7.89543 19.1046 7 18 7Z"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12H20"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RewardsNavIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HelpNavIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.09 9C8.56 8.41 8.26 7.64 8.26 6.78C8.26 4.81 9.87 3.2 11.84 3.2C13.81 3.2 15.42 4.81 15.42 6.78C15.42 7.64 15.12 8.41 14.59 9L12 12V16"
      stroke={colors.blueAccent} // Active color for help
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21.0002H12.01"
      stroke={colors.blueAccent} // Active color for help
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProfileNavIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 20a6 6 0 0 0-12 0"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke={colors.greyText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Component Definitions ---

interface HelpScreenProps {
  // Add any top-level props if the HelpScreen itself needs dynamic data
}

interface TopBarProps {
  appName: string;
  avatarInitials: string;
}

const TopBar: React.FC<TopBarProps> = ({ appName, avatarInitials }) => (
  <div
    className="flex items-center justify-between px-[16px] border-b border-[#e5e8ed] bg-white w-full sticky top-0 z-10"
    style={{ height: '64.57px' }}
  >
    <div className="flex items-center space-x-[12px]">
      <div
        className="flex items-center justify-center w-[40px] h-[40px] rounded-full"
        style={{
          background: `linear-gradient(225deg, #155dfc 0%, #4f39f5 100%)`, // Gradient from TopBar's metadata
        }}
      >
        <span className={`${typography.heading3} text-white`}>{avatarInitials}</span>
      </div>
      <h1 className={`${typography.heading1} text-[#101828]`}>{appName}</h1>
    </div>
    <div className="flex items-center space-x-[16px]">
      <button aria-label="Search" className="relative p-1">
        <SearchIcon className="w-[20px] h-[20px] stroke-[#4a5565]" />
      </button>
      <button aria-label="Notifications" className="relative p-1">
        <BellIcon className="w-[20px] h-[20px] stroke-[#4a5565]" />
        <span
          className="absolute top-[4px] right-[4px] block w-[8px] h-[8px] rounded-full" // Adjusted position
          style={{ background: colors.redDot }}
        ></span>
      </button>
      <button aria-label="Profile" className="relative p-1">
        <UserIcon className="w-[20px] h-[20px] stroke-[#4a5565]" />
      </button>
    </div>
  </div>
);

interface BottomNavigationProps {
  activeItem: 'home' | 'subscriptions' | 'rewards' | 'help' | 'profile';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeItem }) => (
  <nav
    className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e5e8ed] z-10 p-2"
    style={{ height: '64.55px' }}
  >
    <ul className="flex justify-around items-center h-full">
      <li>
        <button className="flex flex-col items-center py-[8px] px-[16px] rounded-[10px]" aria-label="Home">
          <HomeNavIcon className={`w-5 h-5 ${activeItem === 'home' ? 'stroke-[#155dfc]' : 'stroke-[#4a5565]'}`} />
          <span
            className={`${typography.bottomNavText} ${activeItem === 'home' ? 'text-[#155dfc]' : 'text-[#4a5565]'} mt-[4px]`}
          >
            Home
          </span>
        </button>
      </li>
      <li>
        <button className="flex flex-col items-center py-[8px] px-[16px] rounded-[10px]" aria-label="Subscriptions">
          <SubscriptionsNavIcon className={`w-5 h-5 ${activeItem === 'subscriptions' ? 'stroke-[#155dfc]' : 'stroke-[#4a5565]'}`} />
          <span
            className={`${typography.bottomNavText} ${activeItem === 'subscriptions' ? 'text-[#155dfc]' : 'text-[#4a5565]'} mt-[4px]`}
          >
            Subscriptions
          </span>
        </button>
      </li>
      <li>
        <button className="flex flex-col items-center py-[8px] px-[16px] rounded-[10px]" aria-label="Rewards">
          <RewardsNavIcon className={`w-5 h-5 ${activeItem === 'rewards' ? 'stroke-[#155dfc]' : 'stroke-[#4a5565]'}`} />
          <span
            className={`${typography.bottomNavText} ${activeItem === 'rewards' ? 'text-[#155dfc]' : 'text-[#4a5565]'} mt-[4px]`}
          >
            Rewards
          </span>
        </button>
      </li>
      <li>
        <button className="flex flex-col items-center py-[8px] px-[16px] rounded-[10px]" aria-label="Help">
          <HelpNavIcon className={`w-5 h-5 ${activeItem === 'help' ? 'stroke-[#155dfc]' : 'stroke-[#4a5565]'}`} />
          <span
            className={`${typography.bottomNavText} ${activeItem === 'help' ? 'text-[#155dfc]' : 'text-[#4a5565]'} mt-[4px]`}
          >
            Help
          </span>
        </button>
      </li>
      <li>
        <button className="flex flex-col items-center py-[8px] px-[16px] rounded-[10px]" aria-label="Profile">
          <ProfileNavIcon className={`w-5 h-5 ${activeItem === 'profile' ? 'stroke-[#155dfc]' : 'stroke-[#4a5565]'}`} />
          <span
            className={`${typography.bottomNavText} ${activeItem === 'profile' ? 'text-[#155dfc]' : 'text-[#4a5565]'} mt-[4px]`}
          >
            Profile
          </span>
        </button>
      </li>
    </ul>
  </nav>
);

interface IssueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string; // CSS linear-gradient string
}

const IssueCard: React.FC<IssueCardProps> = ({ icon: Icon, title, description, gradient }) => (
  <button
    className="flex items-center w-full bg-white rounded-[14px] border border-[#e5e8ed] px-[16px] py-[16px] space-x-[16px] text-left"
    style={{ minHeight: '81.15px', borderWidth: '0.582217px' }}
  >
    <div
      className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] flex-shrink-0"
      style={{ background: gradient }}
    >
      <Icon className="w-[24px] h-[24px]" />
    </div>
    <div className="flex flex-col flex-grow">
      <h4 className={`${typography.heading4} text-[#101828]`}>{title}</h4>
      <p className={`${typography.smallParagraph} text-[#4a5565]`}>{description}</p>
    </div>
  </button>
);

interface SupportContactButtonProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SupportContactButton: React.FC<SupportContactButtonProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <button
    className="flex flex-col items-center justify-center bg-white rounded-[14px] border border-[#e5e8ed] py-[16px] w-[185px] h-[105px]"
    style={{ borderWidth: '0.582217px' }}
  >
    <Icon className="w-[24px] h-[24px]" />
    <h4 className={`${typography.paragraph} text-[#101828] mt-[8px]`}>{title}</h4>
    <p className={`${typography.smallParagraph} text-[#4a5565]`}>{description}</p>
  </button>
);

interface ResourceLinkProps {
  title: string;
  description: string;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({ title, description }) => (
  <button
    className="flex flex-col items-start bg-white rounded-[14px] border border-[#e5e8ed] px-[16px] py-[16px] text-left w-full"
    style={{ minHeight: '81.14px', borderWidth: '0.582217px' }}
  >
    <h4 className={`${typography.paragraph} text-[#101828]`}>{title}</h4>
    <p className={`${typography.smallParagraph} text-[#4a5565] mt-1`}>{description}</p>
  </button>
);

// Main HelpScreen Component
export const HelpScreen: React.FC<HelpScreenProps> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb] font-inter">
      {/* Top Bar */}
      <TopBar appName="Cignal One" avatarInitials="C1" />

      {/* Main Content Area */}
      <main className="flex-grow pt-0 pb-[80px] overflow-y-auto w-full max-w-[413px] mx-auto">
        {/* Help Center Header */}
        <div className="bg-white p-[16px] border-b border-[#e5e8ed] mb-[16px]">
          <h2 className={`${typography.heading2} text-[#101828] mb-[4px]`}>Help Center</h2>
          <p className={`${typography.paragraph} text-[#4a5565]`}>How can we help you today?</p>
        </div>

        {/* Search Input */}
        <div className="bg-white p-[16px] border-b border-[#e5e8ed] mb-[16px]">
          <div className="flex items-center bg-[#f3f3f5] rounded-[8px] h-[36px] px-[12px]">
            <SearchIcon className="w-[16px] h-[16px] stroke-[#717182] mr-[8px]" />
            <input
              type="text"
              placeholder="Search for help..."
              className={`${typography.inputPlaceholder} text-[#717182] bg-transparent outline-none flex-grow`}
              aria-label="Search for help"
            />
          </div>
        </div>

        {/* Common Issues Section */}
        <section className="mb-[32px] px-[16px]">
          <h3 className={`${typography.heading3} text-[#101828] mb-[16px]`}>Common Issues</h3>
          <div className="grid grid-cols-1 gap-[12px]">
            <IssueCard
              icon={BillingIcon}
              title="Billing & Payments"
              description="Payment methods, invoices, refunds"
              gradient="linear-gradient(225deg, #2b7ffc 0%, #155dfc 100%)"
            />
            <IssueCard
              icon={AccountIcon}
              title="Account Management"
              description="Login, password, profile settings"
              gradient="linear-gradient(225deg, #ac46ff 0%, #980ff9 100%)"
            />
            <IssueCard
              icon={TVSignalIcon}
              title="TV Signal Issues"
              description="No signal, poor quality, troubleshooting"
              gradient="linear-gradient(225deg, #f6339a 0%, #e40076 100%)"
            />
            <IssueCard
              icon={SubscriptionIcon}
              title="Subscription Plans"
              description="Upgrade, downgrade, cancel subscription"
              gradient="linear-gradient(225deg, #615ffc 0%, #4f39f5 100%)"
            />
            <IssueCard
              icon={ConnectivityIcon}
              title="Connectivity"
              description="Internet issues, streaming problems"
              gradient="linear-gradient(225deg, #615ffc 0%, #4f39f5 100%)"
            />
            <IssueCard
              icon={DiagnosticsIcon} // Placeholder icon
              title="Diagnostics"
              description="Diagnostics"
              gradient="linear-gradient(225deg, #615ffc 0%, #4f39f5 100%)"
            />
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="mb-[32px] px-[16px]">
          <h3 className={`${typography.heading3} text-[#101828] mb-[16px]`}>Contact Support</h3>
          <div
            className="rounded-[14px] p-[24px] mb-[16px] flex flex-col items-start"
            style={{
              background: `linear-gradient(225deg, #155dfc 0%, #4f39f5 100%)`, // Gradient from metadata
              minHeight: '148px'
            }}
          >
            <div className="flex items-center space-x-[12px] mb-[16px]">
              <ChatIcon className="w-[32px] h-[32px] flex-shrink-0" />
              <div>
                <h4 className={`${typography.paragraph} text-white`}>Chat with us</h4>
                <p className={`${typography.smallParagraph} text-white/90`}>
                  Average response time: 2 minutes
                </p>
              </div>
            </div>
            <button className="bg-white rounded-[8px] px-4 py-2 w-full text-center h-[36px]" aria-label="Start Chat">
              <span className={`${typography.paragraph} font-medium text-[#155dfc]`}>Start Chat</span>
            </button>
          </div>
          <div className="flex justify-between space-x-[12px]">
            <SupportContactButton icon={PhoneIcon} title="Call Us" description="24/7 Support" />
            <SupportContactButton icon={EnvelopeIcon} title="Email" description="Revert in 24h" />
          </div>
        </section>

        {/* Self-Help Resources Section */}
        <section className="mb-[32px] px-[16px]">
          <h3 className={`${typography.heading3} text-[#101828] mb-[16px]`}>Self-Help Resources</h3>
          <div className="grid grid-cols-1 gap-[12px]">
            <ResourceLink
              title="How to change my subscription plan?"
              description="Step-by-step guide to upgrading or downgrading"
            />
            <ResourceLink
              title="Troubleshooting TV signal issues"
              description="Common fixes for signal problems"
            />
            <ResourceLink
              title="Payment methods and billing"
              description="Everything about payments and invoices"
            />
            <ResourceLink
              title="Understanding rewards points"
              description="How to earn and redeem points"
            />
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="help" />
    </div>
  );
};