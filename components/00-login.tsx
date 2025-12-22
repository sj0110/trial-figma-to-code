// src/components/LoginScreen.tsx
import React, { useState, useMemo } from 'react';

// --- Utils & Types ---

/**
 * Converts Figma's color object (0-1 range) to an rgb() or rgba() CSS string.
 * @param color The Figma color object.
 * @returns A CSS rgb() or rgba() string.
 */
const figmaColorToRgb = (color: { r: number; g: number; b: number; a?: number }): string => {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  if (color.a !== undefined && color.a < 1) {
    // Ensure alpha is clamped between 0 and 1
    const a = Math.max(0, Math.min(1, color.a));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Represents the structure of a typography style extracted from design data.
 */
interface TypographyStyle {
  fontFamily: { family: string; style: string };
  fontSize: number;
  fontWeight: number;
  lineHeight: { unit: 'PIXELS'; value: number };
  letterSpacing: { unit: 'PIXELS'; value: number };
}

/**
 * Generates Tailwind CSS classes for typography based on design data.
 * Assumes 'Inter' font is configured in Tailwind CSS.
 * @param typography The typography style object.
 * @returns A string of Tailwind CSS classes.
 */
const getTypographyClasses = (typography: TypographyStyle): string => {
  const { fontSize, fontWeight, lineHeight, letterSpacing } = typography;
  const fontFamilyClass = `font-inter`; // Assuming 'Inter' is configured as default or 'font-inter'
  const fontWeightClass = `font-[${fontWeight}]`; // Use arbitrary value for precise weight
  const fontSizeClass = `text-[${fontSize}px]`;
  const lineHeightClass = `leading-[${lineHeight.value}px]`;
  const letterSpacingClass = `tracking-[${letterSpacing.value}px]`;
  return `${fontFamilyClass} ${fontWeightClass} ${fontSizeClass} ${lineHeightClass} ${letterSpacingClass}`;
};

// --- Custom Icon Components (Simplified due to missing SVG path data in JSON) ---
// NOTE: For true pixel-perfect SVG rendering, 'pathData' for Vector nodes would be required.
// These icons are simplified geometric approximations based on bounding boxes and fills/strokes provided.

/**
 * Represents the Biometric icon, simplified as path data is missing.
 * @param props.color The stroke color for the icon.
 * @param props.size The width and height of the icon in pixels.
 */
const BiometricIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Simplified representation based on typical biometric/fingerprint icon elements */}
    <path d="M8 10C8 8.34315 9.34315 7 11 7H13C14.6569 7 16 8.34315 16 10V14C16 15.6569 14.6569 17 13 17H11C9.34315 17 8 15.6569 8 14V10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10.5V13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 12H13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Represents the Google icon, simplified as path data is missing.
 * Attempts to recreate the colored segments based on the provided bounding boxes and colors.
 * @param props.size The width and height of the icon in pixels.
 */
const GoogleIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Simplified representation of Google 'G' logo segments */}
    <path d="M19.9975 8.33146H10.0023V11.6687H15.4984C15.2405 12.8687 14.5375 13.9187 13.5675 14.6187L13.5674 14.6188L15.9999 16.4999C17.3999 15.2499 18.3999 13.5828 18.8999 11.7474H19.9975V8.33146Z" fill={figmaColorToRgb({ r: 0.25882354378700256, g: 0.5215686559677124, b: 0.95686274766922 })}/>
    <path d="M1.81626 11.7474L0.833146 14.7474C1.33315 16.1687 2.33315 17.3828 3.56742 18.2147L6.81626 15.7474L1.81626 11.7474Z" fill={figmaColorToRgb({ r: 0.20392157137393951, g: 0.658823549747467, b: 0.32549020648002625 })}/>
    <path d="M1.81626 8.21473L0.833146 5.21473C0.833146 5.21473 1.33315 3.86873 2.56742 2.74742L6.81626 5.21473L1.81626 8.21473Z" fill={figmaColorToRgb({ r: 0.9843137264251709, g: 0.7372549176216125, b: 0.019607843831181526 })}/>
    <path d="M6.81626 5.21473L3.56742 2.74742C4.80169 1.58133 6.44042 0.833146 8.21473 0.833146C10.0001 0.833146 11.7474 1.50009 13.0001 2.58133L16.0001 0C14.0001 -1.33333 11.2499 -1.66667 8.21473 -1.66667C6.44042 -1.66667 4.80169 -1.16667 3.56742 -0.333332L1.81626 0.833146V5.21473Z" fill={figmaColorToRgb({ r: 0.9176470637321472, g: 0.26274511218070984, b: 0.2078431397676468 })}/>
  </svg>
);

/**
 * Represents the Facebook icon, simplified as path data is missing.
 * Uses a basic rounded rectangle and a 'f' path.
 * @param props.size The width and height of the icon in pixels.
 */
const FacebookIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Simplified representation of Facebook 'f' logo */}
    <rect width="20" height="20" rx="9.99" fill={figmaColorToRgb({ r: 0.0941176488995552, g: 0.46666666865348816, b: 0.9490196108818054 })} />
    <path d="M12.9167 10.8333H11.25V18.3333H8.33333V10.8333H6.66667V8.33333H8.33333V6.66667C8.33333 4.98157 9.7149 3.59999 11.3999 3.59999H12.9167V6.08333H11.3999C11.3999 6.08333 11.25 6.08333 11.25 6.66667V8.33333H12.9167L12.9167 10.8333Z" fill="white" />
  </svg>
);


// --- Reusable Sub-Components ---

interface AppTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const AppText: React.FC<AppTextProps> = ({ content, className = '', style }) => (
  <p className={className} style={style}>{content}</p>
);

interface AppButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel: string; // Critical for accessibility
  style?: React.CSSProperties;
}

const AppButton: React.FC<AppButtonProps> = ({ children, className = '', onClick, ariaLabel, style }) => (
  <button type="button" className={className} onClick={onClick} aria-label={ariaLabel} style={style}>
    {children}
  </button>
);

interface AppInputProps {
  label: string;
  placeholder: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  id: string; // Critical for accessibility (label association)
  className?: string;
  style?: React.CSSProperties;
}

const AppInput: React.FC<AppInputProps> = ({ label, placeholder, type = 'text', id, className = '', style }) => (
  <div className="flex flex-col gap-2 w-full">
    <label
      htmlFor={id}
      className="font-inter text-[14px] leading-[20px] font-medium" // Inferred from typography[1] or common label style
      style={{ color: figmaColorToRgb({ r: 0.03938823565840721, g: 0.03938823565840721, b: 0.03938823565840721 }) }}
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`font-inter text-[14px] leading-[20px] p-3 rounded-lg border-none focus:outline-none placeholder:text-gray-500 ${className}`}
      style={{
        backgroundColor: figmaColorToRgb({ r: 0.9529411792755127, g: 0.9529411792755127, b: 0.9607843160629272 }),
        color: figmaColorToRgb({ r: 0.4431372582912445, g: 0.4431372582912445, b: 0.5098039507865906 }),
        ...style
      }}
    />
  </div>
);


// --- LoginScreen Main Component ---

export interface LoginScreenProps {
  // No specific props required for this standalone component based on the provided design data.
  // Add any global props here if the component needs to be configurable externally.
}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [selectedAuthMethod, setSelectedAuthMethod] = useState<'password' | 'otp'>('password');

  // Memoized typography classes for performance and reusability
  const typographyInterRegular30_36 = useMemo(() => getTypographyClasses({
    fontFamily: { family: "Inter", style: "Regular" },
    fontSize: 30,
    fontWeight: 400,
    lineHeight: { unit: "PIXELS", value: 36 },
    letterSpacing: { unit: "PIXELS", value: 0.3955078125 }
  }), []);

  const typographyInterMedium14_20 = useMemo(() => getTypographyClasses({
    fontFamily: { family: "Inter", style: "Medium" },
    fontSize: 14,
    fontWeight: 500,
    lineHeight: { unit: "PIXELS", value: 20 },
    letterSpacing: { unit: "PIXELS", value: -0.150390625 }
  }), []);

  // Centralized color definitions using figmaColorToRgb for precision
  const figmaColors = useMemo(() => ({
    white: figmaColorToRgb({ r: 1, g: 1, b: 1 }),
    blackText: figmaColorToRgb({ r: 0.03938823565840721, g: 0.03938823565840721, b: 0.03938823565840721 }),
    primaryBlue: figmaColorToRgb({ r: 0.08361906558275223, g: 0.3644171357154846, b: 0.9863430261611938 }),
    secondaryGrayText: figmaColorToRgb({ r: 0.41545435786247253, g: 0.4470909833908081, b: 0.5104967951774597 }),
    lightBlueText: figmaColorToRgb({ r: 0.85824054479599, g: 0.9178275465965271, b: 0.9972704648971558 }),
    socialBorderGray: figmaColorToRgb({ r: 0.8190176486968994, g: 0.835814893245697, b: 0.8610087633132935 }),
    tabBgGray: figmaColorToRgb({ r: 0.9529411792755127, g: 0.95686274766922, b: 0.9647058844566345 }),
    tabInactiveText: figmaColorToRgb({ r: 0.2888334393501282, g: 0.3335459232330322, b: 0.39611637592315674 }),
  }), []);

  const gradientStart = figmaColorToRgb({ r: 0.08361906558275223, g: 0.3644171357154846, b: 0.9863430261611938, a: 1 });
  const gradientEnd = figmaColorToRgb({ r: 0.30980393290519714, g: 0.2235294133424759, b: 0.9647058844566345, a: 1 });

  return (
    <div
      className="flex flex-col min-h-screen w-full max-w-[376px] mx-auto relative overflow-hidden font-inter"
      style={{
        // Fixed dimensions from design metadata
        width: '376px',
        height: '901px',
        // Linear gradient background for the main frame
        background: `linear-gradient(0deg, ${gradientEnd} 0%, ${gradientStart} 100%)`, // Adjusted gradient direction
      }}
      aria-label="Login Screen"
      role="region" // Semantic role for main content area
    >
      {/* Top Section: Logo & Title */}
      <div className="relative w-full flex flex-col items-center pt-[26px] pb-[160px] z-10">
        <div className="flex flex-col items-center w-[179.67px] h-[159.97px]"> {/* Container 2:2833 */}
          {/* Logo container 2:2834 */}
          <div className="relative w-[79.99px] h-[79.99px] rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: figmaColors.white }}>
            {/* "C1" Text 2:2836 */}
            <AppText
              content="C1"
              className={typographyInterRegular30_36}
              style={{ color: figmaColors.primaryBlue }}
            />
          </div>
          {/* "Cignal One" Heading 2:2838 */}
          <h1 className={`${typographyInterRegular30_36} text-center w-full`} style={{ color: figmaColors.white }}>
            Cignal One
          </h1>
          {/* "Your all-in-one account hub" Paragraph 2:2840 */}
          <AppText
            content="Your all-in-one account hub"
            className={`${typographyInterMedium14_20} text-center w-full`}
            style={{ color: figmaColors.lightBlueText, marginTop: '4px' }}
          />
        </div>
      </div>

      {/* Bottom Section: Login Form and Actions */}
      <div
        className="absolute bottom-0 w-full rounded-t-3xl p-6 flex flex-col gap-6"
        style={{
          backgroundColor: figmaColors.white,
          height: '692.54px', // Based on design structure's height
          boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', // Approximated shadow
        }}
        role="main"
      >
        {/* "Welcome back" Heading 2:2843 */}
        <h2 className="font-inter text-[28px] leading-[32px] font-semibold" style={{ color: figmaColors.blackText, marginTop: '8px' }}>
          Welcome back
        </h2>
        {/* "Sign in to manage your Cignal services" Paragraph 2:2845 */}
        <AppText
          content="Sign in to manage your Cignal services"
          className="font-inter text-base leading-6" // Inferred from height 24
          style={{ color: figmaColors.secondaryGrayText }}
        />

        {/* Sign in with Biometric Button 2:2846 */}
        <AppButton
          className="flex items-center justify-center py-4 px-6 rounded-xl border w-full"
          style={{ borderColor: figmaColors.primaryBlue, borderWidth: '1.75px' }}
          ariaLabel="Sign in with Biometric"
        >
          <BiometricIcon color={figmaColors.primaryBlue} size={24} />
          <AppText
            content="Sign in with Biometric"
            className={`${typographyInterMedium14_20} ml-3`}
            style={{ color: figmaColors.primaryBlue }}
          />
        </AppButton>

        {/* "Or continue with" Separator 2:2897 */}
        <div className="relative flex items-center justify-center my-2 h-5"> {/* Height 19.99 for Container 2:2897 */}
          <div className="absolute w-full h-[0.58px]" style={{ backgroundColor: figmaColors.socialBorderGray }}></div> {/* Line 2:2898 */}
          <div className="relative px-4" style={{ backgroundColor: figmaColors.white }}>
            <AppText
              content="Or continue with" // Text 2:2900
              className={typographyInterMedium14_20}
              style={{ color: figmaColors.secondaryGrayText }}
            />
          </div>
        </div>

        {/* Social Login Buttons Container 2:2859 */}
        <div className="flex justify-between gap-3 w-full">
          {/* Google Button 2:2860 */}
          <AppButton
            className="flex items-center justify-center flex-1 py-3 px-4 rounded-xl border"
            style={{ borderColor: figmaColors.socialBorderGray, borderWidth: '0.58px' }}
            ariaLabel="Sign in with Google"
          >
            <GoogleIcon size={20} />
            <AppText
              content="Google" // Text 2:2867
              className={`${typographyInterMedium14_20} ml-2`}
              style={{ color: figmaColors.blackText }}
            />
          </AppButton>
          {/* Facebook Button 2:2868 */}
          <AppButton
            className="flex items-center justify-center flex-1 py-3 px-4 rounded-xl border"
            style={{ borderColor: figmaColors.socialBorderGray, borderWidth: '0.58px' }}
            ariaLabel="Sign in with Facebook"
          >
            <FacebookIcon size={20} />
            <AppText
              content="Facebook" // Text 2:2872
              className={`${typographyInterMedium14_20} ml-2`}
              style={{ color: figmaColors.blackText }}
            />
          </AppButton>
        </div>

        {/* Auth Method Tabs Container 2:2873 */}
        <div
          className="flex w-full rounded-lg p-1 justify-between"
          style={{ backgroundColor: figmaColors.tabBgGray }}
          role="tablist"
        >
          {/* Password Tab Button 2:2874 */}
          <AppButton
            onClick={() => setSelectedAuthMethod('password')}
            className={`flex-1 py-2 rounded-lg text-center transition-all duration-200 ${selectedAuthMethod === 'password' ? 'shadow-md' : ''}`}
            style={{
              backgroundColor: selectedAuthMethod === 'password' ? figmaColors.white : 'transparent',
            }}
            ariaLabel="Select password login method"
            role="tab"
            aria-selected={selectedAuthMethod === 'password'}
          >
            <AppText
              content="Password" // Text 2:2875
              className="font-inter text-base leading-6 font-medium" // Inferred from height 24
              style={{
                color: selectedAuthMethod === 'password' ? figmaColors.blackText : figmaColors.tabInactiveText,
              }}
            />
          </AppButton>
          {/* One-Time PIN Tab Button 2:2876 */}
          <AppButton
            onClick={() => setSelectedAuthMethod('otp')}
            className={`flex-1 py-2 rounded-lg text-center transition-all duration-200 ${selectedAuthMethod === 'otp' ? 'shadow-md' : ''}`}
            style={{
              backgroundColor: selectedAuthMethod === 'otp' ? figmaColors.white : 'transparent',
            }}
            ariaLabel="Select one-time PIN login method"
            role="tab"
            aria-selected={selectedAuthMethod === 'otp'}
          >
            <AppText
              content="One-Time PIN" // Text 2:2877
              className="font-inter text-base leading-6 font-medium" // Inferred from height 24
              style={{
                color: selectedAuthMethod === 'otp' ? figmaColors.blackText : figmaColors.tabInactiveText,
              }}
            />
          </AppButton>
        </div>

        {/* Login Form Fields Container 2:2878 */}
        <form className="flex flex-col gap-4 w-full" aria-live="polite">
          {/* Mobile Number / Email Input 2:2879 */}
          <AppInput
            id="mobileEmail"
            label="Mobile Number / Email" // Label 2:2881
            placeholder="Enter your mobile number or email" // Placeholder 2:2883
            type="text"
            className="h-[36px]"
          />
          {/* Password Input 2:2884 */}
          <AppInput
            id="password"
            label="Password" // Label 2:2886
            placeholder="Enter your password" // Placeholder 2:2888
            type="password"
            className="h-[36px]"
          />
          {/* Forgot Password Button 2:2889 */}
          <AppButton
            className="self-start font-inter text-base leading-5 font-medium" // Inferred from height 20
            style={{ color: figmaColors.primaryBlue }}
            ariaLabel="Forgot password?"
          >
            Forgot Password?
          </AppButton>
          {/* Sign In Button 2:2891 */}
          <AppButton
            className="w-full py-3 rounded-lg font-medium"
            style={{ backgroundColor: figmaColors.primaryBlue }}
            ariaLabel="Sign In"
          >
            <AppText
              content="Sign In" // Text 2:2892
              className={typographyInterMedium14_20} // Matched with typography[1]
              style={{ color: figmaColors.white }}
            />
          </AppButton>
        </form>

        {/* Create Account Link 2:2893 */}
        <div className="flex justify-center text-base mt-4 w-full">
          <AppText
            content="Don't have an account?" // Text 2:2894
            className="font-inter text-base leading-6" // Inferred from height 24
            style={{ color: figmaColors.tabInactiveText }}
          />
          <AppButton
            className="ml-1 font-inter text-base leading-6 font-medium" // Inferred from height 24
            style={{ color: figmaColors.primaryBlue }}
            ariaLabel="Create a new account"
          >
            Create Account {/* Text 2:2896 */}
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;