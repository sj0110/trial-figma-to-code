// src/components/GCashPaymentErrorScreen.tsx

import React, { useState, useEffect, useMemo } from 'react';

// --- Color Palette Mapping (from designData.designSystem.colors) ---
// color-1: #ffffff (white)
// color-2: #4a5565 (grey for some text)
// color-3: #101828 (dark text, main headings)
// color-4: #155dfc (primary blue) -> derived specific gradient stop colors: #007DFE, #0062CC
// color-5: #e7000b (error red)
// color-6: #6a7282 (light grey for helper text)
// color-7: #f9fafb (lightest grey for background)

// Derived border colors:
// - From 3:10283, 3:10319 (Container strokes): rgb(0.898, 0.906, 0.922) -> #E5E8EB
// - From 3:10315 (Text Input stroke, error state): rgb(0.982, 0.171, 0.213) -> #FB2C36 (but designSystem color-5 is #E7000B, which is what the text suggests is error color, so using #E7000B)

// --- Typography Mapping (from designData.designSystem.typography) ---
// Type 0: Inter Medium 20px / 30px lineHeight / -0.4492px letterSpacing
//   className="font-medium text-[20px] leading-[30px] tracking-[-0.4492px] font-sans"
// Type 1: Inter Regular 14px / 20px lineHeight / -0.15039px letterSpacing
//   className="font-normal text-[14px] leading-[20px] tracking-[-0.15039px] font-sans"
// Note: Assuming 'Inter' is part of the `font-sans` stack or globally imported.
// Specific smaller text from JSON (e.g., mobile number helper text) also uses Inter Regular, but with different line-height and often an adjusted text color.

interface GCashPaymentErrorScreenProps {
  /** Callback for when the back button is clicked. */
  onBackButtonClick?: () => void;
  /** Callback for when the 'Continue to GCash' button is clicked. */
  onContinueToGCashClick?: () => void;
  /** The current value of the GCash mobile number input. */
  gcashMobileNumber: string;
  /** Handler for changes to the GCash mobile number input. */
  onGcashMobileNumberChange: (number: string) => void;
  /** Whether the GCash mobile number input is in an invalid state. */
  isMobileNumberInvalid: boolean;
}

const BackIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 18L9 12L15 6" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#155DFC" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GCashBrandIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Simplified based on JSON vector data (3:10297 & 3:10298) which describes a vertical line with a dot, commonly stylized as a pin or "i" for information. */}
    <path d="M16 3.33334V27.3333" stroke="#007DFE" strokeWidth="2.66622" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="24.6667" r="1.33311" fill="#007DFE"/>
  </svg>
);

export const GCashPaymentErrorScreen: React.FC<GCashPaymentErrorScreenProps> = ({
  onBackButtonClick,
  onContinueToGCashClick,
  gcashMobileNumber,
  onGcashMobileNumberChange,
  isMobileNumberInvalid,
}) => {
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic sanitization: remove non-digit characters.
    const value = e.target.value.replace(/\D/g, '');
    onGcashMobileNumberChange(value);
  };

  const gradientColors = useMemo(() => {
    // Derived hex values from designData gradient stops for precise color matching.
    const stop0Color = '#007DFE'; // From r:0, g:0.49, b:0.996
    const stop1Color = '#0062CC'; // From r:0, g:0.384, b:0.8
    // The gradient transform is complex. A common interpretation for a vertical-looking
    // gradient in UI is 'to top' or 'to bottom'. Based on typical UIs, this often means
    // a darker shade at the bottom transitioning to a lighter shade at the top.
    // Given 'position: 0' and 'position: 1', this translates to stop0 at 0% and stop1 at 100% along the gradient axis.
    // For 'to top', 0% is the bottom. So it means stop0 at bottom, stop1 at top.
    return `linear-gradient(to top, ${stop1Color} 0%, ${stop0Color} 100%)`;
  }, []);

  return (
    <div className="flex flex-col w-[377px] min-h-[1141px] bg-[#ffffff] font-sans overflow-auto">
      {/* Header Section */}
      <div className="flex flex-col w-full min-h-[98.58px] bg-[#ffffff] border-b-[1px] border-solid border-[#E5E8EB]">
        <div className="flex items-center gap-[12px] px-[16px] py-[24px]">
          <button
            onClick={onBackButtonClick}
            className="flex items-center justify-center w-[32px] h-[32px] focus:outline-none focus:ring-2 focus:ring-[#155DFC] rounded"
            aria-label="Go back to previous page"
          >
            <BackIcon />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[#101828] font-medium text-[20px] leading-[30px] tracking-[-0.4492px]">
              GCash Payment
            </h1>
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Pay with your GCash account
            </p>
          </div>
        </div>
      </div>

      {/* GCash Payment Method Card */}
      <div
        className="flex flex-col w-[calc(100%-32px)] h-[192px] mx-[16px] mt-[24px] rounded-[14px] p-[24px] space-y-[16px]"
        style={{ background: gradientColors }}
        role="region"
        aria-label="GCash Payment details"
      >
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center justify-center w-[64px] h-[64px] bg-[#ffffff] rounded-[12px]">
            <GCashBrandIcon />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-[#ffffff] font-medium text-[20px] leading-[28px] tracking-[-0.4492px]">
              GCash
            </h2>
            <p className="text-[#ffffff]/80 font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Fast & Secure Payment
            </p>
          </div>
        </div>
        <div className="flex items-center w-full min-h-[64px] bg-[#ffffff]/10 rounded-lg p-[12px]">
          <p className="text-[#ffffff]/90 font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
            You will receive an OTP to confirm this transaction
          </p>
        </div>
      </div>

      {/* GCash Mobile Number Input Section */}
      <div className="flex flex-col w-[calc(100%-32px)] mx-[16px] mt-[24px] space-y-[8px]">
        <label htmlFor="gcash-mobile-number" className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
          GCash Mobile Number
        </label>
        <div className={`flex items-center h-[52px] bg-[#ffffff] rounded-lg border-[0.58px] ${isMobileNumberInvalid ? 'border-[#E7000B]' : 'border-[#E5E8EB]'}`}>
          <span className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px] ml-[16px] mr-[8px]">
            +63
          </span>
          <input
            id="gcash-mobile-number"
            type="tel"
            className="flex-grow bg-transparent text-[#101828]/50 font-normal text-[14px] leading-[19px] tracking-[-0.15039px] placeholder:text-[#101828]/50 focus:outline-none"
            placeholder="2435 432 1345"
            value={gcashMobileNumber}
            onChange={handleMobileNumberChange}
            aria-invalid={isMobileNumberInvalid}
            aria-describedby={isMobileNumberInvalid ? "mobile-number-error" : undefined}
          />
        </div>
        {isMobileNumberInvalid && (
          <p id="mobile-number-error" className="text-[#E7000B] font-normal text-[14px] leading-[16px] mt-[8px]">
            Mobile number must start with 09
          </p>
        )}
        <p className="text-[#6A7282] font-normal text-[14px] leading-[16px] mt-[4px]">
          Make sure this number is linked to your GCash account
        </p>
      </div>

      {/* Payment Details Section */}
      <div className="flex flex-col w-[calc(100%-32px)] mx-[16px] mt-[24px] rounded-[14px] border-[0.58px] border-solid border-[#E5E8EB] bg-[#ffffff] p-[16px] space-y-[12px]">
        <h3 className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
          Payment Details
        </h3>
        <div className="flex flex-col space-y-[12px]">
          <div className="flex justify-between items-center w-full">
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Subscription
            </p>
            <p className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Premium Plan
            </p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Amount
            </p>
            <p className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              ₱399/month
            </p>
          </div>
          <div className="flex justify-between items-center w-full pb-[12px] border-b-[1px] border-dashed border-[#E5E8EB]">
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Processing Fee
            </p>
            <p className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              ₱0.00
            </p>
          </div>
          <div className="flex justify-between items-center w-full pt-[12px]">
            <p className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Total Amount
            </p>
            <p className="text-[#155DFC] font-medium text-[20px] leading-[24px] tracking-[-1.25335693359375px]">
              ₱399/month
            </p>
          </div>
        </div>
      </div>

      {/* How to Pay Section */}
      <div className="flex flex-col w-[calc(100%-32px)] mx-[16px] mt-[24px] rounded-[14px] bg-[#F9FAFB] p-[16px] space-y-[12px]">
        <h3 className="text-[#101828] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
          How to Pay
        </h3>
        <div className="flex flex-col space-y-[12px]">
          {/* Step 1 */}
          <div className="flex items-start gap-[12px]">
            <div className="flex items-center justify-center w-[24px] h-[24px] bg-[#155DFC] rounded-full flex-shrink-0">
              <span className="text-[#ffffff] font-normal text-[14px] leading-[16px]">1</span>
            </div>
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Enter your GCash-registered mobile number
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex items-start gap-[12px]">
            <div className="flex items-center justify-center w-[24px] h-[24px] bg-[#155DFC] rounded-full flex-shrink-0">
              <span className="text-[#ffffff] font-normal text-[14px] leading-[16px]">2</span>
            </div>
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              You will receive an OTP via SMS
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex items-start gap-[12px]">
            <div className="flex items-center justify-center w-[24px] h-[24px] bg-[#155DFC] rounded-full flex-shrink-0">
              <span className="text-[#ffffff] font-normal text-[14px] leading-[16px]">3</span>
            </div>
            <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
              Enter the OTP to complete your payment
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="flex flex-col w-[calc(100%-32px)] mx-[16px] mt-[24px] space-y-[8px]">
        {/* Benefit 1 */}
        <div className="flex items-center gap-[8px]">
          <CheckIcon />
          <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
            Instant payment confirmation
          </p>
        </div>
        {/* Benefit 2 */}
        <div className="flex items-center gap-[8px]">
          <CheckIcon />
          <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
            No processing fees
          </p>
        </div>
        {/* Benefit 3 */}
        <div className="flex items-center gap-[8px]">
          <CheckIcon />
          <p className="text-[#4A5565] font-normal text-[14px] leading-[20px] tracking-[-0.15039px]">
            Secure and encrypted transaction
          </p>
        </div>
      </div>

      {/* Footer with Continue Button */}
      <div className="flex flex-col w-full min-h-[76.56px] bg-[#ffffff] border-t-[1px] border-solid border-[#E5E8EB] p-[16px] mt-auto">
        <button
          onClick={onContinueToGCashClick}
          className="flex items-center justify-center w-full h-[44px] bg-[#155DFC] rounded-lg text-[#ffffff] font-normal text-[14px] leading-[20px] tracking-[-0.15039px] focus:outline-none focus:ring-2 focus:ring-[#155DFC]"
          aria-label="Continue to GCash payment"
        >
          Continue to GCash
        </button>
      </div>
    </div>
  );
};

export default GCashPaymentErrorScreen;