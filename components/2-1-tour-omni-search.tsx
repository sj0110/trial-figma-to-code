// src/components/OmniSearchScreen.tsx

import { useState, useMemo, Suspense } from 'react';

// --- Utility Components & Icons (within the same file as per CRITICAL requirement) ---

type SVGProps = React.SVGProps<SVGSVGElement>;

const ChevronRightIcon = (props: SVGProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.99729 3.99819L9.99548 7.99638L5.99729 11.9946" stroke="currentColor" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const QuestionMarkCircleIcon = (props: SVGProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.85299 6.81342C9.43127 6.23514 10.158 5.86794 10.9575 5.7656C11.7571 5.66326 12.5647 5.82029 13.2774 6.21634C13.9902 6.61239 14.5779 7.23432 14.9667 7.99424C15.3556 8.75416 15.5303 9.61905 15.4746 10.485C15.4746 12.0076 13.6826 13.0456 12 14C11.5 14.28 11 14.5 11 15" stroke="currentColor" strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.6871 16.5568H11.6971" stroke="currentColor" strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon = (props: SVGProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 8V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V8" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 8H21V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V8Z" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11H19" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RewardsIcon = (props: SVGProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.61473 8.63972L12.1556 11.5641L14.5004 14.5002" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.83203 4.99888V8.33146" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.1556 11.5641L12.1556 14.5002" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16573 2.49908V6.66517" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = (props: SVGProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3V6L7.5 7.5M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z" stroke="currentColor" strokeWidth="0.999927" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayCircleIcon = (props: SVGProps) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M24.0001 44C35.0458 44 44.0001 35.0457 44.0001 24C44.0001 12.9543 35.0458 4 24.0001 4C12.9544 4 4.00012 12.9543 4.00012 24C4.00012 35.0457 12.9544 44 24.0001 44Z" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.2061 18.1761L31.8444 24.0003L20.2061 29.8245V18.1761Z" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SignalIcon = (props: SVGProps) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.66622 6.66555L29.3284 6.66555" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.66622 13.3311L29.3284 13.3311" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66555 13.3317L23.9963 13.3317" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.3314 19.9963L20.6632 19.9963" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FiberIcon = (props: SVGProps) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9.33177 2.66622L22.6629 2.66622V9.33177C22.6629 17.3304 19.9966 22.6629 15.9973 26.6622C11.998 22.6629 9.33177 17.3304 9.33177 9.33177V2.66622Z" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.9973 26.6622L15.9973 29.3284" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.66622 9.33177L29.3284 9.33177" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.66622 25.3291L29.3284 25.3291" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon = (props: SVGProps) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6.66555 3.99933L25.3291 3.99933C25.3291 3.99933 27.9953 3.99933 27.9953 6.66555V25.3291C27.9953 27.9953 25.3291 27.9953 25.3291 27.9953L6.66555 27.9953C6.66555 27.9953 3.99933 27.9953 3.99933 25.3291V6.66555C3.99933 3.99933 6.66555 3.99933 6.66555 3.99933Z" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.9976 11.3323L19.9967 15.9973L12.9976 20.6623V11.3323Z" stroke="currentColor" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = (props: SVGProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.00031 2.00031V19.9987C2.00031 19.9987 2.00031 22 4.00031 22H19.9987C19.9987 22 22 22 22 19.9987V2.00031C22 2.00031 22 0.000305176 19.9987 0.000305176H4.00031C4.00031 0.000305176 2.00031 0.000305176 2.00031 2.00031Z" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.00031 5.00031H19.0003" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.00031 10.0003H19.0003" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.00031 15.0003H15.0003" stroke="currentColor" strokeWidth="1.99985" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = (props: SVGProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.99888 4.99888L14.9966 14.9966" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.99888 14.9966L14.9966 4.99888" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HomeIcon = (props: SVGProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.49832 9.99775L12.4972 9.99775" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.50005 1.66589L17.5003 1.66589V16.6629L2.50005 16.6629L2.50005 1.66589Z" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SubscriptionsIcon = (props: SVGProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.66629 4.16573L18.3326 4.16573V15.8302L1.66629 15.8302L1.66629 4.16573Z" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.66629 8.33146L18.3326 8.33146" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = (props: SVGProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.94791 1.94788C1.94791 1.94788 18.0521 1.94788 18.0521 1.94788V18.0521C18.0521 18.0521 18.0521 18.0521 18.0521 18.0521L1.94791 18.0521L1.94791 1.94788Z" stroke="currentColor" strokeWidth="1.94786" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = (props: SVGProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.55475 17.4961H11.4453" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.50005 1.66629V12.4972C2.50005 12.4972 2.50005 14.1635 4.16637 14.1635H15.8326C17.4989 14.1635 17.4989 12.4972 17.4989 12.4972V1.66629C17.4989 1.66629 17.4989 0 15.8326 0H4.16637C4.16637 0 2.50005 0 2.50005 1.66629Z" stroke="currentColor" strokeWidth="1.66629" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface TopBarProps {
  onCloseModal: () => void;
  showCloseButton?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onCloseModal, showCloseButton }) => (
  <div className="w-full h-[64.57px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 fixed top-0 left-0 z-30">
    <div className="flex items-center space-x-3">
      <div className="w-[39.99px] h-[39.99px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#155dfc] to-[#4f39f6]">
        <span className="text-white text-base font-medium font-inter">C1</span>
      </div>
      <h1 className="text-primary-dark font-inter text-4xl font-medium">Cignal One</h1>
    </div>
    {showCloseButton && (
      <button onClick={onCloseModal} aria-label="Close modal" className="w-[35.99px] h-[35.99px] rounded-full flex items-center justify-center">
        <CloseIcon className="text-secondary-gray w-5 h-5" />
      </button>
    )}
  </div>
);


interface TourModalProps {
  onNext: () => void;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
}

const TourModal: React.FC<TourModalProps> = ({ onNext, onClose, currentStep, totalSteps }) => (
  <div className="absolute top-[82px] left-1/2 -translate-x-1/2 w-[319.99px] bg-white rounded-2xl shadow-xl p-6 z-50">
    <div className="flex justify-end mb-4">
      <button onClick={onClose} aria-label="Close tour" className="text-light-gray-text hover:text-secondary-gray transition-colors">
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
    <div className="flex flex-col space-y-2 mb-6">
      <p className="font-inter text-base text-brand-blue">Step {currentStep} of {totalSteps}</p>
      <h3 className="font-inter text-2xl font-medium text-primary-dark">Omni Search</h3>
      <p className="font-inter text-base text-secondary-gray">Search across all your content, apps, and services</p>
    </div>
    <div className="flex justify-between items-center mt-6">
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-1.5 rounded-full ${i === currentStep - 1 ? 'bg-brand-blue' : 'bg-light-gray-text'}`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        className="bg-brand-blue text-white rounded-lg px-4 py-2 flex items-center space-x-2 font-inter text-base font-normal"
      >
        <span>Next</span>
        <ChevronRightIcon className="text-white w-4 h-4" />
      </button>
    </div>
  </div>
);


// --- Main Screen Component ---

export const OmniSearchScreen: React.FC = () => {
  const [showTourModal, setShowTourModal] = useState(true);
  const [currentTourStep, setCurrentTourStep] = useState(1);
  const totalTourSteps = 4; // Based on "Step 1 of 4" in JSON 2:4650

  const handleNextTourStep = () => {
    if (currentTourStep < totalTourSteps) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      setShowTourModal(false);
    }
  };

  const handleCloseTourModal = () => {
    setShowTourModal(false);
  };

  // Mock data for carousels
  const appCards = useMemo(() => [
    {
      id: '1',
      title: 'Cignal Postpaid',
      subtitle: 'Premium TV experience',
      gradient: 'from-[#155dfc] to-[#4f39f6]', // color-5 and similar
      icon: (props: SVGProps) => <SignalIcon {...props} />,
    },
    {
      id: '2',
      title: 'Cignal Prepaid',
      subtitle: 'Flexible TV plans',
      gradient: 'from-[#665efd] to-[#4239f6]', // Similar purple gradient
      icon: (props: SVGProps) => <SignalIcon {...props} />,
    },
    {
      id: '3',
      title: 'SatLite',
      subtitle: 'Mobile streaming',
      gradient: 'from-[#f6329a] to-[#e40076]', // Similar pink gradient
      icon: (props: SVGProps) => <PlayIcon {...props} />,
    },
    {
      id: '4',
      title: 'Pilipinas Live',
      subtitle: 'Local channels',
      gradient: 'from-[#00c850] to-[#00a63e]', // Similar green gradient
      icon: (props: SVGProps) => <PlayIcon {...props} />,
    },
    {
      id: '5',
      title: 'Cignal Super',
      subtitle: 'More channels',
      border: true,
      icon: (props: SVGProps) => <QuestionMarkCircleIcon {...props} className="text-medium-gray-text"/>,
    },
  ], []);

  const walletCards = useMemo(() => [
    { id: '1', label: 'Available', value: '2,450 pts', icon: (props: SVGProps) => <WalletIcon {...props} className="text-[#FFDE20]" /> }, // Yellow wallet icon
    { id: '2', label: 'Rewards', value: '15 Available', icon: (props: SVGProps) => <RewardsIcon {...props} className="text-[#FD6DCF]" /> }, // Pink rewards icon
  ], []);

  const entertainmentContent = useMemo(() => [
    {
      id: '1',
      title: 'The Latest Drama Series',
      genre: 'Drama',
      episodes: '8 Episodes',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Drama',
    },
    {
      id: '2',
      title: 'Comedy Night Special',
      genre: 'Comedy',
      duration: '2h 15m',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Comedy',
    },
    {
      id: '3',
      title: 'Reality Show Finale',
      genre: 'Reality',
      season: 'Season 5',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Reality',
    },
    {
      id: '4',
      title: 'Documentary: Nature',
      genre: 'Documentary',
      duration: '1h 45m',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Documentary',
    },
    // Add more mock data as needed
  ], []);

  const movieContent = useMemo(() => [
    {
      id: '1',
      title: 'Action Thriller 2024',
      genre: 'Action',
      duration: '2h 30m',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Action',
    },
    {
      id: '2',
      title: 'Romantic Comedy',
      genre: 'Romance',
      duration: '1h 55m',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Romance',
    },
    {
      id: '3',
      title: 'Sci-Fi Adventure',
      genre: 'Sci-Fi',
      duration: '2h 45m',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Sci-Fi',
    },
    {
      id: '4',
      title: 'Horror Mystery',
      genre: 'Horror',
      duration: '1h 40m',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Horror',
    },
  ], []);

  const sportsContent = useMemo(() => [
    {
      id: '1',
      title: 'NBA Finals Game 7',
      genre: 'Basketball',
      time: 'Live',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Basketball',
    },
    {
      id: '2',
      title: 'Premier League Match',
      genre: 'Football',
      time: 'Today 8PM',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Football',
    },
    {
      id: '3',
      title: 'Tennis Grand Slam',
      genre: 'Tennis',
      time: 'Live Now',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Tennis',
    },
    {
      id: '4',
      title: 'Boxing Championship',
      genre: 'Boxing',
      time: 'This Weekend',
      thumbnail: 'https://via.placeholder.com/192x112/364153/1D2939?text=Boxing',
    },
  ], []);

  const currentPlans = useMemo(() => [
    {
      id: '1',
      title: 'Cignal Postpaid Premium',
      price: '₱1,899/month',
      status: 'Active',
      statusColor: 'bg-light-green-bg text-green-text',
      details: [
        { label: 'Channels', value: '200+' },
        { label: 'Bill Due', value: 'Dec 15, 2025', valueColor: 'text-primary-dark' }, // Original design color for date
        { label: 'Amount Due', value: '₱1,899', valueColor: 'text-error-red' },
      ],
    },
    {
      id: '2',
      title: 'Cignal Fiber 100 Mbps',
      price: '₱1,699/month',
      status: 'Active',
      statusColor: 'bg-light-green-bg text-green-text',
      details: [
        { label: 'Speed', value: '100 Mbps' },
        { label: 'Valid Until', value: 'Dec 31, 2025' },
      ],
    },
    {
      id: '3',
      title: 'Cignal Play Unlimited',
      price: '₱399/month',
      status: 'Expiring',
      statusColor: 'bg-[#FFEBCC] text-[#C26200]', // Mapping 2:4451 colors
      details: [
        { label: 'Channels', value: '50+' },
        { label: 'Valid Until', value: 'Jan 5, 2026' },
      ],
    },
    {
      id: '4',
      title: 'Cignal Fiber 200 Mbps',
      price: '₱2,499/month',
      status: 'Active',
      statusColor: 'bg-light-green-bg text-green-text',
      details: [
        { label: 'Speed', value: '200 Mbps' },
        { label: 'Valid Until', value: 'Mar 15, 2026' },
      ],
    },
    // Add more mock data as needed
  ], []);

  const faqs = useMemo(() => [
    {
      id: '1',
      question: 'How do I upgrade my subscription?',
      answer:
        'Go to your Current Plans section, select the plan you wish to upgrade, and follow the on-screen instructions.',
    },
    {
      id: '2',
      question: 'What payment methods are accepted?',
      answer:
        'We accept credit cards, debit cards, GCash, PayMaya, and various bank transfers.',
    },
    {
      id: '3',
      question: 'Can I pause my subscription?',
      answer:
        'Yes, you can pause prepaid subscriptions. For postpaid, please contact customer support.',
    },
  ], []);

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-bg-light-gray overflow-hidden">
      {/* Overlay for the modal */}
      {showTourModal && (
        <div className="fixed inset-0 bg-black/70 z-40" aria-hidden="true" />
      )}

      {/* Main scrollable content */}
      <div className="relative w-full h-full overflow-y-auto pb-20 no-scrollbar"> {/* Added pb-20 to ensure content isn't hidden by BottomNav */}
        {/* TopBar */}
        <TopBar onCloseModal={handleCloseTourModal} showCloseButton={showTourModal} />

        {/* Content Carousels - Top sections */}
        <div className="pt-[64.57px] space-y-4"> {/* Padding top to offset fixed TopBar */}
          {/* Main Image Carousel */}
          <div className="relative w-full h-[255.99px]">
            <img
              src="https://via.placeholder.com/376x256/1D2939/FFFFFF?text=Action+Movies+Marathon"
              alt="New Release: Action Movies Marathon"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[.8] via-black/[.4] to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col space-y-2">
              <h2 className="font-inter text-3xl font-medium text-white">New Release: Action Movies Marathon</h2>
              <p className="font-inter text-base text-white/90">Stream the latest blockbusters</p>
            </div>
            <div className="absolute bottom-3 right-4 flex space-x-2">
              <div className="w-6 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
            </div>
          </div>

          {/* Current Plans Section */}
          <div className="bg-white border-t border-[#E5E7EB] py-4 overflow-x-auto whitespace-nowrap px-4 no-scrollbar">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <h2 className="font-inter text-3xl font-medium text-primary-dark">Current Plans</h2>
                <p className="font-inter text-base text-secondary-gray">Manage your active subscriptions</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg border border-[#E5E7EB]">
                  <ChevronRightIcon className="text-secondary-gray rotate-180" /> {/* Flip for left arrow */}
                </button>
                <button className="p-2 rounded-lg border border-[#E5E7EB]">
                  <ChevronRightIcon className="text-secondary-gray" />
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              {currentPlans.map((plan) => (
                <div key={plan.id} className="min-w-[280px] bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-light-blue-bg flex items-center justify-center">
                        <SignalIcon className="text-brand-blue w-8 h-8" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-inter text-base text-primary-dark">{plan.title}</p>
                        <p className="font-inter text-base text-secondary-gray">{plan.price}</p>
                      </div>
                    </div>
                    <span className={`font-inter text-xs font-medium px-2 py-1 rounded-full ${plan.statusColor}`}>
                      {plan.status}
                    </span>
                  </div>
                  <div className="border-t border-[#F5F5F5] pt-4 space-y-2 mb-4">
                    {plan.details.map((detail) => (
                      <div key={detail.label} className="flex justify-between items-center">
                        <p className="font-inter text-base text-secondary-gray">{detail.label}</p>
                        <p className={`font-inter text-base font-medium ${detail.valueColor || 'text-primary-dark'}`}>
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-bg-light-gray text-primary-dark rounded-lg px-4 py-2 font-inter text-base">
                      Manage
                    </button>
                    <button className="flex-1 bg-brand-blue text-white rounded-lg px-4 py-2 font-inter text-base">
                      Upgrade
                    </button>
                    {plan.details.some(detail => detail.label === 'Amount Due') && (
                      <button className="flex-1 bg-green-text text-white rounded-lg px-4 py-2 font-inter text-base">
                        Pay Bill
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Wallet Preview */}
          <div className="w-full bg-gradient-to-br from-[#155dfc] to-[#4f39f6] p-4 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <WalletIcon className="w-6 h-6 text-[#FFDE20]" />
                </div>
                <div className="flex flex-col">
                  <p className="font-inter text-base text-white/90">My Wallet</p>
                  <h3 className="font-inter text-2xl font-medium text-white">2,450 Points</h3>
                </div>
              </div>
              <button className="bg-white/20 rounded-lg px-4 py-2 flex items-center space-x-2 font-inter text-base font-normal">
                <span>View Wallet</span>
                <ChevronRightIcon className="text-white w-4 h-4" />
              </button>
            </div>

            <div className="flex space-x-4 overflow-x-auto whitespace-nowrap no-scrollbar">
              {walletCards.map((card) => (
                <div key={card.id} className="min-w-[166px] bg-white/10 rounded-2xl p-4 inline-block">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                    {card.icon({ className: 'w-6 h-6' })}
                  </div>
                  <p className="font-inter text-base text-white/90">{card.label}</p>
                  <h3 className="font-inter text-2xl font-medium text-white">{card.value}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Entertainment Carousel */}
          <div className="bg-white p-4">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <h3 className="font-inter text-2xl font-medium text-primary-dark">Entertainment</h3>
                <p className="font-inter text-base text-secondary-gray">Popular shows and series</p>
              </div>
              <button className="text-brand-blue font-inter text-base flex items-center space-x-1">
                <span>See All</span>
                <ChevronRightIcon className="text-brand-blue w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto whitespace-nowrap no-scrollbar">
              {entertainmentContent.map((item) => (
                <div key={item.id} className="min-w-[192px] bg-primary-dark rounded-2xl p-3 inline-block">
                  <div
                    className="w-full h-[112px] bg-gradient-to-br from-[#364153] to-[#1D2939] rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundImage: `url(${item.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <PlayCircleIcon className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <p className="font-inter text-base text-white mb-1">{item.title}</p>
                  <div className="flex justify-between items-center text-light-gray-text text-xs">
                    <span>{item.genre}</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3 text-medium-gray-text" />
                      <span>{item.episodes || item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Movies Carousel */}
          <div className="bg-white p-4">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <h3 className="font-inter text-2xl font-medium text-primary-dark">Movies</h3>
                <p className="font-inter text-base text-secondary-gray">Blockbusters and classics</p>
              </div>
              <button className="text-brand-blue font-inter text-base flex items-center space-x-1">
                <span>See All</span>
                <ChevronRightIcon className="text-brand-blue w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto whitespace-nowrap no-scrollbar">
              {movieContent.map((item) => (
                <div key={item.id} className="min-w-[192px] bg-primary-dark rounded-2xl p-3 inline-block">
                  <div
                    className="w-full h-[112px] bg-gradient-to-br from-[#364153] to-[#1D2939] rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundImage: `url(${item.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <PlayCircleIcon className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <p className="font-inter text-base text-white mb-1">{item.title}</p>
                  <div className="flex justify-between items-center text-light-gray-text text-xs">
                    <span>{item.genre}</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3 text-medium-gray-text" />
                      <span>{item.episodes || item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sports & Live Events Carousel */}
          <div className="bg-white p-4">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <h3 className="font-inter text-2xl font-medium text-primary-dark">Sports & Live Events</h3>
                <p className="font-inter text-base text-secondary-gray">Watch your favorite sports</p>
              </div>
              <button className="text-brand-blue font-inter text-base flex items-center space-x-1">
                <span>See All</span>
                <ChevronRightIcon className="text-brand-blue w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto whitespace-nowrap no-scrollbar">
              {sportsContent.map((item) => (
                <div key={item.id} className="min-w-[192px] bg-primary-dark rounded-2xl p-3 inline-block">
                  <div
                    className="w-full h-[112px] bg-gradient-to-br from-[#364153] to-[#1D2939] rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundImage: `url(${item.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <PlayCircleIcon className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <p className="font-inter text-base text-white mb-1">{item.title}</p>
                  <div className="flex justify-between items-center text-light-gray-text text-xs">
                    <span>{item.genre}</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3 text-medium-gray-text" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Carousel */}
          <div className="relative w-full h-[255.99px]">
            <img
              src="https://via.placeholder.com/376x256/1D2939/FFFFFF?text=Breaking+News+Coverage"
              alt="Breaking News Coverage"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[.8] via-black/[.4] to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col space-y-2">
              <h2 className="font-inter text-3xl font-medium text-white">Breaking News Coverage</h2>
              <p className="font-inter text-base text-white/90">24/7 news and updates</p>
            </div>
            <div className="absolute bottom-3 right-4 flex space-x-2">
              <div className="w-6 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-bg-light-gray p-4">
            <div className="flex items-center space-x-2 mb-4">
              <QuestionMarkCircleIcon className="w-6 h-6 text-primary-dark" />
              <h2 className="font-inter text-2xl font-medium text-primary-dark">Help & Support</h2>
            </div>
            <div className="flex border-b border-light-gray-text text-lg font-medium mb-4">
              <button className="text-brand-blue border-b-2 border-brand-blue pb-2 px-4 -mb-[2px] font-inter text-base">
                FAQs
              </button>
              <button className="text-secondary-gray pb-2 px-4 font-inter text-base">
                Diagnostics
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-4 text-primary-dark font-inter text-base font-normal"
                  >
                    <span>{faq.question}</span>
                    <ChevronRightIcon
                      className={`text-light-gray-text w-4 h-4 transition-transform ${
                        expandedFaq === faq.id ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <p className="px-4 pb-4 text-secondary-gray font-inter text-base font-normal">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full bg-white rounded-2xl border border-[#E5E7EB] text-primary-dark text-center py-3 mt-4 font-inter text-base font-medium">
              View All FAQs
            </button>
            <div className="bg-light-blue-bg border border-[#BDDAFC] rounded-2xl p-4 mt-4">
              <p className="font-inter text-base text-primary-dark mb-3">Still need help?</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-white border border-[#BDDAFC] rounded-xl text-brand-blue py-2 font-inter text-base">
                  Call Support
                </button>
                <button className="flex-1 bg-brand-blue text-white rounded-xl py-2 font-inter text-base">
                  Chat with Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Button */}
        <button className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-[#004ffc] shadow-xl flex items-center justify-center z-20">
          <ChatIcon className="text-white w-6 h-6" />
        </button>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E5E7EB] h-[64.55px] flex items-center justify-around px-2 z-30">
          <button className="flex flex-col items-center justify-center w-full py-2">
            <HomeIcon className="w-5 h-5 text-brand-blue" />
            <span className="font-inter text-xs text-brand-blue mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-2">
            <SubscriptionsIcon className="w-5 h-5 text-secondary-gray" />
            <span className="font-inter text-xs text-secondary-gray mt-1">Subscriptions</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-2">
            <RewardsIcon className="w-5 h-5 text-secondary-gray" />
            <span className="font-inter text-xs text-secondary-gray mt-1">Rewards</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-2">
            <HelpIcon className="w-5 h-5 text-secondary-gray" />
            <span className="font-inter text-xs text-secondary-gray mt-1">Help</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-2">
            <ProfileIcon className="w-5 h-5 text-secondary-gray" />
            <span className="font-inter text-xs text-secondary-gray mt-1">Profile</span>
          </button>
        </nav>
      </div>

      {/* Tour Modal rendered on top of everything if active */}
      {showTourModal && (
        <TourModal
          onNext={handleNextTourStep}
          onClose={handleCloseTourModal}
          currentStep={currentTourStep}
          totalSteps={totalTourSteps}
        />
      )}
    </div>
  );
};