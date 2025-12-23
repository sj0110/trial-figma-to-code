// Suggested file path: src/app/PayBillPage.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// --- Color Palette Mapping ---
// Based on designData.designSystem.colors and explicit RGB values found in fills/strokes
// color-1: #ffffff (white)
// color-2: #101828 (text-gray-900 equivalent, dark text)
// color-3: #4a5565 (text-gray-600 equivalent, medium text)
// color-4: #99a1af (text-gray-400 equivalent, light text)
// color-5: #155dfc (primary blue)
// color-6: #eff6ff (light blue background)
// color-7: #6a7282 (gray for icons/secondary text)
// color-8: #f3f4f6 (light gray background/border)
// color-9: #dcfce7 (light green background)
// color-10: #008236 (dark green text)

// Derived from explicit RGB values:
// rgb(0.976, 0.980, 0.984) -> #f9fafc (app background)
// rgb(0.819, 0.835, 0.861) -> #d0d5dd (border color)
// rgb(0.906, 0, 0.042) -> #e7000b (red text for amount due)
// rgb(0.791, 0.207, 0) -> #c93500 (orange text for expiring status)
// rgb(0.077, 0.279, 0.901) -> #1447e6 (Call support button text)

// --- Typography Mapping ---
// Font family: Inter is typically the default in Next.js/Tailwind setups.
// 16px, 400 weight, 24px line height, -0.3125px letter spacing -> text-base font-normal leading-6 tracking-[-0.3125px]
// 20px, 500 weight, 30px line height, -0.44921875px letter spacing -> text-xl font-medium leading-[30px] tracking-[-0.44921875px]
// Additional sizes:
// 36px (h1) -> text-[36px] font-medium leading-[normal] tracking-[-0.78px]
// 30px (h2) -> text-[30px] font-medium leading-[normal] tracking-[-0.66px]

// --- Placeholder Images ---
const IMAGE_PLACEHOLDERS: Record<string, string> = {
  '4eda220f49efdbb1ad4b1a5c9ead0b901dc88c43': 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Action Movies Marathon
  'f4601d3391337eed910f0c51a0cffe14718ee87a': 'https://images.unsplash.com/photo-1579952363873-ce070a41aab0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Premier League
  '8a6558968e08468118b791792df41cb25d126728': 'https://images.unsplash.com/photo-1504711434969-e63a80787e71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Breaking News
  // Default placeholder if hash not found, or for items within carousels
  'default': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const getImageUrl = (hash: string) => IMAGE_PLACEHOLDERS[hash] || IMAGE_PLACEHOLDERS.default;

// --- SVG Icon Components ---
// Extracted manually from design data based on `Vector` children within `Icon` frames.

const IconArrowRight = ({ className = 'w-4 h-4', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 10 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.33276 1.33203L8.00003 7.9993L1.33276 14.6666"
      stroke={stroke}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTV = ({ className = 'w-12 h-12', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 4V14L34 14V4H14Z"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V34L40 34V14H4Z"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMobileStreaming = ({ className = 'w-12 h-12', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 4V14L34 14V4H14Z"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V34L44 34V14H4Z"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMobilePhone = ({ className = 'w-12 h-12', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4V44H38V4H10Z"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 36V36"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconWifi = ({ className = 'w-12 h-12', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4C18.6667 4 29.3333 4 44 4"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 24L32 24"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 24L44 24"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPlay = ({ className = 'w-[7.5px] h-[11.6px]', fill = 'white' }: { className?: string, fill?: string }) => (
  <svg
    className={className}
    viewBox="0 0 8 12"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.569458 0.176086L7.56828 6.00021L0.569458 11.6443V0.176086Z"
      fill={fill}
    />
  </svg>
);

const IconClock = ({ className = 'w-3 h-3', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.00003 3.00001V7.00001"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.00003 1.00001L11 1.00001L11 11.00001L1.00003 11.00001L1.00003 1.00001Z"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHome = ({ className = 'w-5 h-5', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 10L12.5 10"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 1.66602L17.5 1.66602L17.5 16.666L2.5 16.666L2.5 1.66602Z"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSubscriptions = ({ className = 'w-5 h-5', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 4.16602L17.5 4.16602L17.5 15.8327L2.5 15.8327L2.5 4.16602Z"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 8.33203L17.5 8.33203"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHelp = ({ className = 'w-5 h-5', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.66602 1.66602L18.3327 1.66602L18.3327 18.3327L1.66602 18.3327L1.66602 1.66602Z"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconProfile = ({ className = 'w-5 h-5', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.16602 12.5C4.16602 10.3333 7.08268 8.33333 9.99935 8.33333C12.916 8.33333 15.8327 10.3333 15.8327 12.5"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66602 2.5L13.3327 2.5C13.3327 2.5 13.3327 7.5 9.99935 7.5C6.66602 7.5 6.66602 2.5 6.66602 2.5Z"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconNotification = ({ className = 'w-5 h-5', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.66602 1.66602L18.3327 1.66602L18.3327 18.3327L1.66602 18.3327L1.66602 1.66602Z"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconQuestionMark = ({ className = 'w-6 h-6', stroke = '#364153' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.94802 1.94795L21.4266 1.94795L21.4266 21.4265L1.94802 21.4265L1.94802 1.94795Z"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.85299 6.81342C8.85299 6.81342 15.5314 6.81342 14.5314 12.6618C14.5314 12.6618 13.5314 11.6618 11.6871 11.6618C10.597 11.6618 9.99701 10.9951 9.99701 9.99511"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6871 16.5568V16.5568"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconNoWifi = ({ className = 'w-6 h-6', stroke = '#155dfc' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.687 19.4787V19.4787"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.94778 4.87011L21.4264 4.87011L21.4264 8.59018"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.86957 9.73997L18.5046 9.73997L19.4786 12.5242"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.27823 14.6086L15.9082 14.6086"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconNoTV = ({ className = 'w-6 h-6', stroke = '#155dfc' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.81741 1.94795L16.5574 1.94795L16.5574 6.81756L6.81741 6.81756L6.81741 1.94795Z"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.94779 6.81756L21.4264 6.81756L21.4264 21.4262L1.94779 21.4262L1.94779 6.81756Z"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconReset = ({ className = 'w-6 h-6', stroke = '#155dfc' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.96448 1.96468L20.4102 1.96468L20.4102 21.4093L2.96448 21.4093L2.96448 1.96468Z"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.76534 8.76495C8.76534 8.76495 14.6085 8.76495 14.6085 14.6081C14.6085 14.6081 13.6085 13.6081 11.6871 13.6081C10.597 13.6081 9.99701 12.9414 9.99701 11.9414"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPhone = ({ className = 'w-6 h-6', stroke = '#155dfc' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.94791 1.94788L21.4265 1.94788L21.4265 21.4265L1.94791 21.4265L1.94791 1.94788Z"
      stroke={stroke}
      strokeWidth="1.94786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconChat = ({ className = 'w-6 h-6', stroke = 'currentColor' }: { className?: string, stroke?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.00031 2.00031L22.0003 2.00031L22.0003 22.0003L2.00031 22.0003L2.00031 2.00031Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface TopBarProps {
  appName: string;
  notificationsCount: number;
}

const TopBar: React.FC<TopBarProps> = ({ appName, notificationsCount }) => {
  return (
    <header className="flex h-[64.57px] w-full items-center justify-between border-b border-[#d0d5dd] bg-white px-4 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(216deg, #155dfc 0%, #4f39f6 100%)' }}
        >
          <span className="text-white text-xl font-medium leading-[30px] tracking-[-0.44921875px]">C1</span>
        </div>
        <h1 className="text-[36px] font-medium leading-[normal] tracking-[-0.78px] text-[#101828]">
          {appName}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button aria-label="Notifications" className="relative">
          <IconNotification className="w-5 h-5" stroke="#364153" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-xs text-white"></span>
          )}
        </button>
        <button aria-label="Profile">
          <IconProfile className="w-5 h-5" stroke="#364153" />
        </button>
      </div>
    </header>
  );
};

interface AppCardProps {
  gradientColors: { start: string; end: string; };
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AppCard: React.FC<AppCardProps> = ({ gradientColors, icon, title, description }) => {
  const isBorderOnly = gradientColors.start === '#f3f4f6' && gradientColors.end === '#f3f4f6';
  const backgroundStyle = isBorderOnly
    ? {}
    : { background: `linear-gradient(216deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)` };
  const borderStyle = isBorderOnly ? { border: '1.75px solid #d0d5dd' } : {};

  return (
    <div className="flex w-[128px] flex-shrink-0 flex-col items-center gap-2">
      <div
        className="flex h-[128px] w-full items-center justify-center rounded-[14px] p-10"
        style={{ ...backgroundStyle, ...borderStyle, boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      >
        {icon}
      </div>
      <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828] text-center max-w-[102px]">
        {title}
      </p>
      <p className="text-sm font-normal leading-[16px] tracking-[-0.3125px] text-[#6a7282] text-center max-w-[135px]">
        {description}
      </p>
    </div>
  );
};

interface AppsSectionProps {
  title: string;
  description: string;
  viewAllLink: string;
  apps: AppCardProps[];
}

const AppsSection: React.FC<AppsSectionProps> = ({ title, description, viewAllLink, apps }) => {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-[#101828]">
            {title}
          </h2>
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
            {description}
          </p>
        </div>
        <Link href={viewAllLink} className="flex items-center text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
          View All <IconArrowRight className="ml-1 w-4 h-4" stroke="#155dfc" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {apps.map((app, index) => (
          <AppCard key={index} {...app} />
        ))}
      </div>
    </section>
  );
};

interface WalletPreviewProps {
  points: number;
  rewardsAvailable: number;
  viewWalletLink: string;
}

const WalletPreview: React.FC<WalletPreviewProps> = ({ points, rewardsAvailable, viewWalletLink }) => {
  return (
    <section
      className="p-6 text-white"
      style={{ background: 'linear-gradient(216deg, #155dfc 0%, #4f39f6 100%)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 3L17 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.5 1.5H21.5V22.5H2.5V1.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

          </div>
          <div>
            <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-white/90">
              My Wallet
            </p>
            <h2 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-white">
              {points.toLocaleString()} Points
            </h2>
          </div>
        </div>
        <Link href={viewWalletLink} className="flex items-center rounded-lg bg-white/20 px-4 py-2 text-base font-medium text-white">
          View Wallet <IconArrowRight className="ml-2 w-4 h-4" stroke="white" />
        </Link>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex-1 rounded-[14px] bg-white/10 p-4">
          <div className="mb-2 flex items-center">
            <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.66629 1.66629L11.664 1.66629L11.664 11.664L1.66629 11.664L1.66629 1.66629Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.61473 8.63972L18.3242 8.63972L18.3242 18.3492L8.61473 18.3492L8.61473 8.63972Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83202 4.99888V8.33146" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.1556 11.5641V14.5051" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="ml-2 text-base font-normal leading-6 tracking-[-0.3125px] text-white/90">
              Available
            </p>
          </div>
          <h3 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-white">
            {rewardsAvailable} pts
          </h3>
        </div>

        <div className="flex-1 rounded-[14px] bg-white/10 p-4">
          <div className="mb-2 flex items-center">
            <svg className="w-5 h-5 text-pink-300" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.49944 6.66517L17.496 6.66517L17.496 9.99775" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.99775 6.66517L9.99775 17.4961" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.16573 9.99775L15.8302 9.99775L15.8302 17.4961" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.16573 2.49908L15.8302 2.49908" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="ml-2 text-base font-normal leading-6 tracking-[-0.3125px] text-white/90">
              Rewards
            </p>
          </div>
          <h3 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-white">
            {rewardsAvailable} Available
          </h3>
        </div>
      </div>
    </section>
  );
};

interface CarouselItemProps {
  imageSrc: string;
  title: string;
  category: string;
  info: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ imageSrc, title, category, info }) => {
  return (
    <div
      className="flex w-[192px] flex-shrink-0 flex-col overflow-hidden rounded-[14px] bg-[#101828]"
      style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
    >
      <div
        className="relative flex h-[112px] w-full items-center justify-center rounded-t-[14px]"
        style={{ background: 'linear-gradient(216deg, #364153 0%, #1e2838 100%)' }}
      >
        {/* Placeholder for video/image */}
        <Image src={imageSrc} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <IconPlay className="w-[7.5px] h-[11.6px] text-white" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="mb-1 text-base font-normal leading-6 tracking-[-0.3125px] text-white">
          {title}
        </p>
        <div className="flex justify-between text-sm font-normal leading-[16px] tracking-[-0.3125px] text-[#99a1af]">
          <span>{category}</span>
          <div className="flex items-center space-x-1">
            <IconClock className="w-3 h-3" stroke="#99a1af" />
            <span>{info}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContentCarouselProps {
  title: string;
  description: string;
  seeAllLink: string;
  items: CarouselItemProps[];
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, description, seeAllLink, items }) => {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-[#101828]">
            {title}
          </h2>
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
            {description}
          </p>
        </div>
        <Link href={seeAllLink} className="flex items-center text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
          See All <IconArrowRight className="ml-1 w-4 h-4" stroke="#155dfc" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, index) => (
          <CarouselItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

interface CurrentPlanCardProps {
  planName: string;
  price: string;
  status: 'Active' | 'Expiring';
  channels: string;
  speed?: string; // For Fiber plans
  validUntil: string;
  manageLink: string;
  upgradeLink: string;
  payBillLink?: string; // Only for postpaid
  icon: React.ReactNode;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  planName,
  price,
  status,
  channels,
  speed,
  validUntil,
  manageLink,
  upgradeLink,
  payBillLink,
  icon,
}) => {
  const statusColorClass = status === 'Active' ? 'bg-[#dcfce7] text-[#008236]' : 'bg-[#fff5e3] text-[#c93500]';

  return (
    <div className="w-[280px] flex-shrink-0 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff]">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-[#101828]">
              {planName}
            </h3>
            <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
              {price}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColorClass}`}>
          {status}
        </span>
      </div>

      <div className="space-y-2 border-t border-[#f3f4f6] pt-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
            Channels
          </p>
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
            {channels}
          </p>
        </div>
        {speed && (
          <div className="flex items-center justify-between">
            <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
              Speed
            </p>
            <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
              {speed}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
            Valid Until
          </p>
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
            {validUntil}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={manageLink}
          className="flex-1 rounded-lg bg-[#f3f4f6] px-4 py-2 text-center text-base font-medium text-[#101828]"
        >
          Manage
        </Link>
        {payBillLink ? (
          <Link
            href={payBillLink}
            className="flex-1 rounded-lg bg-[#008236] px-4 py-2 text-center text-base font-medium text-white"
          >
            Pay Bill
          </Link>
        ) : (
          <Link
            href={upgradeLink}
            className="flex-1 rounded-lg bg-[#155dfc] px-4 py-2 text-center text-base font-medium text-white"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
};

interface CurrentPlansSectionProps {
  title: string;
  description: string;
  actionButtons: { label: string; link: string; icon: React.ReactNode }[];
  plans: CurrentPlanCardProps[];
}

const CurrentPlansSection: React.FC<CurrentPlansSectionProps> = ({ title, description, actionButtons, plans }) => {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-[#101828]">
            {title}
          </h2>
          <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
            {description}
          </p>
        </div>
        <div className="flex space-x-2">
          {actionButtons.map((button, index) => (
            <Link
              key={index}
              href={button.link}
              className="flex h-[33.15px] w-[33.15px] items-center justify-center rounded-lg border border-[#e5e7eb] text-[#4a5565]"
              aria-label={button.label}
            >
              {button.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {plans.map((plan, index) => (
          <CurrentPlanCard key={index} {...plan} />
        ))}
      </div>
    </section>
  );
};

interface HelpItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const HelpItem: React.FC<HelpItemProps> = ({ question, answer, isExpanded, onToggle }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${question.replace(/\s/g, '-')}`}
      >
        <p className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
          {question}
        </p>
        <IconArrowRight className={`w-4 h-4 text-[#99a1af] transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} stroke="#99a1af" />
      </button>
      {isExpanded && (
        <p
          id={`faq-answer-${question.replace(/\s/g, '-')}`}
          className="px-4 pb-4 text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]"
        >
          {answer}
        </p>
      )}
    </div>
  );
};

interface HelpSectionProps {
  title: string;
  faqItems: Omit<HelpItemProps, 'isExpanded' | 'onToggle'>[];
  internetIssueLink: string;
  noTVSignalLink: string;
  resetDeviceLink: string;
  callSupportLink: string;
  stillNeedHelpTitle: string;
  callSupportButtonLabel: string;
  chatWithUsButtonLabel: string;
  viewAllFaqsLink: string;
}

const HelpSection: React.FC<HelpSectionProps> = ({
  title,
  faqItems,
  internetIssueLink,
  noTVSignalLink,
  resetDeviceLink,
  callSupportLink,
  stillNeedHelpTitle,
  callSupportButtonLabel,
  chatWithUsButtonLabel,
  viewAllFaqsLink,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="bg-[#f9fafc] px-4 py-6">
      <div className="mb-6 flex items-center">
        <IconQuestionMark className="w-6 h-6" stroke="#364153" />
        <h2 className="ml-2 text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-[#101828]">
          {title}
        </h2>
      </div>

      <div className="mb-6 flex space-x-2 border-b border-[#e5e7eb]">
        <button className="flex-1 border-b-2 border-[#155dfc] pb-3 text-base font-medium text-[#155dfc]" aria-current="page">
          FAQs
        </button>
        <button className="flex-1 border-b-2 border-transparent pb-3 text-base font-medium text-[#4a5565]">
          Diagnostics
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <Link href={internetIssueLink} className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-4 py-6 text-center shadow-sm">
          <IconNoWifi className="h-6 w-6" />
          <p className="mt-2 text-sm font-normal leading-[16px] tracking-[-0.3125px] text-[#364153]">
            Internet Issues
          </p>
        </Link>
        <Link href={noTVSignalLink} className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-4 py-6 text-center shadow-sm">
          <IconNoTV className="h-6 w-6" />
          <p className="mt-2 text-sm font-normal leading-[16px] tracking-[-0.3125px] text-[#364153]">
            No TV Signal
          </p>
        </Link>
        <Link href={resetDeviceLink} className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-4 py-6 text-center shadow-sm">
          <IconReset className="h-6 w-6" />
          <p className="mt-2 text-sm font-normal leading-[16px] tracking-[-0.3125px] text-[#364153]">
            Reset Device
          </p>
        </Link>
        <Link href={callSupportLink} className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-4 py-6 text-center shadow-sm">
          <IconPhone className="h-6 w-6" />
          <p className="mt-2 text-sm font-normal leading-[16px] tracking-[-0.3125px] text-[#364153]">
            Call Support
          </p>
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        {faqItems.map((item, index) => (
          <HelpItem
            key={index}
            {...item}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-[#c6e0ff] bg-[#eff6ff] p-4">
        <p className="mb-4 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
          {stillNeedHelpTitle}
        </p>
        <div className="flex gap-2">
          <Link href="#" className="flex-1 rounded-lg border border-[#c6e0ff] bg-white px-4 py-2 text-center text-base font-medium text-[#1447e6]">
            {callSupportButtonLabel}
          </Link>
          <Link href="#" className="flex-1 rounded-lg bg-[#155dfc] px-4 py-2 text-center text-base font-medium text-white">
            {chatWithUsButtonLabel}
          </Link>
        </div>
      </div>

      <Link
        href={viewAllFaqsLink}
        className="block w-full rounded-xl border border-[#d0d5dd] px-4 py-3 text-center text-base font-medium text-[#101828] shadow-sm"
      >
        View All FAQs
      </Link>
    </section>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive }) => {
  const textColorClass = isActive ? 'text-[#155dfc]' : 'text-[#4a5565]';
  const iconColor = isActive ? '#155dfc' : '#4a5565';
  return (
    <Link href="#" className={`flex flex-1 flex-col items-center px-2 py-1 ${textColorClass}`} aria-current={isActive ? 'page' : undefined}>
      {React.cloneElement(icon as React.ReactElement, { stroke: iconColor })}
      <span className="mt-1 text-xs font-normal">{label}</span>
    </Link>
  );
};

interface BottomNavProps {
  navItems: NavItemProps[];
}

const BottomNav: React.FC<BottomNavProps> = ({ navItems }) => {
  return (
    <nav className="fixed bottom-0 left-0 z-10 w-full border-t border-[#e5e7eb] bg-white py-2">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </div>
    </nav>
  );
};

interface ChatBotButtonProps {
  onClick: () => void;
}

const ChatBotButton: React.FC<ChatBotButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open chat support"
      className="fixed bottom-[96px] right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#004FFF] shadow-lg ring-4 ring-[#155dfc]"
    >
      <IconChat className="h-6 w-6" stroke="white" />
    </button>
  );
};

interface PayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PayBillModal: React.FC<PayBillModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pay-bill-modal-title"
    >
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-7">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#99a1af]"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-base font-normal leading-6 tracking-[-0.3125px] text-[#155dfc]">
            Step 3 of 4
          </p>
          <h3 id="pay-bill-modal-title" className="mb-4 text-xl font-medium leading-[30px] tracking-[-0.44921875px] text-[#101828]">
            Pay Your Bill
          </h3>
          <p className="mb-6 text-center text-base font-normal leading-6 tracking-[-0.3125px] text-[#4a5565]">
            Easily view and pay your bills directly from the app. Stay on top of your payments effortlessly.
          </p>

          <div className="flex w-full items-center justify-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#99a1af]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#99a1af]" />
            <div className="h-1.5 w-6 rounded-full bg-[#155dfc]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#99a1af]" />
          </div>

          <div className="mt-8 flex w-full justify-between space-x-4">
            <button
              onClick={onClose} // Simplified to close on "Back"
              className="flex-1 rounded-lg border border-[#e5e7eb] px-4 py-2 text-base font-medium text-[#101828]"
            >
              <IconArrowRight className="inline-block rotate-180 mr-1 w-4 h-4" stroke="#101828" />
              Back
            </button>
            <button
              onClick={onClose} // Simplified to close on "Next"
              className="flex-1 rounded-lg bg-[#155dfc] px-4 py-2 text-base font-medium text-white shadow-sm"
            >
              Next
              <IconArrowRight className="inline-block ml-1 w-4 h-4" stroke="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PayBillPage() {
  const router = useRouter(); 

  const [isPayBillModalOpen, setIsPayBillModalOpen] = useState(true); 

  const handleOpenPayBillModal = () => setIsPayBillModalOpen(true);
  const handleClosePayBillModal = () => setIsPayBillModalOpen(false);

  // Mock data for components
  const apps = [
    {
      gradientColors: { start: '#2b7ffc', end: '#155dfc' },
      icon: <IconTV className="w-12 h-12" stroke="white" />,
      title: 'Cignal Postpaid',
      description: 'Premium TV experience',
    },
    {
      gradientColors: { start: '#615efc', end: '#4f39f6' },
      icon: <IconMobileStreaming className="w-12 h-12" stroke="white" />,
      title: 'Cignal Prepaid',
      description: 'Flexible TV plans',
    },
    {
      gradientColors: { start: '#ad47ff', end: '#980ff6' },
      icon: <IconMobilePhone className="w-12 h-12" stroke="white" />,
      title: 'SatLite',
      description: 'Mobile streaming',
    },
    {
      gradientColors: { start: '#00c950', end: '#00a63e' },
      icon: <IconWifi className="w-12 h-12" stroke="white" />,
      title: 'Pilipinas Live',
      description: 'Local channels',
    },
    // Add a placeholder card for "New App" with a border
    {
      gradientColors: { start: '#f3f4f6', end: '#f3f4f6' }, // Used to trigger border-only style
      icon: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-[1.75px] border-[#99a1af] p-1">
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.99992 2.66602V13.3327"
              stroke="#99a1af"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.66659 7.99935H13.3333"
              stroke="#99a1af"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
      title: 'Cignal Super',
      description: 'New App',
    },
  ];

  const entertainmentCarouselItems = [
    {
      imageSrc: getImageUrl('carousel-1'),
      title: 'The Latest Drama Series',
      category: 'Drama',
      info: '8 Episodes',
    },
    {
      imageSrc: getImageUrl('carousel-2'),
      title: 'Comedy Night Special',
      category: 'Comedy',
      info: '2h 15m',
    },
    {
      imageSrc: getImageUrl('carousel-3'),
      title: 'Documentary: Nature',
      category: 'Documentary',
      info: '1h 45m',
    },
  ];

  const moviesCarouselItems = [
    {
      imageSrc: getImageUrl('movie-1'),
      title: 'Action Thriller 2024',
      category: 'Action',
      info: '2h 30m',
    },
    {
      imageSrc: getImageUrl('movie-2'),
      title: 'Romantic Comedy',
      category: 'Romance',
      info: '1h 55m',
    },
    {
      imageSrc: getImageUrl('movie-3'),
      title: 'Sci-Fi Adventure',
      category: 'Sci-Fi',
      info: '2h 45m',
    },
  ];

  const sportsCarouselItems = [
    {
      imageSrc: getImageUrl('sports-1'),
      title: 'NBA Finals Game 7',
      category: 'Basketball',
      info: 'Live',
    },
    {
      imageSrc: getImageUrl('sports-2'),
      title: 'Premier League Match',
      category: 'Football',
      info: 'Today 8PM',
    },
    {
      imageSrc: getImageUrl('sports-3'),
      title: 'Tennis Grand Slam',
      category: 'Tennis',
      info: 'Live Now',
    },
  ];

  const currentPlans = [
    {
      planName: 'Cignal Postpaid Premium',
      price: '₱1,899/month',
      status: 'Active' as const,
      channels: '200+',
      validUntil: 'Dec 15, 2025',
      manageLink: '#',
      upgradeLink: '#',
      payBillLink: '#',
      icon: <IconTV className="w-8 h-8" stroke="#155dfc" />,
    },
    {
      planName: 'Cignal Fiber 100 Mbps',
      price: '₱1,699/month',
      status: 'Active' as const,
      channels: '50+',
      speed: '100 Mbps',
      validUntil: 'Dec 31, 2025',
      manageLink: '#',
      upgradeLink: '#',
      icon: <IconWifi className="w-8 h-8" stroke="#155dfc" />,
    },
    {
      planName: 'Cignal Prepaid Basic',
      price: '₱299/month',
      status: 'Expiring' as const,
      channels: '30+',
      validUntil: 'Dec 10, 2025',
      manageLink: '#',
      upgradeLink: '#',
      icon: <IconMobileStreaming className="w-8 h-8" stroke="#155dfc" />,
    },
  ];

  const helpFaqItems = [
    {
      question: 'How do I upgrade my subscription?',
      answer:
        'Go to your Current Plans section, select the plan you wish to upgrade, and follow the prompts. You can also contact customer support for assistance.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept credit cards, debit cards, GCash, PayMaya, and over-the-counter payments at our partner establishments.',
    },
    {
      question: 'Can I pause my subscription?',
      answer:
        'Yes, you can pause prepaid subscriptions. For postpaid subscriptions, please contact customer support to discuss your options.',
    },
  ];

  const navItems = [
    { icon: <IconHome className="w-5 h-5" />, label: 'Home', isActive: true },
    { icon: <IconSubscriptions className="w-5 h-5" />, label: 'Subscriptions', isActive: false },
    { icon: <IconHelp className="w-5 h-5" />, label: 'Help', isActive: false },
    { icon: <IconProfile className="w-5 h-5" />, label: 'Profile', isActive: false },
  ];

  return (
    <div className="relative mx-auto min-h-screen max-w-[376px] overflow-x-hidden bg-[#f9fafc] text-sm">
      {/* Top Bar */}
      <TopBar appName="Cignal One" notificationsCount={2} />

      {/* Main Content Area */}
      <main className="relative flex flex-col pb-[80px]">
        {/* Header Image Section */}
        <section className="relative h-[256px] w-full bg-[#101828]">
          <Image
            src={getImageUrl('4eda220f49efdbb1ad4b1a5c9ead0b901dc88c43')}
            alt="New Release: Action Movies Marathon"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-[30px] font-medium leading-[30px] tracking-[-0.66px] text-white">
              New Release: Action Movies Marathon
            </h2>
            <p className="mt-2 text-base font-normal leading-6 tracking-[-0.3125px] text-white/90">
              Stream the latest blockbusters
            </p>
          </div>
        </section>

        {/* Current Plans Section */}
        <CurrentPlansSection
          title="Current Plans"
          description="Manage your active subscriptions"
          actionButtons={[
            { label: 'Sort', link: '#', icon: <svg className="w-4 h-4 text-[#4a5565]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6666 4.66699L7.99992 9.33366L3.33325 4.66699" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg> },
            { label: 'Filter', link: '#', icon: <svg className="w-4 h-4 text-[#4a5565]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.66659 4.66602L13.3333 4.66602L13.3333 7.33268L2.66659 7.33268L2.66659 4.66602Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.66659 9.33268L13.3333 9.33268L13.3333 11.9993L2.66659 11.9993L2.66659 9.33268Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg> },
          ]}
          plans={currentPlans}
        />

        {/* Your Apps Section */}
        <AppsSection
          title="Your Apps"
          description="Manage your subscriptions"
          viewAllLink="#"
          apps={apps}
        />

        {/* Wallet Preview Section */}
        <WalletPreview
          points={2450}
          rewardsAvailable={15}
          viewWalletLink="#"
        />

        {/* Content Carousels */}
        <ContentCarousel
          title="Entertainment"
          description="Popular shows and series"
          seeAllLink="#"
          items={entertainmentCarouselItems}
        />
        <ContentCarousel
          title="Movies"
          description="Blockbusters and classics"
          seeAllLink="#"
          items={moviesCarouselItems}
        />
        <ContentCarousel
          title="Sports & Live Events"
          description="Watch your favorite sports"
          seeAllLink="#"
          items={sportsCarouselItems}
        />

        {/* Dynamic Image Sections */}
        <section className="relative h-[256px] w-full bg-[#101828] mt-4">
          <Image
            src={getImageUrl('f4601d3391337eed910f0c51a0cffe14718ee87a')}
            alt="Live Sports: Premier League"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-[30px] font-medium leading-[30px] tracking-[-0.66px] text-white">
              Live Sports: Premier League
            </h2>
            <p className="mt-2 text-base font-normal leading-6 tracking-[-0.3125px] text-white/90">
              Watch your favorite teams live
            </p>
          </div>
        </section>

        <section className="relative h-[256px] w-full bg-[#101828] mt-4">
          <Image
            src={getImageUrl('8a6558968e08468118b791792df41cb25d126728')}
            alt="Breaking News Coverage"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-[30px] font-medium leading-[30px] tracking-[-0.66px] text-white">
              Breaking News Coverage
            </h2>
            <p className="mt-2 text-base font-normal leading-6 tracking-[-0.3125px] text-white/90">
              24/7 news and updates
            </p>
          </div>
        </section>

        {/* Help Section */}
        <HelpSection
          title="Help & Support"
          faqItems={helpFaqItems}
          internetIssueLink="#"
          noTVSignalLink="#"
          resetDeviceLink="#"
          callSupportLink="#"
          stillNeedHelpTitle="Still need help?"
          callSupportButtonLabel="Call Support"
          chatWithUsButtonLabel="Chat with Us"
          viewAllFaqsLink="#"
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNav navItems={navItems} />

      {/* Floating Chatbot Button */}
      <ChatBotButton onClick={handleOpenPayBillModal} />

      {/* Pay Bill Modal */}
      <PayBillModal isOpen={isPayBillModalOpen} onClose={handleClosePayBillModal} />
    </div>
  );
}