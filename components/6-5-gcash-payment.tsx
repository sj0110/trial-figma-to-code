// src/components/GCashPayment.tsx
import { useState, useMemo } from 'react';

interface GCashPaymentProps {
  // Define any props if the component needs to be configurable
  // For this design, all data is static from JSON, so no external props are needed initially.
}

const colors = {
  white: '#ffffff',
  darkGray: '#4a5565',
  richBlack: '#101828',
  gcashBlue: '#155dfc',
  mediumGray: '#6a7282',
  lightGrayBg: '#f9fafb',
  borderLight: '#e5e7eb',
  placeholderGray: '#99a1af',
  inputBorder: '#d1d5db',
  gcashGradientStart: '#007DFE', // Converted from Figma RGB (0, 0.49, 0.996)
  gcashGradientEnd: '#0062CC',   // Converted from Figma RGB (0, 0.384, 0.8)
};

export const GCashPayment: React.FC<GCashPaymentProps> = () => {
  // No state is explicitly needed for this static design, but we include useMemo for demonstration.
  const headerContent = useMemo(() => ({
    title: 'GCash Payment',
    subtitle: 'Pay with your GCash account',
  }), []);

  const mobileNumberInput = useMemo(() => ({
    label: 'GCash Mobile Number',
    prefix: '+63',
    placeholder: '0917 123 4567',
    helperText: 'Make sure this number is linked to your GCash acco', // Truncated in Figma
  }), []);

  const paymentDetails = useMemo(() => ([
    { label: 'Subscription', value: 'Premium Plan' },
    { label: 'Amount', value: '₱399/month' },
    { label: 'Processing Fee', value: '₱0.00' },
  ]), []);

  const totalAmount = useMemo(() => '₱399/month', []);

  const howToPaySteps = useMemo(() => ([
    'Enter your GCash-registered mobile number',
    'You will receive an OTP via SMS',
    'Enter the OTP to complete your payment',
  ]), []);

  const benefits = useMemo(() => ([
    'Instant payment confirmation',
    'No processing fees',
    'Secure and encrypted transaction',
  ]), []);


  return (
    <div className={`
      relative
      w-[377px] h-[1121px] // Specific dimensions from Figma frame
      bg-[${colors.white}]
      font-inter
      antialiased
      overflow-auto // Allow scrolling if content exceeds height
    `}>
      {/* Header Section */}
      <div className={`
        flex flex-col
        w-full h-[98.57658386230469px]
        bg-[${colors.white}]
        border-b border-[${colors.borderLight}]
        px-[16px] py-[24px] // approximated from child's relativeTransform
      `}>
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            className="w-[32px] h-[32px] flex items-center justify-center"
            aria-label="Back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[${colors.richBlack}]"
            >
              <path
                d="M15 6L9 12L15 18"
                stroke={colors.richBlack}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex flex-col">
            <p className={`
              text-[${colors.richBlack}]
              text-[20px] font-medium leading-[30px] tracking-[-0.4492px]
            `}>
              {headerContent.title}
            </p>
            <p className={`
              text-[${colors.mediumGray}]
              text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
            `}>
              {headerContent.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-[24px] px-[16px] pb-[92px] pt-[24px]"> {/* Adjusted padding to match Figma structure */}

        {/* GCash Payment Card */}
        <div className={`
          relative
          w-full h-[191.97689819335938px]
          rounded-[14px]
          bg-gradient-to-r from-[${colors.gcashGradientStart}] to-[${colors.gcashGradientEnd}]
          flex flex-col justify-start gap-[16px]
          p-[24px]
        `}>
          <div className="flex items-center gap-[16px]">
            <div className={`
              w-[64px] h-[64px]
              bg-[${colors.white}] rounded-[12px]
              flex items-center justify-center
            `}>
              {/* GCash Wallet Icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.66555 2.66622C6.66555 2.66622 3.33222 2.66622 3.33222 5.99955V26.6662C3.33222 26.6662 3.33222 29.3329 6.66555 29.3329H25.3322C25.3322 29.3329 28.6655 29.3329 28.6655 26.6662V5.99955C28.6655 5.99955 28.6655 2.66622 25.3322 2.66622H9.33222C9.33222 2.66622 6.66555 2.66622 6.66555 2.66622ZM9.33222 2.66622V5.99955H25.3322V2.66622H9.33222Z"
                  stroke={colors.gcashBlue}
                  strokeWidth="2.66622"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className={`
                text-[${colors.white}]
                text-[28px] font-medium leading-[30px] // Inferred from height and context
              `}>
                GCash
              </p>
              <p className={`
                text-[${colors.white}]/80
                text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
              `}>
                Fast & Secure Payment
              </p>
            </div>
          </div>
          <div className={`
            w-full h-[63.98926544189453px]
            bg-[${colors.white}]/10 rounded-lg
            p-[12px] // Approximated from content positioning
            flex items-center
          `}>
            <p className={`
              text-[${colors.white}]/90
              text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
            `}>
              You will receive an OTP to confirm this transaction
            </p>
          </div>
        </div>

        {/* GCash Mobile Number Input */}
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="gcash-mobile-number"
            className={`
              text-[${colors.richBlack}]
              text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
            `}
          >
            {mobileNumberInput.label}
          </label>
          <div className={`
            relative flex items-center
            w-full h-[52px]
            bg-[${colors.white}] border border-[${colors.inputBorder}] rounded-lg
          `}>
            <span className={`
              text-[${colors.darkGray}]
              text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
              pl-[16px]
            `}>
              {mobileNumberInput.prefix}
            </span>
            <input
              id="gcash-mobile-number"
              type="tel"
              className={`
                flex-grow
                text-[${colors.richBlack}]/50
                text-[14px] font-normal leading-[19px] // Inferred from height
                pl-[16px]
                bg-transparent border-none outline-none
              `}
              placeholder={mobileNumberInput.placeholder}
              aria-label="GCash Mobile Number"
            />
          </div>
          <p className={`
            text-[${colors.mediumGray}]
            text-[12px] font-normal leading-[16px] // Inferred from height
          `}>
            {mobileNumberInput.helperText}
          </p>
        </div>

        {/* Payment Details */}
        <div className={`
          flex flex-col gap-[12px]
          w-full h-[197.7080841064453px]
          bg-[${colors.white}] border border-[${colors.borderLight}] rounded-[14px]
          p-[16.575px]
        `}>
          <p className={`
            text-[${colors.richBlack}]
            text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
          `}>
            Payment Details
          </p>
          <div className="flex flex-col gap-[12px]">
            {paymentDetails.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className={`
                  text-[${colors.darkGray}]
                  text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
                `}>
                  {item.label}
                </p>
                <p className={`
                  text-[${colors.richBlack}]
                  text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
                `}>
                  {item.value}
                </p>
              </div>
            ))}
            <div className={`
              flex justify-between items-center
              pt-[12.581298828125px] mt-[12.581298828125px] // Approximated padding and margin for divider
              border-t border-[${colors.borderLight}]
            `}>
              <p className={`
                text-[${colors.richBlack}]
                text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
              `}>
                Total Amount
              </p>
              <p className={`
                text-[${colors.gcashBlue}]
                text-[20px] font-medium leading-[24px] // Inferred from height
              `}>
                {totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* How to Pay Section */}
        <div className={`
          flex flex-col gap-[12px]
          w-full h-[179.95046997070312px]
          bg-[${colors.lightGrayBg}] rounded-[14px]
          p-[16px]
        `}>
          <p className={`
            text-[${colors.richBlack}]
            text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
          `}>
            How to Pay
          </p>
          <div className="flex flex-col gap-[12px]">
            {howToPaySteps.map((step, index) => (
              <div key={index} className="flex items-center gap-[12px]">
                <div className={`
                  w-[24px] h-[24px] rounded-full
                  bg-[${colors.gcashBlue}]
                  flex items-center justify-center
                `}>
                  <span className={`
                    text-[${colors.white}]
                    text-[12px] font-normal leading-[16px] // Inferred from height
                  `}>
                    {index + 1}
                  </span>
                </div>
                <p className={`
                  text-[${colors.darkGray}]
                  text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
                `}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col gap-[8px] px-0"> {/* Adjusted padding based on original x */}
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-[8px]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.66546 8.99819L6.66546 12.9982L13.3321 5.66819"
                  stroke={colors.gcashBlue}
                  strokeWidth="1.33273"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className={`
                text-[${colors.darkGray}]
                text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
              `}>
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className={`
        fixed bottom-0 left-1/2 -translate-x-1/2
        w-[377px] h-[76.56150817871094px]
        bg-[${colors.white}]
        border-t border-[${colors.borderLight}]
        px-[16px] py-[16.575px] // Approximated from content positioning
      `}>
        <button
          type="button"
          className={`
            w-full h-[43.99375534057617px]
            bg-[${colors.borderLight}] rounded-lg
            flex items-center justify-center
            cursor-not-allowed // Button is disabled in design
          `}
          disabled
        >
          <span className={`
            text-[${colors.placeholderGray}]
            text-[14px] font-normal leading-[20px] tracking-[-0.1504px]
          `}>
            Continue to GCash
          </span>
        </button>
      </div>
    </div>
  );
};