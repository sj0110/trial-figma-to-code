```typescript
// app/components/LoginScreen.tsx
'use client';

import React from 'react';

// --- Design System Mappings ---
// Typography
const TYPOGRAPHY_H1 = "font-normal text-[30px] leading-[36px] tracking-[0.3955px]"; // Inter Regular 30/36
const TYPOGRAPHY_BODY = "font-medium text-[14px] leading-[20px] tracking-[-0.15px]"; // Inter Medium 14/20

// --- Custom Tailwind Colors (Assuming these are defined in tailwind.config.ts) ---
// const colors = {
//   'color-1': '#ffffff', // white
//   'color-2': '#0a0a0a', // very dark gray
//   'color-3': '#155dfc', // strong blue
//   'color-4': '#6a7282', // medium gray
//   'color-5': '#4a5565', // dark gray-blue (not used in this component, but available)
//   'color-6': '#f3f3f5', // light gray
//   'color-7': '#717182', // medium-dark gray
//   'color-8': '#dbeafe', // light blue
//   'google-blue': '#4285f4',
//   'google-green': '#34a853',
//   'google-yellow': '#f9bc05',
//   'google-red': '#ea4335',
//   'facebook-blue': '#1877f2',
//   'primary-gradient-start': '#155dfc', // Lighter blue for gradient
//   'primary-gradient-end': '#4f39f6',   // Darker purple-blue for gradient
// };


// --- SVG Icon Components ---

const BiometricIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* All strokes are color-3 #155dfc, stroke-width approx 2 */}
    <path d="M10 10V16" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 13.119V22" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.2887 18V21.02" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 2H20V12H2V2Z" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 16H2.01" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.7984 10V16" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10V19.5" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.64937 20V22" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 6V14" stroke="#155dfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* All fill colors are from Google's palette */}
    <path d="M10.0001 8.33146L18.7981 1.74736L14.2468 19.1622L1.81626 11.7474C1.81626 11.7474 10.0001 8.33146 10.0001 8.33146Z" fill="#4285f4"/>
    <path d="M1.81626 11.7474L14.2468 19.1622L1.81626 11.7474C1.81626 11.7474 1.81626 11.7474 1.81626 11.7474Z" fill="#34a853"/>
    <path d="M0.833146 5.89034L4.86557 14.1052L0.833146 5.89034C0.833146 5.89034 0.833146 5.89034 0.833146 5.89034Z" fill="#f9bc05"/>
    <path d="M1.81626 0.833146L16.1297 8.25647L1.81626 0.833146C1.81626 0.833146 1.81626 0.833146 1.81626 0.833146Z" fill="#ea4335"/>
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fill color is Facebook Blue */}
    <path d="M19.9955 10.0608C19.9955 4.5447 15.5484 0.0976562 10.0323 0.0976562C4.51622 0.0976562 0.0691782 4.5447 0.0691782 10.0608C0.0691782 15.0061 3.73373 19.068 8.52845 19.9329V12.8722H5.97266V10.0608H8.52845V7.95754C8.52845 5.43384 10.0617 4.02677 12.3387 4.02677C13.4312 4.02677 14.5683 4.21851 14.5683 4.21851V6.65759H13.2359C11.9678 6.65759 11.5794 7.42998 11.5794 8.2125V10.0608H14.4449L13.9961 12.8722H11.5794V19.9329C16.3742 19.068 20.0387 15.0061 20.0387 10.0608H19.9955Z" fill="#1877f2"/>
  </svg>
);

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  return (
    <main className="relative w-[376px] h-[901px] overflow-hidden bg-white">
      {/* Background Gradient Layer */}
      {/* Figma's gradientTransform suggests a vertical gradient. To match common visual direction (lighter top, darker bottom) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#4f39f6] to-[#155dfc]" />

      {/* Top Logo and Title Section */}
      <section className="absolute top-[26px] left-[98px] w-[179.67px] h-[160px] flex flex-col items-center justify-start gap-[16px]">
        {/* Logo Container */}
        <div className="w-[80px] h-[80px] bg-white rounded-[16px] flex items-center justify-center">
          <span className={`${TYPOGRAPHY_H1} text-[#155dfc]`}>C1</span>
        </div>
        {/* Cignal One Heading */}
        <h1 className={`${TYPOGRAPHY_H1} text-white text-center w-full`}>Cignal One</h1>
        {/* Subtitle */}
        <p className={`${TYPOGRAPHY_BODY} text-[#dbeafe] text-center w-[180px]`}>Your all-in-one account hub</p>
      </section>

      {/* Main Content Card */}
      <section className="absolute top-[208px] w-full h-[693px] bg-white rounded-t-none pt-8 px-6 flex flex-col gap-6">
        {/* Welcome Back Heading */}
        <h2 className={`${TYPOGRAPHY_H1} text-[#0a0a0a]`}>Welcome back</h2>
        {/* Sign in description */}
        <p className={`${TYPOGRAPHY_BODY} text-[#6a7282]`}>Sign in to manage your Cignal services</p>

        {/* Biometric Button */}
        <button
          className={`${TYPOGRAPHY_BODY} flex items-center justify-center gap-[12px] w-full h-[59.5px] border-[1.75px] border-[#155dfc] rounded-[14px] text-[#155dfc] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
          aria-label="Sign in with Biometric"
        >
          <BiometricIcon />
          Sign in with Biometric
        </button>

        {/* Social Login Buttons */}
        <div className="flex justify-between gap-[12px] w-full h-[45.16px]">
          <button
            className={`${TYPOGRAPHY_BODY} flex-1 flex items-center justify-center gap-[8px] h-full border-[0.6px] border-[#d1d5db] rounded-[14px] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
            aria-label="Sign in with Google"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            className={`${TYPOGRAPHY_BODY} flex-1 flex items-center justify-center gap-[8px] h-full border-[0.6px] border-[#d1d5db] rounded-[14px] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
            aria-label="Sign in with Facebook"
          >
            <FacebookIcon />
            Facebook
          </button>
        </div>

        {/* Or continue with divider */}
        <div className="relative flex items-center justify-center h-[20px] mt-2">
          <div className="absolute w-full h-[0.58px] bg-[#d1d5db]" />
          <span className={`${TYPOGRAPHY_BODY} relative z-10 px-4 bg-white text-[#6a7282]`}>Or continue with</span>
        </div>

        {/* Password / One-Time PIN toggle */}
        <div className="flex w-full h-[48px] bg-[#f3f3f5] rounded-[10px] p-[4px] gap-[8px]">
          <button
            className={`${TYPOGRAPHY_BODY} flex-1 flex items-center justify-center h-full bg-white rounded-[8px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
            aria-label="Use Password for login"
          >
            Password
          </button>
          <button
            className={`${TYPOGRAPHY_BODY} flex-1 flex items-center justify-center h-full text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
            aria-label="Use One-Time PIN for login"
          >
            One-Time PIN
          </button>
        </div>

        {/* Form Inputs */}
        <form className="flex flex-col gap-[16px] w-full mt-[16px]">
          {/* Mobile Number / Email Input */}
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="mobileEmail" className={`${TYPOGRAPHY_BODY} text-[#0a0a0a]`}>
              Mobile Number / Email
            </label>
            <input
              id="mobileEmail"
              type="text"
              placeholder="Enter your mobile number or email"
              className={`w-full h-[36px] bg-[#f3f3f5] rounded-[8px] px-3 ${TYPOGRAPHY_BODY} text-[#717182] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
              aria-label="Mobile Number or Email"
            />
          </div>
          {/* Password Input */}
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className={`${TYPOGRAPHY_BODY} text-[#0a0a0a]`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`w-full h-[36px] bg-[#f3f3f5] rounded-[8px] px-3 ${TYPOGRAPHY_BODY} text-[#717182] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#155dfc]`}
              aria-label="Password"
            />
            <a href="#" className={`${TYPOGRAPHY_BODY} text-[#155dfc] self-start focus:outline-none focus:ring-2 focus:ring-[#155dfc]`} aria-label="Forgot Password?">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={`w-full h-[36px] bg-[#155dfc] rounded-[8px] ${TYPOGRAPHY_BODY} text-white focus:outline-none focus:ring-2 focus:ring-[#155dfc] mt-[16px]`}
            aria-label="Sign In"
          >
            Sign In
          </button>
        </form>

        {/* Create Account Link */}
        <p className={`${TYPOGRAPHY_BODY} text-[#717182] text-center mt-4`}>
          Don't have an account?{' '}
          <a href="#" className="text-[#155dfc] ml-1 focus:outline-none focus:ring-2 focus:ring-[#155dfc]" aria-label="Create Account">
            Create Account
          </a>
        </p>
      </section>
    </main>
  );
};

export default LoginScreen;
```