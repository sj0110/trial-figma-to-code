// src/components/6-1-payment-methods.tsx
import React, { useState, useMemo } from 'react';

// --- Utils & Types ---

/**
 * Maps design system colors and custom hardcoded colors to a central object for use.
 * Colors are directly extracted HEX values as per requirements, no conversions.
 */
const AppColors = {
  white: '#ffffff', // color-1
  darkText: '#101828', // color-2
  greyText: '#4a5565', // color-3
  lightGreyBg: '#f3f3f5', // color-4
  veryLightGreyBg: '#f9fafb', // color-5
  borderColor: '#e5e7eb', // color-6, also matches Figma's {r:0.898..., g:0.906..., b:0.922...} border color
  disabledText: '#99a1af', // color-7
  primaryBlue: '#155DFC', // Custom, extracted from icon stroke {r:0.082..., g:0.364..., b:0.988...}
  radioBorder: '#D0D5DB', // Custom, extracted from radio button stroke {r:0.819..., g:0.835..., b:0.861...}
  buttonDisabledBg: '#E5E7EB', // Button background from 3:9684 {r:0.898..., g:0.905..., b:0.921...}, matches borderColor
  buttonDisabledTextColor: '#99A0AE', // Button text from 3:9685 {r:0.600..., g:0.631..., b:0.685...}
};

/**
 * Maps design system typography to a central object for use with inline styles.
 * Letter spacing is applied directly via inline style for pixel precision.
 */
const AppTypography = {
  heading: {
    fontSize: '20px',
    lineHeight: '30px',
    fontWeight: '500', // corresponds to font-medium in Tailwind
    letterSpacing: '-0.4492px',
    fontFamily: 'Inter, sans-serif', // Assuming Inter font is available in the project
  },
  body: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '400', // corresponds to font-normal in Tailwind
    letterSpacing: '-0.3125px',
    fontFamily: 'Inter, sans-serif',
  },
};

// --- Icon Components ---
// These SVG components are placeholders. Figma JSON did not provide 'd' attributes for vectors.
// The paths are approximated based on typical icon shapes and bounding boxes provided in the JSON.
// Each icon is designed to fit within a 24x24px viewBox.

interface IconProps {
  strokeColor?: string;
}

const BaseIconWrapper: React.FC<React.PropsWithChildren<IconProps>> = ({ children, strokeColor }) => (
  // The 'Icon' frame (e.g., 3:9638) is 23.998x23.998. It contains the vector children.
  // The SVG viewBox and dimensions are set to effectively represent this inner icon content.
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

const CignalWalletIcon: React.FC<IconProps> = ({ strokeColor = AppColors.primaryBlue }) => (
  <BaseIconWrapper strokeColor={strokeColor}>
    {/* Based on 3:9639 (rect-like) and 3:9640 (line) data relative transforms */}
    <rect x="3" y="3" width="18" height="13" rx="2" stroke={strokeColor} strokeWidth="2" />
    <path d="M3 8H21" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIconWrapper>
);

const CreditCardIcon: React.FC<IconProps> = ({ strokeColor = AppColors.primaryBlue }) => (
  <BaseIconWrapper strokeColor={strokeColor}>
    {/* Based on 3:9651 (rect-like) and 3:9652 (line) data relative transforms */}
    <rect x="2" y="5" width="20" height="14" rx="2" stroke={strokeColor} strokeWidth="2" />
    <path d="M2 10H22" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </BaseIconWrapper>
);

const GCashIcon: React.FC<IconProps> = ({ strokeColor = AppColors.primaryBlue }) => (
  <BaseIconWrapper strokeColor={strokeColor}>
    {/* Based on 3:9663 (rect-like) and 3:9664 (line) data relative transforms */}
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={strokeColor} strokeWidth="2" />
    <path d="M12 18V18" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> {/* Small dot/line at bottom */}
  </BaseIconWrapper>
);

const PayMayaIcon: React.FC<IconProps> = ({ strokeColor = AppColors.primaryBlue }) => (
  <BaseIconWrapper strokeColor={strokeColor}>
    {/* Based on 3:9675 (rect-like) and 3:9676 (line) data relative transforms */}
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={strokeColor} strokeWidth="2" />
    <path d="M12 18V18" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> {/* Small dot/line at bottom */}
  </BaseIconWrapper>
);

// Component for the unselected radio button visual
const UncheckedRadioIcon: React.FC<{ borderColor?: string }> = ({ borderColor = AppColors.radioBorder }) => (
  <div
    className="w-[20px] h-[20px] rounded-full flex-shrink-0" // Dimensions from 3:9646
    style={{
      border: `1.74665px solid ${borderColor}`, // strokeWeight from 3:9646
    }}
  ></div>
);

// --- Component Props Interfaces ---
interface PaymentMethodSelectorProps {
  // Currently, the component is self-contained.
  // Add props here if data or behavior needs to be passed in from a parent.
}

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.FC<IconProps>;
}

// --- Payment Method Selector Component ---
const paymentOptions: PaymentOption[] = [
  {
    id: 'cignal-wallet',
    name: 'Cignal Wallet',
    description: 'Pay using your Cignal Wallet points',
    icon: CignalWalletIcon,
  },
  {
    id: 'credit-debit-card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Amex accepted',
    icon: CreditCardIcon,
  },
  {
    id: 'gcash',
    name: 'GCash',
    description: 'Pay with your GCash account',
    icon: GCashIcon,
  },
  {
    id: 'paymaya',
    name: 'PayMaya',
    description: 'Pay with your PayMaya account',
    icon: PayMayaIcon,
  },
];

export const PaymentMethodSelector = (props: PaymentMethodSelectorProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Memoize typography styles to prevent unnecessary re-renders
  const headingStyle = useMemo(() => AppTypography.heading, []);
  const bodyStyle = useMemo(() => AppTypography.body, []);

  // --- Layout Calculations (derived from Figma JSON) ---
  // Root frame 3:9618 "PaymentMethodSelector" dimensions
  const rootWidth = 393.57855224609375;
  const rootHeight = 852.3654174804688;

  // Header Section (3:9619)
  const headerHeight = 110.5757064819336;
  // Content container 3:9620 (inside 3:9619) has x:15.992, y:23.998. Height 61.996.
  const headerContentPaddingLeftRight = 15.992767333984375;
  const headerContentPaddingTop = 23.998249053955078;
  const headerContentHeight = 61.99699020385742; // Height of the inner content block (3:9620)
  const headerContentPaddingBottom = headerHeight - headerContentPaddingTop - headerContentHeight;
  const headerTitleDescriptionGap = 7.996381759643555; // itemSpacing from 3:9620

  // Subscription Details Section (3:9625)
  const subscriptionDetailsHeight = 72.55876922607422;
  // Content container 3:9626 (inside 3:9625) has x:15.992, y:15.992. Height 39.991.
  const subscriptionDetailsContentPaddingLeftRight = 15.992767333984375;
  const subscriptionDetailsContentPaddingTopBottom = 15.992767333984375;

  // Payment Options Section Container (3:9634)
  const paymentOptionsContainerX = 15.992767333984375; // Left position relative to root
  const paymentOptionsContainerY = 207.13272094726562; // Top position relative to root
  const paymentOptionsContainerWidth = rootWidth - (paymentOptionsContainerX * 2); // Calculated width with symmetrical margins
  const paymentOptionsContainerItemSpacing = 11.999130249023438; // Vertical gap between buttons

  // Calculate margin-top for the payment options container relative to the preceding elements
  const calculatedPaymentOptionsMarginTop = paymentOptionsContainerY - headerHeight - subscriptionDetailsHeight;

  // Payment Option Button (e.g., 3:9635)
  const paymentButtonHeight = 81.14646911621094;
  const paymentButtonBorderWeight = 0.5822169780731201;
  const paymentButtonBorderRadius = 14;
  // Inner container 3:9636 (inside 3:9635) has x:16.574, y:16.574. Height 47.996.
  const paymentButtonInnerPaddingLeftRight = 16.57498550415039;
  const paymentButtonInnerPaddingTopBottom = 16.574981689453125;
  const paymentButtonInnerItemSpacing = 15.99276351928711; // Horizontal gap between icon, text, radio

  // Footer Section (3:9683)
  const footerHeight = 76.56150817871094;
  // Button 3:9684 (inside 3:9683) has x:15.992, y:16.574.
  const footerButtonWidth = 361.593017578125;
  const footerButtonHeight = 43.99375534057617;
  const footerButtonBorderRadius = 8;


  return (
    <div
      className="relative flex flex-col items-center bg-[#ffffff] overflow-hidden"
      style={{
        width: `${rootWidth}px`,
        height: `${rootHeight}px`,
      }}
      role="main"
      aria-label="Payment Method Selection Screen"
    >
      {/* Top Header Section (3:9619) */}
      <div
        className="w-full bg-[#ffffff] border-b-[1px] border-solid"
        style={{ height: `${headerHeight}px`, borderColor: AppColors.borderColor }}
      >
        <div
          className="flex flex-col justify-center"
          style={{
            paddingLeft: `${headerContentPaddingLeftRight}px`,
            paddingRight: `${headerContentPaddingLeftRight}px`,
            paddingTop: `${headerContentPaddingTop}px`,
            paddingBottom: `${headerContentPaddingBottom}px`,
          }}
        >
          <h1
            id="choose-payment-method-heading"
            className="text-[#101828]" // color-2
            style={{ ...headingStyle }}
          >
            Choose Payment Method
          </h1>
          <p
            className="text-[#4a5565]" // color-3
            style={{ ...bodyStyle, marginTop: `${headerTitleDescriptionGap}px` }}
          >
            Select how you want to pay for your subscription
          </p>
        </div>
      </div>

      {/* Subscription Details Section (3:9625) */}
      <div
        className="w-full border-b-[1px] border-solid flex flex-col justify-center"
        style={{
          height: `${subscriptionDetailsHeight}px`,
          backgroundColor: AppColors.veryLightGreyBg, // color-5
          borderColor: AppColors.borderColor, // color-6
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{
            paddingLeft: `${subscriptionDetailsContentPaddingLeftRight}px`,
            paddingRight: `${subscriptionDetailsContentPaddingLeftRight}px`,
            paddingTop: `${subscriptionDetailsContentPaddingTopBottom}px`,
            paddingBottom: `${subscriptionDetailsContentPaddingTopBottom}px`,
            height: '100%', // Take full height of parent
          }}
        >
          <div className="flex flex-col">
            <p className="text-[#101828]" style={{ ...bodyStyle }}>
              Premium Plan
            </p>
            <p className="text-[#4a5565]" style={{ ...bodyStyle }}>
              Monthly subscription
            </p>
          </div>
          <p className="text-[#101828]" style={{ ...bodyStyle }}>
            ₱399/month
          </p>
        </div>
      </div>

      {/* Payment Options Section (3:9634 container) */}
      <div
        className="flex flex-col"
        style={{
          width: `${paymentOptionsContainerWidth}px`,
          marginTop: `${calculatedPaymentOptionsMarginTop}px`,
          marginLeft: `${paymentOptionsContainerX}px`,
          marginRight: `${paymentOptionsContainerX}px`,
          gap: `${paymentOptionsContainerItemSpacing}px`,
        }}
        role="radiogroup"
        aria-labelledby="choose-payment-method-heading"
      >
        {paymentOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedPaymentMethod === option.id;

          return (
            <button
              key={option.id}
              className="relative w-full flex items-center bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => setSelectedPaymentMethod(option.id)}
              style={{
                height: `${paymentButtonHeight}px`,
                border: `${paymentButtonBorderWeight}px solid ${AppColors.borderColor}`,
                borderRadius: `${paymentButtonBorderRadius}px`,
                // Highlight selected option
                borderColor: isSelected ? AppColors.primaryBlue : AppColors.borderColor,
                boxShadow: isSelected ? `0 0 0 1px ${AppColors.primaryBlue}` : 'none',
                // For accessibility, a proper focus ring is important even if not in design
                // Tailwin's `focus:ring` will handle this.
              }}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select ${option.name}`}
            >
              <div
                className="flex items-center justify-between w-full h-full"
                style={{
                  paddingLeft: `${paymentButtonInnerPaddingLeftRight}px`,
                  paddingRight: `${paymentButtonInnerPaddingLeftRight}px`,
                  paddingTop: `${paymentButtonInnerPaddingTopBottom}px`,
                  paddingBottom: `${paymentButtonInnerPaddingTopBottom}px`,
                  gap: `${paymentButtonInnerItemSpacing}px`,
                }}
              >
                {/* Icon Container (3:9637) */}
                <div
                  className="relative flex-shrink-0 flex items-center justify-center bg-[#f3f3f5] rounded-md" // color-4
                  style={{
                    width: '47.996498px',
                    height: '47.996498px',
                  }}
                >
                  {/* Icon Frame (3:9638) is 23.998x23.998 and centered within its 48x48 parent */}
                  <div className="w-[23.998px] h-[23.998px] flex items-center justify-center">
                    <IconComponent />
                  </div>
                </div>

                {/* Text Content (3:9641) */}
                <div className="flex flex-col flex-grow">
                  <p className="text-[#101828]" style={{ ...bodyStyle }}>
                    {option.name}
                  </p>
                  <p className="text-[#4a5565]" style={{ ...bodyStyle }}>
                    {option.description}
                  </p>
                </div>

                {/* Radio Button (3:9646) */}
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <div
                      className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
                      style={{
                        border: `1.74665px solid ${AppColors.primaryBlue}`, // Selected border color
                      }}
                    >
                      <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: AppColors.primaryBlue }}></div>
                    </div>
                  ) : (
                    <UncheckedRadioIcon />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Fixed Button Section (3:9683) */}
      <div
        className="absolute bottom-0 w-full bg-[#ffffff] border-t-[1px] border-solid flex justify-center items-center"
        style={{
          height: `${footerHeight}px`,
          borderColor: AppColors.borderColor, // color-6
        }}
      >
        <button
          className="flex items-center justify-center rounded-lg"
          style={{
            width: `${footerButtonWidth}px`,
            height: `${footerButtonHeight}px`,
            backgroundColor: selectedPaymentMethod ? AppColors.primaryBlue : AppColors.buttonDisabledBg, // Color changes based on selection
            color: selectedPaymentMethod ? AppColors.white : AppColors.buttonDisabledTextColor, // Text color changes based on selection
            borderRadius: `${footerButtonBorderRadius}px`,
          }}
          disabled={!selectedPaymentMethod} // Button is disabled until a payment method is selected
          aria-label="Continue with selected payment method"
        >
          <span style={{ ...bodyStyle }}>
            Continue
          </span>
        </button>
      </div>
    </div>
  );
};