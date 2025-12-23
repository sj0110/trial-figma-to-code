// src/components/CignalWalletPaymentScreen.tsx
import React, { useState, useMemo, useCallback } from 'react'; // Ensure React 19 hooks syntax

// --- Type Definitions for Props ---
export interface CignalWalletPaymentScreenProps {
  initialAvailablePoints?: number;
  subscriptionPlan?: string;
  monthlyAmount?: number;
  pointsToDeduct?: number;
  paymentBenefits?: string[];
  onBack?: () => void;
  onConfirmPayment?: (points: number) => void;
}

// --- Reusable SVG Icons ---
const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="#101828" // color-2 from design system
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Combined and simplified based on Figma vectors 3:9773 and 3:9774 */}
    {/* This represents a card outline with a horizontal stripe */}
    <path
      d="M3 5L21 5L21 19L3 19L3 5Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 9H21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M2.66546 3.99819L7.99638 10.6601L13.3273 3.99819"
      stroke="#155dfc" // color-4 from design system
      strokeWidth="1.33273"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Main Component ---
const CignalWalletPaymentScreen: React.FC<CignalWalletPaymentScreenProps> = ({
  initialAvailablePoints = 2450,
  subscriptionPlan = 'Premium Plan',
  monthlyAmount = 399,
  pointsToDeduct = 399,
  paymentBenefits = [
    'Instant activation',
    'No additional fees',
    'Earn bonus points on payment',
  ],
  onBack,
  onConfirmPayment,
}) => {
  const availablePoints = useMemo(() => initialAvailablePoints, [initialAvailablePoints]);
  const remainingBalance = useMemo(() => availablePoints - pointsToDeduct, [availablePoints, pointsToDeduct]);
  const rewardsValue = useMemo(() => Math.round(availablePoints / 10), [availablePoints]); // Assuming 10 points = ₱1, example conversion

  const handleConfirmPayment = useCallback(() => {
    if (onConfirmPayment) {
      onConfirmPayment(pointsToDeduct);
    }
  }, [onConfirmPayment, pointsToDeduct]);

  return (
    <div
      className="
        relative w-[394px] h-[853px] bg-white text-base
        font-sans flex flex-col items-center justify-start
        overflow-y-auto
      "
      // Assuming 'font-sans' is configured to 'Inter' in tailwind.config.js
    >
      {/* Header Container */}
      <div
        className="
          flex flex-col w-full h-[99px]
          bg-white border-b border-[#e5e7eb]
          py-6 px-4
        "
      >
        <div className="flex items-center gap-3 w-full h-[50px]">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-offset-2"
          >
            <BackArrowIcon />
          </button>
          <div className="flex-1">
            <h1
              className="
                font-medium text-[20px] leading-[30px] tracking-[-0.022em]
                text-[#101828]
              "
            >
              Cignal Wallet
            </h1>
            <p
              className="
                font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                text-[#4a5565]
              "
            >
              Pay with your wallet points
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full px-4 pt-6 space-y-6 pb-[90px]"> {/* Add padding-bottom to avoid overlap with fixed button */}
        {/* Wallet Card */}
        <div
          className="
            flex flex-col w-full h-[166px] rounded-2xl p-6
            bg-gradient-to-t from-[#155dfc] to-[#4f39f6]
            justify-between shadow-sm
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
              <WalletIcon />
            </div>
            <div className="flex flex-col">
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-white/80
                "
              >
                Available Balance
              </p>
              <p
                className="
                  font-medium text-[20px] leading-[30px] tracking-[-0.022em]
                  text-white
                "
              >
                {availablePoints.toLocaleString()} Points
              </p>
            </div>
          </div>
          <div
            className="
              flex items-center justify-center w-full h-11 rounded-lg
              bg-white/10
            "
          >
            <p
              className="
                font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                text-white/90
              "
            >
              ≈ ₱{rewardsValue.toLocaleString()} in rewards value
            </p>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div
          className="
            flex flex-col w-full h-[202px] rounded-2xl p-4
            bg-white border border-[#e5e7eb] shadow-sm
          "
        >
          <h2
            className="
              font-medium text-[20px] leading-[24px] tracking-[-0.022em]
              text-[#101828] mb-4
            "
          >
            Payment Summary
          </h2>
          <div className="flex flex-col space-y-3 flex-grow">
            {/* Subscription */}
            <div className="flex justify-between items-center">
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-[#4a5565]
                "
              >
                Subscription
              </p>
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-[#101828]
                "
              >
                {subscriptionPlan}
              </p>
            </div>
            {/* Amount */}
            <div className="flex justify-between items-center">
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-[#4a5565]
                "
              >
                Amount
              </p>
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-[#101828]
                "
              >
                ₱{monthlyAmount}/month
              </p>
            </div>
            <div className="flex-grow border-t border-[#e5e7eb] mt-3 pt-3">
              {/* Points to be deducted */}
              <div className="flex justify-between items-center">
                <p
                  className="
                    font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                    text-[#101828]
                  "
                >
                  Points to be deducted
                </p>
                <p
                  className="
                    font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                    text-[#155dfc]
                  "
                >
                  {pointsToDeduct} pts
                </p>
              </div>
            </div>
            {/* Remaining balance */}
            <div className="flex justify-between items-center pt-2">
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-[#4a5565]
                "
              >
                Remaining balance
              </p>
              <p
                className="
                  font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                  text-[#101828]
                "
              >
                {remainingBalance.toLocaleString()} pts
              </p>
            </div>
          </div>
        </div>

        {/* Payment Benefits Card */}
        <div
          className="
            flex flex-col w-full h-[140px] rounded-2xl p-4
            bg-[#f9fafb] space-y-3 shadow-sm
          "
        >
          <h2
            className="
              font-normal text-[14px] leading-[20px] tracking-[-0.01em]
              text-[#101828]
            "
          >
            Payment Benefits
          </h2>
          <div className="flex flex-col space-y-2">
            {paymentBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckmarkIcon />
                <p
                  className="
                    font-normal text-[14px] leading-[20px] tracking-[-0.01em]
                    text-[#4a5565]
                  "
                >
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        className="
          absolute bottom-0 left-0 w-full h-[77px]
          bg-white border-t border-[#e5e7eb]
          flex items-center justify-center px-4
        "
      >
        <button
          onClick={handleConfirmPayment}
          className="
            flex items-center justify-center w-full h-11 rounded-lg
            bg-[#155dfc] text-white
            font-normal text-[14px] leading-[20px] tracking-[-0.01em]
            focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-offset-2
            hover:bg-[#155dfc]/90 active:bg-[#155dfc]/80
          "
        >
          Confirm Payment ({pointsToDeduct} pts)
        </button>
      </div>
    </div>
  );
};

export default CignalWalletPaymentScreen;