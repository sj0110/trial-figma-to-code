// File Path: src/components/ActiveChatbotUI.tsx

import { useState, useMemo } from 'react';

// --- Helper Functions for Design System Values ---

interface ColorObject {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Converts Figma RGBA color object (0-1 values) to a CSS hex or rgba string.
 * This adheres to the strict rule of using exact HEX values or rgba.
 */
const convertFigmaColorToCss = (color: ColorObject): string => {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a === undefined ? 1 : color.a;

  if (a === 1) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } else {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
};

// --- SVG Icon Components ---
// These are extracted directly from the JSON structure's 'Vector' paths and 'Icon' frame properties.
// In a real application, these would typically be separate SVG files or an icon library for better management.

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  strokeWidth?: number;
}

const ChevronRightIcon: React.FC<SvgIconProps> = ({ color = '#99a1af', strokeWidth = 1.33, ...props }) => (
  <svg
    width={props.width || 16}
    height={props.height || 16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.99729 3.99819L9.99548 7.99638L5.99729 11.9946"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TVIcon: React.FC<SvgIconProps> = ({ color = '#ffffff', strokeWidth = 4, ...props }) => (
  <svg
    width={props.width || 48}
    height={props.height || 48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.999 3.99971H33.9975V13.9982H13.999V3.99971Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.99971 13.9989H43.9968V43.9954H3.99971V13.9989Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MobileStreamIcon: React.FC<SvgIconProps> = ({ color = '#ffffff', strokeWidth = 4, ...props }) => (
  <svg
    width={props.width || 48}
    height={props.height || 48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.99927 3.99971H37.9972V43.9968H9.99927V3.99971Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.9982 35.9974H24.0182"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PilipinasLiveIcon: React.FC<SvgIconProps> = ({ color = '#ffffff', strokeWidth = 4, ...props }) => (
  <svg
    width={props.width || 48}
    height={props.height || 48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.99971 3.99971H43.9968V43.9968H3.99971V3.99971Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.9988 3.99971V43.9968"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.99971 23.9982H43.9968"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const QuestionMarkCircleIcon: React.FC<SvgIconProps> = ({ color, strokeWidth = 1.95, ...props }) => (
  <svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.94802 1.94795H21.4266V21.4265H1.94802V1.94795Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.85299 6.81342H14.5314C14.5314 6.81342 14.5314 9.49755 11.6871 9.49755C8.85299 9.49755 8.85299 12.012 8.85299 12.012"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6871 16.5568H11.6971"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WifiIcon: React.FC<SvgIconProps> = ({ color = '#155dfc', strokeWidth = 2.67, ...props }) => (
  <svg
    width={props.width || 32}
    height={props.height || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.66555 2.66622H25.3291V29.3284H6.66555V2.66622Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.9973 3.99933H16.0107"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TVIconFill: React.FC<SvgIconProps> = ({ color = '#155dfc', strokeWidth = 2.67, ...props }) => (
  <svg
    width={props.width || 32}
    height={props.height || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.66622 6.66555H29.3284V25.3291H2.66622V6.66555Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66622 13.3311H29.3284"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DollarSignIcon: React.FC<SvgIconProps> = ({ color = '#F0C720', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.66629 1.66629H11.664C11.664 1.66629 11.664 3.74966 9.99775 3.74966C8.33146 3.74966 8.33146 5.83303 9.99775 5.83303C11.664 5.83303 11.664 7.9164 9.99775 7.9164C8.33146 7.9164 8.33146 9.99977 9.99775 9.99977C11.664 9.99977 11.664 12.0831 9.99775 12.0831C8.33146 12.0831 8.33146 14.1665 9.99775 14.1665C11.664 14.1665 11.664 16.2498 9.99775 16.2498"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83202 4.99888V8.33146"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1556 11.5641V14.5051"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GiftIcon: React.FC<SvgIconProps> = ({ color = '#FD89D5', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.49944 6.66517H17.4966V9.99775H2.49944V6.66517Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99775 6.66517V17.4966"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16573 9.99775H15.8318V17.4966H4.16573V9.99775Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16573 2.49908H15.8318V6.66517H4.16573V2.49908Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayCircleIcon: React.FC<SvgIconProps> = ({ color = '#ffffff', strokeWidth = 1, ...props }) => (
  <svg
    width={props.width || 48}
    height={props.height || 48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.2061 18.1761L29.7749 24.0002L22.2061 29.8244L22.2061 18.1761Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon: React.FC<SvgIconProps> = ({ color = '#99a1af', strokeWidth = 1, ...props }) => (
  <svg
    width={props.width || 12}
    height={props.height || 12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.99956 2.99978V6.99949"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.999927 0.999927H10.9992V10.9992H0.999927V0.999927Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MessageCircleIcon: React.FC<SvgIconProps> = ({ color = '#ffffff', strokeWidth = 2, ...props }) => (
  <svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.00031 2.00031H22.0003V22.0003H2.00031V2.00031Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SendIcon: React.FC<SvgIconProps> = ({ color = '#ffffff', strokeWidth = 1.33, ...props }) => (
  <svg
    width={props.width || 16}
    height={props.height || 16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.33285 1.33106H14.6617V14.6601H1.33285V1.33106Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.27271 1.43067L14.5627 8.00004L7.27271 14.5694L7.27271 1.43067Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon: React.FC<SvgIconProps> = ({ color = '#4a5565', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.55475 17.4961H11.4408C11.4408 17.4961 11.4408 18.3292 10.0003 18.3292C8.55475 18.3292 8.55475 17.4961 8.55475 17.4961Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.50005 1.66629H17.4963V14.1635H2.50005V1.66629Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeIcon: React.FC<SvgIconProps> = ({ color = '#155dfc', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.49832 9.99775V17.4966"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.49944 1.66589H17.4966V17.4966H2.49944V1.66589Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SubscriptionsIcon: React.FC<SvgIconProps> = ({ color = '#4a5565', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.66629 4.16573H18.3323V15.8318H1.66629V4.16573Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66629 8.33146H18.3323"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChartBarIcon: React.FC<SvgIconProps> = ({ color = '#4a5565', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.49944 6.66517H17.4966V9.99775H2.49944V6.66517Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99775 6.66517V17.4966"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16573 9.99775H15.8318V17.4966H4.16573V9.99775Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16573 2.49908H15.8318V6.66517H4.16573V2.49908Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LifebuoyIcon: React.FC<SvgIconProps> = ({ color = '#4a5565', strokeWidth = 1.67, ...props }) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.99998 1.99998H17.9987V17.9987H1.99998V1.99998Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Interfaces for Props ---

interface ActiveChatbotUIProps {}

interface AppCardProps {
  id: string;
  name: string;
  description: string;
  gradient: string; // CSS linear-gradient string
  icon: React.FC<SvgIconProps>;
  iconColor?: string;
}

interface WalletCardProps {
  label: string;
  value: string;
  icon: React.FC<SvgIconProps>;
  iconColor?: string;
}

interface ContentItemProps {
  id: string;
  title: string;
  category: string;
  metadata: string; // e.g., "8 Episodes", "2h 15m", "Live"
  image?: string; // Placeholder for image URL
}

interface BannerCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

interface CurrentPlanCardProps {
  id: string;
  planName: string;
  price: string;
  status: 'Active' | 'Expiring';
  channels?: string;
  dueDate?: string;
  amountDue?: string;
  validUntil?: string;
  speed?: string; // For fiber plans
  icon: React.FC<SvgIconProps>;
}

interface HelpDetailProps {
  question: string;
  answer: string;
  initialExpanded?: boolean;
}

// --- Sub-Components ---

const AppCard: React.FC<AppCardProps> = ({ name, description, gradient, icon: Icon, iconColor }) => {
  const shadowStyle = {
    boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="flex-none w-[128px] flex flex-col gap-2 p-0" role="listitem">
      <div
        className="w-[128px] h-[128px] rounded-xl flex items-center justify-center"
        style={{ background: gradient, ...shadowStyle }}
        role="img"
        aria-label={`${name} icon`}
      >
        <Icon width="48" height="48" color={iconColor || '#ffffff'} />
      </div>
      <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px] text-center">{name}</p>
      <p className="text-color-7 text-sm font-normal leading-4 tracking-[-0.3125px] text-center -mt-1">{description}</p>
    </div>
  );
};

const AddAppCard: React.FC = () => {
  return (
    <button className="flex-none w-[128px] h-[172px] flex flex-col items-center justify-center border border-dashed border-color-4 rounded-xl text-color-4 hover:border-color-5 hover:text-color-5 transition-colors duration-200"
    aria-label="Add new app"
    role="listitem button"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <p className="text-color-4 text-base font-normal leading-6 tracking-[-0.3125px] mt-2">Add new app</p>
    </button>
  );
};


const WalletCard: React.FC<WalletCardProps> = ({ label, value, icon: Icon, iconColor }) => {
  return (
    <div className="flex-1 p-4 rounded-xl bg-white/10 flex flex-col justify-between" role="group" aria-labelledby={`${label}-label`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
          <Icon width="20" height="20" color={iconColor} />
        </div>
        <p id={`${label}-label`} className="text-white text-base font-normal opacity-90 leading-6 tracking-[-0.3125px]">{label}</p>
      </div>
      <p className="text-white text-xl font-medium leading-[30px] tracking-[-0.44921875px]">{value}</p>
    </div>
  );
};

const ContentCard: React.FC<ContentItemProps> = ({ title, category, metadata, image }) => {
  const gradientBg = 'linear-gradient(135deg, #364153 0%, #1e2939 100%)';
  return (
    <div className="flex-none w-[192px] rounded-xl overflow-hidden flex flex-col" style={{ background: gradientBg }} role="listitem" aria-label={`Content: ${title}`}>
      <div className="w-full h-[112px] relative flex items-center justify-center">
        {image && <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center z-10" aria-hidden="true">
          <PlayCircleIcon width="48" height="48" color="#ffffff" />
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between text-white">
        <p className="text-base font-normal leading-6 tracking-[-0.3125px] mb-1">{title}</p>
        <div className="flex justify-between items-center text-color-4 text-base font-normal leading-6 tracking-[-0.3125px]">
          <span>{category}</span>
          <div className="flex items-center gap-1">
            <ClockIcon width="12" height="12" color="#99a1af" />
            <span>{metadata}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerCard: React.FC<BannerCardProps> = ({ imageUrl, title, description }) => {
  const overlayGradient = {
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
  };
  return (
    <div className="flex-none w-full h-[256px] relative overflow-hidden" role="group" aria-label={title}>
      <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={overlayGradient} aria-hidden="true"></div>
      <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 text-white">
        <h2 className="text-xl font-medium leading-[30px] tracking-[-0.44921875px]">{title}</h2>
        <p className="text-base font-normal leading-6 tracking-[-0.3125px] opacity-90">{description}</p>
      </div>
    </div>
  );
};

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ planName, price, status, channels, dueDate, amountDue, validUntil, speed, icon: Icon }) => {
  const statusBgColor = status === 'Active' ? 'bg-color-10' : 'bg-[#ffe1d4]';
  const statusTextColor = status === 'Active' ? 'text-[#008236]' : 'text-[#e7000b]';
  const amountDueColor = amountDue ? 'text-[#e7000b]' : '';

  const shadowStyle = {
    boxShadow: '0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="flex-none w-[280px] rounded-2xl bg-color-1 border border-color-8 overflow-hidden p-4 flex flex-col" style={shadowStyle} role="listitem" aria-label={`Current plan: ${planName}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-color-6 flex items-center justify-center" aria-hidden="true">
            <Icon width="32" height="32" color={convertFigmaColorToCss({ r: 0.082, g: 0.364, b: 0.988 })} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">{planName}</h3>
            <p className="text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">{price}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBgColor} ${statusTextColor}`}>
          {status}
        </span>
      </div>

      <div className="border-t border-color-8 py-4 flex flex-col gap-2">
        {channels && (
          <div className="flex justify-between items-center">
            <p className="text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">Channels</p>
            <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">{channels}</p>
          </div>
        )}
        {speed && (
          <div className="flex justify-between items-center">
            <p className="text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">Speed</p>
            <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">{speed}</p>
          </div>
        )}
        {dueDate && (
          <div className="flex justify-between items-center">
            <p className="text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">Bill Due</p>
            <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">{dueDate}</p>
          </div>
        )}
        {amountDue && (
          <div className="flex justify-between items-center">
            <p className="text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">Amount Due</p>
            <p className={`text-color-2 text-base font-semibold leading-6 tracking-[-0.3125px] ${amountDueColor}`}>{amountDue}</p>
          </div>
        )}
        {validUntil && (
          <div className="flex justify-between items-center">
            <p className="text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">Valid Until</p>
            <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">{validUntil}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button className="flex-1 py-2 rounded-lg bg-color-8 text-color-2 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-color-5" aria-label={`Manage ${planName}`}>Manage</button>
        <button className="flex-1 py-2 rounded-lg bg-color-5 text-color-1 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-color-9 focus:outline-none focus:ring-2 focus:ring-color-1" aria-label={`Upgrade ${planName}`}>Upgrade</button>
        {amountDue && <button className="flex-1 py-2 rounded-lg bg-[#00A63E] text-color-1 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-color-1" aria-label={`Pay bill for ${planName}`}>Pay Bill</button>}
      </div>
    </div>
  );
};

const HelpDetail: React.FC<HelpDetailProps> = ({ question, answer, initialExpanded = false }) => {
  const [isOpen, setIsOpen] = useState(initialExpanded);

  return (
    <div className="rounded-lg bg-color-1 border border-color-8 overflow-hidden">
      <button
        className="w-full text-left p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-color-5"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`answer-${question.replace(/\s/g, '-')}`}
      >
        <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">{question}</p>
        <ChevronRightIcon
          width="16"
          height="16"
          color="#99a1af"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        />
      </button>
      {isOpen && (
        <div id={`answer-${question.replace(/\s/g, '-')}`} className="px-4 pb-4 text-color-3 text-base font-normal leading-6 tracking-[-0.3125px]">
          {answer}
        </div>
      )}
    </div>
  );
};

// Chatbot dialog component
interface ChatbotDialogProps {
  show: boolean;
  onClose: () => void;
}

const ChatbotDialog: React.FC<ChatbotDialogProps> = ({ show, onClose }) => {
  const shadowStyle = {
    boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-24 right-4 w-[360px] h-[368px] rounded-2xl bg-white border border-color-8 flex flex-col overflow-hidden z-30"
      style={shadowStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-header"
    >
      {/* Chatbot Header */}
      <div className="p-4 bg-gradient-to-r from-color-5 to-color-9 text-white flex flex-col gap-1" role="banner">
        <div className="flex justify-between items-center">
          <h3 id="chatbot-header" className="text-xl font-medium leading-[30px] tracking-[-0.44921875px]">Cignal Assistant</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Close chatbot">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-base font-normal leading-6 tracking-[-0.3125px] opacity-90">We're here to help</p>
      </div>

      {/* Chat Messages / Quick Actions */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {/* Bot Message */}
        <div className="self-start max-w-[80%] bg-color-8 p-3 rounded-t-xl rounded-br-xl">
          <p className="text-color-2 text-base font-normal leading-6 tracking-[-0.3125px]">
            Hi! I'm your Cignal assistant. How can I help you today?
          </p>
          <span className="text-color-7 text-xs font-normal leading-4 tracking-[-0.3125px] text-right block mt-1">16:40</span>
        </div>

        {/* Quick Actions */}
        <div className="self-start flex flex-wrap gap-2 mt-2" role="group" aria-label="Quick Actions">
          <button className="px-3 py-1.5 rounded-full bg-color-6 text-color-5 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-color-5">
            Check my bill
          </button>
          <button className="px-3 py-1.5 rounded-full bg-color-6 text-color-5 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-color-5">
            Upgrade plan
          </button>
          <button className="px-3 py-1.5 rounded-full bg-color-6 text-color-5 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-color-5">
            Technical support
          </button>
          <button className="px-3 py-1.5 rounded-full bg-color-6 text-color-5 text-base font-normal leading-6 tracking-[-0.3125px] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-color-5">
            Channel guide
          </button>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-color-8 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 py-2 px-4 rounded-lg border border-color-8 bg-white text-color-2 text-base placeholder:text-color-4/[.5] focus:outline-none focus:ring-2 focus:ring-color-5"
          aria-label="Message input"
        />
        <button className="w-12 h-10 rounded-lg bg-color-5 flex items-center justify-center hover:bg-color-9 focus:outline-none focus:ring-2 focus:ring-color-1" aria-label="Send message">
          <SendIcon width="16" height="16" color="#ffffff" />
        </button>
      </div>
    </div>
  );
};


// --- Main Component ---

export const ActiveChatbotUI: React.FC<ActiveChatbotUIProps> = () => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);

  // Data for App Cards
  const appCards: AppCardProps[] = useMemo(() => [
    {
      id: 'cignal-postpaid',
      name: 'Cignal Postpaid',
      description: 'Premium TV experience',
      gradient: 'linear-gradient(135deg, #2b7fff 0%, #155dfc 100%)', // Original: r:0.169,g:0.498,b:1 to r:0.083,g:0.364,b:0.986
      icon: TVIcon,
    },
    {
      id: 'cignal-prepaid',
      name: 'Cignal Prepaid',
      description: 'Flexible TV plans',
      gradient: 'linear-gradient(135deg, #615eff 0%, #4f39f4 100%)', // Original: r:0.382,g:0.371,b:1 to r:0.310,g:0.224,b:0.966
      icon: TVIcon,
    },
    {
      id: 'satlite',
      name: 'SatLite',
      description: 'Mobile streaming',
      gradient: 'linear-gradient(135deg, #ab47f4 0%, #980fe6 100%)', // Original: r:0.677,g:0.275,b:1 to r:0.596,g:0.061,b:0.981
      icon: MobileStreamIcon,
    },
    {
      id: 'pilipinas-live',
      name: 'Pilipinas Live',
      description: 'Local channels',
      gradient: 'linear-gradient(135deg, #00c950 0%, #00a63e 100%)', // Original: r:0,g:0.787,b:0.315 to r:0,g:0.651,b:0.241
      icon: PilipinasLiveIcon,
    }
  ], []);

  // Data for Content Carousels
  const contentItemsEntertainment: ContentItemProps[] = useMemo(() => [
    {
      id: 'drama-series',
      title: 'The Latest Drama Series',
      category: 'Drama',
      metadata: '8 Episodes',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=Drama+Series',
    },
    {
      id: 'comedy-special',
      title: 'Comedy Night Special',
      category: 'Comedy',
      metadata: '2h 15m',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=Comedy+Special',
    },
    {
      id: 'documentary',
      title: 'Documentary: Nature',
      category: 'Documentary',
      metadata: '1h 45m',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=Nature+Doc',
    },
  ], []);

  const contentItemsMovies: ContentItemProps[] = useMemo(() => [
    {
      id: 'action-thriller',
      title: 'Action Thriller 2024',
      category: 'Action',
      metadata: '2h 30m',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=Action+Thriller',
    },
    {
      id: 'romantic-comedy',
      title: 'Romantic Comedy',
      category: 'Romance',
      metadata: '1h 55m',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=RomCom',
    },
    {
      id: 'sci-fi-adventure',
      title: 'Sci-Fi Adventure',
      category: 'Sci-Fi',
      metadata: '2h 45m',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=SciFi+Adventure',
    },
  ], []);

  const contentItemsSports: ContentItemProps[] = useMemo(() => [
    {
      id: 'nba-finals',
      title: 'NBA Finals Game 7',
      category: 'Basketball',
      metadata: 'Live',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=NBA+Finals',
    },
    {
      id: 'premier-league',
      title: 'Premier League Match',
      category: 'Football',
      metadata: 'Today 8PM',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=Premier+League',
    },
    {
      id: 'boxing-championship',
      title: 'Boxing Championship',
      category: 'Boxing',
      metadata: 'Tomorrow',
      image: 'https://via.placeholder.com/192x112/364153/ffffff?text=Boxing',
    },
  ], []);

  // Data for Top Banner Carousel
  const bannerCards: BannerCardProps[] = useMemo(() => [
    {
      id: 'action-movies-marathon',
      imageUrl: 'https://via.placeholder.com/376x256/101828/ffffff?text=Action+Movies+Marathon', // Replaced Figma imageHash with placeholder
      title: 'New Release: Action Movies Marathon',
      description: 'Stream the latest blockbusters',
    },
    {
      id: 'live-sports-premier-league',
      imageUrl: 'https://via.placeholder.com/376x256/101828/ffffff?text=Live+Sports+Premier+League', // Replaced Figma imageHash with placeholder
      title: 'Live Sports: Premier League',
      description: 'Watch your favorite teams live',
    },
    {
      id: 'breaking-news-coverage',
      imageUrl: 'https://via.placeholder.com/376x256/101828/ffffff?text=Breaking+News+Coverage', // Replaced Figma imageHash with placeholder
      title: 'Breaking News Coverage',
      description: '24/7 news and updates',
    },
  ], []);

  // Data for Current Plans Section
  const currentPlans: CurrentPlanCardProps[] = useMemo(() => [
    {
      id: 'cignal-postpaid-premium',
      planName: 'Cignal Postpaid Premium',
      price: '₱1,899/month',
      status: 'Active',
      icon: TVIconFill,
      channels: '200+',
      dueDate: 'Dec 15, 2025',
      amountDue: '₱1,899',
    },
    {
      id: 'cignal-fiber-100mbps',
      planName: 'Cignal Fiber 100 Mbps',
      price: '₱1,699/month',
      status: 'Active',
      icon: WifiIcon,
      speed: '100 Mbps',
      validUntil: 'Dec 31, 2025',
    },
    {
      id: 'cignal-prepaid-basic',
      planName: 'Cignal Prepaid Basic',
      price: '₱299/month',
      status: 'Expiring',
      icon: TVIcon,
      channels: '30+',
      validUntil: 'Dec 10, 2025',
    },
    {
      id: 'cignal-fiber-200mbps',
      planName: 'Cignal Fiber 200 Mbps',
      price: '₱2,499/month',
      status: 'Active',
      icon: WifiIcon,
      speed: '200 Mbps',
      validUntil: 'Mar 15, 2026',
    },
  ], []);

  // Data for Help & Support FAQs
  const faqs = useMemo(() => [
    {
      question: 'How do I upgrade my subscription?',
      answer: 'Go to your Current Plans section, select the plan you wish to upgrade, and follow the on-screen instructions.',
      initialExpanded: true,
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, GCash, PayMaya, and over-the-counter payments at our partner centers.',
    },
    {
      question: 'Can I pause my subscription?',
      answer: 'Yes, you can pause prepaid subscriptions. For postpaid plans, please contact our customer support for options.',
    },
  ], []);


  const handleBannerDotClick = (index: number) => {
    setActiveBannerIndex(index);
  };

  return (
    <div className="relative w-[376px] min-h-screen bg-color-6 font-inter text-color-2 overflow-y-auto pb-[90px]" role="main">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 w-full bg-white border-b border-color-8 py-3 px-4 flex items-center justify-between" role="navigation" aria-label="Main Navigation">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-color-5 to-color-9 flex items-center justify-center" aria-hidden="true">
            <span className="text-white text-base font-medium">C1</span>
          </div>
          <h1 className="text-color-2 text-xl font-medium leading-[30px] tracking-[-0.44921875px]">Cignal One</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-color-3 hover:bg-color-8 focus:outline-none focus:ring-2 focus:ring-color-5" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 17.5L13.125 13.125M15 8.75C15 12.0007 12.0007 15 8.75 15C5.49934 15 2.5 12.0007 2.5 8.75C2.5 5.49934 5.49934 2.5 8.75 2.5C12.0007 2.5 15 5.49934 15 8.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-color-3 hover:bg-color-8 focus:outline-none focus:ring-2 focus:ring-color-5" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 7.5C17.5 7.01633 17.3025 6.55209 16.9559 6.20542C16.6093 5.85875 16.145 5.66125 15.6613 5.66125C15.1776 5.66125 14.7134 5.85875 14.3667 6.20542C14.0201 6.55209 13.8226 7.01633 13.8226 7.5C13.8226 7.98367 14.0201 8.44791 14.3667 8.79458C14.7134 9.14125 15.1776 9.33875 15.6613 9.33875C16.145 9.33875 16.6093 9.14125 16.9559 8.79458C17.3025 8.44791 17.5 7.98367 17.5 7.5ZM17.5 7.5V17.5H2.5V7.5L5 2.5H12.5L15 0L17.5 2.5V7.5ZM10 18.3333C10 18.6768 9.86473 19.0062 9.62256 19.2483C9.38039 19.4905 9.05096 19.6258 8