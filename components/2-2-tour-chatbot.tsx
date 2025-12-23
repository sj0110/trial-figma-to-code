// src/components/2-2-tour-chatbot.tsx
import React, { useState, useMemo, useEffect } from 'react';

// --- Utils & Types ---

// Utility function to convert Figma color object to a CSS hex or rgba string.
// Strict adherence to using exact HEX values for solid colors (alpha 1)
// and rgba for transparent colors, as per requirements.
const getCssColor = (color: { r: number; g: number; b: number; a?: number }): string => {
  const { r, g, b, a = 1 } = color;
  if (a === 1) {
    // Return exact HEX if opacity is 1
    const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  // Return rgba for transparency
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
};

// Utility function to convert Figma linear gradient to a CSS linear-gradient string.
// Based on common Figma interpretation, diagonal gradients will use '135deg' (to bottom right).
// Vertical overlay gradient will use '0deg' (to top).
const figmaGradientToCssString = (gradient: any): string => {
  if (gradient.type === 'GRADIENT_LINEAR') {
    const stops = gradient.gradientStops
      .map((stop: any) => `${getCssColor(stop.color)} ${stop.position * 100}%`)
      .join(', ');

    // Special handling for the image overlay gradient (2:5055) which is vertical.
    if (gradient.id === '2:5055') {
      return `linear-gradient(0deg, ${stops})`; // 0deg corresponds to 'to top' in CSS
    }
    // Default for other diagonal gradients seen in the design
    return `linear-gradient(135deg, ${stops})`; // 135deg corresponds to 'to bottom right' in CSS
  }
  return '';
};


interface VectorProps extends React.SVGProps<SVGSVGElement> {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

// Inline SVG components derived from 'Vector' nodes in Figma
const ArrowRightIcon: React.FC<VectorProps> = ({ strokeColor = '#155DFB', strokeWidth = 1.3327306509017944, ...props }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 4L10 8L6 12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DesktopIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 3.9997081756591797, ...props }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 4H34C35.1046 4 36 4.89543 36 6V16C36 17.1046 35.1046 18 34 18H14C12.8954 18 12 17.1046 12 16V6C12 4.89543 12.8954 4 14 4Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14H44C45.1046 14 46 14.8954 46 16V36C46 37.1046 45.1046 38 44 38H4C2.89543 38 2 37.1046 2 36V16C2 14.8954 2.89543 14 4 14Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 3.9997081756591797, ...props }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 4H38C39.1046 4 40 4.89543 40 6V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V6C8 4.89543 8.89543 4 10 4Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.0099 36H24.0199" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 3.9997081756591797, ...props }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 6L38 24L10 42V6Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 3.9997081756591797, ...props }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 24H44" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 4V44" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.9998540878295898, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.9209 18.9209L22.0199 22.0199" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 1.9998540878295898, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 8H21" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13H21" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V21" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V8" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 3H19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon: React.FC<VectorProps> = ({ strokeColor = '#FFDE20', strokeWidth = 1.666292428970337, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.66629 1.66629L11.664 1.66629L11.664 11.664" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.61473 8.63972L18.3242 8.61473L18.3242 18.3242" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.83202 4.99888L6.66517 8.33146" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.1556 11.5641L14.5051 14.5051" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GiftIcon: React.FC<VectorProps> = ({ strokeColor = '#FC97D5', strokeWidth = 1.666292428970337, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.49944 6.66517H14.9966" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99775 6.66517V17.4961" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 9.99775L15.8302 17.4961" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 2.49908L15.8302 4.1661" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayCircleIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 1.9998540878295898, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.56882 18.1761L18.1761 12.0001L7.56882 5.82408V18.1761Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TimerIcon: React.FC<VectorProps> = ({ strokeColor = '#6A7282', strokeWidth = 0.9999270439147949, ...props }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3C8.76142 3 11 5.23858 11 8C11 10.7614 8.76142 13 6 13C3.23858 13 1 10.7614 1 8C1 5.23858 3.23858 3 6 3Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 3V6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 1H11" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpCircleIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.9478625059127808, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 7C9 5.89543 9.89543 5 11 5C12.1046 5 13 5.89543 13 7C13 8.10457 12.1046 9 11 9C9.89543 9 9 8.10457 9 7Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16H12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WifiIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.9478625059127808, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 10H22" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 14H22" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 18H22" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TVOffIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.9478625059127808, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7 6H17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10H20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14H20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 18H20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RefreshIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.9478625059127808, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 12C20 17.5228 15.5228 22 10 22C4.47715 22 0 17.5228 0 12C0 6.47715 4.47715 2 10 2C15.5228 2 20 6.47715 20 12Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 2V22" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 7H5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 17H5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneSolidIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.9478625059127808, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.96448 1.96468H20.4102V21.4083H2.96448V1.96468Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.76534 8.76495H14.6093V14.6089H8.76534V8.76495Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatBubbleIcon: React.FC<VectorProps> = ({ strokeColor = '#FFFFFF', strokeWidth = 1.9998540878295898, ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.00031 2.00031H22.0001V22.0001H2.00031V2.00031Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HomeIcon: React.FC<VectorProps> = ({ strokeColor = '#155DFB', strokeWidth = 1.666292428970337, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.49832 9.99775L12.4972 12.4972L7.49832 17.4961V9.99775Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.49944 1.66589H17.4966V16.6629H2.49944V1.66589Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SubscriptionsIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.666292428970337, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.49944 6.66517H14.9966" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99775 6.66517V17.4961" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 9.99775L15.8302 17.4961" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 2.49908L15.8302 4.1661" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RewardsBottomNavIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.666292428970337, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.49944 6.66517H14.9966" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99775 6.66517V17.4961" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 9.99775L15.8302 6.66517" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 2.49908L15.8302 4.1661" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIconBottomNav: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.666292428970337, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.55475 17.4961L11.4408 18.3292" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.50005 1.66629H17.4963V14.1635H2.50005V1.66629Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationBellIcon: React.FC<VectorProps> = ({ strokeColor = '#4A5565', strokeWidth = 1.666292428970337, ...props }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.4963 16.6629C17.4963 17.4168 17.1906 18.1402 16.6575 18.6734C16.1243 19.2065 15.3909 19.5122 14.6371 19.5122H5.3629C4.60912 19.5122 3.87572 19.2065 3.34257 18.6734C2.80943 18.1402 2.50371 17.4168 2.50371 16.6629" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.0002 2.50005V16.6629" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.66752 4.1661H18.3325" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// Main component props interface
export interface TourChatbotProps {
  // Define any top-level props needed for customization or data injection
  // For now, it's a self-contained screen based on the JSON.
}

const TourChatbotScreen: React.FC<TourChatbotProps> = () => {
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [activeFaqDetail, setActiveFaqDetail] = useState<number | null>(null);

  const toggleChatbotModal = () => setIsChatbotModalOpen((prev) => !prev);
  const toggleFaqDetail = (id: number) => {
    setActiveFaqDetail((prev) => (prev === id ? null : id));
  };

  // Define dynamic typography styles using useMemo for performance
  const typographyStyles = useMemo(() => {
    return {
      interRegular16: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '-0.3125px',
      },
      interMedium20: {
        fontFamily: 'Inter',
        fontSize: '20px',
        fontWeight: 500,
        lineHeight: '30px',
        letterSpacing: '-0.44921875px',
      },
      interRegular14: { // Derived from 2:5110 'Active' text
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '16px',
        letterSpacing: '-0.2734375px',
      },
      interRegular12: { // Derived from 2:4977 etc for 'Drama', '8 Episodes'
        fontFamily: 'Inter',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
        letterSpacing: '-0.234375px',
      },
      interRegular24: { // Derived from 2:5058 "New Release"
        fontFamily: 'Inter',
        fontSize: '24px',
        fontWeight: 400,
        lineHeight: '30px',
        letterSpacing: '-0.546875px',
      },
      interMedium30: { // Derived from 2:5066 "Live Sports"
        fontFamily: 'Inter',
        fontSize: '20px', // Figma says 20, but line height is 30, it should be 20 Medium
        fontWeight: 500, // Medium in Figma
        lineHeight: '30px',
        letterSpacing: '-0.44921875px',
      },
      interMedium36: { // Derived from 2:5386 "Cignal One"
        fontFamily: 'Inter',
        fontSize: '24px', // Figma says 24, but line height is 36, it should be 24 Medium
        fontWeight: 500, // Medium in Figma
        lineHeight: '36px',
        letterSpacing: '-0.546875px',
      },
    };
  }, []);

  return (
    <div className="relative w-[376px] h-[2786px] bg-[#FFFFFF] overflow-hidden shadow-lg mx-auto">
      {/* App Container - Main content area, scrolls */}
      <div className="absolute top-0 left-0 w-[376px] h-[2217px] bg-[#F7F8F9] overflow-y-auto">
        <div className="flex flex-col min-h-full">
          {/* HomeScreen - This div encompasses the scrollable content below the top bar */}
          <div className="flex flex-col flex-grow w-full bg-[#F7F8F9]">
            {/* Spacer for TopBar */}
            <div className="h-[64.57px]"></div>

            {/* Main content sections */}
            <div className="flex flex-col w-[376px] px-0 py-0" style={{ transform: 'translateY(64.57px)' }}>

              {/* Image Banner Section (Container 2:5052) */}
              <div className="relative w-full h-[255.99px] bg-[#101828]">
                <img
                  src="https://via.placeholder.com/376x256?text=Action+Movies+Marathon"
                  alt="New Release: Action Movies Marathon"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: figmaGradientToCssString({
                      id: "2:5055", type: "GRADIENT_LINEAR",
                      gradientStops: [
                        { color: { r: 0, g: 0, b: 0, a: 0.8 }, position: 0 },
                        { color: { r: 0, g: 0, b: 0, a: 0.4 }, position: 0.5 },
                        { color: { r: 0, g: 0, b: 0, a: 0 }, position: 1 }
                      ],
                      gradientTransform: [[0, -1, 1], [0.5, 0, 0.25]]
                  }) }}
                  aria-hidden="true"
                ></div>
                <div className="absolute bottom-[23.99px] left-[23.99px] flex flex-col w-[328.12px] h-[91.98px] justify-start items-start">
                  <h2 className="text-[#FFFFFF] w-[252px]" style={typographyStyles.interMedium20}>
                    New Release: Action Movies Marathon
                  </h2>
                  <p className="text-[#FFFFFF] opacity-90 w-[224px]" style={typographyStyles.interRegular16}>
                    Stream the latest blockbusters
                  </p>
                </div>
              </div>

              {/* Current Plans Section (2:5081) */}
              <section className="bg-[#FFFFFF] w-[386px] pb-4 border-b-[1px] border-b-[#E5E7EB] pt-4 -ml-[3px]" aria-labelledby="current-plans-heading">
                <div className="flex flex-col w-full px-[15.99px] pb-[15.99px]">
                  <div className="flex justify-between items-center w-full mb-[15.99px]">
                    <div className="flex flex-col">
                      <h2 id="current-plans-heading" className="text-[#101828]" style={typographyStyles.interMedium20}>
                        Current Plans
                      </h2>
                      <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                        Manage your active subscriptions
                      </p>
                    </div>
                    <div className="flex items-center gap-[7.99px]">
                      <button className="flex items-center justify-center w-[33.15px] h-[33.15px] rounded-[10px] border-[0.58px] border-[#E5E7EB]" aria-label="Previous Plan">
                        <ArrowRightIcon className="rotate-180" strokeColor="#4A5565" strokeWidth={1.33}/>
                      </button>
                      <button className="flex items-center justify-center w-[33.15px] h-[33.15px] rounded-[10px] border-[0.58px] border-[#E5E7EB]" aria-label="Next Plan">
                        <ArrowRightIcon strokeColor="#4A5565" strokeWidth={1.33}/>
                      </button>
                    </div>
                  </div>

                  {/* Current Plans Cards Carousel */}
                  <div className="flex overflow-x-auto gap-[15.99px] pb-4 no-scrollbar">
                    {/* Plan Card 1: Cignal Postpaid Premium */}
                    <div className="flex-shrink-0 w-[279.99px] rounded-[16px] border-[0.58px] border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-[11.99px]">
                          <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-[14px] bg-[#EFF6FF]">
                            <DesktopIcon strokeColor="#155DFB" strokeWidth={2.67} width="32" height="32"/>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-[#101828]" style={typographyStyles.interRegular16}>
                              Cignal Postpaid Premium
                            </h3>
                            <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                              ₱1,899/month
                            </p>
                          </div>
                        </div>
                        <span className="bg-[#DCFCE7] text-[#008236] text-[14px] leading-[16px] tracking-[-0.2734375px] rounded-full px-2 py-1 h-[23.98px]" style={typographyStyles.interRegular14}>
                          Active
                        </span>
                      </div>
                      <div className="border-t-[0.58px] border-t-[#E5E7EB] pt-4 flex flex-col space-y-[7.99px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Channels</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>200+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Bill Due</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>Dec 15, 2025</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Amount Due</span>
                          <span className="text-[#E6000B]" style={typographyStyles.interRegular16}>₱1,899</span>
                        </div>
                      </div>
                      <div className="flex gap-[7.99px] pt-4">
                        <button className="flex-1 bg-[#F3F4F6] text-[#101828] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Manage</button>
                        <button className="flex-1 bg-[#155DFB] text-[#FFFFFF] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Upgrade</button>
                        <button className="flex-1 bg-[#008236] text-[#FFFFFF] rounded-[10px] py-[8.74px] px-[14.62px]" style={typographyStyles.interRegular16}>Pay Bill</button>
                      </div>
                    </div>

                    {/* Plan Card 2: Cignal Fiber 100 Mbps */}
                    <div className="flex-shrink-0 w-[279.99px] rounded-[16px] border-[0.58px] border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-[11.99px]">
                          <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-[14px] bg-[#EFF6FF]">
                            <DesktopIcon strokeColor="#155DFB" strokeWidth={2.67} width="32" height="32"/>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-[#101828]" style={typographyStyles.interRegular16}>
                              Cignal Fiber 100 Mbps
                            </h3>
                            <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                              ₱1,699/month
                            </p>
                          </div>
                        </div>
                        <span className="bg-[#DCFCE7] text-[#008236] text-[14px] leading-[16px] tracking-[-0.2734375px] rounded-full px-2 py-1 h-[23.98px]" style={typographyStyles.interRegular14}>
                          Active
                        </span>
                      </div>
                      <div className="border-t-[0.58px] border-t-[#E5E7EB] pt-4 flex flex-col space-y-[7.99px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Speed</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>100 Mbps</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Valid Until</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>Dec 31, 2025</span>
                        </div>
                      </div>
                      <div className="flex gap-[7.99px] pt-4">
                        <button className="flex-1 bg-[#F3F4F6] text-[#101828] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Manage</button>
                        <button className="flex-1 bg-[#155DFB] text-[#FFFFFF] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Upgrade</button>
                      </div>
                    </div>

                    {/* Plan Card 3: Cignal Play Unlimited */}
                    <div className="flex-shrink-0 w-[279.99px] rounded-[16px] border-[0.58px] border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-[11.99px]">
                          <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-[14px] bg-[#EFF6FF]">
                            <PlayIcon strokeColor="#155DFB" strokeWidth={2.67} width="32" height="32"/>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-[#101828]" style={typographyStyles.interRegular16}>
                              Cignal Play Unlimited
                            </h3>
                            <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                              ₱399/month
                            </p>
                          </div>
                        </div>
                        <span className="bg-[#FFE5D4] text-[#C9000A] text-[14px] leading-[16px] tracking-[-0.2734375px] rounded-full px-2 py-1 h-[23.98px]" style={typographyStyles.interRegular14}>
                          Expiring
                        </span>
                      </div>
                      <div className="border-t-[0.58px] border-t-[#E5E7EB] pt-4 flex flex-col space-y-[7.99px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Channels</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>50+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Valid Until</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>Jan 5, 2026</span>
                        </div>
                      </div>
                      <div className="flex gap-[7.99px] pt-4">
                        <button className="flex-1 bg-[#F3F4F6] text-[#101828] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Manage</button>
                        <button className="flex-1 bg-[#155DFB] text-[#FFFFFF] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Upgrade</button>
                      </div>
                    </div>

                    {/* Plan Card 4: Cignal Fiber 200 Mbps */}
                    <div className="flex-shrink-0 w-[279.99px] rounded-[16px] border-[0.58px] border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-[11.99px]">
                          <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-[14px] bg-[#EFF6FF]">
                            <DesktopIcon strokeColor="#155DFB" strokeWidth={2.67} width="32" height="32"/>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-[#101828]" style={typographyStyles.interRegular16}>
                              Cignal Fiber 200 Mbps
                            </h3>
                            <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                              ₱2,499/month
                            </p>
                          </div>
                        </div>
                        <span className="bg-[#DCFCE7] text-[#008236] text-[14px] leading-[16px] tracking-[-0.2734375px] rounded-full px-2 py-1 h-[23.98px]" style={typographyStyles.interRegular14}>
                          Active
                        </span>
                      </div>
                      <div className="border-t-[0.58px] border-t-[#E5E7EB] pt-4 flex flex-col space-y-[7.99px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Speed</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>200 Mbps</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A5565]" style={typographyStyles.interRegular16}>Valid Until</span>
                          <span className="text-[#101828]" style={typographyStyles.interRegular16}>Mar 15, 2026</span>
                        </div>
                      </div>
                      <div className="flex gap-[7.99px] pt-4">
                        <button className="flex-1 bg-[#F3F4F6] text-[#101828] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Manage</button>
                        <button className="flex-1 bg-[#155DFB] text-[#FFFFFF] rounded-[10px] py-[8.74px] px-[11.99px]" style={typographyStyles.interRegular16}>Upgrade</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Your Apps Section (Container 2:4674) */}
              <section className="bg-[#FFFFFF] w-[376.11px] py-6 px-4 flex flex-col space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-[#101828]" style={typographyStyles.interMedium20}>
                      Your Apps
                    </h2>
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      Manage your subscriptions
                    </p>
                  </div>
                  <button className="flex items-center text-[#155DFB]" aria-label="View All Apps">
                    <span className="text-[16px] leading-[20px] tracking-[-0.3125px] font-medium mr-1" style={typographyStyles.interRegular16}>
                      View All
                    </span>
                    <ArrowRightIcon strokeColor="#155DFB" strokeWidth={1.33} />
                  </button>
                </div>

                {/* App Cards Carousel */}
                <div className="flex overflow-x-auto gap-[11.99px] pb-4 no-scrollbar">
                  {/* App Card 1: Cignal Postpaid */}
                  <div className="flex-shrink-0 w-[127.99px] flex flex-col items-center space-y-[7.99px]">
                    <div
                      className="w-[127.99px] h-[127.99px] rounded-[14px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.169, g: 0.498, b: 1, a: 1 }, position: 0 },
                            { color: { r: 0.083, g: 0.364, b: 0.986, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <DesktopIcon strokeColor="#FFFFFF" strokeWidth={3.99} width="48" height="48"/>
                    </div>
                    <p className="text-[#101828] text-center w-[102px]" style={typographyStyles.interRegular16}>
                      Cignal Postpaid
                    </p>
                    <p className="text-[#6A7282] text-center w-[135px]" style={typographyStyles.interRegular12}>
                      Premium TV experience
                    </p>
                  </div>

                  {/* App Card 2: Cignal Prepaid */}
                  <div className="flex-shrink-0 w-[127.99px] flex flex-col items-center space-y-[7.99px]">
                    <div
                      className="w-[127.99px] h-[127.99px] rounded-[14px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.382, g: 0.371, b: 1, a: 1 }, position: 0 },
                            { color: { r: 0.310, g: 0.224, b: 0.966, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <PhoneIcon strokeColor="#FFFFFF" strokeWidth={3.99} width="48" height="48"/>
                    </div>
                    <p className="text-[#101828] text-center w-[94px]" style={typographyStyles.interRegular16}>
                      Cignal Prepaid
                    </p>
                    <p className="text-[#6A7282] text-center w-[97px]" style={typographyStyles.interRegular12}>
                      Flexible TV plans
                    </p>
                  </div>

                  {/* App Card 3: SatLite */}
                  <div className="flex-shrink-0 w-[127.99px] flex flex-col items-center space-y-[7.99px]">
                    <div
                      className="w-[127.99px] h-[127.99px] rounded-[14px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.677, g: 0.275, b: 1, a: 1 }, position: 0 },
                            { color: { r: 0.596, g: 0.061, b: 0.981, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <PlayIcon strokeColor="#FFFFFF" strokeWidth={3.99} width="48" height="48"/>
                    </div>
                    <p className="text-[#101828] text-center w-[46px]" style={typographyStyles.interRegular16}>
                      SatLite
                    </p>
                    <p className="text-[#6A7282] text-center w-[98px]" style={typographyStyles.interRegular12}>
                      Mobile streaming
                    </p>
                  </div>

                  {/* App Card 4: Cignal Play */}
                  <div className="flex-shrink-0 w-[127.99px] flex flex-col items-center space-y-[7.99px]">
                    <div
                      className="w-[127.99px] h-[127.99px] rounded-[14px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.965, g: 0.198, b: 0.604, a: 1 }, position: 0 },
                            { color: { r: 0.901, g: 0, b: 0.463, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <PlayIcon strokeColor="#FFFFFF" strokeWidth={3.99} width="48" height="48"/>
                    </div>
                    <p className="text-[#101828] text-center w-[72px]" style={typographyStyles.interRegular16}>
                      Cignal Play
                    </p>
                    <p className="text-[#6A7282] text-center w-[115px]" style={typographyStyles.interRegular12}>
                      On-demand content
                    </p>
                  </div>

                  {/* App Card 5: Pilipinas Live */}
                  <div className="flex-shrink-0 w-[127.99px] flex flex-col items-center space-y-[7.99px]">
                    <div
                      className="w-[127.99px] h-[127.99px] rounded-[14px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0, g: 0.787, b: 0.315, a: 1 }, position: 0 },
                            { color: { r: 0, g: 0.651, b: 0.241, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <PlusIcon strokeColor="#FFFFFF" strokeWidth={3.99} width="48" height="48"/>
                    </div>
                    <p className="text-[#101828] text-center w-[83px]" style={typographyStyles.interRegular16}>
                      Pilipinas Live
                    </p>
                    <p className="text-[#6A7282] text-center w-[85px]" style={typographyStyles.interRegular12}>
                      Local channels
                    </p>
                  </div>

                  {/* App Card 6: Cignal Super - Border only */}
                  <div className="flex-shrink-0 w-[127.99px] h-[159.99px] rounded-[14px] border-[1.75px] border-[#CED3DB] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center h-[47.99px]">
                      <PlusIcon strokeColor="#99A1AF" strokeWidth={2} width="24" height="24" />
                      <p className="text-[#6A7282] text-center mt-2" style={typographyStyles.interRegular12}>
                        Cignal Super
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* My Wallet Section (WalletPreview 2:4737) */}
              <section
                className="w-full h-[215.96px] py-6 px-4 flex flex-col justify-between"
                style={{ backgroundImage: figmaGradientToCssString({
                    type: "GRADIENT_LINEAR",
                    gradientStops: [
                      { color: { r: 0.083, g: 0.364, b: 0.986, a: 1 }, position: 0 },
                      { color: { r: 0.310, g: 0.224, b: 0.966, a: 1 }, position: 1 }
                    ],
                    gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                }) }}
                aria-labelledby="my-wallet-heading"
              >
                <div className="flex justify-between items-start mb-[15.99px]">
                  <div className="flex items-center space-x-[11.99px]">
                    <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                      <WalletIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#FFFFFF] opacity-90" style={typographyStyles.interRegular16}>
                        My Wallet
                      </p>
                      <h2 id="my-wallet-heading" className="text-[#FFFFFF]" style={typographyStyles.interMedium20}>
                        2,450 Points
                      </h2>
                    </div>
                  </div>
                  <button className="bg-[#FFFFFF] opacity-20 text-[#FFFFFF] rounded-[10px] py-[4.00px] px-[15.99px] h-[39.99px] flex items-center justify-center" aria-label="View Wallet">
                    <span style={typographyStyles.interRegular16}>View Wallet</span>
                    <ArrowRightIcon strokeColor="#FFFFFF" strokeWidth={1.33} className="ml-2"/>
                  </button>
                </div>

                <div className="flex justify-between items-start space-x-[11.99px] mt-[15.99px]">
                  {/* Available Rewards Card */}
                  <div className="flex-1 bg-[#FFFFFF] opacity-10 rounded-[14px] p-4 flex flex-col justify-between">
                    <div className="flex items-center space-x-2">
                      <StarIcon strokeColor="#FFDE20" strokeWidth={1.67} width="20" height="20" />
                      <p className="text-[#FFFFFF] opacity-90" style={typographyStyles.interRegular16}>Available</p>
                    </div>
                    <p className="text-[#FFFFFF] mt-2" style={typographyStyles.interMedium20}>2,450 pts</p>
                  </div>

                  {/* Rewards Available Card */}
                  <div className="flex-1 bg-[#FFFFFF] opacity-10 rounded-[14px] p-4 flex flex-col justify-between">
                    <div className="flex items-center space-x-2">
                      <GiftIcon strokeColor="#FC97D5" strokeWidth={1.67} width="20" height="20" />
                      <p className="text-[#FFFFFF] opacity-90" style={typographyStyles.interRegular16}>Rewards</p>
                    </div>
                    <p className="text-[#FFFFFF] mt-2" style={typographyStyles.interMedium20}>15 Available</p>
                  </div>
                </div>
              </section>

              {/* Entertainment Content Carousel (2:4776) */}
              <section className="bg-[#FFFFFF] w-[376.11px] py-6 px-4 flex flex-col space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-[#101828]" style={typographyStyles.interMedium20}>
                      Entertainment
                    </h2>
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      Popular shows and series
                    </p>
                  </div>
                  <button className="flex items-center text-[#155DFB]" aria-label="See All Entertainment">
                    <span className="text-[16px] leading-[20px] tracking-[-0.3125px] font-medium mr-1" style={typographyStyles.interRegular16}>
                      See All
                    </span>
                    <ArrowRightIcon strokeColor="#155DFB" strokeWidth={1.33}/>
                  </button>
                </div>

                {/* Entertainment Cards Carousel */}
                <div className="flex overflow-x-auto gap-[15.99px] pb-4 no-scrollbar">
                  {/* Content Card 1: The Latest Drama Series */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        The Latest Drama Series
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Drama</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>8 Episodes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 2: Comedy Night Special */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Comedy Night Special
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Comedy</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>2h 15m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 3: Reality Show Finale */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Reality Show Finale
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Reality</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>Season 5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 4: Documentary: Nature */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Documentary: Nature
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Documentary</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>1h 45m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Movies Content Carousel (2:4868) */}
              <section className="bg-[#FFFFFF] w-[376.11px] py-6 px-4 flex flex-col space-y-4 -ml-[1px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-[#101828]" style={typographyStyles.interMedium20}>
                      Movies
                    </h2>
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      Blockbusters and classics
                    </p>
                  </div>
                  <button className="flex items-center text-[#155DFB]" aria-label="See All Movies">
                    <span className="text-[16px] leading-[20px] tracking-[-0.3125px] font-medium mr-1" style={typographyStyles.interRegular16}>
                      See All
                    </span>
                    <ArrowRightIcon strokeColor="#155DFB" strokeWidth={1.33}/>
                  </button>
                </div>

                {/* Movies Cards Carousel */}
                <div className="flex overflow-x-auto gap-[15.99px] pb-4 no-scrollbar">
                  {/* Content Card 1: Action Thriller 2024 */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Action Thriller 2024
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Action</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>2h 30m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 2: Romantic Comedy */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Romantic Comedy
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Romance</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>1h 55m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 3: Sci-Fi Adventure */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Sci-Fi Adventure
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Sci-Fi</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>2h 45m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 4: Horror Mystery */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Horror Mystery
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Horror</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>1h 40m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sports & Live Events Content Carousel (2:4960) */}
              <section className="bg-[#FFFFFF] w-[376.11px] py-6 px-4 flex flex-col space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-[#101828]" style={typographyStyles.interMedium20}>
                      Sports & Live Events
                    </h2>
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      Watch your favorite sports
                    </p>
                  </div>
                  <button className="flex items-center text-[#155DFB]" aria-label="See All Sports & Live Events">
                    <span className="text-[16px] leading-[20px] tracking-[-0.3125px] font-medium mr-1" style={typographyStyles.interRegular16}>
                      See All
                    </span>
                    <ArrowRightIcon strokeColor="#155DFB" strokeWidth={1.33}/>
                  </button>
                </div>

                {/* Sports Cards Carousel */}
                <div className="flex overflow-x-auto gap-[15.99px] pb-4 no-scrollbar">
                  {/* Content Card 1: NBA Finals Game 7 */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        NBA Finals Game 7
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Basketball</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>Live</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 2: Premier League Match */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Premier League Match
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Football</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>Today 8PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 3: Tennis Grand Slam */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        Tennis Grand Slam
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>Tennis</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>Live Now</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Card 4: UFC Fight Night */}
                  <div className="flex-shrink-0 w-[191.99px] rounded-[14px] bg-[#101828] flex flex-col">
                    <div
                      className="w-full h-[111.99px] rounded-t-[14px] flex items-center justify-center"
                      style={{ backgroundImage: figmaGradientToCssString({
                          type: "GRADIENT_LINEAR",
                          gradientStops: [
                            { color: { r: 0.211, g: 0.255, b: 0.324, a: 1 }, position: 0 },
                            { color: { r: 0.116, g: 0.160, b: 0.222, a: 1 }, position: 1 }
                          ],
                          gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
                      }) }}
                    >
                      <div className="flex items-center justify-center w-[47.99px] h-[47.99px] rounded-full bg-[#FFFFFF] opacity-20">
                        <PlayCircleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-end space-y-1">
                      <p className="text-[#FFFFFF]" style={typographyStyles.interRegular16}>
                        UFC Fight Night
                      </p>
                      <div className="flex justify-between items-center text-[#99A1AF] text-sm">
                        <span style={typographyStyles.interRegular12}>MMA</span>
                        <div className="flex items-center space-x-[3.99px]">
                          <TimerIcon strokeColor="#99A1AF" strokeWidth={1} />
                          <span style={typographyStyles.interRegular12}>This Weekend</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pagination Dots (2:5077) - fixed at the bottom right of the carousel parent */}
                <div className="flex justify-end gap-[7.99px] absolute bottom-[23.99px] right-[15.99px]">
                  <DotIcon fillColor="#FFFFFF" strokeColor="transparent" className="w-[23.99px] h-[7.99px] rounded-full" />
                  <DotIcon fillColor="#FFFFFF" strokeColor="transparent" className="w-[7.99px] h-[7.99px] rounded-full opacity-50" />
                  <DotIcon fillColor="#FFFFFF" strokeColor="transparent" className="w-[7.99px] h-[7.99px] rounded-full opacity-50" />
                </div>
              </section>
            </div>
          </div>

          {/* Help Section (2:5262) */}
          <section className="absolute top-[2022px] left-0 w-[376px] h-[764px] bg-[#F7F8F9] px-4 py-6">
            <div className="flex items-center space-x-[7.79px] mb-4">
              <HelpCircleIcon strokeColor="#4A5565" strokeWidth={1.95} width="23.37" height="23.37" />
              <h2 className="text-[#101828]" style={typographyStyles.interMedium20}>
                Help & Support
              </h2>
            </div>

            <div className="flex space-x-[7.79px] mb-4 border-b-[1px] border-b-[#E5E7EB] pb-2">
              <button className="text-[#155DFB] border-b-[2px] border-b-[#155DFB] pb-[7.13px]" style={typographyStyles.interRegular16} aria-current="page">
                FAQs
              </button>
              <button className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                Diagnostics
              </button>
            </div>

            {/* FAQ Buttons (2:5275) */}
            <div className="grid grid-cols-2 gap-[11.69px]">
              <button className="flex flex-col items-center justify-center p-4 rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB]" aria-label="Internet Issues" onClick={() => toggleFaqDetail(1)}>
                <WifiIcon strokeColor="#155DFB" strokeWidth={1.95} width="23.37" height="23.37"/>
                <p className="mt-2 text-[#363F4D]" style={typographyStyles.interRegular12}>
                  Internet Issues
                </p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB]" aria-label="No TV Signal" onClick={() => toggleFaqDetail(2)}>
                <TVOffIcon strokeColor="#155DFB" strokeWidth={1.95} width="23.37" height="23.37"/>
                <p className="mt-2 text-[#363F4D]" style={typographyStyles.interRegular12}>
                  No TV Signal
                </p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB]" aria-label="Reset Device" onClick={() => toggleFaqDetail(3)}>
                <RefreshIcon strokeColor="#155DFB" strokeWidth={1.95} width="23.37" height="23.37"/>
                <p className="mt-2 text-[#363F4D]" style={typographyStyles.interRegular12}>
                  Reset Device
                </p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB]" aria-label="Call Support" onClick={() => toggleFaqDetail(4)}>
                <PhoneSolidIcon strokeColor="#155DFB" strokeWidth={1.95} width="23.37" height="23.37"/>
                <p className="mt-2 text-[#363F4D]" style={typographyStyles.interRegular12}>
                  Call Support
                </p>
              </button>
            </div>

            {/* FAQ Details Section (2:5301) */}
            <div className="flex flex-col space-y-[11.69px] mt-6">
              {/* FAQ 1 */}
              <div className="rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB] cursor-pointer" onClick={() => toggleFaqDetail(5)} aria-expanded={activeFaqDetail === 5}>
                <div className="flex justify-between items-center p-4">
                  <p className="text-[#101828]" style={typographyStyles.interRegular16}>
                    How do I upgrade my subscription?
                  </p>
                  <ArrowRightIcon strokeColor="#99A1AF" strokeWidth={1.30} className={activeFaqDetail === 5 ? 'rotate-90' : 'rotate-0'} />
                </div>
                {activeFaqDetail === 5 && (
                  <div className="px-4 pb-4">
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      Go to your Current Plans section, select the plan you wish to upgrade, and follow the prompts.
                    </p>
                  </div>
                )}
              </div>
              {/* FAQ 2 */}
              <div className="rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB] cursor-pointer" onClick={() => toggleFaqDetail(6)} aria-expanded={activeFaqDetail === 6}>
                <div className="flex justify-between items-center p-4">
                  <p className="text-[#101828]" style={typographyStyles.interRegular16}>
                    What payment methods are accepted?
                  </p>
                  <ArrowRightIcon strokeColor="#99A1AF" strokeWidth={1.30} className={activeFaqDetail === 6 ? 'rotate-90' : 'rotate-0'} />
                </div>
                {activeFaqDetail === 6 && (
                  <div className="px-4 pb-4">
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      We accept credit cards, debit cards, GCash, PayMaya, and bank transfers.
                    </p>
                  </div>
                )}
              </div>
              {/* FAQ 3 */}
              <div className="rounded-[13.64px] bg-[#FFFFFF] border-[0.57px] border-[#E5E7EB] cursor-pointer" onClick={() => toggleFaqDetail(7)} aria-expanded={activeFaqDetail === 7}>
                <div className="flex justify-between items-center p-4">
                  <p className="text-[#101828]" style={typographyStyles.interRegular16}>
                    Can I pause my subscription?
                  </p>
                  <ArrowRightIcon strokeColor="#99A1AF" strokeWidth={1.30} className={activeFaqDetail === 7 ? 'rotate-90' : 'rotate-0'} />
                </div>
                {activeFaqDetail === 7 && (
                  <div className="px-4 pb-4">
                    <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                      Yes, you can pause prepaid subscriptions. For postpaid, please contact support.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-[14px] border-[0.58px] border-[#CED3DB] bg-[#FFFFFF] text-[#101828]" style={typographyStyles.interRegular16}>
              View All FAQs
            </button>

            {/* Still Need Help (2:5334) */}
            <div className="mt-6 rounded-[13.64px] bg-[#EFF6FF] border-[0.57px] border-[#BDDFFC] p-4 flex flex-col space-y-[7.79px]">
              <p className="text-[#101828]" style={typographyStyles.interRegular16}>
                Still need help?
              </p>
              <div className="flex space-x-[7.79px]">
                <button className="flex-1 bg-[#FFFFFF] rounded-[9.74px] border-[0.57px] border-[#BDDFFC] text-[#0D2F7B] py-[9.08px]" style={typographyStyles.interRegular16}>
                  Call Support
                </button>
                <button className="flex-1 bg-[#155DFB] rounded-[9.74px] text-[#FFFFFF] py-[9.08px]" style={typographyStyles.interRegular16}>
                  Chat with Us
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed UI elements */}
      {/* TopBar (2:5379) */}
      <header className="fixed top-0 left-0 w-full h-[64.57px] bg-[#FFFFFF] border-b-[1px] border-b-[#E5E7EB] flex items-center px-4 z-20">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-[11.99px]">
            <div
              className="w-[39.99px] h-[39.99px] rounded-full flex items-center justify-center"
              style={{ backgroundImage: figmaGradientToCssString({
                  type: "GRADIENT_LINEAR",
                  gradientStops: [
                    { color: { r: 0.083, g: 0.364, b: 0.986, a: 1 }, position: 0 },
                    { color: { r: 0.310, g: 0.224, b: 0.966, a: 1 }, position: 1 }
                  ],
                  gradientTransform: [[0.5, 0.5, 0], [-0.25, 0.25, 0.5]]
              }) }}
            >
              <span className="text-[#FFFFFF]" style={typographyStyles.interMedium20}>C1</span>
            </div>
            <h1 className="text-[#101828]" style={typographyStyles.interMedium36}>
              Cignal One
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button aria-label="Search" className="w-[35.99px] h-[35.99px] rounded-full flex items-center justify-center">
              <SearchIcon strokeColor="#363F4D" strokeWidth={1.67} width="24" height="24"/>
            </button>
            <button aria-label="Notifications" className="relative w-[35.99px] h-[35.99px] rounded-full flex items-center justify-center">
                <NotificationBellIcon strokeColor="#363F4D" strokeWidth={1.67} width="20" height="20" />
                <RedDotIcon fillColor="#FE2C36" className="absolute top-[3.99px] right-[3.99px] w-[7.99px] h-[7.99px]" />
            </button>
          </div>
        </div>
      </header>

      {/* BottomNav (2:5344) */}
      <nav className="fixed bottom-0 left-0 w-full h-[64.55px] bg-[#FFFFFF] border-t-[1px] border-t-[#E5E7EB] flex items-center px-4 z-20">
        <ul className="flex justify-around w-full">
          <li>
            <button className="flex flex-col items-center text-[#155DFB] space-y-[3.99px]" aria-label="Home">
              <HomeIcon strokeColor="#155DFB" strokeWidth={1.67}/>
              <span style={typographyStyles.interRegular12}>Home</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center text-[#4A5565] space-y-[3.99px]" aria-label="Subscriptions">
              <SubscriptionsIcon strokeColor="#4A5565" strokeWidth={1.67}/>
              <span style={typographyStyles.interRegular12}>Subscriptions</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center text-[#4A5565] space-y-[3.99px]" aria-label="Rewards">
              <RewardsBottomNavIcon strokeColor="#4A5565" strokeWidth={1.67}/>
              <span style={typographyStyles.interRegular12}>Rewards</span>
            </button>
          </li>
          <li>
            <button className="relative flex flex-col items-center text-[#4A5565] space-y-[3.99px]" aria-label="Help">
              <HelpCircleIcon strokeColor="#4A5565" strokeWidth={1.95} width="20" height="20" />
              <span style={typographyStyles.interRegular12}>Help</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center text-[#4A5565] space-y-[3.99px]" aria-label="Profile">
              <ProfileIconBottomNav strokeColor="#4A5565" strokeWidth={1.67}/>
              <span style={typographyStyles.interRegular12}>Profile</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* ChatBot Floating Action Button (2:5401) */}
      <button
        onClick={toggleChatbotModal}
        className="fixed bottom-[80.45px] right-[15.99px] w-[55.99px] h-[55.99px] rounded-full bg-[#004FFF] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center z-30"
        aria-label="Open Chatbot"
      >
        <ChatBubbleIcon strokeColor="#FFFFFF" strokeWidth={2} width="24" height="24"/>
      </button>
      {/* Visual indicator (circle around chatbot button) */}
      <div className="fixed bottom-[70px] right-[5px] w-[80px] h-[80px] rounded-full border-[4px] border-[#155DFB] z-20" aria-hidden="true"></div>

      {/* Chatbot Modal (Container 2:5404) */}
      {isChatbotModalOpen && (
        <>
          {/* Overlay (Rectangle 1 2:5261) */}
          <div className="fixed inset-0 bg-[#000000] opacity-70 z-40" onClick={toggleChatbotModal} aria-hidden="true"></div>

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-modal-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[319.99px] h-[228.20px] bg-[#FFFFFF] rounded-[14px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col p-6 z-50"
          >
            <div className="flex flex-col mb-6">
              <p className="text-[#155DFB]" style={typographyStyles.interRegular12}>
                Step 2 of 4
              </p>
              <h3 id="chatbot-modal-title" className="text-[#101828]" style={typographyStyles.interMedium20}>
                AI Chatbot Assistant
              </h3>
              <p className="text-[#4A5565]" style={typographyStyles.interRegular16}>
                Get instant help with our AI chatbot. Ask questions about your account, services, or technical issues.
              </p>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex space-x-[7.99px] items-center">
                <span className="w-[5.99px] h-[5.99px] rounded-full bg-[#CED3DB]" aria-hidden="true"></span>
                <span className="w-[23.99px] h-[5.99px] rounded-full bg-[#155DFB]" aria-hidden="true"></span>
                <span className="w-[5.99px] h-[5.99px] rounded-full bg-[#CED3DB]" aria-hidden="true"></span>
                <span className="w-[5.99px] h-[5.99px] rounded-full bg-[#CED3DB]" aria-hidden="true"></span>
              </div>
              <div className="flex space-x-[7.99px]">
                <button
                  onClick={toggleChatbotModal}
                  className="flex items-center justify-center py-2 px-3 rounded-md border-[0.58px] border-[#000000]/10 text-[#101828]"
                  style={typographyStyles.interRegular16}
                >
                  <ArrowRightIcon strokeColor="#101828" strokeWidth={1.33} className="rotate-180 mr-1"/>
                  Back
                </button>
                <button
                  className="flex items-center justify-center py-2 px-3 rounded-md bg-[#155DFB] text-[#FFFFFF]"
                  style={typographyStyles.interRegular16}
                >
                  Next
                  <ArrowRightIcon strokeColor="#FFFFFF" strokeWidth={1.33} className="ml-1"/>
                </button>
              </div>
            </div>
            <button
              onClick={toggleChatbotModal}
              className="absolute top-[15.99px] right-[15.99px] w-[19.99px] h-[19.99px] flex items-center justify-center"
              aria-label="Close Chatbot Modal"
            >
              <SearchIcon strokeColor="#99A1AF" strokeWidth={1.67} width="20" height="20" className="rotate-45"/> {/* Using a rotated search icon for close as per design */}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TourChatbotScreen;