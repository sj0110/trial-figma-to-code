// src/components/HomeScreen.tsx
import { useState, useMemo } from 'react';

// --- Icons (Sub-components) ---
interface SvgIconProps {
  className?: string;
  strokeColor?: string;
  strokeWidth?: string;
  fillColor?: string;
}

const ArrowRightIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#155DFC', strokeWidth = '1.33333' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 4L10 8L6 12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TvIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#ffffff', strokeWidth = '3.99971' }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 4H34V14H14V4Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14H44V34C44 38.4183 40.4183 42 36 42H12C7.58172 42 4 38.4183 4 34V14Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayButtonIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#ffffff', strokeWidth = '3.99971' }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9.99927 3.99971V43.9962L39.9971 23.9979L9.99927 3.99971Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MicIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#ffffff', strokeWidth = '3.99971' }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 5.9984L10 41.9982L40 23.9983L10 5.9984Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpSupportIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#364052', strokeWidth = '1.94786' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V17.01" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 10.8954 12.1046 10 11 10C10.4477 10 10 10.4477 10 11M12 13C11.4477 13 11 12.5523 11 12C11 10.8954 11.8954 10 13 10C13.5523 10 14 10.4477 14 11" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InternetIssuesIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#155dfc', strokeWidth = '1.94786' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 20V20.01" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 17C10.6667 16 13.3333 16 15 17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14C9.33333 12 14.6667 12 18 14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11C7.33333 8 16.6667 8 21 11" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NoTvSignalIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#155dfc', strokeWidth = '1.94786' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.22 4.22L6.65 6.65" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ResetDeviceIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#155dfc', strokeWidth = '1.94786' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M23 4V10H17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 20V14H7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 9C3.99672 7.74718 4.70776 6.59124 5.59858 5.59918C6.4894 4.60711 7.54583 3.80559 8.70735 3.2505C9.86888 2.69542 11.1167 2.39958 12.3782 2.38555C13.6396 2.37151 14.887 2.63972 16.0504 3.1764C17.2139 3.71308 18.2694 4.50972 19.1623 5.50005L23 10M1 14L4.8377 18.4999C5.73062 19.4903 6.78611 20.287 7.94956 20.8236C9.11301 21.3603 10.3604 21.6285 11.6219 21.6145C12.8833 21.6004 14.1311 21.3046 15.2926 20.7495C16.4542 20.1944 17.5106 19.3929 18.4014 18.4008" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CallSupportIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#155dfc', strokeWidth = '1.94786' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 16.92V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C17.17 22 14.47 21.34 12 20C7.26 18.78 3.22 14.74 2 10C0.66 7.53 0 4.83 0 2C0 1.46957 0.210714 0.960868 0.585786 0.585786C0.960868 0.960868 1.46957 0 2 0H5.08C5.61043 0 6.10919 0.210714 6.48427 0.585786C6.85935 0.960868 7.07007 1.46957 7.07007 2C7.07007 2.45 6.94007 2.91 6.69007 3.33L5.13007 5.86C4.89007 6.27 4.88007 6.78 5.12007 7.18C6.67007 9.87 9.13007 12.33 11.82 13.88C12.22 14.12 12.73 14.11 13.14 13.87L15.67 12.31C16.09 12.06 16.55 11.93 17 11.93C17.5304 11.93 18.0391 12.1407 18.4142 12.5157C18.7893 12.8908 19 13.3996 19 13.93V16.92Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#ffffff', strokeWidth = '2' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 12C21 12.5304 20.7893 13.0391 20.4142 13.4142C20.0391 13.7893 19.5304 14 19 14H5C4.46957 14 3.96087 13.7893 3.58579 13.4142C3.21071 13.0391 3 12.5304 3 12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96087 10.2107 4.46957 10 5 10H19C19.5304 10 20.0391 10.2107 20.4142 10.5858C20.7893 10.9609 21 11.4696 21 12Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10V21C12 21.5304 11.7893 22.0391 11.4142 22.4142C11.0391 22.7893 10.5304 23 10 23C9.46957 23 8.96087 22.7893 8.58579 22.4142C8.21071 22.0391 8 21.5304 8 21V3C8 2.46957 8.21071 1.96087 8.58579 1.58579C8.96087 1.21071 9.46957 1 10 1C10.5304 1 11.0391 1.21071 11.4142 1.58579C11.7893 1.96087 12 2.46957 12 3V10Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 14V3C5 2.46957 5.21071 1.96087 5.58579 1.58579C5.96087 1.21071 6.46957 1 7 1H10V10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 14V21C19 21.5304 18.7893 22.0391 18.4142 22.4142C18.0391 22.7893 17.5304 23 17 23H10V14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#6A7282', strokeWidth = '1' }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 3V6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 2C9.09672 1.21071 8.03913 0.713082 6.87823 0.449514C5.71734 0.185946 4.46957 0.160351 3.23828 0.360481C2.007 0.560611 0.817406 1.05834 0 1.80005M12 6C12 7.23112 11.7766 8.45037 11.3396 9.58882C10.9026 10.7273 10.2608 11.7618 9.4623 12.5592L6 10.8741" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10C5.12071 10 4.28859 9.77661 3.55118 9.33962C2.81377 8.90263 2.20382 8.26084 1.76683 7.46235C1.32984 6.66386 1.10645 5.83173 1.10645 4.95244C1.10645 4.07315 1.32984 3.24102 1.76683 2.44253C2.20382 1.64404 2.81377 1.02271 3.55118 0.58572C4.28859 0.14873 5.12071 -0.0746698 6 -0.0746698C6.87929 -0.0746698 7.71141 0.14873 8.44882 0.58572C9.18623 1.02271 9.79618 1.64404 10.2332 2.44253C10.6702 3.24102 10.8936 4.07315 10.8936 4.95244C10.8936 5.83173 10.6702 6.66386 10.2332 7.46235C9.79618 8.26084 9.18623 8.90263 8.44882 9.33962C7.71141 9.77661 6.87929 10 6 10Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavHomeIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#155DFC', strokeWidth = '1.66629' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.5 17.5V11.6667H12.5V17.5H16.6667V9.16667H19.1667L10 0.833344L0.833344 9.16667H3.33334V17.5H7.5Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavSubscriptionsIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#4A5565', strokeWidth = '1.66629' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5 17.5V10.8333C17.5 10.3957 17.3245 9.97686 17.0195 9.6618C16.7144 9.34673 16.3022 9.16667 15.875 9.16667H4.125C3.69781 9.16667 3.28556 9.34673 2.9805 9.6618C2.67544 9.97686 2.5 10.3957 2.5 10.8333V17.5C2.5 17.9602 2.68538 18.4022 3.01997 18.7368C3.35456 19.0714 3.79659 19.2568 4.25672 19.2568C4.71685 19.2568 5.15888 19.0714 5.49347 18.7368C5.82806 18.4022 6.01344 17.9602 6.01344 17.5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 2.5V12.5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.83334 6.66667L10 2.5L14.1667 6.66667" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavHelpIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#4A5565', strokeWidth = '1.66629' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 17.5V17.51" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12.5C10.4602 12.5 10.8333 12.1268 10.8333 11.6667C10.8333 10.8333 10.1268 10 9.16667 10C8.63624 10 8.12753 10.2107 7.75245 10.5858C7.37737 10.9609 7.16667 11.4696 7.16667 12C7.16667 12.4602 7.34673 12.8793 7.6618 13.1844C7.97686 13.4895 8.39569 13.6645 8.83334 13.6645M10 12.5C9.53982 12.5 9.16667 12.1268 9.16667 11.6667C9.16667 10.8333 9.87316 10 10.8333 10C11.3638 10 11.8725 10.2107 12.2475 10.5858C12.6226 10.9609 12.8333 11.4696 12.8333 12C12.8333 12.4602 12.6596 12.8793 12.3445 13.1844C12.0294 13.4895 11.6116 13.6645 11.1667 13.6645" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 19.1667C15.062 19.1667 19.1667 15.062 19.1667 10C19.1667 4.93802 15.062 0.833344 10 0.833344C4.93802 0.833344 0.833344 4.93802 0.833344 10C0.833344 15.062 4.93802 19.1667 10 19.1667Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BottomNavProfileIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#4A5565', strokeWidth = '1.66629' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 12.5C12.3012 12.5 14.1667 10.6345 14.1667 8.33333C14.1667 6.03217 12.3012 4.16667 10 4.16667C7.69882 4.16667 5.83334 6.03217 5.83334 8.33333C5.83334 10.6345 7.69882 12.5 10 12.5Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.8333 15.8333C15.8333 14.0709 15.1274 12.3804 13.8778 11.1308C12.6281 9.88118 10.9376 9.16667 9.17518 9.16667H1.67518C-0.087222 9.16667 -1.77773 9.88118 -3.02738 11.1308C-4.27703 12.3804 -4.98295 14.0709 -4.98295 15.8333V19.1667C-4.98295 19.6268 -4.79757 20.0688 -4.46298 20.4034C-4.12838 20.738 -3.68635 20.9234 -3.22622 20.9234C-2.76609 20.9234 -2.32406 20.738 -1.98947 20.4034C-1.65488 20.0688 -1.4695 19.6268 -1.4695 19.1667H20V15.8333H15.8333Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatBotIcon: React.FC<SvgIconProps> = ({ className, strokeColor = '#ffffff', strokeWidth = '2' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C6.2533 21 2 16.7467 2 11.5C2 6.2533 6.2533 2 11.5 2C16.7467 2 21 6.2533 21 11.5Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V17.01" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 10.8954 12.1046 10 11 10C10.4477 10 10 10.4477 10 11M12 13C11.4477 13 11 12.5523 11 12C11 10.8954 11.8954 10 13 10C13.5523 10 14 10.4477 14 11" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// --- Utility functions ---
function hexToRgbA(hex: string, alpha: number): string {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
  }
  throw new Error('Bad Hex');
}

// --- Sub-components ---

interface AppCardProps {
  gradientStart: string;
  gradientEnd: string;
  title: string;
  description: string;
  IconComponent: React.ElementType<SvgIconProps>;
}

const AppCard: React.FC<AppCardProps> = ({ gradientStart, gradientEnd, title, description, IconComponent }) => (
  <div
    className="flex h-[172px] w-[128px] flex-col items-center justify-start rounded-[14px] px-0 py-0 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)]"
    style={{
      background: `linear-gradient(225deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
      gap: '7.996376px',
    }}
  >
    <div className="flex h-[128px] w-[128px] flex-row items-center justify-center">
      <IconComponent className="h-[48px] w-[48px]" />
    </div>
    <div className="flex w-full flex-col items-center justify-start">
      <p className="w-full text-center text-[16px] font-normal text-[#101828]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
        {title}
      </p>
      <p className="w-full text-center text-[16px] font-normal text-[#6a7282]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582214px' }}>
        {description}
      </p>
    </div>
  </div>
);

interface CarouselContentCardProps {
  imageHash: string;
  title: string;
  category: string;
  duration?: string; // e.g., "8 Episodes" or "2h 15m"
}

const CarouselContentCard: React.FC<CarouselContentCardProps> = ({ imageHash, title, category, duration }) => (
  <div className="flex h-[176px] w-[192px] flex-col items-start justify-start rounded-[14px] bg-[#101828] px-0 py-0">
    <div
      className="flex h-[112px] w-full flex-row items-center justify-center rounded-t-[14px]"
      style={{
        background: `url(https://picsum.photos/192/112?hash=${imageHash}) center / cover no-repeat`,
        backgroundSize: 'cover',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#ffffff]/20">
        <PlayButtonIcon className="h-[12px] w-[8px]" strokeColor="white" strokeWidth="2.66622" />
      </div>
    </div>
    <div className="flex w-full flex-col items-start justify-start px-[12px] py-[12px]" style={{ gap: '3.993688px' }}>
      <p className="text-[16px] font-normal text-white" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
        {title}
      </p>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-[16px] font-normal text-[#99a1af]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582153px' }}>
          {category}
        </p>
        {duration && (
          <div className="flex items-center justify-start" style={{ gap: '3.993642px' }}>
            <ClockIcon className="h-[12px] w-[12px]" strokeColor="#99a1af" strokeWidth="1" />
            <p className="text-[16px] font-normal text-[#99a1af]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582153px' }}>
              {duration}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface CurrentPlanCardProps {
  IconComponent: React.ElementType<SvgIconProps>;
  title: string;
  price: string;
  status: 'Active' | 'Expiring';
  channelsOrSpeedLabel: string;
  channelsOrSpeedValue: string;
  validUntilLabel: string;
  validUntilValue: string;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  IconComponent,
  title,
  price,
  status,
  channelsOrSpeedLabel,
  channelsOrSpeedValue,
  validUntilLabel,
  validUntilValue,
}) => (
  <div className="flex w-[280px] flex-col items-start justify-start rounded-[16px] border border-[#e5e7eb] bg-white shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)]" style={{ gap: '15.992767px' }}>
    <div className="flex w-full flex-row items-start justify-between px-[16.575px] py-[16.575px]">
      <div className="flex flex-row items-center justify-start" style={{ gap: '11.999123px' }}>
        <div className="flex h-[47.987px] w-[47.987px] items-center justify-center rounded-[14px] bg-[#eff6ff]">
          <IconComponent className="h-[31.995px] w-[31.995px]" strokeColor="#155dfc" strokeWidth="2.66622" />
        </div>
        <div className="flex flex-col items-start justify-start">
          <h3 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
            {title}
          </h3>
          <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746658px' }}>
            {price}
          </p>
        </div>
      </div>
      <span className={`flex h-[24px] w-[51px] items-center justify-center rounded-full text-[16px] font-normal ${status === 'Active' ? 'bg-[#dcfce7] text-[#008236]' : 'bg-[#fefce8] text-[#b91c1c]'}`} style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '4.57585px' }}>
        {status}
      </span>
    </div>

    <div className="flex w-full flex-col items-start justify-start border-t border-[#f3f4f6] px-[16.575px] py-0" style={{ gap: '7.996405px' }}>
      <div className="flex w-full flex-row items-center justify-between pt-[12.581329px]">
        <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
          {channelsOrSpeedLabel}
        </p>
        <p className="text-[16px] font-normal text-[#101828]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
          {channelsOrSpeedValue}
        </p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
          {validUntilLabel}
        </p>
        <p className="text-[16px] font-normal text-[#101828]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
          {validUntilValue}
        </p>
      </div>
    </div>

    <div className="flex w-full flex-row items-start justify-start px-[16.575px] pb-[16.575px]" style={{ gap: '7.996361px' }}>
      <button className="flex h-[36px] flex-1 items-center justify-center rounded-[10px] bg-[#f3f4f6]">
        <p className="text-[16px] font-normal text-[#101828]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '8.743011px' }}>
          Manage
        </p>
      </button>
      <button className="flex h-[36px] flex-1 items-center justify-center rounded-[10px] bg-[#155dfc]">
        <p className="text-[16px] font-normal text-white" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '8.743011px' }}>
          Upgrade
        </p>
      </button>
      {status === 'Active' && (
        <button className="flex h-[36px] flex-1 items-center justify-center rounded-[10px] bg-[#008236]">
          <p className="text-[16px] font-normal text-white" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '8.743011px' }}>
            Pay Bill
          </p>
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
    <div className="flex w-full flex-col items-start justify-start rounded-[13.636px] border border-[#e5e7eb] bg-white px-0 py-0">
      <button
        className="flex w-full cursor-pointer flex-row items-center justify-between px-[15.577px] py-[13.636px]"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <p className="text-[16px] font-normal text-[#101828]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.726949px' }}>
          {question}
        </p>
        <ArrowRightIcon
          className={`h-[15.577px] w-[15.577px] transform transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          strokeColor="#99a1af"
          strokeWidth="1.29808"
        />
      </button>
      {isOpen && (
        <p className="w-full px-[16.144px] pb-[16.144px] text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.726978px' }}>
          {answer}
        </p>
      )}
    </div>
  );
};


// --- Main Component ---
export interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const promoImages = useMemo(() => [
    {
      id: '2:3564',
      src: `https://picsum.photos/376/256?random=1`, // "4eda220f49efdbb1ad4b1a5c9ead0b901dc88c43",
      title: 'New Release: Action Movies Marathon',
      description: 'Stream the latest blockbusters',
    },
    {
      id: '2:3572',
      src: `https://picsum.photos/376/256?random=2`, // "f4601d3391337eed910f0c51a0cffe14718ee87a",
      title: 'Live Sports: Premier League',
      description: 'Watch your favorite teams live',
    },
    {
      id: '2:3580',
      src: `https://picsum.photos/376/256?random=3`, // "8a6558968e08468118b791792df41cb25d126728",
      title: 'Breaking News Coverage',
      description: '24/7 news and updates',
    },
  ], []);

  const handleDotClick = (index: number) => {
    setActivePromoIndex(index);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#ffffff] font-inter text-[#101828]">
      {/* TopBar */}
      <div className="fixed left-0 right-0 top-0 z-10 flex h-[64.57px] w-full flex-col items-start justify-end border-b border-[#e5e7eb] bg-white px-0 py-0">
        <div className="flex w-full flex-row items-center justify-between px-[16px] py-0">
          <div className="flex flex-row items-center justify-start gap-[12px]">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
              style={{ background: `linear-gradient(225deg, #155dfc 0%, #4f39f4 100%)` }}>
              <p className="text-[20px] font-normal text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.671133px' }}>
                C1
              </p>
            </div>
            <h1 className="text-[30px] font-medium text-[#101828]" style={{ lineHeight: '36px', letterSpacing: '-0.5067px', paddingTop: '-0.5067px' }}>
              Cignal One
            </h1>
          </div>
          <div className="flex h-[36px] flex-row items-center justify-start">
            <button className="flex h-[36px] w-[36px] items-center justify-center rounded-full">
              <span className="relative h-[20px] w-[20px] rounded-full">
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ef4444]" />
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6667 8.33333C16.6667 9.87754 16.0521 11.3591 14.9526 12.4586C13.8531 13.5581 12.3715 14.1727 10.8333 14.1727C9.29518 14.1727 7.81363 13.5581 6.71412 12.4586C5.6146 11.3591 5 9.87754 5 8.33333V4.16667L10.8333 0.833344V4.16667C12.3775 4.16667 13.8591 4.78122 14.9586 5.88074C16.0581 6.98025 16.6727 8.4618 16.6667 10.0001V8.33333Z" stroke="#364052" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.0001 19.1667C10.6133 19.1667 11.218 19.0435 11.7854 18.799C12.3528 18.5545 12.8757 18.1837 13.3283 17.7011C13.7809 17.2185 14.156 16.6346 14.4363 15.9928C14.7166 15.351 14.8966 14.6621 14.9667 13.9749H5.03337C5.10343 14.6621 5.28347 15.351 5.56379 15.9928C5.84411 16.6346 6.21926 17.2185 6.67188 17.7011C7.12451 18.1837 7.64736 18.5545 8.21481 18.799C8.78227 19.0435 9.38702 19.1667 10.0001 19.1667Z" stroke="#364052" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <button className="flex h-[36px] w-[36px] items-center justify-center rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1667 19.1667L14.6667 14.6667M16.6667 9.16667C16.6667 11.4678 15.8333 13.5964 14.2407 15.189C12.6481 16.7816 10.5195 17.615 8.21833 17.615C5.91715 17.615 3.78859 16.7816 2.19598 15.189C0.603366 13.5964 -0.230006 11.4678 -0.230006 9.16667C-0.230006 6.86549 0.603366 4.73693 2.19598 3.14432C3.78859 1.5517 5.91715 0.718331 8.21833 0.718331C10.5195 0.718331 12.6481 1.5517 14.2407 3.14432C15.8333 4.73693 16.6667 6.86549 16.6667 9.16667Z" stroke="#364052" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pt-[64.57px] pb-[64.55px]">
        {/* Promotion Carousel */}
        <section className="relative flex h-[256px] w-full flex-col bg-[#101828]">
          {promoImages.map((promo, index) => (
            <div
              key={promo.id}
              className={`absolute left-0 top-0 h-full w-full transition-opacity duration-500 ${
                index === activePromoIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${promo.src})` }}
                role="img"
                aria-label={promo.title}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 top-0"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                  }}
                />
                <div className="absolute bottom-[24px] left-[24px] flex flex-col items-start justify-start gap-[8px]">
                  <h2 className="text-[20px] font-medium text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.088928px' }}>
                    {promo.title}
                  </h2>
                  <p className="text-[16px] font-normal text-white/90" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '-0.671127px' }}>
                    {promo.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-[24px] right-[24px] flex flex-row items-center justify-start gap-[8px]">
            {promoImages.map((_, index) => (
              <button
                key={index}
                className={`h-[8px] rounded-full ${
                  index === activePromoIndex ? 'w-[24px] bg-white' : 'w-[8px] bg-white/50'
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Current Plans Section */}
        <section className="flex w-full flex-col items-start justify-start border-t border-[#f3f4f6] bg-white pb-[16px]" style={{ paddingTop: '15.992767px', gap: '15.992763px' }}>
          <div className="flex w-full flex-row items-center justify-between px-[16px]">
            <div className="flex flex-col items-start justify-start">
              <h2 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.671135px' }}>
                Current Plans
              </h2>
              <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746651px' }}>
                Manage your active subscriptions
              </p>
            </div>
            <div className="flex flex-row items-start justify-start gap-[8px]">
              <button className="flex h-[33.15px] w-[33.15px] items-center justify-center rounded-[10px] border border-[#e5e7eb] text-[#4a5565]">
                <ArrowRightIcon className="h-[16px] w-[16px] rotate-180" strokeColor="#4a5565" strokeWidth="1.33273" />
              </button>
              <button className="flex h-[33.15px] w-[33.15px] items-center justify-center rounded-[10px] border border-[#e5e7eb] text-[#4a5565]">
                <ArrowRightIcon className="h-[16px] w-[16px]" strokeColor="#4a5565" strokeWidth="1.33273" />
              </button>
            </div>
          </div>
          <div className="flex w-full overflow-x-auto px-[16px] py-0" style={{ gap: '16px' }}>
            <CurrentPlanCard
              IconComponent={TvIcon}
              title="Cignal Postpaid Premium"
              price="₱1,899/month"
              status="Active"
              channelsOrSpeedLabel="Channels"
              channelsOrSpeedValue="200+"
              validUntilLabel="Bill Due"
              validUntilValue="Dec 15, 2025"
            />
            <CurrentPlanCard
              IconComponent={PlayButtonIcon}
              title="Cignal Play Unlimited"
              price="₱399/month"
              status="Expiring"
              channelsOrSpeedLabel="Channels"
              channelsOrSpeedValue="50+"
              validUntilLabel="Valid Until"
              validUntilValue="Jan 5, 2026"
            />
            <CurrentPlanCard
              IconComponent={TvIcon} // Assuming TvIcon for Fiber as well for simplicity
              title="Cignal Fiber 200 Mbps"
              price="₱2,499/month"
              status="Active"
              channelsOrSpeedLabel="Speed"
              channelsOrSpeedValue="200 Mbps"
              validUntilLabel="Valid Until"
              validUntilValue="Mar 15, 2026"
            />
          </div>
        </section>

        {/* Your Apps Section */}
        <section className="flex w-full flex-col items-start justify-start bg-white pb-[24px] pt-[24px]" style={{ gap: '15.992756px', marginTop: '198.571472px' }}>
          <div className="flex w-full flex-row items-center justify-between px-[16px]">
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.671387px' }}>
                Your Apps
              </h3>
              <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                Manage your subscriptions
              </p>
            </div>
            <button className="flex items-center justify-center gap-[4px] px-0 py-0">
              <p className="text-[16px] font-normal text-[#155dfc]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                View All
              </p>
              <ArrowRightIcon className="h-[16px] w-[16px]" strokeColor="#155dfc" strokeWidth="1.33273" />
            </button>
          </div>
          <div className="flex w-full overflow-x-auto px-[16px] py-0" style={{ gap: '12px' }}>
            <AppCard
              gradientStart="#2b7eef"
              gradientEnd="#155dfc"
              title="Cignal Postpaid"
              description="Premium TV experience"
              IconComponent={TvIcon}
            />
            <AppCard
              gradientStart="#615fef"
              gradientEnd="#4f39f4"
              title="Cignal Prepaid"
              description="Flexible TV plans"
              IconComponent={TvIcon}
            />
            <AppCard
              gradientStart="#ac46fe"
              gradientEnd="#9800ed"
              title="SatLite"
              description="Mobile streaming"
              IconComponent={PlayButtonIcon}
            />
            <AppCard
              gradientStart="#00c850"
              gradientEnd="#00a63e"
              title="Pilipinas Live"
              description="Local channels"
              IconComponent={MicIcon}
            />
          </div>
        </section>

        {/* Wallet Preview */}
        <section
          className="flex w-full flex-col items-start justify-start pb-[24px] pt-[24px]"
          style={{
            marginTop: '290.953552px', // Difference between 849.875793 and 558.922241
            background: `linear-gradient(225deg, #155dfc 0%, #4f39f4 100%)`,
            gap: '15.992759px',
          }}
        >
          <div className="flex w-full flex-row items-center justify-between px-[16px]">
            <div className="flex flex-row items-center justify-start gap-[12px]">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white/20">
                <WalletIcon className="h-[24px] w-[24px]" />
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="text-[16px] font-normal text-white/90" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                  My Wallet
                </p>
                <h3 className="text-[20px] font-medium text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
                  2,450 Points
                </h3>
              </div>
            </div>
            <button className="flex h-[40px] w-[140px] items-center justify-center rounded-[10px] bg-white/20">
              <p className="text-[16px] font-normal text-white" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '7.325256px' }}>
                View Wallet
              </p>
              <ArrowRightIcon className="h-[16px] w-[16px]" strokeColor="white" strokeWidth="1.33273" />
            </button>
          </div>
          <div className="flex w-full flex-row items-start justify-start px-[16px] py-0" style={{ gap: '16px' }}>
            <div className="flex h-[104px] flex-1 flex-col items-start justify-start rounded-[14px] bg-white/10 px-[16px] py-0">
              <div className="flex h-[20px] w-[20px] items-center justify-center pt-[16px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.66629 1.66629H11.664C11.664 1.66629 13.3303 1.66629 13.3303 3.33258C13.3303 5.00017 11.664 5.00017 11.664 5.00017H1.66629V1.66629Z" stroke="#FFDE20" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.61473 8.63972L18.3242 8.63972L18.3001 18.3225L8.61473 18.3001L8.61473 8.63972Z" stroke="#FFDE20" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83202 4.99888V8.33146" stroke="#FFDE20" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.1556 11.5641L14.5051 14.5051" stroke="#FFDE20" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-normal text-white/90 pt-[11.999px]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                Available
              </p>
              <p className="text-[20px] font-medium text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
                2,450 pts
              </p>
            </div>
            <div className="flex h-[104px] flex-1 flex-col items-start justify-start rounded-[14px] bg-white/10 px-[16px] py-0">
              <div className="flex h-[20px] w-[20px] items-center justify-center pt-[16px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.49944 6.66517H17.4966L17.5 10L2.5 10V6.66517Z" stroke="#FC93D5" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.99775 6.66517V17.496" stroke="#FC93D5" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.16573 9.99775L15.8298 9.99775L15.8306 17.4952L4.16573 17.4952L4.16573 9.99775Z" stroke="#FC93D5" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.16573 2.49908L15.8298 2.49908L15.8306 6.66517L4.16573 6.66517L4.16573 2.49908Z" stroke="#FC93D5" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-normal text-white/90 pt-[11.999px]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                Rewards
              </p>
              <p className="text-[20px] font-medium text-white" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
                15 Available
              </p>
            </div>
          </div>
        </section>

        {/* Entertainment Carousel */}
        <section className="flex w-full flex-col items-start justify-start bg-white pb-[24px] pt-[24px]" style={{ gap: '15.992756px', marginTop: '215.956939px' }}>
          <div className="flex w-full flex-row items-center justify-between px-[16px]">
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
                Entertainment
              </h3>
              <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                Popular shows and series
              </p>
            </div>
            <button className="flex items-center justify-center gap-[4px]">
              <p className="text-[16px] font-normal text-[#155dfc]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746643px' }}>
                See All
              </p>
              <ArrowRightIcon className="h-[16px] w-[16px]" strokeColor="#155dfc" strokeWidth="1.33273" />
            </button>
          </div>
          <div className="flex w-full overflow-x-auto px-[16px] py-0" style={{ gap: '16px' }}>
            <CarouselContentCard
              imageHash="image-1"
              title="The Latest Drama Series"
              category="Drama"
              duration="8 Episodes"
            />
            <CarouselContentCard
              imageHash="image-2"
              title="Comedy Night Special"
              category="Comedy"
              duration="2h 15m"
            />
            <CarouselContentCard
              imageHash="image-3"
              title="Documentary: Nature"
              category="Documentary"
              duration="1h 45m"
            />
          </div>
        </section>

        {/* Movies Carousel */}
        <section className="flex w-full flex-col items-start justify-start bg-white pb-[24px] pt-[24px]" style={{ gap: '15.992695px', marginTop: '16px' }}>
          <div className="flex w-full flex-row items-center justify-between px-[16px]">
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
                Movies
              </h3>
              <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746704px' }}>
                Blockbusters and classics
              </p>
            </div>
            <button className="flex items-center justify-center gap-[4px]">
              <p className="text-[16px] font-normal text-[#155dfc]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746582px' }}>
                See All
              </p>
              <ArrowRightIcon className="h-[16px] w-[16px]" strokeColor="#155dfc" strokeWidth="1.33273" />
            </button>
          </div>
          <div className="flex w-full overflow-x-auto px-[16px] py-0" style={{ gap: '16px' }}>
            <CarouselContentCard
              imageHash="movie-1"
              title="Action Thriller 2024"
              category="Action"
              duration="2h 30m"
            />
            <CarouselContentCard
              imageHash="movie-2"
              title="Romantic Comedy"
              category="Romance"
              duration="1h 55m"
            />
            <CarouselContentCard
              imageHash="movie-3"
              title="Horror Mystery"
              category="Horror"
              duration="1h 40m"
            />
            <CarouselContentCard
              imageHash="movie-4"
              title="Animated Feature"
              category="Animation"
              duration="1h 30m"
            />
          </div>
        </section>

        {/* Sports & Live Events Carousel */}
        <section className="flex w-full flex-col items-start justify-start bg-white pb-[24px] pt-[24px]" style={{ gap: '15.992817px', marginTop: '16px' }}>
          <div className="flex w-full flex-row items-center justify-between px-[16px]">
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.670898px' }}>
                Sports & Live Events
              </h3>
              <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746582px' }}>
                Watch your favorite sports
              </p>
            </div>
            <button className="flex items-center justify-center gap-[4px]">
              <p className="text-[16px] font-normal text-[#155dfc]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.746704px' }}>
                See All
              </p>
              <ArrowRightIcon className="h-[16px] w-[16px]" strokeColor="#155dfc" strokeWidth="1.33273" />
            </button>
          </div>
          <div className="flex w-full overflow-x-auto px-[16px] py-0" style={{ gap: '16px' }}>
            <CarouselContentCard
              imageHash="sports-1"
              title="NBA Finals Game 7"
              category="Basketball"
              duration="Live"
            />
            <CarouselContentCard
              imageHash="sports-2"
              title="Premier League Match"
              category="Football"
              duration="Today 8PM"
            />
            <CarouselContentCard
              imageHash="sports-3"
              title="Tennis Grand Slam"
              category="Tennis"
              duration="Live Now"
            />
            <CarouselContentCard
              imageHash="sports-4"
              title="Boxing Championship"
              category="Boxing"
              duration="This Weekend"
            />
          </div>
        </section>

        {/* Help Section */}
        <section className="flex w-full flex-col items-start justify-start bg-[#eff6ff] px-[15.576px] py-0 pt-[24px]" style={{ marginTop: '16px' }}>
          <div className="flex w-full flex-row items-center justify-start gap-[7.788px] py-0 pb-[24px]">
            <HelpSupportIcon className="h-[23.374px] w-[23.374px]" strokeColor="#364052" strokeWidth="1.94786" />
            <h2 className="text-[20px] font-medium text-[#101828]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '-0.653777px' }}>
              Help & Support
            </h2>
          </div>

          <div className="flex w-full flex-row items-center justify-start border-b border-[#e5e7eb] py-0 pb-[23.374302px]" style={{ gap: '7.788496px' }}>
            <button className="flex h-[40.652px] w-[68.475px] items-center justify-center border-b-[2px] border-[#155dfc]">
              <p className="text-[16px] font-normal text-[#155dfc]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '7.134749px' }}>
                FAQs
              </p>
            </button>
            <button className="flex h-[40.652px] w-[113.85px] items-center justify-center border-b-[2px] border-transparent">
              <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '7.134749px' }}>
                Diagnostics
              </p>
            </button>
          </div>

          <div className="flex w-full flex-row flex-wrap items-start justify-between py-0 pt-[24px]" style={{ gap: '11.687147px' }}>
            <button className="flex h-[79.028px] w-[166.562px] flex-col items-center justify-center rounded-[13.636px] border border-[#e5e7eb] bg-white">
              <InternetIssuesIcon className="h-[23.374px] w-[23.374px]" strokeColor="#155dfc" strokeWidth="1.94786" />
              <p className="text-[16px] font-normal text-[#364052] pt-[7.788px]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.566977px' }}>
                Internet Issues
              </p>
            </button>
            <button className="flex h-[79.028px] w-[166.571px] flex-col items-center justify-center rounded-[13.636px] border border-[#e5e7eb] bg-white">
              <NoTvSignalIcon className="h-[23.374px] w-[23.374px]" strokeColor="#155dfc" strokeWidth="1.94786" />
              <p className="text-[16px] font-normal text-[#364052] pt-[7.788px]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.566977px' }}>
                No TV Signal
              </p>
            </button>
            <button className="flex h-[79.028px] w-[166.562px] flex-col items-center justify-center rounded-[13.636px] border border-[#e5e7eb] bg-white">
              <ResetDeviceIcon className="h-[23.374px] w-[23.374px]" strokeColor="#155dfc" strokeWidth="1.94786" />
              <p className="text-[16px] font-normal text-[#364052] pt-[7.788px]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.567152px' }}>
                Reset Device
              </p>
            </button>
            <button className="flex h-[79.028px] w-[166.571px] flex-col items-center justify-center rounded-[13.636px] border border-[#e5e7eb] bg-white">
              <CallSupportIcon className="h-[23.374px] w-[23.374px]" strokeColor="#155dfc" strokeWidth="1.94786" />
              <p className="text-[16px] font-normal text-[#364052] pt-[7.788px]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.567152px' }}>
                Call Support
              </p>
            </button>
          </div>

          <div className="flex w-full flex-col items-start justify-start pt-[24px]" style={{ gap: '11.687147px' }}>
            <FaqItem
              question="How do I upgrade my subscription?"
              answer="Go to your Current Plans section, select the plan you wish to upgrade, and follow the instructions to choose a new package."
            />
            <FaqItem
              question="What payment methods are accepted?"
              answer="We accept credit cards, debit cards, GCash, PayMaya, and over-the-counter payments at our partner establishments."
            />
            <FaqItem
              question="How can I earn more rewards points?"
              answer="Earn points by paying bills on time, referring friends, participating in surveys, and engaging with our special promotions."
            />
            <FaqItem
              question="Can I pause my subscription?"
              answer="Yes, you can pause prepaid subscriptions. For postpaid, you may downgrade or temporarily suspend your account subject to terms."
            />
          </div>

          <button className="flex h-[49.161px] w-full items-center justify-center rounded-[14px] border border-[#d2d6db] bg-[#f8f9fa] mt-[24px]">
            <p className="text-[20px] font-medium text-[#000000]" style={{ lineHeight: '30px', letterSpacing: '-0.44921875px', paddingTop: '11.910156px' }}>
              View All FAQs
            </p>
          </button>

          <div className="flex w-full flex-col items-start justify-start rounded-[13.636px] border border-[#bae0ff] bg-[#eff6ff] p-[16.144px] mt-[24px]" style={{ gap: '7.788487px' }}>
            <p className="w-full text-[16px] font-normal text-[#101828]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.727018px' }}>
              Still need help?
            </p>
            <div className="flex w-full flex-row items-center justify-start" style={{ gap: '7.788493px' }}>
              <button className="flex h-[36.187px] flex-1 items-center justify-center rounded-[9.74px] border border-[#c3daf1] bg-white">
                <p className="text-[16px] font-normal text-[#1349e5]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '9.082717px' }}>
                  Call Support
                </p>
              </button>
              <button className="flex h-[36.187px] flex-1 items-center justify-center rounded-[9.74px] bg-[#155dfc]">
                <p className="text-[16px] font-normal text-white" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '9.082717px' }}>
                  Chat with Us
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNav */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex h-[64.553px] w-full flex-col items-start justify-center border-t border-[#e5e7eb] bg-white px-[8px] py-0">
        <div className="flex w-full flex-row items-center justify-around">
          <button className="flex h-[55.975px] w-[65.281px] flex-col items-center justify-center gap-[3.994px]">
            <BottomNavHomeIcon className="h-[20px] w-[20px]" />
            <p className="text-[16px] font-normal text-[#155dfc]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582214px' }}>
              Home
            </p>
          </button>
          <button className="flex h-[55.975px] w-[109.557px] flex-col items-center justify-center gap-[3.994px]">
            <BottomNavSubscriptionsIcon className="h-[20px] w-[20px]" />
            <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582214px' }}>
              Subscriptions
            </p>
          </button>
          <button className="flex h-[55.975px] w-[80.291px] flex-col items-center justify-center gap-[3.994px]">
            <BottomNavHelpIcon className="h-[20px] w-[20px]" />
            <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582214px' }}>
              Help
            </p>
          </button>
          <button className="flex h-[55.975px] w-[68.292px] flex-col items-center justify-center gap-[3.994px]">
            <BottomNavProfileIcon className="h-[20px] w-[20px]" />
            <p className="text-[16px] font-normal text-[#4a5565]" style={{ lineHeight: '24px', letterSpacing: '-0.3125px', paddingTop: '0.582214px' }}>
              Profile
            </p>
          </button>
        </div>
      </div>

      {/* ChatBot Floating Button */}
      <button className="fixed bottom-[80px] right-[16px] z-20 flex h-[55.993px] w-[55.993px] items-center justify-center rounded-full shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)]"
        style={{ background: `linear-gradient(225deg, #155dfc 0%, #4f39f4 100%)` }}>
        <ChatBotIcon className="h-[24px] w-[24px]" />
      </button>
    </div>
  );
};

export default HomeScreen;