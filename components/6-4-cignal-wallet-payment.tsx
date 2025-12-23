// src/components/CignalWalletPayment.tsx
import React, { useState, useMemo } from 'react'; // React 19 hooks

// --- Types ---
export interface CignalWalletPaymentProps {
  /** Callback function when the back button is clicked. */
  onBack?: () => void;
  /** Callback function when the 'Pay' button is clicked.
   *  The amount is currently hardcoded as '₱399/month' based on the design.
   */
  onPay?: (amount: string) => void;
}

// Typography styles mapping to Tailwind classes or custom styles.
// For `font-inter` and `font-menlo` to work, ensure they are configured
// in your `tailwind.config.js` and linked in your project's CSS.
const typographyStyles = {
  heading: 'font-inter text-[20px] font-medium leading-[30px] tracking-[-0.4492px] text-[#101828]', // color-2
  subheading: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#4a5565]', // color-3
  cardDetails: 'font-menlo text-[20px] font-normal leading-[28px] tracking-[2px] text-white',
  label: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#101828]', // color-2
  placeholder: 'font-inter text-[14px] font-normal leading-[17px] tracking-[-0.1504px] text-[#101828]/50', // color-2 with 50% opacity
  summaryTitle: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#101828]', // color-2
  summaryDetail: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#4a5565]', // color-3
  summaryAmount: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#101828]', // color-2
  secureText: 'font-inter text-[14px] font-normal leading-[16px] tracking-[-0.1504px] text-[#4a5565]', // color-3
  buttonText: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#99a1af]', // color-6
  activeButtonText: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-white',
  cardTextWhite: 'font-inter text-[14px] font-normal leading-[16px] tracking-[-0.1504px] text-white/60', // white with 60% opacity
  cardTextWhiteName: 'font-inter text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-white',
};

// --- Reusable Sub-components ---

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = 'Go back' }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 flex items-center justify-center"
      aria-label={label}
    >
      {/* Figma vector path for the back arrow icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="#101828" // Mapped from color-2
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardNumber, cardholderName, expiryDate }) => {
  return (
    <div
      className="
        w-full h-[220px] rounded-[14px] p-6
        flex flex-col justify-between
      "
      style={{
        background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)', // Mapped from Figma gradient stops
        boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)', // Mapped from Figma multiple shadows
      }}
      role="img"
      aria-label="Credit card preview displaying details"
    >
      <div className="flex justify-between items-center">
        {/* Card Icon - simplified from Figma vectors (card shape with a line) */}
        <div className="w-10 h-10 flex items-center justify-center" aria-hidden="true">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
          >
            <rect x="3.33258" y="8.33146" width="33.3258" height="23.3281" rx="3.33258" stroke="white" strokeOpacity="0.8" strokeWidth="3.33258"/>
            <line x1="3.33258" y1="16.6629" x2="36.6584" y2="16.6629" stroke="white" strokeOpacity="0.8" strokeWidth="3.33258"/>
          </svg>
        </div>
        <p className={typographyStyles.cardTextWhite}>Credit/Debit Card</p>
      </div>

      <p className={`${typographyStyles.cardDetails} text-white`}>
        {cardNumber || '•••• •••• •••• ••••'}
      </p>

      <div className="flex justify-between items-end">
        <div>
          <p className={typographyStyles.cardTextWhite}>CARDHOLDER NAME</p>
          <p className={typographyStyles.cardTextWhiteName}>
            {cardholderName || 'YOUR NAME'}
          </p>
        </div>
        <div>
          <p className={typographyStyles.cardTextWhite}>VALID THRU</p>
          <p className={typographyStyles.cardTextWhiteName}>
            {expiryDate || 'MM/YY'}
          </p>
        </div>
      </div>
    </div>
  );
};

interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id: string;
  maxLength?: number;
  inputMode?: 'numeric' | 'text' | 'tel'; // For better mobile keyboard support
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  id,
  maxLength,
  inputMode = 'text',
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className={typographyStyles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        inputMode={inputMode}
        className={`
          w-full px-4 py-[13.5px] border border-[#e5e7eb] rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#e5e7eb]
          ${typographyStyles.placeholder}
        `}
      />
    </div>
  );
};

interface PaymentSummaryBoxProps {
  planName: string;
  amount: string;
}

const PaymentSummaryBox: React.FC<PaymentSummaryBoxProps> = ({ planName, amount }) => {
  return (
    <div
      className="
        w-full p-4 border rounded-[14px]
        flex flex-col gap-3 bg-[#f9fafb] border-[#e5e7eb]
      "
      style={{
        borderWidth: '0.582217px', // Exact stroke weight from Figma
      }}
    >
      <p className={typographyStyles.summaryTitle}>Payment Summary</p>
      {/* Adjusted spacing from Figma, pt-[12px] represents 11.999px */}
      <div className="flex justify-between items-center pt-[12px] border-t border-[#e5e7eb] border-dashed">
        <p className={typographyStyles.summaryDetail}>{planName}</p>
        <p className={typographyStyles.summaryAmount}>{amount}</p>
      </div>
      {/* Adjusted spacing from Figma, pt-[12px] represents 11.999px */}
      <div className="flex items-center gap-2 pt-[12px] border-t border-[#e5e7eb] border-dashed">
        {/* Secure Icon - simplified from Figma vectors (lock icon) */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M2 7.33002C2 6.53982 2.31607 5.78168 2.87868 5.21907C3.44129 4.65646 4.19943 4.34039 5 4.34039H11C11.8006 4.34039 12.5587 4.65646 13.1213 5.21907C13.6839 5.78168 14 6.53982 14 7.33002V13.3301C14 14.1203 13.6839 14.8784 13.1213 15.4411C12.5587 16.0037 11.8006 16.3198 11 16.3198H5C4.19943 16.3198 3.44129 16.0037 2.87868 15.4411C2.31607 14.8784 2 14.1203 2 13.3301V7.33002Z" stroke="#155DFC" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 1.33273V5.99729" stroke="#155DFC" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.66456 1.33273V5.99729H11.3354V1.33273" stroke="#155DFC" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className={typographyStyles.secureText}>Your payment is secured and encrypted</p>
      </div>
    </div>
  );
};

// --- Main Component ---
export const CignalWalletPayment: React.FC<CignalWalletPaymentProps> = ({
  onBack,
  onPay,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Derived state for the card preview, formatted for display
  const formattedCardNumber = useMemo(() => {
    // Allows up to 16 digits, then formats with spaces every 4 digits
    const cleaned = cardNumber.replace(/\D/g, '').substring(0, 16);
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  }, [cardNumber]);

  const formattedExpiryDate = useMemo(() => {
    // Formats MM/YY, limiting to 4 digits for MMYY
    const cleaned = expiryDate.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length > 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    return cleaned;
  }, [expiryDate]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setCardNumber(value);
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName(e.target.value.toUpperCase()); // Conventionally uppercase
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    let formattedValue = value.substring(0, 4); // Max 4 digits for MMYY
    if (formattedValue.length > 2) {
      formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
    }
    setExpiryDate(formattedValue); // Enforce MM/YY format length
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setCvv(value.slice(0, 4)); // CVV is typically 3 or 4 digits
  };

  const isFormValid = useMemo(() => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardholderName.trim() !== '' &&
      expiryDate.length === 5 && // MM/YY
      cvv.length >= 3 && cvv.length <= 4
    );
  }, [cardNumber, cardholderName, expiryDate, cvv]);

  const handlePayClick = () => {
    if (isFormValid) {
      // Assuming a fixed amount from the design for now
      onPay?.('₱399/month');
      // console.log('Payment details:', { cardNumber, cardholderName, expiryDate, cvv });
      // alert('Payment initiated!'); // Placeholder for actual payment logic
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-inter w-[377px] mx-auto overflow-hidden"> {/* color-1 */}
      {/* Header Section */}
      <header className="flex items-center px-4 py-6 border-b border-[#e5e7eb]"> {/* color-5 */}
        <BackButton onClick={onBack || (() => console.log('Back button clicked'))} />
        <div className="flex flex-col ml-3">
          <h1 className={typographyStyles.heading}>Card Payment</h1>
          <p className={typographyStyles.subheading}>Enter your card details</p>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-28"> {/* pb-28 to ensure content isn't hidden by fixed footer */}
        {/* Card Preview Section */}
        <section aria-labelledby="card-preview-heading">
          <h2 id="card-preview-heading" className="sr-only">Card Preview</h2>
          <CardPreview
            cardNumber={formattedCardNumber}
            cardholderName={cardholderName}
            expiryDate={formattedExpiryDate}
          />
        </section>

        {/* Input Fields Section */}
        <section className="flex flex-col gap-4" aria-labelledby="card-details-heading">
          <h2 id="card-details-heading" className="sr-only">Card Details Input</h2>
          <TextInputField
            id="cardNumber"
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            type="tel"
            inputMode="numeric"
            maxLength={16} // Max digits without spaces
          />

          <TextInputField
            id="cardholderName"
            label="Cardholder Name"
            placeholder="JUAN DELA CRUZ"
            value={cardholderName}
            onChange={handleCardholderNameChange}
            type="text"
            inputMode="text"
            maxLength={50} // Reasonable max length for a name
          />

          <div className="flex gap-4">
            <TextInputField
              id="expiryDate"
              label="Expiry Date"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              type="text"
              inputMode="numeric"
              maxLength={5} // MM/YY including '/'
            />
            <TextInputField
              id="cvv"
              label="CVV"
              placeholder="123"
              value={cvv}
              onChange={handleCvvChange}
              type="password" // For security, mask CVV
              inputMode="numeric"
              maxLength={4}
            />
          </div>
        </section>

        {/* Payment Summary Section */}
        <section aria-labelledby="payment-summary-heading">
          <h2 id="payment-summary-heading" className="sr-only">Payment Summary</h2>
          <PaymentSummaryBox planName="Premium Plan" amount="₱399/month" />
        </section>
      </main>

      {/* Footer Button Section */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[377px] bg-white border-t border-[#e5e7eb] p-4 flex justify-center"> {/* color-1 and color-5 */}
        <button
          onClick={handlePayClick}
          className={`
            w-full py-3 rounded-lg flex items-center justify-center
            ${isFormValid ? 'bg-[#155DFC] text-white' : 'bg-[#e5e7eb] text-[#99a1af] cursor-not-allowed'}
            ${isFormValid ? typographyStyles.activeButtonText : typographyStyles.buttonText}
          `}
          disabled={!isFormValid}
          aria-label="Pay ₱399 per month"
        >
          Pay ₱399/month
        </button>
      </footer>
    </div>
  );
};

// IMPORTANT: For 'Inter' and 'Menlo' font families to work,
// ensure they are correctly linked in your HTML/CSS (e.g., via Google Fonts or @font-face)
// and configured in your `tailwind.config.js` like this:
//
// module.exports = {
//   theme: {
//     extend: {
//       fontFamily: {
//         inter: ['Inter', 'sans-serif'],
//         menlo: ['Menlo', 'monospace'],
//       },
//     },
//   },
// };