// components/2-3-tour-pay-bill.tsx
import React, { useState, useMemo } from 'react';

// --- Types & Interfaces ---

interface TourPayBillScreenProps {
  // Define any top-level props if needed for the screen, e.g., userId, theme, etc.
}

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface AppCardProps {
  iconPaths: { d: string; fill?: string; stroke?: string; strokeWidth?: number }[];
  gradientFrom: string;
  gradientTo: string;
  title: string;
  description: string;
  textColor: string;
  descriptionColor: string;
}

interface ContentCardProps {
  gradientFrom: string;
  gradientTo: string;
  title: string;
  category: string;
  duration?: string; // e.g., "8 Episodes", "2h 15m", "Season 5"
  categoryColor: string;
  detailColor: string; // for duration/episodes/etc
  iconColor: string;
}

interface CurrentPlanCardProps {
  planName: string;
  planPrice: string;
  channels: string; // e.g., "200+"
  validUntil: string;
  status: 'Active' | 'Expiring'; // Maps to color-9/color-10 or #E7000B
  iconPaths: { d: string; fill?: string; string?: string; stroke?: string; strokeWidth?: number }[];
  statusBgColor: string;
  statusTextColor: string;
}

interface HelpDetailProps {
  question: string;
  answer: string;
  chevronColor: string;
  textColor: string;
}

// Icon for chevron (right arrow)
const ChevronRightIcon: React.FC<{ className?: string; stroke?: string }> = ({ className = 'stroke-[#6a7282]' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M5.99729 3.99819L9.99548 7.99638L5.99729 11.9946" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Icon for clock
const ClockIcon: React.FC<{ className?: string }> = ({ className = 'stroke-[#99a1af]' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M5.99956 2.99978V6.99797" strokeWidth="0.999927" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0.999927 0.999927C4.10393 0.999927 6.66629 3.56228 6.66629 6.66629C6.66629 9.7703 4.10393 12.3326 0.999927 12.3326C-2.10408 12.3326 -4.66644 9.7703 -4.66644 6.66629C-4.66644 3.56228 -2.10408 0.999927 0.999927 0.999927Z" strokeWidth="0.999927" />
  </svg>
);

// Icon for episode/season
const FilmIcon: React.FC<{ className?: string }> = ({ className = 'stroke-[#99a1af]' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M0.999927 0.999927C4.10393 0.999927 6.66629 3.56228 6.66629 6.66629C6.66629 9.7703 4.10393 12.3326 0.999927 12.3326C-2.10408 12.3326 -4.66644 9.7703 -4.66644 6.66629C-4.66644 3.56228 -2.10408 0.999927 0.999927 0.999927Z" strokeWidth="0.999927" />
  </svg>
);

// Generic icon from vectors
const GenericIcon: React.FC<{ paths: { d: string; fill?: string; stroke?: string; strokeWidth?: number }[]; size?: number; className?: string }> = ({ paths, size = 20, className }) => (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {paths.map((path, index) => (
            <path
                key={index}
                d={path.d}
                fill={path.fill || "none"}
                stroke={path.stroke || "currentColor"}
                strokeWidth={path.strokeWidth || 1}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ))}
    </svg>
);

// --- Sub-components ---

const AppCard: React.FC<AppCardProps> = ({ iconPaths, gradientFrom, gradientTo, title, description, textColor, descriptionColor }) => (
  <div className="flex flex-col gap-2 w-[128px]">
    <div className={`w-[128px] h-[128px] bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-[14px] flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]`}>
      <GenericIcon paths={iconPaths} size={48} className="stroke-white" />
    </div>
    <div className="flex flex-col items-center">
      <p className={`text-center text-[${textColor}] text-[16px] font-normal leading-6 tracking-[-0.3125px]`}>{title}</p>
      <p className={`text-center text-[${descriptionColor}] text-[16px] font-normal leading-6 tracking-[-0.3125px]`}>{description}</p>
    </div>
  </div>
);

const ContentCard: React.FC<ContentCardProps> = ({ gradientFrom, gradientTo, title, category, duration, iconColor }) => (
  <div className="flex flex-col w-[192px] rounded-[14px] bg-[#101828] overflow-hidden">
    <div className={`relative w-full h-[112px] bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
      <div className="w-[48px] h-[48px] rounded-full bg-white/[0.2] flex items-center justify-center">
        <div className="w-[7.57px] h-[11.64px] border-2 border-white" /> {/* Placeholder for play icon */}
      </div>
    </div>
    <div className="p-3 flex flex-col gap-1.5 h-full">
      <p className="text-white text-[16px] font-normal leading-6 tracking-[-0.3125px]">{title}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#99a1af] text-[16px] font-normal leading-6 tracking-[-0.3125px]">{category}</span>
        {duration && (
          <div className="flex items-center gap-1">
            <ClockIcon className={`stroke-[${iconColor}] w-3 h-3`} />
            <span className={`text-[${iconColor}] text-[16px] font-normal leading-6 tracking-[-0.3125px]`}>{duration}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ planName, planPrice, channels, validUntil, status, iconPaths, statusBgColor, statusTextColor }) => (
  <div className="min-w-[280px] flex-shrink-0 bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] flex flex-col p-4 gap-4">
    <div className="flex items-start justify-between">
      <div className="flex gap-3">
        <div className="w-[48px] h-[48px] bg-[#eff6ff] rounded-[14px] flex items-center justify-center">
          <GenericIcon paths={iconPaths} size={32} className="stroke-[#155dfc]" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">{planName}</h3>
          <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">{planPrice}</p>
        </div>
      </div>
      <div className={`px-2 py-1 rounded-full ${statusBgColor} text-[16px] font-normal leading-6 tracking-[-0.3125px] ${statusTextColor}`}>
        {status}
      </div>
    </div>

    <div className="flex flex-col gap-2 pt-4 border-t border-[#f3f4f6]">
      <div className="flex justify-between items-center">
        <span className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Channels</span>
        <span className="text-[#101828] text-base font-normal leading-6 tracking-[-0.3125px]">{channels}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Valid Until</span>
        <span className="text-[#101828] text-base font-normal leading-6 tracking-[-0.3125px]">{validUntil}</span>
      </div>
    </div>

    <div className="flex gap-2 pt-4 border-t border-[#f3f4f6]">
      <button className="flex-1 px-4 py-2 bg-[#eff6ff] rounded-lg text-[#101828] text-base font-normal leading-6 tracking-[-0.3125px]">
        Manage
      </button>
      <button className="flex-1 px-4 py-2 bg-[#155dfc] rounded-lg text-white text-base font-normal leading-6 tracking-[-0.3125px]">
        Upgrade
      </button>
      {planName === "Cignal Postpaid Premium" && (
        <button className="flex-1 px-4 py-2 bg-[#00A63E] rounded-lg text-white text-base font-normal leading-6 tracking-[-0.3125px]">
          Pay Bill
        </button>
      )}
    </div>
  </div>
);

const HelpDetail: React.FC<HelpDetailProps> = ({ question, answer, chevronColor, textColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)]">
      <button
        className="w-full flex justify-between items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <p className={`text-[${textColor}] text-base font-normal leading-6 tracking-[-0.3125px] pr-4 text-left`}>{question}</p>
        <ChevronRightIcon className={`transform transition-transform ${isOpen ? 'rotate-90' : ''} stroke-[${chevronColor}]`} />
      </button>
      {isOpen && (
        <p className={`p-4 pt-0 text-[${textColor}] text-base font-normal leading-6 tracking-[-0.3125px]`}>
          {answer}
        </p>
      )}
    </div>
  );
};


// --- Main Component ---

export interface TourPayBillScreenComponentProps extends TourPayBillScreenProps {}

export const TourPayBillScreen: React.FC<TourPayBillScreenComponentProps> = () => {
  const [showPayBillModal, setShowPayBillModal] = useState(false);

  const togglePayBillModal = () => setShowPayBillModal(!showPayBillModal);

  return (
    <div className="relative w-full min-h-screen bg-[#f3f4f6] font-['Inter']">
      {/* TopBar */}
      <div className="sticky top-0 z-10 w-full h-[64.57px] bg-white border-b border-[#e5e7eb] flex items-center px-4">
        <div className="flex items-center justify-between w-full h-[40px]">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#155DFB] to-[#4F39F6] flex items-center justify-center">
              <span className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">C1</span>
            </div>
            <h1 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Cignal One</h1>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13.8802 13.8802L17.4961 17.4961" stroke="#364153" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.50005 2.50005L15.8304 15.8304" stroke="#364153" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button aria-label="Search" className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4.16573 12.4972L11.664 4.99888" stroke="#364153" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.66517 2.49944C9.77025 2.49944 12.3326 5.06179 12.3326 8.16588C12.3326 11.2704 9.77025 13.8327 6.66517 13.8327C3.5601 13.8327 0.997742 11.2704 0.997742 8.16588C0.997742 5.06179 3.5601 2.49944 6.66517 2.49944Z" stroke="#364153" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="absolute w-2 h-2 rounded-full bg-[#fa2c36] right-0 top-1/2 -mt-2 mr-2" /> {/* Notification dot */}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pb-[calc(64.55px+24px)]"> {/* Padding for fixed bottom nav and chatbot */}
        <div className="flex flex-col gap-4 py-6">
          {/* Header Image/Banner */}
          <div className="relative w-full h-[256px] overflow-hidden">
            <img src="https://via.placeholder.com/376x256/202c38/ffffff?text=New+Release" alt="New Release: Action Movies Marathon" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.8] via-black/[0.4] to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
              <h2 className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">New Release: Action Movies Marathon</h2>
              <p className="text-white/[0.9] text-base font-normal leading-6 tracking-[-0.3125px]">Stream the latest blockbusters</p>
            </div>
          </div>
          {/* Live Sports Image/Banner */}
          <div className="relative w-full h-[256px] overflow-hidden">
            <img src="https://via.placeholder.com/376x256/202c38/ffffff?text=Live+Sports" alt="Live Sports: Premier League" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.8] via-black/[0.4] to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
              <h2 className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Live Sports: Premier League</h2>
              <p className="text-white/[0.9] text-base font-normal leading-6 tracking-[-0.3125px]">Watch your favorite teams live</p>
            </div>
          </div>
          {/* Breaking News Image/Banner */}
          <div className="relative w-full h-[256px] overflow-hidden">
            <img src="https://via.placeholder.com/376x256/202c38/ffffff?text=Breaking+News" alt="Breaking News Coverage" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.8] via-black/[0.4] to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
              <h2 className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Breaking News Coverage</h2>
              <p className="text-white/[0.9] text-base font-normal leading-6 tracking-[-0.3125px]">24/7 news and updates</p>
            </div>
          </div>
          {/* Pagination for Banners */}
          <div className="flex justify-end gap-2 pr-6">
            <div className="w-[24px] h-[8px] rounded-full bg-white" />
            <div className="w-[8px] h-[8px] rounded-full bg-white/[0.5]" />
            <div className="w-[8px] h-[8px] rounded-full bg-white/[0.5]" />
          </div>

          {/* Current Plans Section */}
          <section className="bg-white px-4 py-4 border-b border-[#f3f4f6]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h2 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Current Plans</h2>
                <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Manage your active subscriptions</p>
              </div>
              <div className="flex gap-2">
                <button aria-label="Previous plan" className="w-[33.15px] h-[33.15px] rounded-lg border border-[#e5e7eb] flex items-center justify-center">
                  <ChevronRightIcon className="transform rotate-180 stroke-[#4a5565] w-4 h-4" />
                </button>
                <button aria-label="Next plan" className="w-[33.15px] h-[33.15px] rounded-lg border border-[#e5e7eb] flex items-center justify-center">
                  <ChevronRightIcon className="stroke-[#4a5565] w-4 h-4" />
                </button>
            </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              <CurrentPlanCard
                planName="Cignal Postpaid Premium"
                planPrice="₱1,899/month"
                channels="200+"
                validUntil="Dec 15, 2025"
                status="Active"
                iconPaths={[{ d: "M2.66622 6.66555H29.3284V25.3291C29.3284 26.8043 28.1408 27.9917 26.6655 27.9917H5.33256C3.85725 27.9917 2.66622 26.8043 2.66622 25.3291V6.66555Z", stroke: undefined, strokeWidth: undefined }, { d: "M2.66622 13.3311H29.3284", stroke: undefined, strokeWidth: undefined }]}
                statusBgColor="bg-[#dcfce7]"
                statusTextColor="text-[#008236]"
              />
              <CurrentPlanCard
                planName="Cignal Fiber 100 Mbps"
                planPrice="₱1,699/month"
                channels="100 Mbps"
                validUntil="Dec 31, 2025"
                status="Active"
                iconPaths={[{ d: "M9.33177 2.66622H22.6629L25.3291 9.33177L15.9973 26.6622L6.66555 9.33177L9.33177 2.66622Z", stroke: undefined, strokeWidth: undefined }, { d: "M15.9973 26.6622V26.6622", stroke: undefined, strokeWidth: undefined }, { d: "M6.66555 3.99933H25.3291L2.66622 6.66555H7.99866L15.9973 13.3311L2.66622 6.66555Z", stroke: undefined, strokeWidth: undefined }, { d: "M11.3314 19.9963L20.6632 21.9017", stroke: undefined, strokeWidth: undefined }]}
                statusBgColor="bg-[#dcfce7]"
                statusTextColor="text-[#008236]"
              />
              <CurrentPlanCard
                planName="Cignal Prepaid Basic"
                planPrice="₱299/month"
                channels="30+"
                validUntil="Dec 10, 2025"
                status="Expiring"
                iconPaths={[{ d: "M9.33177 2.66622H22.6629L25.3291 9.33177L15.9973 26.6622L6.66555 9.33177L9.33177 2.66622Z", stroke: undefined, strokeWidth: undefined }, { d: "M15.9973 26.6622V26.6622", stroke: undefined, strokeWidth: undefined }, { d: "M6.66555 3.99933H25.3291L2.66622 6.66555H7.99866L15.9973 13.3311L2.66622 6.66555Z", stroke: undefined, strokeWidth: undefined }, { d: "M11.3314 19.9963L20.6632 21.9017", stroke: undefined, strokeWidth: undefined }]}
                statusBgColor="bg-[#ffe8e0]" // Approx for #FDE0DCE0
                statusTextColor="text-[#E7000B]" // Approx for #E7000B
              />
               <CurrentPlanCard
                planName="Cignal Fiber 200 Mbps"
                planPrice="₱2,499/month"
                channels="200 Mbps"
                validUntil="Mar 15, 2026"
                status="Active"
                iconPaths={[{ d: "M9.33177 2.66622H22.6629L25.3291 9.33177L15.9973 26.6622L6.66555 9.33177L9.33177 2.66622Z", stroke: undefined, strokeWidth: undefined }, { d: "M15.9973 26.6622V26.6622", stroke: undefined, strokeWidth: undefined }, { d: "M6.66555 3.99933H25.3291L2.66622 6.66555H7.99866L15.9973 13.3311L2.66622 6.66555Z", stroke: undefined, strokeWidth: undefined }, { d: "M11.3314 19.9963L20.6632 21.9017", stroke: undefined, strokeWidth: undefined }]}
                statusBgColor="bg-[#dcfce7]"
                statusTextColor="text-[#008236]"
              />
            </div>
          </section>

          {/* Your Apps Section */}
          <section className="bg-white px-4 py-4 border-b border-[#f3f4f6]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h3 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Your Apps</h3>
                <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Manage your subscriptions</p>
              </div>
              <button className="flex items-center gap-1 text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]" onClick={togglePayBillModal}>
                View All
                <ChevronRightIcon className="stroke-[#155dfc] w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              <AppCard
                title="Cignal Postpaid"
                description="Premium TV experience"
                gradientFrom="from-[#2B7FFF]"
                gradientTo="to-[#155DFB]"
                textColor="#101828"
                descriptionColor="#6a7282"
                iconPaths={[
                  { d: "M13.999 3.99971H33.9982V13.9989H13.999V3.99971Z", stroke: undefined, strokeWidth: 4 },
                  { d: "M3.99971 13.999H43.9968V43.9959H3.99971V13.999Z", stroke: undefined, strokeWidth: 4 }
                ]}
              />
              <AppCard
                title="Cignal Prepaid"
                description="Flexible TV plans"
                gradientFrom="from-[#615FFF]"
                gradientTo="to-[#4F39F6]"
                textColor="#101828"
                descriptionColor="#6a7282"
                iconPaths={[
                  { d: "M13.999 3.99971H33.9982V13.9989H13.999V3.99971Z", stroke: undefined, strokeWidth: 4 },
                  { d: "M3.99971 13.999H43.9968V43.9959H3.99971V13.999Z", stroke: undefined, strokeWidth: 4 }
                ]}
              />
              <AppCard
                title="SatLite"
                description="Mobile streaming"
                gradientFrom="from-[#AD46FF]"
                gradientTo="to-[#9810FA]"
                textColor="#101828"
                descriptionColor="#6a7282"
                iconPaths={[
                  { d: "M9.99927 3.99971V43.9968H37.9972V3.99971H9.99927Z", stroke: undefined, strokeWidth: 4 },
                  { d: "M23.9982 35.9974L24.0182 35.9974", stroke: undefined, strokeWidth: 4 }
                ]}
              />
              <AppCard
                title="Cignal Play"
                description="On-demand content"
                gradientFrom="from-[#F6329A]"
                gradientTo="to-[#E50076]"
                textColor="#101828"
                descriptionColor="#6a7282"
                iconPaths={[
                  { d: "M9.99927 5.9984H41.9994V41.9981H9.99927V5.9984Z", stroke: undefined, strokeWidth: 4 }
                ]}
              />
              <AppCard
                title="Pilipinas Live"
                description="Local channels"
                gradientFrom="from-[#00C850]"
                gradientTo="to-[#00A63E]"
                textColor="#101828"
                descriptionColor="#6a7282"
                iconPaths={[
                  { d: "M3.99971 3.99971H43.9968V43.9968H3.99971V3.99971Z", stroke: undefined, strokeWidth: 4 },
                  { d: "M15.9988 3.99971V43.9968", stroke: undefined, strokeWidth: 4 },
                  { d: "M3.99971 23.9982H43.9968", stroke: undefined, strokeWidth: 4 }
                ]}
              />
              <div className="min-w-[128px] h-[160px] rounded-xl border border-[#d1d5db] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <GenericIcon paths={[{ d: "M2.99659 1.9974L21.0021 1.9974C21.5542 1.9974 21.9997 2.44185 21.9997 2.99401L21.9997 22.0006C21.9997 22.5528 21.5542 22.9972 21.0021 22.9972L2.99659 22.9972C2.44185 22.9972 1.9973 22.5528 1.9973 22.0006L1.9973 2.99401C1.9973 2.44185 2.44185 1.9974 2.99659 1.9974Z", stroke: undefined, strokeWidth: 2 }]} size={24} className="stroke-[#99a1af]" />
                  <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Cignal Super</p>
                </div>
              </div>
            </div>
          </section>

          {/* Wallet Preview Section */}
          <section className="bg-gradient-to-br from-[#155DFB] to-[#4F39F6] px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-[48px] h-[48px] rounded-full bg-white/[0.2] flex items-center justify-center">
                    {/* Wallet icon paths */}
                    <GenericIcon paths={[
                        { d: "M2.99978 7.99942H20.9985V11.9991H2.99978V7.99942Z", stroke: undefined, strokeWidth: 2 },
                        { d: "M11.9991 7.99942V20.9986", stroke: undefined, strokeWidth: 2 },
                        { d: "M4.99963 11.9991H18.9986V20.9985H4.99963V11.9991Z", stroke: undefined, strokeWidth: 2 },
                        { d: "M4.99963 2.99935H18.9986V7.99942H4.99963V2.99935Z", stroke: undefined, strokeWidth: 2 }
                    ]} size={24} className="stroke-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-white/[0.9] text-base font-normal leading-6 tracking-[-0.3125px]">My Wallet</p>
                  <h3 className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">2,450 Points</h3>
                </div>
              </div>
              <button className="flex items-center gap-1 px-4 py-2 bg-white/[0.2] rounded-lg text-white text-base font-normal leading-6 tracking-[-0.3125px]" onClick={togglePayBillModal}>
                View Wallet
                <ChevronRightIcon className="stroke-white w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex-1 p-4 bg-white/[0.1] rounded-xl flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    {/* Available icon paths (star) */}
                    <GenericIcon paths={[
                        { d: "M1.66629 1.66629H11.664C11.9392 1.66629 12.1819 1.77797 12.3582 1.95427C12.5345 2.13057 12.6462 2.37329 12.6462 2.64848L12.6462 11.6443C12.6462 11.9195 12.5345 12.1622 12.3582 12.3385C12.1819 12.5148 11.9392 12.6265 11.664 12.6265H2.64848C2.37329 12.6265 2.13057 12.5148 1.95427 12.3385C1.77797 12.1622 1.66629 11.9195 1.66629 11.6443V1.66629Z", stroke: undefined, strokeWidth: 1.66629 },
                        { d: "M8.61473 8.63972L18.3242 18.3492", stroke: undefined, strokeWidth: 1.66629 },
                        { d: "M5.83202 4.99888H6.66517", stroke: undefined, strokeWidth: 1.66629 },
                        { d: "M12.1556 11.5641H14.5051", stroke: undefined, strokeWidth: 1.66629 }
                    ]} size={20} className="stroke-[#FFDE20]" />
                  <p className="text-white/[0.9] text-base font-normal leading-6 tracking-[-0.3125px]">Available</p>
                </div>
                <p className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">2,450 pts</p>
              </div>
              <div className="flex-1 p-4 bg-white/[0.1] rounded-xl flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    {/* Rewards icon paths (gift box) */}
                    <GenericIcon paths={[
                        { d: "M2.49944 6.66517H17.4966V9.99775H2.49944V6.66517Z", stroke: undefined, strokeWidth: 1.66629 },
                        { d: "M9.99775 6.66517V17.4966", stroke: undefined, strokeWidth: 1.66629 },
                        { d: "M4.16573 9.99775H15.8302V17.4966H4.16573V9.99775Z", stroke: undefined, strokeWidth: 1.66629 },
                        { d: "M4.16573 2.49908H15.8302V6.66517H4.16573V2.49908Z", stroke: undefined, strokeWidth: 1.66629 }
                    ]} size={20} className="stroke-[#FD97D5]" />
                  <p className="text-white/[0.9] text-base font-normal leading-6 tracking-[-0.3125px]">Rewards</p>
                </div>
                <p className="text-white text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">15 Available</p>
              </div>
            </div>
          </section>

          {/* Entertainment Carousel */}
          <section className="bg-white px-4 py-4 border-b border-[#f3f4f6]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h3 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Entertainment</h3>
                <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Popular shows and series</p>
              </div>
              <button className="flex items-center gap-1 text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
                See All
                <ChevronRightIcon className="stroke-[#155dfc] w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              <ContentCard
                title="The Latest Drama Series"
                category="Drama"
                duration="8 Episodes"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Comedy Night Special"
                category="Comedy"
                duration="Season 5"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Documentary: Nature"
                category="Documentary"
                duration="1h 45m"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
            </div>
          </section>

          {/* Movies Carousel */}
          <section className="bg-white px-4 py-4 border-b border-[#f3f4f6]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h3 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Movies</h3>
                <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Blockbusters and classics</p>
              </div>
              <button className="flex items-center gap-1 text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
                See All
                <ChevronRightIcon className="stroke-[#155dfc] w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              <ContentCard
                title="Action Thriller 2024"
                category="Action"
                duration="2h 30m"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Romantic Comedy"
                category="Romance"
                duration="1h 55m"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Sci-Fi Adventure"
                category="Sci-Fi"
                duration="2h 45m"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
            </div>
          </section>

          {/* Sports & Live Events Carousel */}
          <section className="bg-white px-4 py-4 border-b border-[#f3f4f6]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h3 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Sports & Live Events</h3>
                <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Watch your favorite sports</p>
              </div>
              <button className="flex items-center gap-1 text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
                See All
                <ChevronRightIcon className="stroke-[#155dfc] w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              <ContentCard
                title="NBA Finals Game 7"
                category="Basketball"
                duration="Live"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Premier League Match"
                category="Football"
                duration="Today 8PM"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Tennis Grand Slam"
                category="Tennis"
                duration="Live Now"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailTo="to-[#1E2939]"
                iconColor="#99a1af"
              />
              <ContentCard
                title="Boxing Championship"
                category="Boxing"
                duration="Tomorrow"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
              <ContentCard
                title="UFC Fight Night"
                category="MMA"
                duration="This Weekend"
                gradientFrom="from-[#364153]"
                gradientTo="to-[#1E2939]"
                categoryColor="#99a1af"
                detailColor="#99a1af"
                iconColor="#99a1af"
              />
            </div>
          </section>

          {/* Help Section */}
          <section className="bg-[#f3f4f6] px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <GenericIcon paths={[
                { d: "M1.94802 1.94795C6.01255 1.94795 9.73926 5.67465 9.73926 9.73919C9.73926 13.8037 6.01255 17.5304 1.94802 17.5304C-2.11651 17.5304 -5.84322 13.8037 -5.84322 9.73919C-5.84322 5.67465 -2.11651 1.94795 1.94802 1.94795Z", stroke: undefined, strokeWidth: 1.94786 },
                { d: "M8.85299 6.81342H14.5314V12.6618H8.85299V6.81342Z", stroke: undefined, strokeWidth: 1.94786 },
                { d: "M11.6871 16.5568L11.6971 16.5568", stroke: undefined, strokeWidth: 1.94786 }
              ]} size={24} className="stroke-[#364153]" />
              <h2 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Help & Support</h2>
            </div>
            <div className="flex gap-2 mb-4 border-b border-[#e5e7eb] pb-2">
              <button className="flex-1 text-center py-2 text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
                FAQs
              </button>
              <button className="flex-1 text-center py-2 text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">
                Diagnostics
              </button>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-4 mb-4">
              <button className="flex-1 min-w-[160px] p-4 bg-white border border-[#e5e7eb] rounded-lg flex flex-col items-center justify-center gap-2">
                <GenericIcon paths={[
                    { d: "M11.687 19.4787L11.697 19.4787", stroke: undefined, strokeWidth: 1.94786 },
                    { d: "M1.94778 4.87011H21.4264V8.59018H1.94778V4.87011Z", stroke: undefined, strokeWidth: 1.94786 },
                    { d: "M4.86957 9.73997H18.5046V12.524H4.86957V9.73997Z", stroke: undefined, strokeWidth: 1.94786 },
                    { d: "M8.27823 14.6086H15.1098V15.9996H8.27823V14.6086Z", stroke: undefined, strokeWidth: 1.94786 }
                ]} size={24} className="stroke-[#155dfc]" />
                <p className="text-[#364153] text-base font-normal leading-6 tracking-[-0.3125px]">Internet Issues</p>
              </button>
              <button className="flex-1 min-w-[160px] p-4 bg-white border border-[#e5e7eb] rounded-lg flex flex-col items-center justify-center gap-2">
                <GenericIcon paths={[
                    { d: "M6.81741 1.94795H16.5574L16.5574 6.81756L1.94779 6.81756L6.81741 1.94795Z", stroke: undefined, strokeWidth: 1.94786 },
                    { d: "M1.94779 6.81756H21.4264V21.4261H1.94779V6.81756Z", stroke: undefined, strokeWidth: 1.94786 }
                ]} size={24} className="stroke-[#155dfc]" />
                <p className="text-[#364153] text-base font-normal leading-6 tracking-[-0.3125px]">No TV Signal</p>
              </button>
              <button className="flex-1 min-w-[160px] p-4 bg-white border border-[#e5e7eb] rounded-lg flex flex-col items-center justify-center gap-2">
                <GenericIcon paths={[
                    { d: "M2.96448 1.96468C7.03058 1.96468 10.7584 5.69248 10.7584 9.75858C10.7584 13.8247 7.03058 17.5525 2.96448 17.5525C-1.10162 17.5525 -4.82942 13.8247 -4.82942 9.75858C-4.82942 5.69248 -1.10162 1.96468 2.96448 1.96468Z", stroke: undefined, strokeWidth: 1.94786 },
                    { d: "M8.76534 8.76495C14.5312 8.76495 19.4795 13.7132 19.4795 19.4791C19.4795 25.245 14.5312 30.1932 8.76534 30.1932C2.99944 30.1932 -1.48831 25.245 -1.48831 19.4791C-1.48831 13.7132 2.99944 8.76495 8.76534 8.76495Z", stroke: undefined, strokeWidth: 1.94786 }
                ]} size={24} className="stroke-[#155dfc]" />
                <p className="text-[#364153] text-base font-normal leading-6 tracking-[-0.3125px]">Reset Device</p>
              </button>
              <button className="flex-1 min-w-[160px] p-4 bg-white border border-[#e5e7eb] rounded-lg flex flex-col items-center justify-center gap-2">
                <GenericIcon paths={[
                    { d: "M1.94791 1.94788C6.01244 1.94788 9.73915 5.67459 9.73915 9.73912C9.73915 13.8037 6.01244 17.5304 1.94791 17.5304C-2.11662 17.5304 -5.84333 13.8037 -5.84333 9.73912C-5.84333 5.67459 -2.11662 1.94788 1.94791 1.94788Z", stroke: undefined, strokeWidth: 1.94786 }
                ]} size={24} className="stroke-[#155dfc]" />
                <p className="text-[#364153] text-base font-normal leading-6 tracking-[-0.3125px]">Call Support</p>
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <HelpDetail
                question="How do I upgrade my subscription?"
                answer="Go to your Current Plans section, select the plan you wish to upgrade, and follow the prompts. You can also contact customer support for assistance."
                chevronColor="#6a7282"
                textColor="#101828"
              />
              <HelpDetail
                question="What payment methods are accepted?"
                answer="We accept credit cards, debit cards, GCash, PayMaya, and over-the-counter payments at our partner establishments."
                chevronColor="#6a7282"
                textColor="#101828"
              />
              <HelpDetail
                question="How can I earn more rewards points?"
                answer="Earn points by paying bills on time, referring friends, participating in app activities, and subscribing to premium content."
                chevronColor="#6a7282"
                textColor="#101828"
              />
              <HelpDetail
                question="Can I pause my subscription?"
                answer="Yes, you can pause prepaid subscriptions. For postpaid, you may need to contact customer service to discuss options."
                chevronColor="#6a7282"
                textColor="#101828"
              />
            </div>
            <button className="w-full py-3 rounded-lg border border-[#d1d5db] text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">
              View All FAQs
            </button>
          </section>

          {/* Still Need Help Section */}
          <section className="px-4 py-4 bg-[#eff6ff] rounded-lg mx-4 mt-4 mb-24"> {/* Added margin bottom for spacing above bottom nav */}
            <p className="text-[#101828] text-base font-normal leading-6 tracking-[-0.3125px] mb-3">Still need help?</p>
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-white border border-[#bbdcfc] rounded-lg text-[#155dfc] text-base font-normal leading-6 tracking-[-0.3125px]">
                Call Support
              </button>
              <button className="flex-1 py-3 bg-[#155dfc] rounded-lg text-white text-base font-normal leading-6 tracking-[-0.3125px]">
                Chat with Us
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ChatBot Floating Button */}
      <div className="fixed bottom-24 right-4 z-20"> {/* Adjusted position to avoid overlap with bottom nav */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-4 border-[#155dfc] animate-ping-slow-fade" />
          <button aria-label="Open Chatbot" className="w-14 h-14 rounded-full bg-[#004FFF] flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]" onClick={togglePayBillModal}> {/* Reusing modal for demo */}
            <GenericIcon paths={[{ d: "M2.00031 2.00031C8.00031 2.00031 19.9986 2.00031 19.9986 2.00031C19.9986 8.00031 19.9986 19.9987 19.9986 19.9987C13.9986 19.9987 2.00031 19.9987 2.00031 19.9987C2.00031 13.9987 2.00031 2.00031 2.00031 2.00031Z", stroke: undefined, strokeWidth: 2 }]} size={24} className="stroke-white" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e5e7eb] pt-2 pb-4 px-2 z-10">
        <div className="flex justify-around h-[56px]">
          <button aria-label="Home" className="flex flex-col items-center justify-center gap-1 w-[65px] text-[#155dfc]">
            <GenericIcon paths={[
                { d: "M7.49832 9.99775V17.4961", stroke: undefined, strokeWidth: 1.66629 },
                { d: "M2.49944 1.66589H17.4966V17.4961H2.49944V1.66589Z", stroke: undefined, strokeWidth: 1.66629 }
            ]} size={20} className="stroke-[#155dfc]" />
            <span className="text-base font-normal leading-6 tracking-[-0.3125px]">Home</span>
          </button>
          <button aria-label="Subscriptions" className="flex flex-col items-center justify-center gap-1 w-[109.5px] text-[#4a5565]">
            <GenericIcon paths={[
                { d: "M1.66629 4.16573H18.3326V15.8302H1.66629V4.16573Z", stroke: undefined, strokeWidth: 1.66629 },
                { d: "M1.66629 8.33146H18.3326", stroke: undefined, strokeWidth: 1.66629 }
            ]} size={20} className="stroke-[#4a5565]" />
            <span className="text-base font-normal leading-6 tracking-[-0.3125px]">Subscriptions</span>
          </button>
          <button aria-label="Rewards" className="flex flex-col items-center justify-center gap-1 w-[58px] text-[#4a5565]">
            <GenericIcon paths={[
                { d: "M2.49944 6.66517H17.4966V9.99775H2.49944V6.66517Z", stroke: undefined, strokeWidth: 1.66629 },
                { d: "M9.99775 6.66517V17.4966", stroke: undefined, strokeWidth: 1.66629 },
                { d: "M4.16573 9.99775H15.8302V17.4966H4.16573V9.99775Z", stroke: undefined, strokeWidth: 1.66629 },
                { d: "M4.16573 2.49908H15.8302V6.66517H4.16573V2.49908Z", stroke: undefined, strokeWidth: 1.66629 }
            ]} size={20} className="stroke-[#4a5565]" />
            <span className="text-base font-normal leading-6 tracking-[-0.3125px]">Rewards</span>
          </button>
          <button aria-label="Help" className="flex flex-col items-center justify-center gap-1 w-[80px] text-[#4a5565]">
            <GenericIcon paths={[
                { d: "M1.66629 1.66629C6.01255 1.66629 9.73926 5.393 9.73926 9.73919C9.73926 14.0854 6.01255 17.8121 1.66629 17.8121C-2.68097 17.8121 -6.40768 14.0854 -6.40768 9.73919C-6.40768 5.393 -2.68097 1.66629 1.66629 1.66629Z", stroke: undefined, strokeWidth: 1.66629 }
            ]} size={20} className="stroke-[#4a5565]" />
            <span className="text-base font-normal leading-6 tracking-[-0.3125px]">Help</span>
          </button>
          <button aria-label="Profile" className="flex flex-col items-center justify-center gap-1 w-[68px] text-[#4a5565]">
            <GenericIcon paths={[
                { d: "M4.16573 12.4972H15.8302V17.4961H4.16573V12.4972Z", stroke: undefined, strokeWidth: 1.66629 },
                { d: "M6.66517 2.49944C9.77025 2.49944 12.3326 5.06179 12.3326 8.16588C12.3326 11.2704 9.77025 13.8327 6.66517 13.8327C3.5601 13.8327 0.997742 11.2704 0.997742 8.16588C0.997742 5.06179 3.5601 2.49944 6.66517 2.49944Z", stroke: undefined, strokeWidth: 1.66629 }
            ]} size={20} className="stroke-[#4a5565]" />
            <span className="text-base font-normal leading-6 tracking-[-0.3125px]">Profile</span>
            <div className="absolute w-2 h-2 rounded-full bg-[#fa2c36] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[-10px] ml-[15px]" />
          </button>
        </div>
      </nav>

      {/* Pay Your Bill Modal */}
      {showPayBillModal && (
        <div className="fixed inset-0 bg-black/[0.7] z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-[#155dfc] text-[16px] font-normal leading-6 tracking-[-0.3125px]">Step 3 of 4</p>
              <h3 className="text-[#101828] text-[20px] font-medium leading-[30px] tracking-[-0.44921875px]">Pay Your Bill</h3>
              <p className="text-[#4a5565] text-base font-normal leading-6 tracking-[-0.3125px]">Easily view and pay your bills directly from the app.</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#99a1af]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#99a1af]" />
                <div className="w-6 h-1.5 rounded-full bg-[#155dfc]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#99a1af]" />
              </div>
              <button aria-label="Close modal" onClick={togglePayBillModal} className="w-5 h-5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M4.99888 4.99888L14.9966 14.9966" stroke="#99a1af" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.99888 14.9966L14.9966 4.99888" stroke="#99a1af" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={togglePayBillModal} className="flex-1 px-4 py-2 bg-white border border-black/[0.1] rounded-lg text-[#101828] text-base font-normal leading-6 tracking-[-0.3125px]">
                <ChevronRightIcon className="inline-block transform rotate-180 stroke-[#101828] w-4 h-4 mr-1" />
                Back
              </button>
              <button className="flex-1 px-4 py-2 bg-[#155dfc] rounded-lg text-white text-base font-normal leading-6 tracking-[-0.3125px]">
                Next
                <ChevronRightIcon className="inline-block stroke-white w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add keyframes for the custom ping animation in your global CSS or in a style tag if not using PostCSS for Tailwind.
// Example for tailwind.config.js (needs to be adapted if this is a standalone file):
/*
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'ping-slow-fade': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        }
      },
      animation: {
        'ping-slow-fade': 'ping-slow-fade 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    }
  }
}
*/