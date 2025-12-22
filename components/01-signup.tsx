// src/components/SignupScreen.tsx
import React, { useState, useMemo } from 'react'; // Ensure React 19 hooks

// --- Utils & Types ---

/**
 * Converts Figma's color object (0-1 range) to an rgba() CSS string or hex if no alpha.
 * @param color The Figma color object.
 * @returns A CSS rgba() string.
 */
const figmaColorToCss = (color: { r: number; g: number; b: number; a?: number }): string => {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  if (color.a !== undefined && color.a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${color.a})`;
  }
  // Convert to hex for cleaner output if no alpha is present
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Figma's color values for direct mapping for clarity
const DESIGN_COLORS = {
  'color-1': '#f3f3f5', // bg for inputs, checkboxes (fill for 2:2921, 2:2962)
  'color-2': '#0a0a0a', // primary text (black) (fill for 2:2911, 2:2920)
  'color-3': '#717182', // placeholder text, password hint, or-divider text (fill for 2:2922, 2:2949, 2:2989)
  'color-4': '#ffffff', // white (background, button text) (fill for 2:2998, 2:3000)
  'color-5': '#364153', // 'I agree to the...' text (fill for 2:2964)
  'color-6': '#155dfc', // primary blue (button background, links) (fill for 2:2980, 2:2914)
  'color-7': '#f9fafb', // screen background (fill for 2:2902, 2:2988)
  'color-8': '#6a7282', // line color, specific text (stroke for 2:2946)
  'color-9': '#4285f4', // Google blue icon (fill for 2:2906)
  'color-10': '#34a853', // Google green icon (fill for 2:2907)

  // Specific hex values from the structure that weren't in designSystem.colors
  'color-google-yellow': '#Fbbc04', // Inferred from 2:2908 fill
  'color-google-red': '#EA4335',    // Inferred from 2:2909 fill
  'color-border-subtle': figmaColorToCss({r: 0.8190176486968994, g: 0.835814893245697, b: 0.8610087633132935}), // From 2:2904 stroke, 2:2987 stroke
  'color-header-gradient-start': figmaColorToCss({r: 0.08361906558275223, g: 0.3644171357154846, b: 0.9863430261611938, a: 1}), // From 2:2993 gradient stop 0
  'color-header-gradient-end': figmaColorToCss({r: 0.30980393290519714, g: 0.2235294133424759, b: 0.9647058844566345, a: 1}), // From 2:2993 gradient stop 1
  'color-text-header-subtitle': figmaColorToCss({r: 0.85824054479599, g: 0.9178275465965271, b: 0.9972704648971558, a: 1}), // From 2:3002 fill
  'color-text-body-dark': figmaColorToCss({r: 0.211532324552536, g: 0.2550295889377594, b: 0.32470521330833435}), // From 2:2964, 2:2967, 2:2975, 2:2979
  'color-text-subtle-dark': figmaColorToCss({r: 0.41545435786247253, g: 0.4470909833908081, b: 0.5104967951774597}), // From 2:2949
  'color-text-subtle-grey': figmaColorToCss({r: 0.2888334393501282, g: 0.3335459232330322, b: 0.39611637592315674}), // From 2:2983
  'color-red-error': figmaColorToCss({r: 0.9826614260673523, g: 0.17179709672927856, b: 0.21307019889354706}) // From 2:2971
};

// Typography styles as per designSystem.typography, combined and mapped
const TYPOGRAPHY = {
  body: { // Matches typography[0] (16px, 400, 24px line, -0.3125px letter)
    className: 'font-inter text-base font-normal leading-6',
    style: { letterSpacing: '-0.3125px' }
  },
  label: { // Matches typography[1] (14px, 500, 14px line, -0.150390625px letter)
    className: 'font-inter text-sm font-medium leading-[14px]',
    style: { letterSpacing: '-0.150390625px' }
  },
  heading1: { // Inferred for "Create Account" 2:3000, 32px height of frame implies line-height, text height 32
    className: 'font-inter text-[28px] font-semibold leading-8', // Adjusted text size to fit within 32px height frame, 28px font, 32px line-height (leading-8)
    style: {}
  }
};


// Custom Components (following composition pattern)

interface BackIconProps {
  className?: string;
}
const BackIcon: React.FC<BackIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.49832 4.99888L7.49832 14.9966"
      stroke="white"
      strokeWidth="1.66629"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 10H7.5"
      stroke="white"
      strokeWidth="1.66629"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


interface GoogleIconProps {
  className?: string;
}
const GoogleIcon: React.FC<GoogleIconProps> = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M9.99775 8.33146L18.7958 8.33146V8.61473C18.7958 13.5658 15.1118 17.5 10.0003 17.5C4.88725 17.5 0.833146 13.5658 0.833146 8.61473C0.833146 3.66359 4.88725 -0.269409 10.0003 -0.269409V-0.269409C12.3592 -0.269409 14.4079 0.654877 15.8943 2.14443L15.8943 2.14443L14.3142 3.73373C13.2676 2.68417 11.7583 2.08059 10.0003 2.08059C6.46979 2.08059 3.55938 4.98971 3.55938 8.61473C3.55938 12.2398 6.46979 15.1489 10.0003 15.1489C13.5308 15.1489 16.4412 12.2398 16.4412 8.61473V8.33146H9.99775Z"
      fill={DESIGN_COLORS['color-9']} // Blue from original Figma data
      fillRule="evenodd"
      clipRule="evenodd"
    />
    <path
      d="M1.81626 11.7474L16.0631 11.7474V11.7474L16.0631 11.7474C16.0631 12.8711 15.8596 13.9483 15.4678 14.9397L15.4678 14.9397L15.4678 14.9397L1.81626 11.7474Z"
      fill={DESIGN_COLORS['color-10']} // Green
      fillRule="evenodd"
      clipRule="evenodd"
    />
    <path
      d="M0.833146 5.89034L4.86557 5.89034V5.89034L4.86557 5.89034C4.86557 5.09707 4.70831 4.33139 4.41727 3.63004L4.41727 3.63004L4.41727 3.63004L0.833146 5.89034Z"
      fill={DESIGN_COLORS['color-google-yellow']} // Yellow, approximated as design system has no direct yellow
      fillRule="evenodd"
      clipRule="evenodd"
    />
    <path
      d="M1.81626 0.833146L16.1297 0.833146V0.833146L16.1297 0.833146C16.1297 1.95681 15.9262 3.03397 15.5344 4.02542L15.5344 4.02542L15.5344 4.02542L1.81626 0.833146Z"
      fill={DESIGN_COLORS['color-google-red']} // Red, approximated
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);


interface FacebookIconProps {
  className?: string;
}
const FacebookIcon: React.FC<FacebookIconProps> = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.9955 0.0608194C19.9955 0.0608194 0 0.0608194 0 0.0608194C0 0.0608194 0.000355259 19.9355 0.000355259 19.9355C0.000355259 19.9355 19.9955 19.9355 19.9955 19.9355C19.9955 19.9355 19.9955 0.0608194 19.9955 0.0608194ZM13.8863 6.64969L13.8863 4.39706H11.5312C10.198 4.39706 9.49755 5.06041 9.49755 6.0963V8.27117H13.8863L13.5683 12.3382H9.49755V19.9355H4.27103V12.3382H0.875306V8.27117H4.27103V5.88173C4.27103 2.65996 6.32742 0.0608194 9.87329 0.0608194H13.8863V0.0608194H13.8863V6.64969Z"
      fill={DESIGN_COLORS['color-6']} // Blue
    />
  </svg>
);


interface EyeIconProps {
  className?: string;
  isOpen: boolean;
  onClick: () => void;
}
const EyeIcon: React.FC<EyeIconProps> = ({ className, isOpen, onClick }) => (
  <button type="button" onClick={onClick} className={className} aria-label={isOpen ? "Hide password" : "Show password"}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.66586 10C2.97743 6.66667 6.32637 4.16667 9.99775 4.16667C13.6691 4.16667 17.018 6.66667 18.3296 10C17.018 13.3333 13.6691 15.8333 9.99775 15.8333C6.32637 15.8333 2.97743 13.3333 1.66586 10Z"
        stroke={DESIGN_COLORS['color-8']}
        strokeWidth="1.66629"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.49832 10C7.49832 8.61929 8.61695 7.5 9.99775 7.5C11.3785 7.5 12.4972 8.61929 12.4972 10C12.4972 11.3807 11.3785 12.5 9.99775 12.5C8.61695 12.5 7.49832 11.3807 7.49832 10Z"
        stroke={DESIGN_COLORS['color-8']}
        strokeWidth="1.66629"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);


interface SocialButtonProps {
  icon: 'google' | 'facebook';
  label: string;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick }) => (
  <button
    type="button"
    className="flex items-center justify-center w-full h-[49.16px] gap-3 bg-white border border-[var(--color-border-subtle)] rounded-[14px]"
    style={{borderWidth: '0.582217px'}} // Exact border width from Figma
    onClick={onClick}
  >
    {icon === 'google' ? <GoogleIcon /> : <FacebookIcon />}
    <span className={`${TYPOGRAPHY.body.className} text-[var(--color-2)]`} style={TYPOGRAPHY.body.style}>
      {label}
    </span>
  </button>
);

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type = 'text', value, onChange, hint, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-2">
      <label className={`${TYPOGRAPHY.label.className} text-[var(--color-2)]`} style={TYPOGRAPHY.label.style}>
        {label} {required && <span className="text-[var(--color-red-error)]">*</span>}
      </label>
      <div className="relative flex items-center w-full h-[36px]">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${TYPOGRAPHY.body.className} flex-grow h-full px-3 py-2 bg-[var(--color-1)] rounded-lg text-[var(--color-2)] placeholder-[var(--color-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-6)]`}
          style={TYPOGRAPHY.body.style}
          aria-label={label}
        />
        {type === 'password' && (
          <EyeIcon
            isOpen={showPassword}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer"
          />
        )}
      </div>
      {hint && (
        <p className={`${TYPOGRAPHY.body.className} text-[var(--color-3)]`} style={TYPOGRAPHY.body.style}>
          {hint}
        </p>
      )}
    </div>
  );
};

interface CheckboxProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
  <div className="flex items-start gap-3 w-full min-h-[20px]"> {/* min-h added to accommodate multiline labels */}
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="appearance-none w-4 h-4 bg-[var(--color-1)] border border-[rgba(0,0,0,0.1)] rounded-sm shadow-sm checked:bg-[var(--color-6)] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-6)] cursor-pointer mt-1"
      aria-checked={checked}
    />
    <label htmlFor={id} className={`${TYPOGRAPHY.body.className} flex-1 text-[var(--color-text-body-dark)] cursor-pointer`} style={TYPOGRAPHY.body.style}>
      {label}
    </label>
  </div>
);


// Main Component
interface SignupScreenProps {}

export const SignupScreen: React.FC<SignupScreenProps> = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);
  const [subscribeNewsletters, setSubscribeNewsletters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      fullName, email, phone, address, password, confirmPassword,
      agreedToTerms, receiveEmails, subscribeNewsletters
    });
    // Add form submission logic here
  };

  // Define CSS variables for easier color management and consistency with Figma
  // These would ideally be in tailwind.config.js or a global CSS file for a larger project
  const rootStyles = useMemo(() => ({
    '--color-1': DESIGN_COLORS['color-1'],
    '--color-2': DESIGN_COLORS['color-2'],
    '--color-3': DESIGN_COLORS['color-3'],
    '--color-4': DESIGN_COLORS['color-4'],
    '--color-5': DESIGN_COLORS['color-5'],
    '--color-6': DESIGN_COLORS['color-6'],
    '--color-7': DESIGN_COLORS['color-7'],
    '--color-8': DESIGN_COLORS['color-8'],
    '--color-9': DESIGN_COLORS['color-9'],
    '--color-10': DESIGN_COLORS['color-10'],
    '--color-google-yellow': DESIGN_COLORS['color-google-yellow'],
    '--color-google-red': DESIGN_COLORS['color-google-red'],
    '--color-border-subtle': DESIGN_COLORS['color-border-subtle'],
    '--color-header-gradient-start': DESIGN_COLORS['color-header-gradient-start'],
    '--color-header-gradient-end': DESIGN_COLORS['color-header-gradient-end'],
    '--color-text-header-subtitle': DESIGN_COLORS['color-text-header-subtitle'],
    '--color-text-body-dark': DESIGN_COLORS['color-text-body-dark'],
    '--color-text-subtle-dark': DESIGN_COLORS['color-text-subtle-dark'],
    '--color-text-subtle-grey': DESIGN_COLORS['color-text-subtle-grey'],
    '--color-red-error': DESIGN_COLORS['color-red-error'],
  } as React.CSSProperties), []);

  return (
    <div
      className="relative w-[377px] min-h-[1159px] bg-[var(--color-4)] overflow-hidden" // Main frame 01 - Signup
      style={rootStyles}
    >
      {/* Top Gradient Header */}
      <div
        className="absolute top-0 left-0 w-[376.11px] h-[167.97px] bg-gradient-to-br from-[var(--color-header-gradient-start)] to-[var(--color-header-gradient-end)]" // SignupScreen header
      >
        <button className="absolute left-6 top-12 flex items-center gap-2" aria-label="Go back">
          <BackIcon />
          <span className={`${TYPOGRAPHY.body.className} text-[var(--color-4)]`} style={TYPOGRAPHY.body.style}>Back</span>
        </button>
        <h1 className={`${TYPOGRAPHY.heading1.className} absolute left-6 top-[88px] text-[var(--color-4)]`} style={TYPOGRAPHY.heading1.style}>
          Create Account
        </h1>
        <p className={`${TYPOGRAPHY.body.className} absolute left-6 top-[124px] text-[var(--color-text-header-subtitle)]`} style={TYPOGRAPHY.body.style}>
          Join Cignal One today
        </p>
      </div>

      {/* Main Content Area */}
      <div
        className="absolute top-[167.97px] left-0 w-[376.11px] min-h-[990px] bg-[var(--color-7)] pb-10" // SignupScreen content frame
      >
        <div className="px-6 py-6 flex flex-col gap-6"> {/* Container 2:2903 and other form sections */}
          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3">
            <SocialButton icon="google" label="Continue with Google" onClick={() => console.log('Google Sign-up')} />
            <SocialButton icon="facebook" label="Continue with Facebook" onClick={() => console.log('Facebook Sign-up')} />
          </div>

          {/* Or Sign Up Divider */}
          <div className="relative flex items-center justify-center h-[20px]">
            <div className="absolute w-full h-px bg-[var(--color-border-subtle)]"></div>
            <span className={`${TYPOGRAPHY.body.className} relative z-10 bg-[var(--color-7)] px-4 text-[var(--color-3)]`} style={TYPOGRAPHY.body.style}>
              Or sign up with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <InputField
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              label="Phone Number"
              placeholder="Enter your mobile number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputField
              label="Address"
              placeholder="Enter your complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <InputField
              label="Password"
              placeholder="Create a strong password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Must be at least 8 characters with letters and numbers"
              required
            />
            <InputField
              label="Confirm Password"
              placeholder="Re-enter your password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Checkboxes */}
            <div className="flex flex-col gap-4 pt-2">
              <Checkbox
                id="agreeTerms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                label={
                  <>
                    I agree to the <a href="#" className="text-[var(--color-6)] underline inline-block" style={TYPOGRAPHY.body.style}>Privacy Policy</a> and <a href="#" className="text-[var(--color-6)] underline inline-block" style={TYPOGRAPHY.body.style}>Terms of Service</a>
                    <span className="text-[var(--color-red-error)]">*</span>
                  </>
                }
              />
              <Checkbox
                id="receiveEmails"
                checked={receiveEmails}
                onChange={(e) => setReceiveEmails(e.target.checked)}
                label="I want to receive promotional emails and special offers"
              />
              <Checkbox
                id="subscribeNewsletters"
                checked={subscribeNewsletters}
                onChange={(e) => setSubscribeNewsletters(e.target.checked)}
                label="Subscribe to newsletters for updates and tips"
              />
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full h-[36px] bg-[var(--color-6)] rounded-lg flex items-center justify-center mt-3"
            >
              <span className={`${TYPOGRAPHY.body.className} text-[var(--color-4)]`} style={TYPOGRAPHY.body.style}>Create Account</span>
            </button>
          </form>

          {/* Sign In Link */}
          <p className={`${TYPOGRAPHY.body.className} text-center text-[var(--color-text-subtle-grey)]`} style={TYPOGRAPHY.body.style}>
            Already have an account?{' '}
            <a href="#" className="text-[var(--color-6)] underline" style={TYPOGRAPHY.body.style}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};