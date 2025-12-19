An expert frontend developer would approach this by first setting up the foundational pieces like theme configuration, and then building the UI from modular, reusable components. Although the request is for a single file, the code will be structured internally as if it were composed of multiple components to demonstrate best practices in structure and maintainability.

### `tailwind.config.ts`

First, you would configure Tailwind CSS to use the colors and fonts from the design system. This file is essential for a production-ready setup.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#155dfc',
          'primary-light': '#dbeafe',
        },
        'text': {
          'primary': '#0a0a0a',
          'secondary': '#4a5565',
          'muted': '#6a7282',
          'subtle': '#717182',
        },
        'surface': {
          'primary': '#ffffff',
          'secondary': '#f3f3f5',
        },
        // Social colors from design data
        'google-blue': '#4285f4',
        'google-green': '#34a853',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        // Corresponds to 30px from design data
        '3.5xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      letterSpacing: {
        // Custom values from design data
        'wide-lg': '0.025em', // Approx 0.39px for 30px font
        'tight-sm': '-0.01em', // Approx -0.15px for 14px font
      },
    },
  },
  plugins: [],
}
export default config
```

### `layout.tsx`

Next, you would set up the root layout to import the 'Inter' font, which is specified in the design system.

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Cignal One - Login',
  description: 'Your all-in-one account hub. Sign in to manage your Cignal services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter bg-surface-secondary`}>
        {children}
      </body>
    </html>
  );
}
```

### Login Page Code

Here is the complete, production-ready code for the login page, contained within a single file as requested.

```typescript
// app/page.tsx
'use client';

import { useState, type SVGProps } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// Since this is a client component, we define metadata here for reference.
// In a real App Router project, this would be exported from a server component or page.tsx.
export const metadata: Metadata = {
  title: 'Cignal One - Login',
  description: 'Your all-in-one account hub. Sign in to manage your Cignal services.',
};

// ============================================================================
//  ICON COMPONENTS
//  In a larger project, these would be in their own files (e.g., /components/icons).
//  They are included here to fulfill the single-file requirement.
// ============================================================================

const BiometricIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16 7.5H16.5C18.7091 7.5 20.5 9.29086 20.5 11.5V12.5C20.5 14.7091 18.7091 16.5 16.5 16.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 7.5H7.5C5.29086 7.5 3.5 9.29086 3.5 11.5V12.5C3.5 14.7091 5.29086 16.5 7.5 16.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8.5 4.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 4.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.5 4.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 17.5V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 17.5V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 17.5V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 10.5H7.5C8.32843 10.5 9 11.1716 9 12C9 12.8284 8.32843 13.5 7.5 13.5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 10.5H16.5C15.6716 10.5 15 11.1716 15 12C15 12.8284 15.6716 13.5 16.5 13.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12.5 9.5V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19.7997 10.2242C19.7997 9.52423 19.7397 8.84423 19.6297 8.18423H10.1997V11.8642H15.6497C15.4297 13.0642 14.7697 14.1142 13.7997 14.7742V17.2642H16.8997C18.7297 15.5442 19.7997 13.0742 19.7997 10.2242Z" fill="#4285F4"/>
    <path d="M10.1998 20.0001C12.8998 20.0001 15.1998 19.1101 16.8998 17.2601L13.7998 14.7701C12.9298 15.3401 11.7598 15.6901 10.1998 15.6901C7.67979 15.6901 5.56979 14.0101 4.79979 11.7201H1.58979V14.2901C3.25979 17.6501 6.48979 20.0001 10.1998 20.0001Z" fill="#34A853"/>
    <path d="M4.79995 11.72C4.58995 11.11 4.46995 10.45 4.46995 9.76001C4.46995 9.07001 4.58995 8.41001 4.79995 7.8L1.58995 5.23C0.579952 7.21001 0 9.76001 0 9.76001C0 9.76001 0.579952 12.31 1.58995 14.29L4.79995 11.72Z" fill="#FBBC05"/>
    <path d="M10.1998 3.82996C11.6698 3.82996 12.9798 4.34996 13.8498 5.16996L16.9698 2.04996C15.1898 0.779956 12.8998 0 10.1998 0C6.48979 0 3.25979 2.34996 1.58979 5.70996L4.79979 8.27996C5.56979 5.98996 7.67979 3.82996 10.1998 3.82996Z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16.2043 10.3344C16.2753 13.1077 18.5997 14.7351 18.7303 14.8027C18.6678 14.9751 17.844 17.1517 16.2891 18.7508C15.5401 19.5239 14.6074 20.0354 13.633 20.0354C12.6076 20.0145 12.247 19.4613 10.8242 19.4613C9.40142 19.4613 8.98993 20.0145 8.05719 20.0563C7.08272 20.0772 6.17096 19.5029 5.42194 18.7299C3.05584 16.3533 2.14408 12.6033 3.65733 9.74327C4.42732 8.28315 5.89182 7.37877 7.50209 7.35787C8.45385 7.33697 9.50029 7.89019 10.2912 7.89019C11.0612 7.89019 12.4223 7.20917 13.562 7.3996C14.209 7.48386 15.459 7.84848 16.2043 9.07767C16.1428 9.1028 14.5919 9.87588 14.5919 12.1894C14.5919 14.887 15.9321 15.681 16.2043 15.7652V10.3344Z" fill="#0A0A0A"/>
    <path d="M12.6865 4.3813C13.3544 3.54109 13.6888 2.4571 13.583 1.37311C12.627 1.45738 11.5805 2.05318 10.8917 2.87254C10.2877 3.62848 9.89098 4.71247 10.0177 5.79646C10.9932 5.77556 12.0375 5.22234 12.6865 4.3813Z" fill="#0A0A0A"/>
  </svg>
);

const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const EyeOffIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
);

// ============================================================================
//  MAIN LOGIN PAGE COMPONENT
// ============================================================================

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 bg-surface-secondary font-inter">
      <div className="w-full max-w-sm">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary mb-4">
            <span className="text-3xl font-normal text-surface-primary">C1</span>
          </div>
          <h1 className="text-3xl font-normal tracking-wide-lg text-text-primary">
            Cignal One
          </h1>
          <p className="text-sm font-medium text-text-muted mt-2">
            Your all-in-one account hub
          </p>
        </header>

        {/* Form Container */}
        <div className="w-full rounded-2xl bg-surface-primary p-6 shadow-md">
          <h2 className="text-2xl font-normal text-text-primary">Welcome back</h2>
          <p className="text-sm text-text-muted mt-2 mb-6">
            Sign in to manage your Cignal services
          </p>
          
          {/* Biometric Button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-brand-primary px-4 py-4 text-sm font-medium text-surface-primary transition-colors hover:bg-opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <BiometricIcon className="h-6 w-6" />
            Sign in with Biometric
          </button>

          {/* Social Logins */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Sign in with Google"
              className="flex h-12 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-surface-primary transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <GoogleIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Sign in with Apple"
              className="flex h-12 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-surface-primary transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <AppleIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Divider */}
          <div className="relative my-6 flex items-center" aria-hidden="true">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 flex-shrink text-xs font-medium text-text-muted">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          {/* Login Method Toggle */}
          <div className="flex rounded-lg bg-surface-secondary p-1 mb-6">
            <button
              onClick={() => setLoginMethod('password')}
              aria-pressed={loginMethod === 'password'}
              className={`w-1/2 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ease-in-out
                ${loginMethod === 'password'
                  ? 'bg-surface-primary text-text-primary shadow-sm'
                  : 'bg-transparent text-text-muted hover:bg-gray-200/50'
                }`}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              aria-pressed={loginMethod === 'otp'}
              className={`w-1/2 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ease-in-out
                ${loginMethod === 'otp'
                  ? 'bg-surface-primary text-text-primary shadow-sm'
                  : 'bg-transparent text-text-muted hover:bg-gray-200/50'
                }`}
            >
              One-Time PIN
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {/* Email/Mobile Input */}
              <div>
                <label htmlFor="email" className="sr-only">Email or mobile number</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email or mobile number"
                  className="w-full rounded-md border border-gray-300 bg-surface-secondary px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:border-brand-primary focus:ring-brand-primary"
                />
              </div>

              {/* Password/OTP Input */}
              {loginMethod === 'password' ? (
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="Password"
                      className="w-full rounded-md border border-gray-300 bg-surface-secondary px-4 py-3 pr-10 text-sm text-text-primary placeholder-text-muted focus:border-brand-primary focus:ring-brand-primary"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <Link href="#" className="text-sm font-medium text-brand-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="otp" className="sr-only">One-Time PIN</label>
                   <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    placeholder="One-Time PIN"
                    className="w-full rounded-md border border-gray-300 bg-surface-secondary px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:border-brand-primary focus:ring-brand-primary"
                  />
                  <div className="mt-2 text-right">
                    <Link href="#" className="text-sm font-medium text-brand-primary hover:underline">
                      Resend PIN
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium text-surface-primary transition-colors hover:bg-opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link */}
        <footer className="mt-6 text-center text-sm">
          <p className="text-text-muted">
            Don't have an account?{' '}
            <Link href="#" className="font-medium text-brand-primary hover:underline">
              Create Account
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
```