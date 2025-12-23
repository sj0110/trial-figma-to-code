// src/components/PayMayaPayment.tsx
import { useState, useMemo } from 'react';

interface PayMayaPaymentProps {
  initialMobileNumber?: string;
  initialEmailAddress?: string;
  onContinueToPayMaya?: (mobile: string, email: string) => void;
  onBack?: () => void;
}

interface DesignColors {
  white: string;
  darkBlueGray: string;
  grayishBlue: string;
  green: string;
  blue: string;
  red: string;
  mediumGray: string;
  lightGray: string;
  borderGray: string;
  gradientStop1: string;
  gradientStop2: string;
  inputBorderDefault: string;
  inputPlaceholder: string;
}

interface DesignTypography {
  heading: string;
  subheading: string;
  bodyStrong: string;
  bodyNormal: string;
  bodySmall: string;
  buttonText: string;
  blueText: string;
  redText: string;
  whiteText: string;
  infoWhiteText: string;
}

// Extracted Design System
const colors: DesignColors = {
  white: '#ffffff',
  darkBlueGray: '#101828',
  grayishBlue: '#4a5565',
  green: '#00d632',
  blue: '#155dfc',
  red: '#e7000b',
  mediumGray: '#6a7282',
  lightGray: '#f9fafb',
  borderGray: '#e5e7eb', // Found by converting r: 0.8983431458473206, g: 0.9064381718635559, b: 0.9226285219192505
  gradientStop1: '#00d632', // color-4
  gradientStop2: '#00b228', // Converted from r: 0, g: 0.6901960968971252, b: 0.1568627506494522
  inputBorderDefault: '#d0d6df', // Converted from r: 0.8190176486968994, g: 0.835814893245697, b: 0.8610087633132935
  inputPlaceholder: '#10182880', // color-2 with 50% opacity
};

const typography: DesignTypography = {
  heading: 'font-inter text-[20px] font-medium leading-[30px] tracking-[-0.4492px] text-[#101828]',
  subheading: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#4a5565]',
  bodyStrong: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#101828]',
  bodyNormal: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#4a5565]',
  bodySmall: 'font-inter text-[12px] font-normal leading-[16px] tracking-[-0.1504px] text-[#6a7282]', // Derived from helper text
  buttonText: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#ffffff]',
  blueText: 'font-inter text-[16px] font-medium leading-[24px] tracking-[-0.1504px] text-[#155dfc]', // From Total Amount
  redText: 'font-inter text-[12px] font-normal leading-[16px] tracking-[-0.1504px] text-[#e7000b]', // From error text
  whiteText: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#ffffff]', // For PayMaya card body text
  infoWhiteText: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#ffffff]/95', // For PayMaya card info text with opacity
};

// Helper for back button icon (Vector 3:10390)
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke={colors.darkBlueGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Helper for checkmark icon (Vector 3:10477)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66546 8.00033L6.66546 12.0003L13.3321 4.00033" stroke={colors.blue} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Helper for PayMaya card icon (Vector 3:10400, 3:10401)
const PayMayaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.3283 13.332L21.3283 26.6653H6.66162L10.6616 13.332L25.3283 13.332Z" stroke={colors.green} strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.9973 23.996V23.996" stroke={colors.green} strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Header = ({ onBack }: { onBack?: () => void }) => (
  <div className={`flex items-center gap-[12px] p-[24px] border-b border-[#e5e7eb] bg-[${colors.white}]`}>
    <button
      onClick={onBack}
      className="flex h-[32px] w-[32px] items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
      aria-label="Back"
    >
      <BackIcon />
    </button>
    <div className="flex flex-col">
      <h2 className={typography.heading}>PayMaya Payment</h2>
      <p className={typography.subheading}>Pay with your PayMaya account</p>
    </div>
  </div>
);

interface PaymentCardProps {
  title: string;
  description: string;
  infoText: string;
}

const PaymentCard = ({ title, description, infoText }: PaymentCardProps) => (
  <div className={`mx-[16px] flex flex-col gap-[16px] rounded-[14px] bg-gradient-to-r from-[${colors.gradientStop1}] to-[${colors.gradientStop2}] p-[24px]`}>
    <div className="flex items-center gap-[16px]">
      <div className={`flex h-[64px] w-[64px] items-center justify-center rounded-[12px] bg-[${colors.white}]`}>
        <PayMayaIcon />
      </div>
      <div className="flex flex-col">
        <h3 className={`text-[18px] font-medium leading-[28px] tracking-[-0.1504px] text-[${colors.white}]`}>{title}</h3>
        <p className={typography.whiteText}>{description}</p>
      </div>
    </div>
    <div className={`rounded-[8px] bg-[${colors.white}]/[0.1] px-[16px] py-[12px]`}>
      <p className={typography.infoWhiteText}>{infoText}</p>
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  prefix?: string;
  id: string;
  type?: 'text' | 'email' | 'tel';
}

const InputField = ({ label, value, onChange, placeholder, error, helperText, prefix, id, type = 'text' }: InputFieldProps) => (
  <div className="flex flex-col gap-[8px]">
    <label htmlFor={id} className={typography.bodyStrong}>{label}</label>
    <div className={`relative flex items-center rounded-[8px] border-[0.58px] bg-[${colors.white}] ${error ? `border-[${colors.red}]` : `border-[${colors.inputBorderDefault}]`} focus-within:ring-2 focus-within:ring-[#155dfc]`}>
      {prefix && <span className={`pl-[16px] pr-[8px] ${typography.bodyNormal}`}>{prefix}</span>}
      <input
        id={id}
        type={type}
        className={`w-full appearance-none rounded-[8px] py-[16px] ${prefix ? 'pl-0' : 'pl-[16px]'} pr-[16px] ${typography.bodyNormal} outline-none focus:outline-none ${value ? `text-[${colors.darkBlueGray}]` : `text-[${colors.inputPlaceholder}]`}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error}
        aria-describedby={helperText ? `${id}-helper-text` : undefined}
      />
    </div>
    {helperText && (
      <p id={`${id}-helper-text`} className={error ? typography.redText : typography.bodySmall}>
        {helperText}
      </p>
    )}
  </div>
);

interface PaymentSummaryProps {
  subscription: string;
  amount: string;
  convenienceFee: string;
  totalAmount: string;
}

const PaymentSummaryCard = ({ subscription, amount, convenienceFee, totalAmount }: PaymentSummaryProps) => (
  <div className={`mx-[16px] flex flex-col gap-[12px] rounded-[14px] border-[0.58px] border-[${colors.borderGray}] bg-[${colors.white}] p-[16px]`}>
    <h3 className={typography.bodyStrong}>Payment Details</h3>
    <div className="flex flex-col gap-[12px]">
      <div className="flex justify-between">
        <p className={typography.bodyNormal}>Subscription</p>
        <p className={typography.bodyStrong}>{subscription}</p>
      </div>
      <div className="flex justify-between">
        <p className={typography.bodyNormal}>Amount</p>
        <p className={typography.bodyStrong}>{amount}</p>
      </div>
      <div className="flex justify-between border-b border-dashed border-[#e5e7eb] pb-[12px]">
        <p className={typography.bodyNormal}>Convenience Fee</p>
        <p className={typography.bodyStrong}>{convenienceFee}</p>
      </div>
      <div className="flex justify-between">
        <p className={typography.bodyStrong}>Total Amount</p>
        <p className={typography.blueText}>{totalAmount}</p>
      </div>
    </div>
  </div>
);

interface StepProps {
  stepNumber: number;
  text: string;
}

const Step = ({ stepNumber, text }: StepProps) => (
  <div className="flex items-center gap-[12px]">
    <div className={`flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[${colors.green}]`}>
      <span className={`text-[12px] font-normal leading-[16px] tracking-[-0.1504px] text-[${colors.white}]`}>{stepNumber}</span>
    </div>
    <p className={typography.bodyNormal}>{text}</p>
  </div>
);

const NextStepsCard = () => (
  <div className={`mx-[16px] flex flex-col gap-[12px] rounded-[14px] bg-[${colors.lightGray}] p-[16px]`}>
    <h3 className={typography.bodyStrong}>Next Steps</h3>
    <div className="flex flex-col gap-[12px]">
      <Step stepNumber={1} text="Review and confirm your payment details" />
      <Step stepNumber={2} text="You will be redirected to PayMaya" />
      <Step stepNumber={3} text="Log in and authorize the payment" />
    </div>
  </div>
);

interface InfoBulletProps {
  text: string;
}

const InfoBullet = ({ text }: InfoBulletProps) => (
  <div className="flex items-center gap-[8px]">
    <div className="h-[16px] w-[16px] flex items-center justify-center">
      <CheckIcon />
    </div>
    <p className={typography.bodyNormal}>{text}</p>
  </div>
);

const FooterInfo = () => (
  <div className="mx-[16px] mt-[16px] flex flex-col gap-[8px]">
    <InfoBullet text="Real-time payment processing" />
    <InfoBullet text="No hidden charges" />
    <InfoBullet text="Bank-level security protection" />
  </div>
);

export const PayMayaPayment = ({
  initialMobileNumber = '',
  initialEmailAddress = '',
  onContinueToPayMaya,
  onBack,
}: PayMayaPaymentProps) => {
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);
  const [emailAddress, setEmailAddress] = useState(initialEmailAddress);
  const [mobileError, setMobileError] = useState(false);

  useMemo(() => {
    // Basic validation for mobile number (starts with '09')
    if (mobileNumber && !mobileNumber.startsWith('09')) {
      setMobileError(true);
    } else {
      setMobileError(false);
    }
  }, [mobileNumber]);

  const handleContinue = () => {
    if (!mobileError && onContinueToPayMaya) {
      onContinueToPayMaya(mobileNumber, emailAddress);
    } else if (mobileError) {
      // Optionally, show a toast or alert for the error
      console.error('Mobile number is invalid.');
    }
  };

  return (
    <div className={`flex min-h-screen w-[376px] flex-col bg-[${colors.white}]`}>
      <Header onBack={onBack} />

      <main className="flex flex-1 flex-col gap-[24px] py-[24px]">
        <PaymentCard
          title="PayMaya"
          description="Simple & Convenient Payment"
          infoText="You will be redirected to PayMaya to complete payment"
        />

        <div className="flex flex-col gap-[16px] px-[16px]">
          <InputField
            id="mobile-number"
            label="PayMaya Mobile Number"
            type="tel"
            prefix="+63"
            placeholder="3454 321 3454"
            value={mobileNumber}
            onChange={setMobileNumber}
            error={mobileError}
            helperText={mobileError ? 'Mobile number must start with 09' : undefined}
          />
          <InputField
            id="email-address"
            label="Email Address"
            type="email"
            placeholder="abcd@searce.com"
            value={emailAddress}
            onChange={setEmailAddress}
            helperText="Receipt and payment confirmation will be sent to this email address"
          />
        </div>

        <PaymentSummaryCard
          subscription="Premium Plan"
          amount="₱399/month"
          convenienceFee="₱0.00"
          totalAmount="₱399/month"
        />

        <NextStepsCard />
      </main>

      <footer className={`flex flex-col border-t border-[${colors.borderGray}] bg-[${colors.white}] pb-[16px] pt-[24px]`}>
        <FooterInfo />
        <div className="px-[16px] pt-[24px]">
          <button
            onClick={handleContinue}
            className={`w-full rounded-[8px] bg-[${colors.blue}] py-[12px] text-center ${typography.buttonText} transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#155dfc] disabled:opacity-50`}
            disabled={mobileError || !mobileNumber} // Disable if mobile has error or is empty
          >
            Continue to PayMaya
          </button>
        </div>
      </footer>
    </div>
  );
};