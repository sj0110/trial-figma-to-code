// src/components/AllOfferingsScreen.tsx
import React, { useState, useMemo } from 'react';

// --- Utils & Types ---

// Helper to convert Figma's 0-1 RGB to a hex string.
// This is used for colors defined directly within the structure's fills/strokes
// that are not explicitly part of the designSystem.colors list.
const figmaRgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// --- Design System Colors ---
// Extracted and mapped from designSystem.colors and implicitly used RGBs from structure.
const AppColors = {
  white: '#ffffff',
  grayText: '#4a5565', // color-2
  darkText: '#101828', // color-3
  black: '#0a0a0a',   // color-4
  bluePrimary: '#155dfc', // color-5
  lightBg: '#f9fafb', // color-6
  lightGrayBorder: '#f3f3f5', // color-7
  lightGreenBg: '#dcfce7', // color-8
  greenText: '#008236', // color-9
  redNotification: '#fb2c36', // color-10
  // Derived colors for pixel perfection, not explicitly in designSystem.colors:
  borderGray: '#e4e7eb', // from r:0.898 g:0.906 b:0.922
  iconGrayStroke: '#717182', // from r:0.443 g:0.443 b:0.509
  topBarIconStroke: '#364153', // from r:0.211 g:0.254 b:0.325
};

// --- Icons (Vector paths extracted from JSON) ---

interface IconProps {
  className?: string;
  color?: string; // Fill color for SVG
  stroke?: string; // Stroke color for SVG
  strokeWidth?: number; // Stroke width for SVG
  paths: { d: string; stroke?: string; fill?: string; strokeWidth?: number; }[];
  viewBox?: string;
}

const BaseIcon: React.FC<IconProps> = ({ className, paths, viewBox = "0 0 20 20", color, stroke, strokeWidth }) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox={viewBox}
    fill={color || 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    {paths.map((path, index) => (
      <path
        key={index}
        d={path.d}
        stroke={path.stroke || stroke}
        fill={path.fill || 'none'}
        strokeWidth={path.strokeWidth || strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </svg>
);

const AppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BaseIcon
    className={className}
    stroke={AppColors.iconGrayStroke}
    strokeWidth={1.3327306509017944}
    paths={[
      { d: "M 3.3318264484405518 1.998699426651001 L 13.99449462890625 1.998699426651001 L 13.99449462890625 13.994065284729004 L 3.3318264484405518 13.994065284729004 L 3.3318264484405518 1.998699426651001 Z M 1.9990956783294678 1.998699426651001 L 15.327299118041992 1.998699426651001 L 15.327299118041992 13.994065284729004 L 1.9990956783294678 13.994065284729004 L 1.9990956783294678 1.998699426651001 Z" }
    ]}
    viewBox="0 0 16 16"
  />
);

const DropdownArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BaseIcon
    className={className}
    stroke={AppColors.iconGrayStroke}
    strokeWidth={1.3327306509017944}
    paths={[
      { d: "M 3.9981918334960938 5.997287750244141 L 7.9963836669921875 9.995479583740234 L 11.994575500488281 5.997287750244141" }
    ]}
    viewBox="0 0 16 16"
  />
);

const CheckmarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BaseIcon
    className={className}
    stroke={AppColors.bluePrimary}
    strokeWidth={1.3327306509017944}
    paths={[
      { d: "M 1.3327306509017944 1.3327306509017944 C 4.998394966125488 4.998394966125488 13.327305793762207 1.3327306509017944 13.327305793762207 1.3327306509017944 L 13.327305793762207 13.327305793762207 L 1.3327306509017944 13.327305793762207 L 1.3327306509017944 1.3327306509017944 Z" },
      { d: "M 5.997287750244141 6.6636528968811035 L 7.9963836669921875 9.329117774963379 L 9.995479583740234 6.6636528968811035" }
    ]}
    viewBox="0 0 16 16"
  />
);

const HomeIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
  <BaseIcon
    className={className}
    stroke={color || AppColors.grayText}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 7.498315811157227 9.997754096984863 L 12.4971923828125 9.997754096984863 L 12.4971923828125 15.83017635345459 L 7.498315811157227 15.83017635345459 L 7.498315811157227 9.997754096984863 Z" },
      { d: "M 2.499438524246216 1.6658855676651 L 14.996631622314453 1.6658855676651 L 14.996631622314453 15.83017635345459 L 2.499438524246216 15.83017635345459 L 2.499438524246216 1.6658855676651 Z" }
    ]}
  />
);

const SubscriptionsIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
  <BaseIcon
    className={className}
    stroke={color || AppColors.bluePrimary}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 1.6662923097610474 4.165730953216553 L 18.32921600341797 4.165730953216553 L 18.32921600341797 15.83017635345459 L 1.6662923097610474 15.83017635345459 L 1.6662923097610474 4.165730953216553 Z" },
      { d: "M 1.6662923097610474 8.331461906433105 L 18.32921600341797 8.331461906433105" }
    ]}
  />
);

const RewardsIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
  <BaseIcon
    className={className}
    stroke={color || AppColors.grayText}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 2.499438524246216 6.6651692390441895 L 17.496631622314453 6.6651692390441895 L 17.496631622314453 9.997754096984863 L 2.499438524246216 9.997754096984863 L 2.499438524246216 6.6651692390441895 Z" },
      { d: "M 9.997754096984863 6.6651692390441895 L 9.997754096984863 17.496070861816406" },
      { d: "M 4.165730953216553 9.997754096984863 L 15.83017635345459 9.997754096984863 L 15.83017635345459 17.496070861816406 L 4.165730953216553 17.496070861816553 L 4.165730953216553 9.997754096984863 Z" },
      { d: "M 4.165730953216553 2.499082565307617 L 15.83017635345459 2.499082565307617 L 15.83017635345459 6.6651692390441895 L 4.165730953216553 6.6651692390441895 L 4.165730953216553 2.499082565307617 Z" }
    ]}
  />
);

const HelpIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
  <BaseIcon
    className={className}
    stroke={color || AppColors.grayText}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 1.6662923097610474 1.6662923097610474 L 18.32921600341797 1.6662923097610474 L 18.32921600341797 18.32921600341797 L 1.6662923097610474 18.32921600341797 L 1.6662923097610474 1.6662923097610474 Z" },
      { d: "M 7.573295593261719 5.828310966491699 L 12.430540084838867 5.828310966491699 L 12.430540084838867 10.830900192260742 L 7.573295593261719 10.830900192260742 L 7.573295593261719 5.828310966491699 Z" },
      { d: "M 9.997754096984863 14.163484573364258 L 9.997754096984863 14.163484573364258" }
    ]}
  />
);

const ProfileIcon: React.FC<{ className?: string; color?: string }> = ({ className, color }) => (
  <BaseIcon
    className={className}
    stroke={color || AppColors.grayText}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 4.165730953216553 12.4971923828125 L 15.83017635345459 12.4971923828125 L 15.83017635345459 17.496070861816406 L 4.165730953216553 17.496070861816406 L 4.165730953216553 12.4971923828125 Z" },
      { d: "M 6.6651692390441895 2.499438524246216 L 13.330338478088379 2.499438524246216 L 13.330338478088379 9.164607048034668 L 6.6651692390441895 9.164607048034668 L 6.6651692390441895 2.499438524246216 Z" }
    ]}
  />
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BaseIcon
    className={className}
    stroke={AppColors.topBarIconStroke}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 13.880218505859375 13.880213737487793 L 17.496070861816406 17.496070861816406" },
      { d: "M 2.499438524246216 2.499438524246216 L 15.83017635345459 2.499438524246216 L 15.83017635345459 15.83017635345459 L 2.499438524246216 15.83017635345459 L 2.499438524246216 2.499438524246216 Z" }
    ]}
  />
);

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BaseIcon
    className={className}
    stroke={AppColors.topBarIconStroke}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 8.554749488830566 17.496070861816406 L 11.440768241882324 17.496070861816406 L 11.440768241882324 18.329143524169922 L 8.554749488830566 18.329143524169922 L 8.554749488830566 17.496070861816406 Z" },
      { d: "M 2.5000486373901367 1.6662923097610474 L 17.496370315551758 1.6662923097610474 L 17.496370315551758 14.163484573364258 L 2.5000486373901367 14.163484573364258 L 2.5000486373901367 1.6662923097610474 Z" }
    ]}
  />
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BaseIcon
    className={className}
    stroke={AppColors.topBarIconStroke}
    strokeWidth={1.666292428970337}
    paths={[
      { d: "M 4.165730953216553 12.497194290161133 L 15.83017635345459 12.497194290161133 L 15.83017635345459 17.49607276916504 L 4.165730953216553 17.49607276916504 L 4.165730953216553 12.497194290161133 Z" },
      { d: "M 6.6651692390441895 2.499438524246216 L 13.330338478088379 2.499438524246216 L 13.330338478088379 9.164607048034668 L 6.6651692390441895 9.164607048034668 L 6.6651692390441895 2.499438524246216 Z" }
    ]}
  />
);


// --- Reusable Sub-components ---

interface TopBarProps {
  appName: string;
  onSearchClick: () => void;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  hasNotifications: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  appName,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  hasNotifications,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-[16px] py-[12px] h-[64.57px] bg-[#ffffff] border-b border-[#e4e7eb] z-10">
      <div className="flex items-center gap-[12px]">
        <div className="flex items-center justify-center rounded-full w-[40px] h-[40px] bg-gradient-to-br from-[#155dfc] to-[#4c39f6]">
          <span className="font-sans text-[16px] font-normal leading-[24px] tracking-[-0.31px] text-[#ffffff]">C1</span>
        </div>
        <h1 className="font-sans text-[30px] font-medium leading-[36px] tracking-[-0.56px] text-[#101828]">
          {appName}
        </h1>
      </div>
      <div className="flex items-center gap-0">
        <button onClick={onSearchClick} aria-label="Search" className="flex items-center justify-center w-[36px] h-[36px] rounded-full">
          <SearchIcon className="w-[20px] h-[20px]" />
        </button>
        <button onClick={onNotificationsClick} aria-label="Notifications" className="relative flex items-center justify-center w-[36px] h-[36px] rounded-full">
          <BellIcon className="w-[20px] h-[20px]" />
          {hasNotifications && (
            <span className="absolute top-[4px] right-[4px] w-[8px] h-[8px] rounded-full bg-[#fb2c36]" aria-hidden="true"></span>
          )}
        </button>
        <button onClick={onProfileClick} aria-label="Profile" className="flex items-center justify-center w-[36px] h-[36px] rounded-full">
          <UserIcon className="w-[20px] h-[20px]" />
        </button>
      </div>
    </header>
  );
};

interface BottomNavBarProps {
  activeTab: 'home' | 'subscriptions' | 'rewards' | 'help' | 'profile';
  onTabChange: (tab: 'home' | 'subscriptions' | 'rewards' | 'help' | 'profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const getTabClasses = (tabName: BottomNavBarProps['activeTab']) => {
    const isActive = activeTab === tabName;
    const textColor = isActive ? 'text-[#155dfc]' : 'text-[#4a5565]';
    const iconColor = isActive ? AppColors.bluePrimary : AppColors.grayText;
    return {
      container: `flex flex-col items-center justify-center w-full h-full rounded-[10px] py-[8px] px-0`,
      text: `font-sans text-[13px] font-medium leading-[16px] tracking-[-0.13px] ${textColor}`,
      iconColor: iconColor,
    };
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[64.55px] bg-[#ffffff] border-t border-[#e4e7eb] flex justify-around items-start pt-[8.58px] px-[8px] z-10">
      <button onClick={() => onTabChange('home')} className={getTabClasses('home').container}>
        <HomeIcon className="w-[20px] h-[20px]" color={getTabClasses('home').iconColor} />
        <span className={getTabClasses('home').text}>Home</span>
      </button>
      <button onClick={() => onTabChange('subscriptions')} className={getTabClasses('subscriptions').container}>
        <SubscriptionsIcon className="w-[20px] h-[20px]" color={getTabClasses('subscriptions').iconColor} />
        <span className={getTabClasses('subscriptions').text}>Subscriptions</span>
      </button>
      <button onClick={() => onTabChange('rewards')} className={getTabClasses('rewards').container}>
        <RewardsIcon className="w-[20px] h-[20px]" color={getTabClasses('rewards').iconColor} />
        <span className={getTabClasses('rewards').text}>Rewards</span>
      </button>
      <button onClick={() => onTabChange('help')} className={getTabClasses('help').container}>
        <HelpIcon className="w-[20px] h-[20px]" color={getTabClasses('help').iconColor} />
        <span className={getTabClasses('help').text}>Help</span>
      </button>
      <button onClick={() => onTabChange('profile')} className={getTabClasses('profile').container}>
        <ProfileIcon className="w-[20px] h-[20px]" color={getTabClasses('profile').iconColor} />
        <span className={getTabClasses('profile').text}>Profile</span>
      </button>
    </nav>
  );
};

interface FeatureListItemProps {
  text: string;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ text }) => (
  <div className="flex items-center gap-[8px] self-stretch">
    <div className="flex items-center justify-center w-[16px] h-[16px]">
      <CheckmarkCircleIcon className="w-[16px] h-[16px]" />
    </div>
    <span className="font-sans text-[16px] font-normal leading-[20px] tracking-[-0.31px] text-[#4a5565]">
      {text}
    </span>
  </div>
);

interface ActionButtonProps {
  label: string;
  primary?: boolean;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, primary = false, onClick }) => {
  const buttonClasses = primary
    ? 'bg-[#155dfc] text-[#ffffff]'
    : 'bg-[#ffffff] text-[#0a0a0a] border border-black/10'; // Figma has opacity 0.1 for black stroke

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center py-[8px] px-[16px] rounded-lg h-[36px] 
                  font-sans text-[16px] font-medium leading-[20px] tracking-[-0.31px] ${buttonClasses}`}
    >
      {label}
    </button>
  );
};

interface PlanBadgeProps {
  label: string;
  primary?: boolean; // For "Most Popular"
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ label, primary = false }) => {
  const badgeClasses = primary
    ? 'bg-[#155dfc] text-[#ffffff]'
    : 'bg-[#dcfce7] text-[#008236]';

  return (
    <div
      className={`absolute top-[-10px] left-[18px] flex items-center justify-center rounded-lg px-[8px] py-[2px] h-[21.14px] 
                  font-sans text-[13px] font-medium leading-[16px] tracking-[-0.13px] ${badgeClasses}`}
    >
      {label}
    </div>
  );
};


interface SubscriptionPlanCardProps {
  title: string;
  description: string;
  features: string[];
  badge?: { label: string; primary?: boolean };
  onLearnMoreClick: () => void;
  onActionClick: () => void;
  actionLabel: string;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  description,
  features,
  badge,
  onLearnMoreClick,
  onActionClick,
  actionLabel,
}) => {
  const cardBorderColor = badge?.primary ? AppColors.bluePrimary : AppColors.borderGray;
  return (
    <div className={`relative flex flex-col p-[26px] rounded-2xl border-[1.75px] border-[${cardBorderColor}] bg-[#ffffff] self-stretch`}>
      {badge && <PlanBadge label={badge.label} primary={badge.primary} />}
      <div className="flex flex-col gap-[8px] self-stretch">
        <h3 className="font-sans text-[18px] font-medium leading-[27px] tracking-[-0.31px] text-[#101828]">
          {title}
        </h3>
        <p className="font-sans text-[16px] font-normal leading-[24px] tracking-[-0.31px] text-[#101828]">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-[8px] self-stretch mt-[16px]">
        {features.map((feature, index) => (
          <FeatureListItem key={index} text={feature} />
        ))}
      </div>
      <div className="flex gap-[12px] self-stretch mt-[36px]">
        <ActionButton label="Learn More" onClick={onLearnMoreClick} />
        <ActionButton label={actionLabel} primary onClick={onActionClick} />
      </div>
    </div>
  );
};

interface TabSwitcherProps {
  activeTab: 'active' | 'history' | 'all-offerings';
  onTabChange: (tab: 'active' | 'history' | 'all-offerings') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const getTabClasses = (tabName: TabSwitcherProps['activeTab']) => {
    const isActive = activeTab === tabName;
    const baseClasses = "flex-1 flex items-center justify-center py-[8px] px-[16px] h-[38.32px] font-sans text-[16px] font-medium leading-[20px] tracking-[-0.31px] text-[#0a0a0a]";
    const activeClasses = `bg-[${AppColors.white}] border border-[${AppColors.bluePrimary}] rounded-[14px]`;
    const inactiveClasses = "border border-transparent"; // Add transparent border to prevent shifting

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex self-stretch px-[16px] py-0">
      <div className="flex w-full items-center justify-between gap-[24px] rounded-[14px] border border-[#f3f3f5] bg-[#f3f3f5]">
        <button onClick={() => onTabChange('active')} className={getTabClasses('active')}>
          Active
        </button>
        <button onClick={() => onTabChange('history')} className={getTabClasses('history')}>
          History
        </button>
        <button onClick={() => onTabChange('all-offerings')} className={getTabClasses('all-offerings')}>
          All Offerings
        </button>
      </div>
    </div>
  );
};


// --- Main Component ---

interface AllOfferingsScreenProps {
  onSelectApp: () => void;
  onLearnMoreSpecial: () => void;
  onSelectPrograms: () => void;
  onLearnMoreBasic: () => void;
  onUpgradeBasic: () => void;
  onLearnMorePremium: () => void;
  onUpgradePremium: () => void;
  onSearchClick: () => void;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
}

export const AllOfferingsScreen: React.FC<AllOfferingsScreenProps> = ({
  onSelectApp,
  onLearnMoreSpecial,
  onSelectPrograms,
  onLearnMoreBasic,
  onUpgradeBasic,
  onLearnMorePremium,
  onUpgradePremium,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
}) => {
  const [currentTab, setCurrentTab] = useState<'active' | 'history' | 'all-offerings'>('all-offerings');
  const [bottomNavActive, setBottomNavActive] = useState<'home' | 'subscriptions' | 'rewards' | 'help' | 'profile'>('subscriptions');

  return (
    <div className="flex flex-col w-[414px] min-h-[100vh] bg-[#f9fafb] overflow-auto">
      <TopBar
        appName="Cignal One"
        onSearchClick={onSearchClick}
        onNotificationsClick={onNotificationsClick}
        onProfileClick={onProfileClick}
        hasNotifications={true}
      />

      <main className="flex-1 flex flex-col pt-[64.57px] pb-[64.55px] space-y-[8px]">
        {/* Header Section */}
        <div className="bg-[#ffffff] border-b border-[#e4e7eb] py-[24px] px-[16px] h-[110.57px]">
          <h2 className="font-sans text-[20px] font-medium leading-[30px] tracking-[-0.45px] text-[#101828]">
            My Subscriptions
          </h2>
          <p className="font-sans text-[16px] font-normal leading-[24px] tracking-[-0.31px] text-[#4a5565] mt-[8px]">
            Manage all your active subscriptions
          </p>
        </div>

        {/* Select App Section */}
        <div className="bg-[#ffffff] border-b border-[#e4e7eb] pt-[16px] pb-[16px] px-[16px] h-[96.56px]">
          <label htmlFor="app-selector" className="block font-sans text-[16px] font-medium leading-[20px] tracking-[-0.31px] text-[#4a5565]">
            Select App
          </label>
          <button
            id="app-selector"
            onClick={onSelectApp}
            className="flex items-center justify-between bg-[#f3f3f5] border border-transparent rounded-lg h-[36px] mt-[8px] w-full px-[13px] py-[8px]"
          >
            <div className="flex items-center gap-[8px]">
              <AppIcon className="w-[16px] h-[16px]" />
              <span className="font-sans text-[16px] font-medium leading-[20px] tracking-[-0.31px] text-[#0a0a0a]">
                Cignal Play
              </span>
            </div>
            <DropdownArrowIcon className="w-[16px] h-[16px]" />
          </button>
        </div>

        {/* Tab Navigation and Content */}
        <div className="flex-1 flex flex-col bg-[#ffffff] py-0 px-0 pb-[16px]">
          <TabSwitcher activeTab={currentTab} onTabChange={setCurrentTab} />

          <div className="flex flex-col gap-[16px] p-[16px] mt-[16px]">
            {currentTab === 'all-offerings' && (
              <>
                <SubscriptionPlanCard
                  title="Select your Services"
                  description="Pay-as-per-Program Basis"
                  features={[
                    "HD Streaming",
                    "1 Device",
                    "Choose your own programs",
                  ]}
                  badge={{ label: "Special Plan" }}
                  onLearnMoreClick={onLearnMoreSpecial}
                  onActionClick={onSelectPrograms}
                  actionLabel="Select Programs"
                />

                <SubscriptionPlanCard
                  title="Basic Plan"
                  description="₱199/month"
                  features={[
                    "HD Streaming",
                    "1 Device",
                    "Limited Library",
                  ]}
                  onLearnMoreClick={onLearnMoreBasic}
                  onActionClick={onUpgradeBasic}
                  actionLabel="Upgrade"
                />

                <SubscriptionPlanCard
                  title="Premium Plan"
                  description="₱399/month"
                  features={[
                    "4K Streaming",
                    "2 Devices",
                    "Full Library",
                    "Downloads",
                  ]}
                  badge={{ label: "Most Popular", primary: true }}
                  onLearnMoreClick={onLearnMorePremium}
                  onActionClick={onUpgradePremium}
                  actionLabel="Upgrade"
                />
              </>
            )}
            {currentTab === 'active' && (
              <div className="text-center text-[#4a5565] py-8 font-sans text-[16px]">No active subscriptions.</div>
            )}
            {currentTab === 'history' && (
              <div className="text-center text-[#4a5565] py-8 font-sans text-[16px]">No subscription history.</div>
            )}
          </div>
        </div>
      </main>

      <BottomNavBar activeTab={bottomNavActive} onTabChange={setBottomNavActive} />
    </div>
  );
};