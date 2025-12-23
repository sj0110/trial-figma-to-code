// src/components/3-2-past-subscriptions.tsx
import React, { useState, useMemo } from 'react';

// --- Design System Tokens (Extracted from JSON) ---

type DesignColors = {
  'bg-primary-app': string; // #f9fafb
  'bg-card-default': string; // #ffffff
  'bg-button-secondary': string; // #f3f3f5
  'bg-header-bar': string; // #ffffff
  'text-heading': string; // #101828
  'text-body': string; // #4a5565
  'text-button-dark': string; // #0a0a0a
  'text-button-active': string; // #155dfc
  'text-white': string; // #ffffff
  'border-default': string; // #e5e7eb (from r:0.898,g:0.906,b:0.922)
  'border-button-active': string; // #155dfc
  'icon-stroke-default': string; // #4a5565
  'icon-stroke-active': string; // #155dfc
  'icon-stroke-topbar': string; // #364153 (newly identified for top bar icons)
  'gradient-start': string; // #155dfc
  'gradient-end': string; // #3108f7 (from r:0.310,g:0.224,b:0.966)
  'badge-alert': string; // #fb2c36
};

const designTokens = {
  colors: {
    'bg-primary-app': '#f9fafb', // color-5
    'bg-card-default': '#ffffff', // color-2
    'bg-button-secondary': '#f3f3f5', // color-6
    'bg-header-bar': '#ffffff', // color-2
    'text-heading': '#101828', // color-3
    'text-body': '#4a5565', // color-1
    'text-button-dark': '#0a0a0a', // color-4
    'text-button-active': '#155dfc', // color-7
    'text-white': '#ffffff', // color-2
    'border-default': '#E5E7EB', // Derived from r:0.898,g:0.906,b:0.922
    'border-button-active': '#155dfc', // color-7
    'icon-stroke-default': '#4A5565', // Derived from r:0.443,g:0.443,b:0.509 (matches color-1)
    'icon-stroke-active': '#155DFC', // Derived from r:0.082,g:0.364,b:0.988 (matches color-7)
    'icon-stroke-topbar': '#364153', // Derived from r:0.211,g:0.254,b:0.325
    'gradient-start': '#155dfc', // color-7
    'gradient-end': '#4F39F4', // Derived from r:0.310,g:0.224,b:0.966
    'badge-alert': '#fb2c36', // color-8
  } as DesignColors,

  typography: {
    'heading-1': 'text-[24px] font-medium leading-[36px] tracking-[-0.45px]',
    'heading-2': 'text-[20px] font-medium leading-[30px] tracking-[-0.45px]',
    'paragraph-lg': 'text-[16px] font-normal leading-[24px] tracking-[-0.31px]',
    'paragraph-lg-medium': 'text-[16px] font-medium leading-[24px]', // For card titles
    'paragraph-sm': 'text-[13px] font-normal leading-[16px]', // For badges and bottom nav
  },
};

// --- Icon Components (Simplified SVGs based on JSON vector data) ---
// For production, these would typically be actual SVG components or from an icon library.
// The paths are converted from the original Figma vector data.

interface IconProps {
  className?: string;
  color?: string;
}

const HomeIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.5 17.5V10H12.5V17.5M2.5 7.5L10 2.5L17.5 7.5V17.5C17.5 17.7652 17.3946 18.0196 17.2071 18.2071C17.0196 18.3946 16.7652 18.5 16.5 18.5H3.5C3.23478 18.5 2.98043 18.3946 2.79289 18.2071C2.60536 18.0196 2.5 17.7652 2.5 17.5V7.5L2.5 7.5Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SubscriptionsIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-active'] }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.66663 4.16699H18.3333V15.8337C18.3333 16.2759 18.1576 16.7 17.845 17.0126C17.5324 17.3252 17.108 17.5003 16.6657 17.5003H3.3333C2.89097 17.5003 2.46657 17.3252 2.15396 17.0126C1.84135 16.7 1.66567 16.2759 1.66567 15.8337V4.16699H1.66663Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.66663 8.33301H18.3333" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RewardsIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.5 6.66699H17.5V10.0003C17.5 10.4426 17.3243 10.867 17.0117 11.1796C16.6991 11.4922 16.2747 11.667 15.8323 11.667H4.16667C3.72433 11.667 3.29994 11.4922 2.98733 11.1796C2.67471 10.867 2.5 10.4426 2.5 10.0003V6.66699Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.99961 6.66699V17.5003" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.16663 10.0003H15.8333" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.16663 2.50034L15.8333 2.50034C16.2756 2.50034 16.7001 2.67503 17.0127 2.98764C17.3253 3.30026 17.5 3.72465 17.5 4.16699V6.66699H2.5V4.16699C2.5 3.72465 2.67471 3.30026 2.98733 2.98764C3.29994 2.67503 3.72433 2.50034 4.16663 2.50034Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HelpIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.66663 1.66699H18.3333V18.3337H1.66663V1.66699Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.57329 5.82861C7.57329 5.82861 12.4267 5.82861 12.4267 5.82861C12.4267 8.32861 9.99996 9.16195 9.99996 11.6619" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.99775 14.1635H10.0061" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4.16573 12.4972C4.16573 12.4972 15.8333 12.4972 15.8333 12.4972C15.8333 12.4972 15.8333 17.4961 9.9994 17.4961C4.16573 17.4961 4.16573 12.4972 4.16573 12.4972Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66517 2.49944C6.66517 2.49944 13.3327 2.49944 13.3327 2.49944C13.3327 2.49944 13.3327 9.16517 9.9994 9.16517C6.66517 9.16517 6.66517 2.49944 6.66517 2.49944Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AppIconPlaceholder = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  // Original Figma id: 3:8081 - represents a generic app icon
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.33183 2C3.33183 2 13.9945 2 13.9945 2C13.9945 14 3.33183 14 3.33183 14C3.33183 14 3.33183 2 3.33183 2Z" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDownIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  // Original Figma id: 3:8085 - simple arrow down
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.99819 5.99729L7.99638 9.99548L11.9946 5.99729" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-default'] }: IconProps) => (
  // Original Figma id: 3:8108-3:8111 - simplified calendar icon
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5.33092 1.33273V4.00037" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6618 1.33273V4.00037" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.9991 2.66546H13.9937V14.6599H1.9991V2.66546Z" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.9991 6.66365H13.9937" stroke={color} strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TopBarSearchIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-topbar'] }: IconProps) => (
  // Original Figma id: 3:8182, 3:8183 - simplified search icon
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.8802 13.8802L17.4998 17.4998" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 2.5C2.5 2.5 17.5 2.5 17.5 2.5C17.5 17.5 2.5 17.5 2.5 17.5C2.5 17.5 2.5 2.5 2.5 2.5Z" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TopBarBellIcon = ({ className = 'stroke-current', color = designTokens.colors['icon-stroke-topbar'] }: IconProps) => (
  // Original Figma id: 3:8186, 3:8187 - simplified bell icon
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4.16573 12.4972V17.4961H15.8333V12.4972" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66517 2.49944V9.16517C6.66517 9.16517 13.3327 9.16517 13.3327 9.16517V2.49944" stroke={color} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Data Types and Mocks ---

interface Subscription {
  id: string;
  appName: string;
  plan: string;
  status: 'expired' | 'completed' | 'active';
  dateRange: string;
  totalPaid: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    appName: 'Cignal Play',
    plan: 'Basic Monthly',
    status: 'expired',
    dateRange: 'Jan 2024 - Oct 2024',
    totalPaid: '₱2,990',
  },
  {
    id: 'sub2',
    appName: 'Pilipinas Live',
    plan: 'Premium Annual',
    status: 'completed',
    dateRange: 'Mar 2023 - Mar 2024',
    totalPaid: '₱4,788',
  },
];

// --- Sub-Components ---

interface TopBarProps {
  appName: string;
  logoText: string;
}

const TopBar: React.FC<TopBarProps> = ({ appName, logoText }) => {
  return (
    <header className={`w-full bg-[${designTokens.colors['bg-header-bar']}] border-b border-[${designTokens.colors['border-default']}] py-[12px] px-[16px] flex justify-between items-center h-[64.57px]`}>
      <div className="flex items-center gap-[12px]">
        <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-br from-[${designTokens.colors['gradient-start']}] to-[${designTokens.colors['gradient-end']}]`}>
          <span className={`${designTokens.typography['heading-2']} text-[${designTokens.colors['text-white']}]`}>
            {logoText}
          </span>
        </div>
        <h1 className={`${designTokens.typography['heading-1']} text-[${designTokens.colors['text-heading']}]`}>
          {appName}
        </h1>
      </div>
      <div className="flex items-center space-x-[12px]">
        <button className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${designTokens.colors['gradient-start']}]" aria-label="Notifications">
          <TopBarBellIcon color={designTokens.colors['icon-stroke-topbar']} />
          <span className={`absolute top-[4px] right-[4px] w-2 h-2 rounded-full bg-[${designTokens.colors['badge-alert']}]`}></span>
        </button>
        <button className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${designTokens.colors['gradient-start']}]" aria-label="Search">
          <TopBarSearchIcon color={designTokens.colors['icon-stroke-topbar']} />
        </button>
      </div>
    </header>
  );
};

interface ScreenHeaderProps {
  title: string;
  description: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, description }) => {
  return (
    <div className={`bg-[${designTokens.colors['bg-card-default']}] border-b border-[${designTokens.colors['border-default']}] px-[16px] pt-[24px] pb-[24px] space-y-[8px]`}>
      <h2 className={`${designTokens.typography['heading-2']} text-[${designTokens.colors['text-heading']}]`}>
        {title}
      </h2>
      <p className={`${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-body']}]`}>
        {description}
      </p>
    </div>
  );
};

interface AppSelectorProps {
  label: string;
  selectedApp: string;
  onSelectApp?: (app: string) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ label, selectedApp, onSelectApp }) => {
  return (
    <div className={`bg-[${designTokens.colors['bg-card-default']}] border-b border-[${designTokens.colors['border-default']}] px-[16px] py-[16px] space-y-[8px]`}>
      <label className={`${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-body']}] block`}>
        {label}
      </label>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-[12.58px] py-[8px] h-[36px] bg-[${designTokens.colors['bg-button-secondary']}] rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${designTokens.colors['gradient-start']}]`}
        aria-haspopup="listbox"
        aria-expanded="false" // Would be dynamic with actual dropdown
        aria-label={`Selected app: ${selectedApp}`}
        onClick={() => onSelectApp?.(selectedApp)} // Placeholder for interaction
      >
        <span className="flex items-center gap-[8px]">
          <AppIconPlaceholder />
          <span className={`${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-button-dark']}]`}>
            {selectedApp}
          </span>
        </span>
        <ArrowDownIcon />
      </button>
    </div>
  );
};

interface SubscriptionCardProps {
  subscription: Subscription;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
  const badgeColor = useMemo(() => {
    switch (subscription.status) {
      case 'expired':
        return `border-[${designTokens.colors['text-body']}]/10`; // Figma opacity 0.1
      case 'completed':
        return `border-[${designTokens.colors['text-body']}]/10`; // Figma opacity 0.1
      case 'active':
        return `border-[${designTokens.colors['text-button-active']}]/10`;
      default:
        return `border-[${designTokens.colors['text-body']}]/10`;
    }
  }, [subscription.status]);

  return (
    <div className={`bg-[${designTokens.colors['bg-card-default']}] rounded-xl border border-[${designTokens.colors['border-default']}] shadow-sm p-[16.57px] space-y-[12px]`}>
      <div className="flex justify-between items-start">
        <div className="space-y-[4px]">
          <p className={`${designTokens.typography['paragraph-lg-medium']} text-[${designTokens.colors['text-heading']}]`}>
            {subscription.appName}
          </p>
          <p className={`${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-body']}]`}>
            {subscription.plan}
          </p>
        </div>
        <span className={`inline-flex items-center px-[8px] py-[2.57px] rounded-lg ${badgeColor} border bg-white`}
              aria-label={`Status: ${subscription.status}`}>
          <span className={`${designTokens.typography['paragraph-sm']} text-[${designTokens.colors['text-body']}]`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </span>
      </div>
      <div className="space-y-[4px]">
        <div className="flex items-center gap-[8px]">
          <CalendarIcon />
          <p className={`${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-body']}]`}>
            {subscription.dateRange}
          </p>
        </div>
        <p className={`${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-body']}]`}>
          Total Paid: {subscription.totalPaid}
        </p>
      </div>
    </div>
  );
};

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div className={`bg-[${designTokens.colors['bg-card-default']}] px-[16px] pt-0 pb-[46.9px]`}>
      <div className={`flex w-full rounded-xl border border-[${designTokens.colors['border-default']}]`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 text-center py-[9.16px] ${designTokens.typography['paragraph-lg']} text-[${designTokens.colors['text-button-dark']}] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${designTokens.colors['gradient-start']}] 
              ${activeTab === tab.id
                ? `bg-[${designTokens.colors['bg-card-default']}] border-b-2 border-[${designTokens.colors['border-button-active']}]`
                : 'border-b-2 border-transparent'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-[16px]">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && 'id' in child.props && child.props.id === activeTab) {
            return (
              <div
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                className="space-y-[16px]"
              >
                {child}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

interface BottomNavBarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeItem, onItemClick }) => {
  const navItems = useMemo(() => [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'subscriptions', label: 'Subscriptions', Icon: SubscriptionsIcon },
    { id: 'rewards', label: 'Rewards', Icon: RewardsIcon },
    { id: 'help', label: 'Help', Icon: HelpIcon },
    { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  ], []);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 w-full bg-[${designTokens.colors['bg-card-default']}] border-t border-[${designTokens.colors['border-default']}] h-[64.55px] flex items-center justify-around px-[8px]`} aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = activeItem === item.id;
        const textColor = isActive ? designTokens.colors['text-button-active'] : designTokens.colors['text-body'];
        const iconColor = isActive ? designTokens.colors['icon-stroke-active'] : designTokens.colors['icon-stroke-default'];

        return (
          <button
            key={item.id}
            className="flex flex-col items-center justify-center p-[4px] rounded-lg w-[65px] h-[56px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${designTokens.colors['gradient-start']}]"
            onClick={() => onItemClick(item.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            <item.Icon color={iconColor} className="w-[20px] h-[20px]" />
            <span className={`${designTokens.typography['paragraph-sm']} text-[${textColor}] mt-[4px]`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

// --- Main Component ---

export interface PastSubscriptionsScreenProps {
  // Define any top-level props if needed, e.g., initial tab, user data
}

export const PastSubscriptionsScreen: React.FC<PastSubscriptionsScreenProps> = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'all-offerings'>('history');
  const [activeBottomNavItem, setActiveBottomNavItem] = useState('subscriptions');

  const tabs = useMemo(() => [
    { id: 'active', label: 'Active' },
    { id: 'history', label: 'History' },
    { id: 'all-offerings', label: 'All Offerings' },
  ], []);

  return (
    <div className={`min-h-screen bg-[${designTokens.colors['bg-primary-app']}] flex flex-col w-[431px] mx-auto overflow-hidden`}>
      <TopBar appName="Cignal One" logoText="C1" />

      <main className="flex-1 overflow-y-auto pb-[64.55px]"> {/* Padding for fixed bottom nav */}
        <ScreenHeader
          title="My Subscriptions"
          description="Manage all your active subscriptions"
        />

        <AppSelector
          label="Select App"
          selectedApp="Cignal Play"
          onSelectApp={(app) => console.log('Selected app:', app)}
        />

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {/* Content for 'Active' tab */}
          <div id="active">
            <p className={`${designTokens.typography['paragraph-lg']} text-center text-[${designTokens.colors['text-body']}] py-4`}>
              No active subscriptions.
            </p>
          </div>

          {/* Content for 'History' tab */}
          <div id="history">
            {mockSubscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>

          {/* Content for 'All Offerings' tab */}
          <div id="all-offerings">
            <p className={`${designTokens.typography['paragraph-lg']} text-center text-[${designTokens.colors['text-body']}] py-4`}>
              Explore all offerings here.
            </p>
          </div>
        </Tabs>
      </main>

      <BottomNavBar activeItem={activeBottomNavItem} onItemClick={setActiveBottomNavItem} />
    </div>
  );
};