// Suggested file path: src/components/PayMayaPayment.tsx

import React, { useState } from 'react';
// import { useMemo, useEffect } from 'react'; // Included in critical requirements but not directly used for static content.

// CRITICAL: Type definitions for React 19 and TypeScript 5.6.0.
// React.FC has implicitly `children` prop in React 18+, but explicit type for children is good practice.
interface CommonProps {
  children?: React.ReactNode;
  className?: string;
}

// --- Design System Constants ---
// CRITICAL: Using exact HEX codes as per design data. No conversions.
const COLOR = {
  white: '#ffffff', // color-1
  darkGray: '#101828', // color-2
  mediumGray: '#4a5565', // color-3
  green: '#00d632', // color-4
  lightGray: '#6a7282', // color-5
  blue: '#155dfc', // color-6
  offWhite: '#f9fafb', // color-7
  borderLightGray: '#e5e7eb', // color-8
  placeholderGray: '#99a1af', // color-9 (not directly used as placeholder color is darkGray with opacity)
  gradientGreenEnd: '#00b028', // From gradient stop, not in named color palette
  borderInput: '#d1d6de', // From input stroke color 3:10034
  borderHeader: '#e5e7eb', // color-8, also used for header border
  textInfoSmall: '#6a7282', // Match design for 3:10044
};

// CRITICAL: Using direct pixel values for typography as Tailwind might not have exact matches for specific line-heights and letter-spacings.
const TYPOGRAPHY_STYLES = {
  heading1: {
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: '500', // Medium
    lineHeight: '30px',
    letterSpacing: '-0.4492px',
    color: COLOR.darkGray, // color-2
  },
  body1: {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.mediumGray, // color-3
  },
  body1DarkGray: {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.darkGray, // color-2
  },
  body1Placeholder: {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '19px', // Specific to 3:10035, 3:10042 text elements which have 19px height
    letterSpacing: '-0.1504px',
    color: COLOR.darkGray, // color-2 with opacity 0.5
    opacity: 0.5,
  },
  bodySmall: { // "Receipt and payment confirmation..."
    fontFamily: 'Inter',
    fontSize: '12px', // Inferred from height 16px
    fontWeight: '400', // Regular
    lineHeight: '16px',
    letterSpacing: '-0.1504px',
    color: COLOR.textInfoSmall, // color-5 or equivalent from design data
  },
  cardTitle: { // PayMaya title in green card
    fontFamily: 'Inter',
    fontSize: '24px', // Inferred from height 28px
    fontWeight: '500', // Medium
    lineHeight: '28px',
    letterSpacing: '-0.4492px',
    color: COLOR.white, // color-1
  },
  cardSubtitle: { // Simple & Convenient Payment
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.white, // color-1 with opacity
    opacity: 0.9,
  },
  cardInfoText: { // You will be redirected to PayMaya...
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.white, // color-1 with opacity
    opacity: 0.95,
  },
  paymentTotalValue: { // ₱399/month in Payment Details (blue)
    fontFamily: 'Inter',
    fontSize: '16px', // Inferred from height 24px
    fontWeight: '500', // Medium
    lineHeight: '24px',
    letterSpacing: '-0.4492px',
    color: COLOR.blue, // color-6
  },
  nextStepNumber: { // 1, 2, 3 circles
    fontFamily: 'Inter',
    fontSize: '12px', // Inferred from height 16px
    fontWeight: '500', // Medium
    lineHeight: '16px',
    letterSpacing: '-0.1504px',
    color: COLOR.white, // color-1
  },
  nextStepText: {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.mediumGray, // color-3
  },
  benefitText: {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.mediumGray, // color-3
  },
  buttonTextDisabled: {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400', // Regular
    lineHeight: '20px',
    letterSpacing: '-0.1504px',
    color: COLOR.lightGray, // color-5
  },
};

// Helper for applying typography styles as inline styles for pixel-perfect match.
// Note: 'Inter' font would need to be configured in tailwind.config.js or imported globally.
// Assuming it's available for rendering.
const getTypographyStyles = (type: keyof typeof TYPOGRAPHY_STYLES): React.CSSProperties => {
  const style = TYPOGRAPHY_STYLES[type];
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    color: style.color,
    opacity: style.opacity !== undefined ? style.opacity : 1,
  };
};

// --- Icons as React Components for reusability ---
interface IconProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
  width?: string;
  height?: string;
  ariaLabel?: string;
}

const BackArrowIcon: React.FC<IconProps> = ({ className = '', color = COLOR.darkGray, strokeWidth = 2, width = '6px', height = '12px', ariaLabel = 'Go back' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 6 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={ariaLabel}
  >
    <path
      d="M5 11L1 6L5 1"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon: React.FC<IconProps> = ({ className = '', color = COLOR.green, strokeWidth = 2.6662, width = '32px', height = '32px', ariaLabel = 'Checked' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32" // Adjusted viewbox to contain the checkmark clearly
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={ariaLabel}
  >
    <path
      d="M25 6L11.6667 25L7 19.3333" // Simplified and scaled path for clarity
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SmallCheckIcon: React.FC<IconProps> = ({ className = '', color = COLOR.blue, strokeWidth = 1.3327, width = '16px', height = '16px', ariaLabel = 'Benefit check' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16" // Adjusted viewbox for the small icon
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={ariaLabel}
  >
    <path
      d="M13.3333 4L6 11.3333L2.66667 8" // Simplified and scaled path for clarity
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


// --- Sub-components ---

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => (
  <div
    className="flex items-center gap-3.5 px-4 py-6 border-b bg-white"
    style={{ borderColor: COLOR.borderHeader, height: '98.576px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '24px', paddingBottom: '24px' }}
  >
    <button
      onClick={onBack}
      className="p-2 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Back"
      style={{ width: '32px', height: '32px' }}
    >
      <BackArrowIcon />
    </button>
    <div className="flex flex-col" style={{ gap: '0' }}>
      <h1 className="font-medium" style={getTypographyStyles('heading1')}>
        PayMaya Payment
      </h1>
      <p style={getTypographyStyles('body1')}>
        Pay with your PayMaya account
      </p>
    </div>
  </div>
);

const PayMayaCard: React.FC<CommonProps> = () => (
  <div
    className="mx-4 mt-6 p-6 rounded-xl flex flex-col justify-between"
    style={{
      width: 'calc(100% - 32px)', // 344.1265px
      height: '191.977px',
      background: `linear-gradient(116.565deg, ${COLOR.green} 0%, ${COLOR.gradientGreenEnd} 100%)`,
      borderRadius: '14px',
      padding: '24px',
    }}
  >
    <div className="flex items-center gap-4">
      <div
        className="flex items-center justify-center bg-white rounded-xl"
        style={{ width: '64px', height: '64px', borderRadius: '12px' }}
      >
        <CheckIcon color={COLOR.green} />
      </div>
      <div className="flex flex-col" style={{ gap: '0' }}>
        <h2 style={getTypographyStyles('cardTitle')}>PayMaya</h2>
        <p style={getTypographyStyles('cardSubtitle')}>Simple & Convenient Payment</p>
      </div>
    </div>
    <div
      className="p-3 rounded-lg"
      style={{ background: `${COLOR.white}1A`, borderRadius: '8px', minHeight: '64px' }} // 0.1 opacity
    >
      <p style={getTypographyStyles('cardInfoText')}>
        You will be redirected to PayMaya to complete payment.
      </p>
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  infoText?: string;
  type?: React.HTMLInputTypeAttribute;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  prefix,
  infoText,
  type = 'text',
}) => (
  <div className="flex flex-col mx-4 mt-6" style={{ gap: '8px', width: 'calc(100% - 32px)' }}> {/* 344.1265px */}
    <label htmlFor={label} style={getTypographyStyles('body1DarkGray')}>
      {label}
    </label>
    <div
      className="flex items-center border rounded-lg overflow-hidden"
      style={{
        borderColor: COLOR.borderInput,
        height: '52px',
        paddingLeft: prefix ? '0px' : '16px',
        borderRadius: '8px',
        borderWidth: '0.5822px',
      }}
    >
      {prefix && (
        <span className="pl-4 pr-2" style={getTypographyStyles('body1')}>
          {prefix}
        </span>
      )}
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-white focus:outline-none"
        style={{
          ...getTypographyStyles('body1Placeholder'), // For placeholder style
          color: value ? getTypographyStyles('body1DarkGray').color : getTypographyStyles('body1Placeholder').color,
          opacity: value ? 1 : getTypographyStyles('body1Placeholder').opacity,
          height: '100%',
          paddingRight: '16px', // Align with design spacing
        }}
        aria-label={label}
      />
    </div>
    {infoText && (
      <p style={getTypographyStyles('bodySmall')} className="mt-1">
        {infoText}
      </p>
    )}
  </div>
);

interface PaymentDetailItemProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

const PaymentDetailItem: React.FC<PaymentDetailItemProps> = ({ label, value, isTotal = false }) => (
  <div
    className={`flex justify-between items-center ${isTotal ? 'py-3 border-t' : ''}`}
    style={{ borderColor: COLOR.borderLightGray, paddingTop: isTotal ? '12px' : '0px', paddingBottom: isTotal ? '12px' : '0px' }}
  >
    <p style={isTotal ? getTypographyStyles('body1DarkGray') : getTypographyStyles('body1')}>
      {label}
    </p>
    <p style={isTotal ? getTypographyStyles('paymentTotalValue') : getTypographyStyles('body1DarkGray')}>
      {value}
    </p>
  </div>
);

const PaymentDetailsCard: React.FC<CommonProps> = () => (
  <div
    className="bg-white mx-4 mt-6 p-4 rounded-xl border flex flex-col"
    style={{
      width: 'calc(100% - 32px)', // 344.1265px
      borderRadius: '14px',
      borderColor: COLOR.borderLightGray,
      borderWidth: '0.5822px',
      padding: '16px',
      gap: '12px',
    }}
  >
    <h3 style={getTypographyStyles('body1DarkGray')}>
      Payment Details
    </h3>
    <div className="flex flex-col" style={{ gap: '12px' }}>
      <PaymentDetailItem label="Subscription" value="Premium Plan" />
      <PaymentDetailItem label="Amount" value="₱399/month" />
      <PaymentDetailItem label="Convenience Fee" value="₱0.00" />
      <PaymentDetailItem label="Total Amount" value="₱399/month" isTotal />
    </div>
  </div>
);

interface NextStepItemProps {
  stepNumber: number;
  text: string;
}

const NextStepItem: React.FC<NextStepItemProps> = ({ stepNumber, text }) => (
  <div className="flex items-center" style={{ gap: '12px', minHeight: '26px' }}>
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full"
      style={{ backgroundColor: COLOR.green, width: '24px', height: '24px' }}
    >
      <span style={getTypographyStyles('nextStepNumber')}>{stepNumber}</span>
    </div>
    <p style={getTypographyStyles('nextStepText')}>
      {text}
    </p>
  </div>
);

const NextStepsCard: React.FC<CommonProps> = () => (
  <div
    className="mx-4 mt-6 p-4 rounded-xl flex flex-col"
    style={{
      width: 'calc(100% - 32px)', // 344.1265px
      backgroundColor: COLOR.offWhite, // color-7
      borderRadius: '14px',
      padding: '16px',
      gap: '12px',
    }}
  >
    <h3 style={getTypographyStyles('body1DarkGray')}>
      Next Steps
    </h3>
    <div className="flex flex-col" style={{ gap: '12px' }}>
      <NextStepItem stepNumber={1} text="Review and confirm your payment details" />
      <NextStepItem stepNumber={2} text="You will be redirected to PayMaya" />
      <NextStepItem stepNumber={3} text="Log in and authorize the payment" />
    </div>
  </div>
);

interface BenefitItemProps {
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ text }) => (
  <div className="flex items-center" style={{ gap: '8px', minHeight: '20px' }}>
    <SmallCheckIcon color={COLOR.blue} />
    <p style={getTypographyStyles('benefitText')}>{text}</p>
  </div>
);

const BenefitSection: React.FC<CommonProps> = () => (
  <div
    className="mx-4 mt-6 flex flex-col"
    style={{ width: 'calc(100% - 32px)', gap: '8px' }}
  >
    <BenefitItem text="Real-time payment processing" />
    <BenefitItem text="No hidden charges" />
    <BenefitItem text="Bank-level security protection" />
  </div>
);

interface FooterButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

const FooterButton: React.FC<FooterButtonProps> = ({ label, onClick, disabled }) => (
  <div
    className="w-full border-t flex items-center justify-center px-4 bg-white"
    style={{
      borderColor: COLOR.borderHeader, // color-8
      marginTop: 'auto', // Push to bottom
      minHeight: '76.56px',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '16.575px',
      paddingBottom: '16.575px',
    }}
  >
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-lg flex items-center justify-center`}
      style={{
        backgroundColor: disabled ? COLOR.borderLightGray : COLOR.blue, // Conditional color for active state
        borderRadius: '8px',
        height: '44px',
      }}
    >
      <span style={getTypographyStyles('buttonTextDisabled')}>{label}</span>
    </button>
  </div>
);


// --- Main Component ---
export interface PayMayaPaymentProps {
  // Define any top-level props here if needed, e.g., initial mobile number, email, callback for completion.
}

export const PayMayaPayment: React.FC<PayMayaPaymentProps> = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleBack = () => {
    // console.log('Navigating back...');
    // Implement actual navigation logic here (e.g., router.back())
  };

  const handleContinue = () => {
    // console.log('Continuing to PayMaya with:', { mobileNumber, email });
    // Implement payment redirection logic here
  };

  // Simple validation for button enablement
  const isFormValid = mobileNumber.length > 0 && email.length > 0;

  return (
    <div
      className="w-full max-w-[377px] mx-auto bg-white shadow-lg flex flex-col overflow-hidden"
      style={{ minHeight: '1203px', width: '377px' }} // Explicit width and min-height as per design frame
    >
      <Header onBack={handleBack} />

      <main className="flex-1 flex flex-col items-center pb-6"> {/* Added pb-6 for consistent bottom spacing before footer */}
        <PayMayaCard />

        <InputField
          label="PayMaya Mobile Number"
          placeholder="0917 123 4567"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          prefix="+63"
          type="tel"
        />

        <InputField
          label="Email Address"
          placeholder="juan.delacruz@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          infoText="Receipt and payment confirmation will be sent to this email."
          type="email"
        />

        <PaymentDetailsCard />

        <NextStepsCard />

        <BenefitSection />
      </main>

      <FooterButton
        label="Continue to PayMaya"
        onClick={handleContinue}
        disabled={!isFormValid}
      />
    </div>
  );
};