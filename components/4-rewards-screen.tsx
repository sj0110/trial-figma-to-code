// src/components/rewards-screen.tsx
import React, { useState, useMemo } from 'react';

// --- Design System Colors ---
// Extracted from designData.designSystem.colors
const colors = {
  'color-1': '#ffffff', // White
  'color-2': '#6a7282', // Gray
  'color-3': '#101828', // Dark Gray / Black
  'color-4': '#155dfc', // Primary Blue
  'color-5': '#4a5565', // Darker Gray
  'color-6': '#dcfce7', // Light Green
  'color-7': '#008236', // Medium Green
  'color-8': '#00a63e', // Bright Green
  'color-9': '#dbeafe', // Light Blue
  'color-10': '#f9fafb', // Off-White / Light Gray
};

// --- Utility Functions ---
/**
 * Converts Figma's color object (0-1 range) to a CSS hex string.
 * It will try to match against the predefined `colors` map for consistency.
 * If a matching exact hex (case-insensitive) is found in `colors`, it returns that key's hex.
 * Otherwise, it generates a new hex.
 * Opacity is handled by Tailwind's /alpha syntax, so this function only returns the base hex.
 */
const getCssHex = (color: { r: number; g: number; b: number }): string => {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const generatedHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  // Check if generated hex matches any of the predefined colors
  for (const key in colors) {
    if (colors[key].toLowerCase() === generatedHex.toLowerCase()) {
      return colors[key];
    }
  }
  return generatedHex;
};

// --- Icon Components (Inferred from Vector Data) ---
interface IconProps {
  className?: string;
  stroke?: string; // For stroke-based icons
  fill?: string;   // For fill-based icons
  width?: number;
  height?: number;
}

// Icon for Star (used in Wallet and Reward Card Points)
const IconStar: React.FC<IconProps> = ({ className = '', stroke = colors['color-4'], width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M8.00008 1.99955L9.77441 5.92348L13.9997 6.54133L10.9999 9.54474L11.7741 13.7741L8.00008 11.9998L4.22596 13.7741L5.00029 9.54474L2.00049 6.54133L6.22582 5.92348L8.00008 1.99955Z"
      stroke={stroke}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icon for Checkmark (used in Wallet and Transaction History)
const IconCheckmark: React.FC<IconProps> = ({ className = '', stroke = colors['color-8'], width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke={stroke} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Rewards (Bottom Nav) (simplified from vector data)
const IconRewards: React.FC<IconProps> = ({ className = '', stroke = colors['color-4'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 1.66602L12.4267 6.57722L17.8541 7.39162L13.9271 11.3916L14.8535 16.8228L10 14.3916L5.1465 16.8228L6.07293 11.3916L2.14594 7.39162L7.57333 6.57722L10 1.66602Z"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icon for Calendar (Valid for X days)
const IconCalendar: React.FC<IconProps> = ({ className = '', stroke = colors['color-2'], width = 12, height = 12 }) => (
  <svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 1V2.5" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 1V2.5" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 4.5H10.5" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 4V10C1.5 10.4142 1.83579 10.75 2.25 10.75H9.75C10.1642 10.75 10.5 10.4142 10.5 10V4C10.5 3.58579 10.1642 3.25 9.75 3.25H2.25C1.83579 3.25 1.5 3.58579 1.5 4Z" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Document/Tasks (Earn More Points - Complete Challenges)
const IconDocument: React.FC<IconProps> = ({ className = '', stroke = colors['color-4'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5 12.5V17.5H2.5V2.5H12.5L17.5 7.5V12.5Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 2.5V7.5H17.5" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Referral (Earn More Points - Refer Friends)
const IconUsers: React.FC<IconProps> = ({ className = '', stroke = colors['color-4'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15.8333 16.6667V15C15.8333 14.0625 15.4673 13.1649 14.8164 12.514C14.1655 11.8631 13.2679 11.4971 12.3333 11.4971H7.66667C6.73204 11.4971 5.83446 11.8631 5.18355 12.514C4.53264 13.1649 4.16667 14.0625 4.16667 15V16.6667" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 8.16335C10.9205 8.16335 11.8028 7.79979 12.4435 7.15911C13.0842 6.51843 13.4477 5.63613 13.4477 4.71569C13.4477 3.79526 13.0842 2.91296 12.4435 2.27228C11.8028 1.6316 10.9205 1.26805 10 1.26805C9.07957 1.26805 8.19727 1.6316 7.55659 2.27228C6.91591 2.91296 6.55236 3.79526 6.55236 4.71569C6.55236 5.63613 6.91591 6.51843 7.55659 7.15911C8.19727 7.79979 9.07957 8.16335 10 8.16335Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Icon for Daily Login (Calendar-like streak)
const IconStreak: React.FC<IconProps> = ({ className = '', stroke = colors['color-4'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 2.5V5" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 2.5V5" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 8.33398H17.5" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 7.5V16.6673C17.5 17.1095 17.3243 17.5342 17.0166 17.8419C16.7089 18.1496 16.2842 18.3253 15.8419 18.3253H4.1581C3.71581 18.3253 3.29112 18.1496 2.98342 17.8419C2.67572 17.5342 2.5 17.1095 2.5 16.6673V7.5C2.5 7.05777 2.67572 6.63308 2.98342 6.32538C3.29112 6.01769 3.71581 5.84199 4.1581 5.84199H15.8419C16.2842 5.84199 16.7089 6.01769 17.0166 6.32538C17.3243 6.63308 17.5 7.05777 17.5 7.5Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Icon for Transaction Gain (Checkmark)
const IconTransactionGain: React.FC<IconProps> = ({ className = '', stroke = colors['color-8'], width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke={stroke} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Transaction Loss (Exclamation)
const IconTransactionLoss: React.FC<IconProps> = ({ className = '', stroke = '#f54900', width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.99967 11.3333V8.00004" stroke={stroke} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.99967 4.66671H8.00634" stroke={stroke} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.6663 8.00004C14.6663 11.6819 11.6815 14.6667 7.99967 14.6667C4.31786 14.6667 1.33301 11.6819 1.33301 8.00004C1.33301 4.31823 4.31786 1.33337 7.99967 1.33337C11.6815 1.33337 14.6663 4.31823 14.6663 8.00004Z" stroke={stroke} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Home (Bottom Nav)
const IconHome: React.FC<IconProps> = ({ className = '', stroke = colors['color-5'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.5 7.5L10 1.66667L17.5 7.5V15.8333C17.5 16.2754 17.3243 16.6999 17.0166 17.0076C16.7089 17.3153 16.2842 17.491 15.8419 17.491H4.1581C3.71581 17.491 3.29112 17.3153 2.98342 17.0076C2.67572 16.6999 2.5 16.2754 2.5 15.8333V7.5Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 17.5V10H12.5V17.5" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Subscriptions (Bottom Nav)
const IconSubscriptions: React.FC<IconProps> = ({ className = '', stroke = colors['color-5'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.66667 5.83333V15C1.66667 15.4421 1.84238 15.8668 2.15008 16.1745C2.45778 16.4822 2.88247 16.6579 3.32456 16.6579H16.6667C17.1088 16.6579 17.5335 16.4822 17.8412 16.1745C18.1489 15.8668 18.3246 15.4421 18.3246 15V5.83333C18.3246 5.39124 18.1489 4.96655 17.8412 4.65885C17.5335 4.35115 17.1088 4.17544 16.6667 4.17544H3.32456C2.88247 4.17544 2.45778 4.35115 2.15008 4.65885C1.84238 4.96655 1.66667 5.39124 1.66667 5.83333Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.66667 9.16602H18.3333" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Help (Bottom Nav)
const IconHelp: React.FC<IconProps> = ({ className = '', stroke = colors['color-5'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 14.1667V10.8333" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99167 6.66669H10.0083" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Profile (Bottom Nav)
const IconProfile: React.FC<IconProps> = ({ className = '', stroke = colors['color-5'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16.6667 16.6667V15C16.6667 14.0625 16.2952 13.1649 15.6393 12.509C14.9835 11.8531 14.0792 11.4816 13.1333 11.4816H6.86667C5.92078 11.4816 5.01651 11.8531 4.36067 12.509C3.70483 13.1649 3.33333 14.0625 3.33333 15V16.6667" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 8.15689C10.9205 8.15689 11.8028 7.79527 12.4435 7.15459C13.0842 6.51391 13.4477 5.63162 13.4477 4.71118C13.4477 3.79075 13.0842 2.90846 12.4435 2.26778C11.8028 1.6271 10.9205 1.26548 10 1.26548C9.07957 1.26548 8.19727 1.6271 7.55659 2.26778C6.91591 2.90846 6.55236 3.79075 6.55236 4.71118C6.55236 5.63162 6.91591 6.51391 7.55659 7.15459C8.19727 7.79527 9.07957 8.15689 10 8.15689Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Icon for Search (Top Bar)
const IconSearch: React.FC<IconProps> = ({ className = '', stroke = colors['color-3'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5 17.5L13.8819 13.8819" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.8333 9.16667C15.8333 12.8485 12.8485 15.8333 9.16667 15.8333C5.48485 15.8333 2.5 12.8485 2.5 9.16667C2.5 5.48485 5.48485 2.5 9.16667 2.5C12.8485 2.5 15.8333 5.48485 15.8333 9.16667Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon for Notifications (Top Bar)
const IconBell: React.FC<IconProps> = ({ className = '', stroke = colors['color-3'], width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.4999 7.5C17.4999 5.89433 16.8415 4.35415 15.6543 3.16694C14.4671 1.97973 12.9269 1.32135 11.3212 1.32135H8.67873C7.07306 1.32135 5.53288 1.97973 4.34567 3.16694C3.15846 4.35415 2.5 5.89433 2.5 7.5V11.6667L1.66656 13.3334H18.3334L17.4999 11.6667V7.5Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66656 16.6666C7.02672 17.0743 7.46467 17.3999 7.95475 17.6163C8.44483 17.8327 8.9754 17.9351 9.50973 17.9184C10.0441 17.9016 10.5702 17.7663 11.0543 17.519C11.5385 17.2717 11.9667 16.9188 12.3129 16.4802M6.66656 16.6666L6.59823 16.7455C6.46726 16.8969 6.30456 17.0229 6.11894 17.1185C5.93333 17.2141 5.72922 17.2785 5.51475 17.3082C5.30028 17.3379 5.07823 17.3323 4.86241 17.2917C4.64659 17.2511 4.44026 17.176 4.25055 17.0708C4.06085 16.9657 3.89066 16.8315 3.74836 16.6749C3.60606 16.5183 3.49258 16.3409 3.41443 16.149C3.33627 15.9572 3.29492 15.7538 3.29492 15.5484C3.29492 15.343 3.33627 15.1396 3.41443 14.9477C3.49258 14.7559 3.60606 14.5785 3.74836 14.4219C3.89066 14.2654 4.06085 14.1312 4.25055 14.026C4.44026 13.9208 4.64659 13.8457 4.86241 13.8051C5.07823 13.7645 5.30028 13.7589 5.51475 13.7886C5.72922 13.8183 5.93333 13.8827 6.11894 13.9783C6.30456 14.0739 6.46726 14.1999 6.59823 14.3513L6.66656 16.6666Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.3129 16.4802C12.3813 16.5591 12.4938 16.6851 12.6074 16.7807C12.721 16.8763 12.8354 16.9392 12.9515 16.9688C13.0676 16.9985 13.1849 16.9929 13.3015 16.9523C13.4181 16.9117 13.532 16.8366 13.6393 16.7314C13.7466 16.6263 13.8402 16.4921 13.9161 16.3355C13.992 16.1789 14.0494 16.0015 14.0833 15.8166" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// --- Component Props Interfaces ---

interface RewardItem {
  id: string;
  title: string;
  category: string;
  validityText: string;
  cost: string;
  isAvailable: boolean;
  validityIconColor: string;
  costIconColor: string;
}

interface EarnPointItem {
  id: string;
  icon: 'dailyLogin' | 'challenges' | 'referFriends';
  title: string;
  points: string;
  description: string;
}

interface TransactionItem {
  id: string;
  type: 'gain' | 'loss';
  title: string;
  date: string;
  time: string;
  pointsChange: string;
}

interface RewardsScreenProps {
  initialPoints?: number;
  rewardValue?: number;
  availableRewards: RewardItem[];
  earnMorePoints: EarnPointItem[];
  transactionHistory: TransactionItem[];
}

// --- Sub-Components ---

const TopBar: React.FC = () => {
  const logoGradient = `linear-gradient(135deg, ${colors['color-4']} 0%, #4f39f6 100%)`; // Approximated gradient

  return (
    <div className={`flex flex-col w-[413.37px] h-[64.57px] bg-[${colors['color-1']}] border-b-[0.58px] border-b-[#e5e7eb]`}>
      <div className="flex items-center justify-between w-[381.38px] h-[39.99px] px-[16px] py-[12px]">
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center justify-center w-[39.99px] h-[39.99px] rounded-full" style={{ background: logoGradient }}>
            <span className={`text-[${colors['color-1']}] text-[16px] font-medium leading-[24px]`}>C1</span>
          </div>
          <h1 className={`text-[${colors['color-3']}] text-[24px] font-bold leading-[36px]`}>Cignal One</h1>
        </div>
        <div className="flex gap-[12px]">
          <button aria-label="Search" className="flex items-center justify-center w-[35.98px] h-[35.98px] rounded-full">
            <IconSearch stroke={colors['color-3']} width={20} height={20} />
          </button>
          <button aria-label="Notifications" className="relative flex items-center justify-center w-[35.98px] h-[35.98px] rounded-full">
            <IconBell stroke={colors['color-3']} width={20} height={20} />
            <span className={`absolute top-[4px] right-[4px] w-[8px] h-[8px] rounded-full bg-[#f82c36]`}></span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface WalletBalanceCardProps {
  initialPoints: number;
  rewardValue: number;
  availablePoints: number;
  thisMonthPoints: number;
  rewardsCount: number;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  initialPoints,
  rewardValue,
  availablePoints,
  thisMonthPoints,
  rewardsCount,
}) => {
  const cardGradient = `linear-gradient(135deg, ${colors['color-4']} 0%, #4f39f6 100%)`; // Approximated gradient

  return (
    <div
      className={`w-[413.37px] h-[279.93px] flex flex-col p-[16px] gap-[24px]`}
      style={{ background: cardGradient }}
    >
      <div className="flex flex-col gap-[8px] items-center text-center">
        <p className={`text-[${colors['color-1']}]/90 text-[16px] font-normal leading-[24px]`}>My Wallet Balance</p>
        <h2 className={`text-[${colors['color-1']}] text-[24px] font-bold leading-[24px]`}>{initialPoints} Points</h2>
        <p className={`text-[${colors['color-1']}]/80 text-[16px] font-normal leading-[20px]`}>≈ ₱{rewardValue} in rewards value</p>
      </div>

      <div className="flex justify-between gap-[12px]">
        {/* Available Points Card */}
        <div className={`flex flex-col items-center justify-center flex-1 h-[107.96px] bg-[${colors['color-1']}]/10 rounded-[14px] p-[16px]`}>
          <IconStar stroke="#FFDF20" width={24} height={24} className="mb-2" />
          <p className={`text-[${colors['color-1']}] text-[16px] font-normal leading-[24px]`}>{availablePoints}</p>
          <p className={`text-[${colors['color-1']}]/80 text-[12px] font-medium leading-[16px]`}>Available</p>
        </div>

        {/* This Month Points Card */}
        <div className={`flex flex-col items-center justify-center flex-1 h-[107.96px] bg-[${colors['color-1']}]/10 rounded-[14px] p-[16px]`}>
          <IconCheckmark stroke="#00A63E" width={24} height={24} className="mb-2" />
          <p className={`text-[${colors['color-1']}] text-[16px] font-normal leading-[24px]`}>{thisMonthPoints}</p>
          <p className={`text-[${colors['color-1']}]/80 text-[12px] font-medium leading-[16px]`}>This Month</p>
        </div>

        {/* Rewards Count Card */}
        <div className={`flex flex-col items-center justify-center flex-1 h-[107.96px] bg-[${colors['color-1']}]/10 rounded-[14px] p-[16px]`}>
          {/* This icon data looks like a heart based on color: #f54900 (red/pink) in vector 3:9009 child, but it's complex vectors. Using a generic heart representation. */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="#F54900"/>
          </svg>
          <p className={`text-[${colors['color-1']}] text-[16px] font-normal leading-[24px]`}>{rewardsCount}</p>
          <p className={`text-[${colors['color-1']}]/80 text-[12px] font-medium leading-[16px]`}>Rewards</p>
        </div>
      </div>
    </div>
  );
};

const RewardItemCard: React.FC<RewardItem> = ({
  title,
  category,
  validityText,
  cost,
  isAvailable,
  validityIconColor,
  costIconColor,
}) => {
  return (
    <div className={`flex flex-col w-[381.38px] h-[165.13px] bg-[${colors['color-1']}] border-[0.58px] border-black/10 rounded-[14px]`}>
      <div className="flex flex-col flex-grow p-[16px] gap-[12px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[8px]">
              <h3 className={`text-[${colors['color-3']}] text-[16px] font-normal leading-[24px]`}>{title}</h3>
              {isAvailable && (
                <span className={`inline-flex items-center px-[8px] py-[4px] bg-[${colors['color-6']}] text-[${colors['color-7']}] text-[12px] font-medium leading-[16px] rounded-[8px]`}>
                  Available
                </span>
              )}
            </div>
            <p className={`text-[${colors['color-5']}] text-[16px] font-normal leading-[20px]`}>{category}</p>
          </div>
          <div className="flex items-center gap-[4px]">
            <IconStar stroke={getCssHex({r:0.08235294371843338, g:0.364705890417099, b:0.9882352948188782})} width={16} height={16} /> {/* Using blue for consistency with cost */}
            <p className={`text-[${colors['color-4']}] text-[16px] font-normal leading-[20px]`}>{cost}</p>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <IconCalendar stroke={validityIconColor} width={12} height={12} />
          <p className={`text-[${colors['color-2']}] text-[16px] font-normal leading-[20px]`}>{validityText}</p>
        </div>

        <button
          className={`flex items-center justify-center w-full h-[35.99px] rounded-[8px]
            ${isAvailable ? `bg-[${colors['color-4']}]` : `bg-[${colors['color-2']}]`}
            text-[${colors['color-1']}] text-[16px] font-normal leading-[20px]`}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Redeem Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

const EarnPointsItem: React.FC<EarnPointItem> = ({ id, icon, title, points, description }) => {
  let IconComponent;
  switch (icon) {
    case 'dailyLogin':
      IconComponent = IconStreak;
      break;
    case 'challenges':
      IconComponent = IconDocument;
      break;
    case 'referFriends':
      IconComponent = IconUsers;
      break;
    default:
      IconComponent = IconStar; // Fallback
  }

  return (
    <div className={`flex w-[381.38px] h-[81.13px] bg-[${colors['color-1']}] border-[0.58px] border-[#e5e7eb] rounded-[14px] p-[16px] items-center gap-[12px]`}>
      <div className={`flex items-center justify-center w-[39.99px] h-[39.99px] rounded-full bg-[${colors['color-9']}]`}>
        <IconComponent stroke={colors['color-4']} width={20} height={20} />
      </div>
      <div className="flex-1 flex flex-col gap-[4px]">
        <div className="flex justify-between items-start">
          <h3 className={`text-[${colors['color-3']}] text-[16px] font-normal leading-[24px]`}>{title}</h3>
          <p className={`text-[${colors['color-4']}] text-[16px] font-normal leading-[20px]`}>{points}</p>
        </div>
        <p className={`text-[${colors['color-5']}] text-[16px] font-normal leading-[20px]`}>{description}</p>
      </div>
    </div>
  );
};

const TransactionHistoryItem: React.FC<TransactionItem> = ({ id, type, title, date, time, pointsChange }) => {
  const isGain = type === 'gain';
  const iconBgColor = isGain ? colors['color-6'] : getCssHex({r: 1, g: 0.929411768913269, b: 0.8313725590705872}); // #ffeecb
  const iconStrokeColor = isGain ? colors['color-8'] : getCssHex({r: 0.9607843160629272, g: 0.2862745225429535, b: 0}); // #f54900
  const pointsTextColor = isGain ? colors['color-8'] : iconStrokeColor; // #f54900

  return (
    <div className={`flex w-full min-h-[76.55px] border-b-[0.58px] border-b-[#f2f4f7] py-[16px] px-[16px] items-center gap-[12px]`}>
      <div className={`flex items-center justify-center w-[31.99px] h-[31.99px] rounded-full bg-[${iconBgColor}]`}>
        {isGain ? <IconTransactionGain stroke={iconStrokeColor} /> : <IconTransactionLoss stroke={iconStrokeColor} />}
      </div>
      <div className="flex-1 flex flex-col gap-[4px]">
        <h3 className={`text-[${colors['color-3']}] text-[16px] font-normal leading-[24px]`}>{title}</h3>
        <p className={`text-[${colors['color-2']}] text-[12px] font-medium leading-[16px]`}>
          {date} • {time}
        </p>
      </div>
      <p className={`text-[${pointsTextColor}] text-[16px] font-normal leading-[24px]`} style={{ letterSpacing: '-0.3125px' }}>{pointsChange}</p>
    </div>
  );
};

const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Rewards'); // Assuming Rewards is active initially

  const navItems = [
    { name: 'Home', icon: IconHome },
    { name: 'Subscriptions', icon: IconSubscriptions },
    { name: 'Rewards', icon: IconRewards },
    { name: 'Help', icon: IconHelp },
    { name: 'Profile', icon: IconProfile },
  ];

  return (
    <div className={`w-[413.37px] h-[64.55px] bg-[${colors['color-1']}] border-t-[0.58px] border-t-[#e5e7eb]`}>
      <div className="flex justify-around items-center h-full px-[8px]">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          const textColor = isActive ? colors['color-4'] : colors['color-5'];
          const iconStroke = isActive ? colors['color-4'] : colors['color-5'];
          const IconComponent = item.icon;

          return (
            <button
              key={item.name}
              className={`flex flex-col items-center justify-center flex-1 h-full py-[8px] gap-[4px] rounded-[10px]`}
              onClick={() => setActiveTab(item.name)}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComponent stroke={iconStroke} />
              <span className={`text-[${textColor}] text-[12px] font-medium leading-[16px]`}>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Component ---

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  initialPoints = 2450,
  rewardValue = 245,
  availableRewards = [
    {
      id: 'reward1',
      title: '₱100 Discount Voucher',
      category: 'Subscription',
      validityText: 'Valid for 30 days',
      cost: '500 pts',
      isAvailable: true,
      validityIconColor: colors['color-2'],
      costIconColor: colors['color-4'],
    },
    {
      id: 'reward2',
      title: 'Free 1 Month Premium',
      category: 'Upgrade',
      validityText: 'Limited offer',
      cost: '1500 pts',
      isAvailable: true,
      validityIconColor: colors['color-2'],
      costIconColor: colors['color-4'],
    },
    {
      id: 'reward3',
      title: '₱50 GCash Cashback',
      category: 'Payment',
      validityText: 'Valid for 15 days',
      cost: '300 pts',
      isAvailable: true,
      validityIconColor: colors['color-2'],
      costIconColor: colors['color-4'],
    },
    {
      id: 'reward4',
      title: 'Exclusive Content Access',
      category: 'Entertainment',
      validityText: 'Valid for 7 days', // Corrected per data
      cost: '800 pts',
      isAvailable: false, // Set to false based on design JSON
      validityIconColor: colors['color-2'],
      costIconColor: colors['color-4'],
    },
    {
        id: 'reward5',
        title: 'Another Discount Voucher',
        category: 'Shopping',
        validityText: 'Valid for 60 days',
        cost: '1000 pts',
        isAvailable: true,
        validityIconColor: colors['color-2'],
        costIconColor: colors['color-4'],
      },
    {
        id: 'reward6',
        title: 'Another Premium Access',
        category: 'Upgrade',
        validityText: 'Limited stock',
        cost: '2000 pts',
        isAvailable: true,
        validityIconColor: colors['color-2'],
        costIconColor: colors['color-4'],
      },
  ],
  earnMorePoints = [
    {
      id: 'earn1',
      icon: 'dailyLogin',
      title: 'Daily Login',
      points: '+10 pts/day',
      description: 'Login daily to earn bonus points',
    },
    {
      id: 'earn2',
      icon: 'challenges',
      title: 'Complete Challenges',
      points: '+100-500 pts',
      description: 'Complete weekly challenges',
    },
    {
      id: 'earn3',
      icon: 'referFriends',
      title: 'Refer Friends',
      points: '+500 pts/friend',
      description: 'Invite friends to join',
    },
  ],
  transactionHistory = [
    {
      id: 'trans1',
      type: 'gain',
      title: 'Subscription Renewal Bonus',
      date: 'Dec 3, 2024',
      time: '2:30 PM',
      pointsChange: '+150 pts',
    },
    {
      id: 'trans2',
      type: 'loss',
      title: 'Redeemed ₱50 Voucher',
      date: 'Dec 1, 2024',
      time: '10:15 AM',
      pointsChange: '-300 pts',
    },
    {
      id: 'trans3',
      type: 'gain',
      title: 'Watched 5 Movies Milestone',
      date: 'Nov 28, 2024',
      time: '8:45 PM',
      pointsChange: '+200 pts',
    },
    {
      id: 'trans4',
      type: 'loss',
      title: 'Redeemed Premium Access',
      date: 'Nov 22, 2024',
      time: '1:10 PM',
      pointsChange: '-800 pts',
    },
    {
      id: 'trans5',
      type: 'gain',
      title: 'Daily Login Streak (7 days)',
      date: 'Nov 20, 2024',
      time: '9:00 AM',
      pointsChange: '+100 pts',
    },
    // Adding a 6th transaction item for more realistic data
    {
        id: 'trans6',
        type: 'loss',
        title: 'Redeemed ₱100 Discount',
        date: 'Nov 18, 2024',
        time: '4:00 PM',
        pointsChange: '-500 pts',
      },
  ],
}) => {
  const availablePoints = 2450; // Hardcoded from design
  const thisMonthPoints = 950;  // Hardcoded from design
  const rewardsCount = 15;      // Hardcoded from design

  return (
    <div className={`relative w-[413.37px] h-[2506px] bg-[${colors['color-10']}] overflow-auto`}>
      <TopBar />

      <div className="absolute top-[64.57px] left-0 right-0 overflow-y-auto pb-[64.55px]">
        <WalletBalanceCard
          initialPoints={initialPoints}
          rewardValue={rewardValue}
          availablePoints={availablePoints}
          thisMonthPoints={thisMonthPoints}
          rewardsCount={rewardsCount}
        />

        {/* Available Rewards Section */}
        <div className="flex flex-col px-[16px] mt-[24px] mb-[24px] w-full">
          <div className="flex flex-col mb-[24px]">
            <h3 className={`text-[${colors['color-3']}] text-[16px] font-normal leading-[24px]`}>Available Rewards</h3>
            <p className={`text-[${colors['color-5']}] text-[16px] font-normal leading-[20px]`}>
              Redeem your points for exclusive rewards
            </p>
          </div>
          <div className="flex flex-col gap-[16px]">
            {availableRewards.map((reward) => (
              <RewardItemCard key={reward.id} {...reward} />
            ))}
          </div>
        </div>

        {/* Earn More Points Section */}
        <div className="flex flex-col px-[16px] mt-[24px] mb-[24px] w-full">
          <h3 className={`text-[${colors['color-3']}] text-[16px] font-normal leading-[24px] mb-[24px]`}>Earn More Points</h3>
          <div className="flex flex-col gap-[16px]">
            {earnMorePoints.map((item) => (
              <EarnPointsItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="flex flex-col px-[16px] mt-[24px] mb-[24px] w-full">
          <h3 className={`text-[${colors['color-3']}] text-[16px] font-normal leading-[24px] mb-[24px]`}>Transaction History</h3>
          <div className={`flex flex-col w-[381.38px] bg-[${colors['color-1']}] border-[0.58px] border-black/10 rounded-[14px]`}>
            {transactionHistory.map((item) => (
              <TransactionHistoryItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
};