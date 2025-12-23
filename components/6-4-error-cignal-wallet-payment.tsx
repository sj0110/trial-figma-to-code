// src/components/CignalWalletPaymentError.tsx
import { useState, useMemo } from 'react';
// For React 19, `useEffect` is still imported this way.
// `useTransition` and `useDeferredValue` are not directly needed for this static form example but are part of R19.

interface CignalWalletPaymentErrorProps {
  initialCardNumber?: string;
  initialCardholderName?: string;
  initialExpiryDate?: string;
  initialCvv?: string;
  paymentAmount?: string;
  planName?: string;
  onPay?: (details: { cardNumber: string; cardholderName: string; expiryDate: string; cvv: string }) => void;
  onBack?: () => void;
}

// --- Icons ---
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardChipIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33258 8.33146H36.6584V31.6596H3.33258V8.33146Z" stroke="white" strokeOpacity="0.8" strokeWidth="3.33258" strokeLinejoin="round"/>
    <path d="M3.33258 16.6629H36.6584" stroke="white" strokeOpacity="0.8" strokeWidth="3.33258" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7.33002V14.66C2 14.7483 2.03513 14.8329 2.09765 14.8954C2.16018 14.9579 2.24483 14.9931 2.33316 14.9931H13.6665C13.7548 14.9931 13.8395 14.9579 13.902 14.8954C13.9645 14.8329 13.9997 14.7483 13.9997 14.66V7.33002" stroke="#155dfc" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.66455 1.33273V5.99729C4.66455 6.17387 4.73479 6.3431 4.86016 6.46847C4.98553 6.59384 5.15476 6.66408 5.33134 6.66408H10.665C10.8416 6.66408 11.0108 6.59384 11.1362 6.46847C11.2616 6.3431 11.3318 6.17387 11.3318 5.99729V1.33273" stroke="#155dfc" strokeWidth="1.33273" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// --- Sub-components ---

const CignalHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <div className="w-full h-[98.576px] bg-white border-b border-[#E5E7EB] flex items-center">
    <div className="flex items-center space-x-[11.999px] px-4 w-full max-w-[376px] mx-auto">
      <button onClick={onBack} className="w-[31.985px] h-[31.985px] flex items-center justify-center p-[4px]">
        <BackArrowIcon />
      </button>
      <div className="flex flex-col">
        <h2 className="text-[20px] leading-[30px] tracking-[-0.45px] font-medium font-inter text-[#101828]">
          Card Payment
        </h2>
        <p className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-[#4a5565]">
          Enter your card details
        </p>
      </div>
    </div>
  </div>
);

interface CignalCreditCardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
}

const CignalCreditCardPreview: React.FC<CignalCreditCardPreviewProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
}) => {
  const formattedCardNumber = useMemo(() => {
    // Basic formatting for display, assumes max 16 digits
    const num = cardNumber.padEnd(16, 'X');
    return `${num.substring(0, 4)} ${num.substring(4, 8)} ${num.substring(8, 12)} ${num.substring(12, 16)}`;
  }, [cardNumber]);

  const formattedExpiry = useMemo(() => expiryDate.padEnd(5, 'X'), [expiryDate]);
  const formattedCardholderName = useMemo(() => cardholderName || 'VS', [cardholderName]);

  return (
    <div className="w-[344.126px] h-[219.968px] rounded-[14px] p-6 relative flex flex-col justify-between
                    bg-gradient-to-b from-[#1A202B] to-[#2D3748]
                    shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-start">
        <CardChipIcon />
        <p className="text-[14px] leading-[16px] font-normal font-inter text-white/60">
          Credit/Debit Card
        </p>
      </div>
      <div className="mb-4">
        <p className="text-[20px] leading-[28px] tracking-[2px] font-normal font-menlo text-white">
          {formattedCardNumber}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <p className="text-[14px] leading-[16px] font-normal font-inter text-white/60">
            CARDHOLDER NAME
          </p>
          <p className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-white">
            {formattedCardholderName}
          </p>
        </div>
        <div className="flex flex-col text-right">
          <p className="text-[14px] leading-[16px] font-normal font-inter text-white/60">
            VALID THRU
          </p>
          <p className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-white">
            {formattedExpiry}
          </p>
        </div>
      </div>
    </div>
  );
};

interface CignalInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string | null;
  type?: 'text' | 'password' | 'number';
  maxLength?: number;
}

const CignalInputField: React.FC<CignalInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error = null,
  type = 'text',
  maxLength,
}) => (
  <div className="flex flex-col space-y-[7.996px] w-full">
    <label className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-[#101828]">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full h-[43.993px] px-4 py-3 rounded-[8px] bg-white text-[14px] leading-[17px] font-normal font-inter text-[#101828]/50 outline-none
                  ${error ? 'border-[0.582px] border-[#F82B36]' : 'border-[0.582px] border-[#D0D5DD] focus:border-[#155dfc]'}`}
    />
    {error && (
      <p className="text-[14px] leading-[16px] font-normal font-inter text-[#E7000B]">
        {error}
      </p>
    )}
  </div>
);

interface CignalCardFormProps {
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardNumberError: string | null;
  cardholderName: string;
  setCardholderName: (val: string) => void;
  cardholderNameError: string | null;
  expiryDate: string;
  setExpiryDate: (val: string) => void;
  expiryDateError: string | null;
  cvv: string;
  setCvv: (val: string) => void;
  cvvError: string | null;
}

const CignalCardForm: React.FC<CignalCardFormProps> = ({
  cardNumber, setCardNumber, cardNumberError,
  cardholderName, setCardholderName, cardholderNameError,
  expiryDate, setExpiryDate, expiryDateError,
  cvv, setCvv, cvvError,
}) => {
  const handleExpiryChange = (value: string) => {
    // Automatically add slash for MM/YY format
    let formattedValue = value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (formattedValue.length > 2 && !formattedValue.includes('/')) {
      formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
    }
    setExpiryDate(formattedValue.substring(0, 5)); // Limit to MM/YY (5 chars)
  };

  return (
    <div className="w-[344.126px] flex flex-col space-y-[15.992px]">
      <CignalInputField
        label="Card Number"
        value={cardNumber}
        onChange={setCardNumber}
        placeholder="•••• •••• •••• ••••"
        error={cardNumberError}
        type="text"
        maxLength={19} // 16 digits + 3 spaces
      />
      <CignalInputField
        label="Cardholder Name"
        value={cardholderName}
        onChange={setCardholderName}
        placeholder="VS"
        error={cardholderNameError}
      />
      <div className="flex space-x-[15.992px] w-full">
        <CignalInputField
          label="Expiry Date"
          value={expiryDate}
          onChange={handleExpiryChange}
          placeholder="MM/YY"
          error={expiryDateError}
          maxLength={5}
        />
        <CignalInputField
          label="CVV"
          value={cvv}
          onChange={setCvv}
          placeholder="•••"
          error={cvvError}
          type="password"
          maxLength={4}
        />
      </div>
    </div>
  );
};

interface CignalPaymentSummaryProps {
  planName: string;
  paymentAmount: string;
}

const CignalPaymentSummary: React.FC<CignalPaymentSummaryProps> = ({
  planName,
  paymentAmount,
}) => (
  <div className="w-[344.126px] rounded-[14px] border-[0.582px] border-[#E5E7EB] bg-[#F9FAFB] p-4 flex flex-col space-y-[11.999px]">
    <p className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-[#101828]">
      Payment Summary
    </p>
    <div className="flex justify-between items-center w-full">
      <p className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-[#4a5565]">
        {planName}
      </p>
      <p className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-[#101828]">
        {paymentAmount}
      </p>
    </div>
    <div className="flex items-center space-x-[7.996px] pt-4 border-t border-[#E5E7EB]">
      <LockIcon />
      <p className="text-[14px] leading-[16px] font-normal font-inter text-[#4a5565]">
        Your payment is secured and encrypted
      </p>
    </div>
  </div>
);

const CignalCtaButton: React.FC<{
  amount: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ amount, onClick, disabled }) => (
  <div className="w-full h-[76.561px] bg-white border-t border-[#E5E7EB] flex items-center justify-center">
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-[344.126px] h-[43.993px] rounded-[8px] bg-[#155dfc] flex items-center justify-center
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-[14px] leading-[20px] tracking-[-0.15px] font-normal font-inter text-white">
        Pay {amount}
      </span>
    </button>
  </div>
);


// --- Main Component ---
export const CignalWalletPaymentError: React.FC<CignalWalletPaymentErrorProps> = ({
  initialCardNumber = '',
  initialCardholderName = '',
  initialExpiryDate = '',
  initialCvv = '',
  paymentAmount = '₱399/month',
  planName = 'Premium Plan',
  onPay,
  onBack,
}) => {
  const [cardNumber, setCardNumber] = useState(initialCardNumber);
  const [cardholderName, setCardholderName] = useState(initialCardholderName);
  const [expiryDate, setExpiryDate] = useState(initialExpiryDate);
  const [cvv, setCvv] = useState(initialCvv);

  const [cardNumberError, setCardNumberError] = useState<string | null>('Please enter a valid card number');
  const [cardholderNameError, setCardholderNameError] = useState<string | null>('Please enter the cardholder name');
  const [expiryDateError, setExpiryDateError] = useState<string | null>(null); // No error for expiry in design
  const [cvvError, setCvvError] = useState<string | null>('Please enter CVV');

  // Simple validation for demonstration, can be extended
  const validateForm = useMemo(() => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isCardholderNameValid = cardholderName.trim().length > 0;
    const isExpiryDateValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
    const isCvvValid = /^\d{3,4}$/.test(cvv);

    setCardNumberError(isCardNumberValid ? null : 'Please enter a valid card number');
    setCardholderNameError(isCardholderNameValid ? null : 'Please enter the cardholder name');
    setExpiryDateError(isExpiryDateValid ? null : 'Please enter a valid expiry date (MM/YY)');
    setCvvError(isCvvValid ? null : 'Please enter CVV');

    return isCardNumberValid && isCardholderNameValid && isExpiryDateValid && isCvvValid;
  }, [cardNumber, cardholderName, expiryDate, cvv]);

  const handlePay = () => {
    if (validateForm) {
      onPay?.({ cardNumber, cardholderName, expiryDate, cvv });
      alert('Payment Initiated (simulated)!');
    } else {
      // Errors are already displayed via state
    }
  };

  return (
    <div className="w-[377px] h-[977px] overflow-auto bg-white flex flex-col mx-auto shadow-lg">
      <CignalHeader onBack={onBack} />
      <div className="flex flex-col items-center flex-grow py-6 space-y-[15.992px]">
        <CignalCreditCardPreview
          cardNumber={cardNumber}
          cardholderName={cardholderName}
          expiryDate={expiryDate}
        />
        <CignalCardForm
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardNumberError={cardNumberError}
          cardholderName={cardholderName}
          setCardholderName={setCardholderName}
          cardholderNameError={cardholderNameError}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          expiryDateError={expiryDateError}
          cvv={cvv}
          setCvv={setCvv}
          cvvError={cvvError}
        />
        <CignalPaymentSummary
          planName={planName}
          paymentAmount={paymentAmount}
        />
      </div>
      <CignalCtaButton
        amount={paymentAmount}
        onClick={handlePay}
        disabled={!validateForm}
      />
    </div>
  );
};