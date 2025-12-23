// src/components/6-2-payment-method-selector.tsx
import React, { useState, useMemo } from 'react';

// --- Utils & Types ---

// The prompt explicitly states: "NO CONVERSION: Do NOT convert HEX to rgb(), rgba(), or hsl()",
// and "You MUST use the exact HEX codes provided in designData".
// The designData.designSystem.colors provides hex values.
// For fills/strokes that provide RGB, we convert them once to hex to adhere to the "exact HEX" rule.
const colors = {
  white: '#ffffff', // color-1
  darkText: '#101828', // color-2
  grayText: '#4a5565', // color-3
  lightGrayBg: '#f3f3f5', // color-4
  primaryBlue: '#155dfc', // color-5
  veryLightGrayBg: '#f9fafb', // color-6
  borderLight: '#E5E7EB', // Derived from `rgb(0.898...0.922)` found in multiple stroke colors
  borderMedium: '#D1D4DB', // Derived from `rgb(0.819...0.861)` found in unselected radio button strokes
};

// Base typography classes based on designSystem.typography
const typography = {
  heading1: `font-['Inter'] text-[20px] font-medium leading-[30px] tracking-[-0.4492px]`,
  paragraph: `font-['Inter'] text-[16px] font-normal leading-[24px] tracking-[-0.3125px]`,
};

interface PaymentMethodOptionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
  id,
  icon,
  title,
  description,
  isSelected,
  onSelect,
}) => {
  const borderColor = isSelected ? colors.primaryBlue : colors.borderLight;
  const borderWidth = isSelected ? 'border-[1.74665px]' : 'border-[0.58222px]';
  const radioBorderColor = isSelected ? colors.primaryBlue : colors.borderMedium;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(id)}
      className={`
        flex flex-col items-start
        w-[361.593px] h-[83.475px]
        bg-[${colors.white}]
        border-[${borderColor}] ${borderWidth}
        rounded-[14px]
        overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-[${colors.primaryBlue}] focus:ring-offset-1
        ${isSelected ? 'h-[83.475px]' : 'h-[81.146px]'}
      `}
      style={{
        marginBottom: isSelected ? '12px' : '12px', // Approx spacing from Figma data
      }}
    >
      <div
        className="
          flex flex-row items-center justify-between
          w-[326.114px] h-[47.996px]
          mt-[17.739px] ml-[17.739px]
          mr-[17.739px] mb-[17.739px]
          gap-[15.993px]
        "
        // Adjust margin to achieve internal spacing consistent with Figma relative transforms
        style={{
          width: 'calc(100% - 2 * 17.739px)',
          height: 'calc(100% - 2 * 17.739px)',
          marginTop: isSelected ? '17.739px' : '16.575px', // Adjust to match parent container offset
          marginLeft: isSelected ? '17.739px' : '16.575px',
          marginRight: isSelected ? '17.739px' : '16.575px',
          marginBottom: isSelected ? '17.739px' : '16.575px',
        }}
      >
        {/* Icon Container (3:9706, 3:9719, 3:9731) */}
        <div
          className={`
            flex items-center justify-center
            w-[47.996px] h-[47.996px]
            bg-[${colors.lightGrayBg}]
            rounded-[8px]
          `}
        >
          {icon}
        </div>

        {/* Text Content Container (3:9710, 3:9723, 3:9735) */}
        <div
          className="
            flex flex-col flex-grow
            h-[39.991px]
            mt-[4.003px]
            gap-[0.000005722px]
            items-start
          "
        >
          <p className={`${typography.paragraph} text-[${colors.darkText}]`}>{title}</p>
          <p className={`${typography.paragraph} text-[${colors.grayText}]`}>{description}</p>
        </div>

        {/* Radio Button Container (3:9715, 3:9728, 3:9740, 3:9752) */}
        <div
          className={`
            flex items-center justify-center
            w-[19.996px] h-[19.996px]
            border-[${radioBorderColor}] border-[1.74665px]
            rounded-full
            mt-[14.000px]
          `}
        >
          {isSelected && (
            <div className={`w-[7.996px] h-[7.996px] bg-[${colors.white}] rounded-full`} />
          )}
        </div>
      </div>
    </button>
  );
};

// Cignal Wallet Icon Component
const CignalWalletIcon: React.FC = () => (
  <div
    className="relative w-[23.998px] h-[23.998px]"
    style={{
      transform: 'translate(11.999px, 11.999px)', // Relative transform for the Icon frame
    }}
  >
    {/* Vector 1 (3:9708) */}
    <div
      className="absolute border-solid border-[1.99985px] border-[${colors.primaryBlue}]"
      style={{
        left: '3px',
        top: '3px',
        width: '18.9986px',
        height: '12.9991px',
        borderRadius: '3px', // Assuming a slight curve for typical wallet icons
      }}
    />
    {/* Vector 2 (3:9709) */}
    <div
      className="absolute border-solid border-[1.99985px] border-[${colors.primaryBlue}]"
      style={{
        left: '2.9998px',
        top: '4.9996px',
        width: '17.9987px',
        height: '15.9988px',
        borderRadius: '2px', // Assuming a slight curve
      }}
    />
  </div>
);

// Credit/Debit Card Icon Component
const CreditCardIcon: React.FC = () => (
  <div
    className="relative w-[23.998px] h-[23.998px]"
    style={{
      transform: 'translate(11.999px, 11.999px)',
    }}
  >
    {/* Vector 1 (3:9721) */}
    <div
      className="absolute border-solid border-[1.99985px] border-[${colors.primaryBlue}]"
      style={{
        left: '1.9999px',
        top: '4.9996px',
        width: '19.9985px',
        height: '13.999px',
        borderRadius: '2px', // Represents card shape
      }}
    />
    {/* Vector 2 (3:9722) - horizontal line */}
    <div
      className="absolute border-t-[1.99985px] border-solid border-t-[${colors.primaryBlue}]"
      style={{
        left: '1.9999px',
        top: '9.9993px',
        width: '19.9985px',
        height: '0px',
      }}
    />
  </div>
);

// GCash/PayMaya Icon Component (same structure based on data)
const GCashPayMayaIcon: React.FC = () => (
  <div
    className="relative w-[23.998px] h-[23.998px]"
    style={{
      transform: 'translate(11.999px, 11.999px)',
    }}
  >
    {/* Vector 1 (3:9733, 3:9745) */}
    <div
      className="absolute border-solid border-[1.99985px] border-[${colors.primaryBlue}]"
      style={{
        left: '4.9996px',
        top: '1.9999px',
        width: '13.999px',
        height: '19.9985px',
        borderRadius: '2px', // Represents a phone or wallet shape
      }}
    />
    {/* Vector 2 (3:9734, 3:9746) - bottom dot/line */}
    <div
      className="absolute border-t-[1.99985px] border-solid border-t-[${colors.primaryBlue}]"
      style={{
        left: '11.9991px',
        top: '17.9987px',
        width: '0.01px', // Very small width as per JSON
        height: '0px',
      }}
    />
  </div>
);

interface PaymentMethodSelectorProps {
  // Can add props here if the header/summary content needs to be dynamic
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cignalWallet'); // 'cignalWallet' is selected in design

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  return (
    <div
      className="
        flex flex-col
        w-[393.578552px] h-[852.365417px]
        bg-[${colors.white}]
        overflow-hidden
        font-['Inter']
      "
      aria-label="Payment Method Selector"
    >
      {/* Header Section (3:9688) */}
      <div
        className={`
          flex flex-col
          w-full h-[110.5757px]
          bg-[${colors.white}]
          border-b-[1px] border-solid border-[${colors.borderLight}]
          overflow-hidden
        `}
      >
        <div
          className="
            flex flex-col items-start
            w-[361.593px] h-[61.997px]
            mt-[23.998px] ml-[15.993px]
            gap-[7.996px]
          "
        >
          {/* Choose Payment Method (3:9691) */}
          <h1 className={`${typography.heading1} text-[${colors.darkText}]`}>
            Choose Payment Method
          </h1>
          {/* Select how you want to pay (3:9693) */}
          <p className={`${typography.paragraph} text-[${colors.grayText}]`}>
            Select how you want to pay for your subscription
          </p>
        </div>
      </div>

      {/* Plan Summary Section (3:9694) */}
      <div
        className={`
          flex flex-col
          w-full h-[72.55877px]
          bg-[${colors.veryLightGrayBg}]
          border-b-[1px] border-solid border-[${colors.borderLight}]
          overflow-hidden
        `}
      >
        <div
          className="
            flex flex-row items-center justify-between
            w-[361.593px] h-[39.991px]
            mt-[15.993px] ml-[15.993px]
            mr-[15.993px] mb-[15.993px]
            gap-[131.053px]
          "
        >
          {/* Left: Plan Name and Subscription Type (3:9696) */}
          <div className="flex flex-col h-[39.991px] items-start">
            <p className={`${typography.paragraph} text-[${colors.darkText}]`}>
              Premium Plan
            </p>
            <p className={`${typography.paragraph} text-[${colors.grayText}]`}>
              Monthly subscription
            </p>
          </div>
          {/* Right: Price (3:9701) */}
          <p className={`${typography.paragraph} text-[${colors.darkText}] mt-[7.996px]`}>
            ₱399/month
          </p>
        </div>
      </div>

      {/* Payment Method Options (3:9703) */}
      <div
        className="
          flex flex-col items-center
          w-[361.593px] h-[362.912px]
          mt-[207.133px] ml-[15.993px]
          relative // For positioning later elements if needed
        "
      >
        <PaymentMethodOption
          id="cignalWallet"
          icon={<CignalWalletIcon />}
          title="Cignal Wallet"
          description="Pay using your Cignal Wallet points"
          isSelected={selectedMethod === 'cignalWallet'}
          onSelect={handleSelectMethod}
        />
        <PaymentMethodOption
          id="creditDebitCard"
          icon={<CreditCardIcon />}
          title="Credit/Debit Card"
          description="Visa, Mastercard, Amex accepted"
          isSelected={selectedMethod === 'creditDebitCard'}
          onSelect={handleSelectMethod}
        />
        <PaymentMethodOption
          id="gcash"
          icon={<GCashPayMayaIcon />}
          title="GCash"
          description="Pay with your GCash account"
          isSelected={selectedMethod === 'gcash'}
          onSelect={handleSelectMethod}
        />
        <PaymentMethodOption
          id="paymaya"
          icon={<GCashPayMayaIcon />} // Reusing as they share structure in JSON
          title="PayMaya"
          description="Pay with your PayMaya account"
          isSelected={selectedMethod === 'paymaya'}
          onSelect={handleSelectMethod}
        />
      </div>

      {/* Continue Button Section (3:9753) */}
      <div
        className={`
          flex flex-col justify-center items-center
          w-full h-[76.5615px]
          bg-[${colors.white}]
          border-t-[1px] border-solid border-[${colors.borderLight}]
          mt-auto // Pushes it to the bottom
          px-[15.993px]
        `}
      >
        <button
          type="button"
          className={`
            flex items-center justify-center
            w-full h-[43.993755px]
            bg-[${colors.primaryBlue}]
            rounded-[8px]
            focus:outline-none focus:ring-2 focus:ring-[${colors.primaryBlue}] focus:ring-offset-1
            active:bg-blue-700
          `}
          aria-label="Continue with selected payment method"
        >
          <span className={`${typography.paragraph} text-[${colors.white}]`}>
            Continue
          </span>
        </button>
      </div>
    </div>
  );
};