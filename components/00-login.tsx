```javascript
// LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { styled } from 'nativewind';
import { Svg, Path } from 'react-native-svg';

// ========== STYLING SETUP ==========
// Using nativewind's styled HOC for better component styling
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

// Define the color palette from the design system for easy reference
const themeColors = {
  white: '#ffffff',
  black: '#0a0a0a',
  primary: '#155dfc',
  textMuted: '#6a7282',
  textDefault: '#4a5565',
  backgroundMuted: '#f3f3f5',
  textSubtle: '#717182',
  primaryLight: '#dbeafe',
  googleBlue: '#4285f4',
  appleBlack: '#0a0a0a', // Assuming Apple button would be black
};

// ========== ICON COMPONENTS ==========
// Self-contained SVG icon components based on common representations.

const BiometricIcon = ({ color = themeColors.white, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5.5 12.5C5.5 8.358 8.858 5 13 5C15.12 5 17.062 5.923 18.413 7.36M18.5 12.5V17.5C18.5 20.261 16.261 22.5 13.5 22.5C10.739 22.5 8.5 20.261 8.5 17.5V10M8.5 10C8.5 7.239 6.261 5 3.5 5C2.119 5 1 6.119 1 7.5V7.5M8.5 10C8.5 12.761 10.739 15 13.5 15C16.261 15 18.5 12.761 18.5 10M13.5 22.5C14.881 22.5 16 21.381 16 20V17M13.5 15C12.119 15 11 16.119 11 17.5V20M1 7.5C1 8.881 2.119 10 3.5 10C4.881 10 6 8.881 6 7.5V6.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GoogleIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22.56 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.04c-.31 1.47-1.25 2.72-2.73 3.57v3h3.86c2.26-2.09 3.56-5.17 3.56-8.81z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.5v3.1C3.44 20.43 7.47 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.27 13.74a7.29 7.29 0 010-4.48V6.16H1.5A11.97 11.97 0 001 12.5c0 1.62.33 3.16.92 4.58l3.77-2.92z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.16c1.77 0 3.35.61 4.62 1.83l3.42-3.42C17.95 1.83 15.24 0 12 0 7.47 0 3.44 2.57 1.5 6.16l3.77 2.92C6.22 7.27 8.87 5.16 12 5.16z"
      fill="#EA4335"
    />
  </Svg>
);

const AppleIcon = ({ size = 20, color = themeColors.textDefault }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.27 12.63c.01-2.92-2-4.3-4.34-4.34-1.63 0-3.1.92-4.07.92-.98 0-2.65-.95-4.14-.95-2.88 0-5.26 2.22-5.26 5.57 0 2.22.98 5.16 2.7 6.91 1.18 1.22 2.5 2.1 4.13 2.08 1.54-.02 2.1-.64 4.07-.64 1.95 0 2.45.64 4.07.62 1.66-.02 2.87-.8 4-2.02-1.37-.82-2.2-2.2-2.2-3.85zm-4.32-5.5c.9-.99 1.48-2.32 1.34-3.65-1.1.03-2.42.6-3.26 1.57-.8.92-1.48 2.27-1.32 3.58 1.22.08 2.33-.53 3.24-1.5z"
      fill={color}
    />
  </Svg>
);

// ========== REUSABLE COMPONENTS ==========

interface AppInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const AppInput: React.FC<AppInputProps> = ({ label, ...props }) => (
  <StyledView className="w-full">
    <StyledText className="mb-2 text-sm font-medium" style={{ color: themeColors.textDefault }}>
      {label}
    </StyledText>
    <StyledTextInput
      className="h-12 w-full rounded-lg border border-slate-200 px-4 text-base"
      placeholderTextColor={themeColors.textMuted}
      style={{ backgroundColor: themeColors.backgroundMuted, color: themeColors.black }}
      {...props}
    />
  </StyledView>
);

// ========== MAIN SCREEN COMPONENT ==========

export const LoginScreen: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const renderPasswordForm = () => (
    <>
      <AppInput
        label="Email address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <StyledView className="w-full">
        <AppInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <StyledTouchableOpacity className="absolute right-0 bottom-8">
          <StyledText className="text-sm font-medium" style={{ color: themeColors.primary }}>
            Forgot password?
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </>
  );

  // Placeholder for OTP form
  const renderOtpForm = () => (
    <StyledView className="w-full space-y-4">
      <AppInput
        label="Mobile Number or Email"
        placeholder="Enter your details"
        value={email}
        onChangeText={setEmail}
      />
      <StyledText className="text-center text-xs" style={{ color: themeColors.textMuted }}>
        We'll send a one-time PIN to your registered mobile number or email.
      </StyledText>
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1" style={{ backgroundColor: themeColors.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={themeColors.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <StyledScrollView
          className="flex-1"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <StyledView className="items-center pt-8 pb-12">
            <StyledView
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: themeColors.primary }}
            >
              <StyledText className="text-4xl font-bold" style={{ color: themeColors.white }}>
                C1
              </StyledText>
            </StyledView>
            <StyledText
              className="mt-4 text-3xl"
              style={{ color: themeColors.black, fontFamily: 'Inter-Regular' }}
            >
              Cignal One
            </StyledText>
            <StyledText
              className="mt-2 text-sm"
              style={{ color: themeColors.textMuted, fontFamily: 'Inter-Medium' }}
            >
              Your all-in-one account hub
            </StyledText>
          </StyledView>

          {/* Login Form Section */}
          <StyledView className="w-full flex-1 rounded-t-3xl p-6" style={{ backgroundColor: themeColors.white }}>
            <StyledText
              className="text-2xl font-bold"
              style={{ color: themeColors.black, fontFamily: 'Inter-Regular' }}
            >
              Welcome back
            </StyledText>
            <StyledText
              className="mt-2 text-sm"
              style={{ color: themeColors.textMuted, fontFamily: 'Inter-Medium' }}
            >
              Sign in to manage your Cignal services
            </StyledText>
            
            <StyledTouchableOpacity
              className="mt-8 h-14 w-full flex-row items-center justify-center rounded-xl"
              style={{ backgroundColor: themeColors.primary }}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Biometric"
            >
              <BiometricIcon color={themeColors.white} />
              <StyledText className="ml-3 text-base font-medium" style={{ color: themeColors.white }}>
                Sign in with Biometric
              </StyledText>
            </StyledTouchableOpacity>

            {/* Social Login Buttons */}
            <StyledView className="mt-5 flex-row justify-between space-x-3">
              <StyledTouchableOpacity
                className="h-12 flex-1 flex-row items-center justify-center rounded-lg border border-slate-200"
                style={{ backgroundColor: themeColors.backgroundMuted }}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Google"
              >
                <GoogleIcon />
                <StyledText className="ml-2 text-sm font-medium" style={{ color: themeColors.textDefault }}>
                  Google
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="h-12 flex-1 flex-row items-center justify-center rounded-lg border border-slate-200"
                style={{ backgroundColor: themeColors.backgroundMuted }}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Apple"
              >
                <AppleIcon color={themeColors.appleBlack} />
                <StyledText className="ml-2 text-sm font-medium" style={{ color: themeColors.textDefault }}>
                  Apple
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            
            {/* Divider */}
            <StyledView className="my-6 w-full flex-row items-center">
              <StyledView className="flex-1 border-t border-slate-200" />
              <StyledText
                className="px-4 text-sm"
                style={{ color: themeColors.textSubtle, backgroundColor: themeColors.white }}
              >
                Or continue with
              </StyledText>
              <StyledView className="flex-1 border-t border-slate-200" />
            </StyledView>

            {/* Login Method Tabs */}
            <StyledView
              className="flex-row rounded-lg p-1"
              style={{ backgroundColor: themeColors.backgroundMuted }}
            >
              <StyledTouchableOpacity
                onPress={() => setLoginMethod('password')}
                className="flex-1 items-center justify-center rounded-md py-2.5"
                style={loginMethod === 'password' ? { backgroundColor: themeColors.primaryLight } : {}}
                accessibilityRole="button"
                accessibilityState={{ selected: loginMethod === 'password' }}
              >
                <StyledText
                  className="text-sm font-medium"
                  style={{ color: loginMethod === 'password' ? themeColors.primary : themeColors.textDefault }}
                >
                  Password
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => setLoginMethod('otp')}
                className="flex-1 items-center justify-center rounded-md py-2.5"
                style={loginMethod === 'otp' ? { backgroundColor: themeColors.primaryLight } : {}}
                accessibilityRole="button"
                accessibilityState={{ selected: loginMethod === 'otp' }}
              >
                <StyledText
                  className="text-sm font-medium"
                  style={{ color: loginMethod === 'otp' ? themeColors.primary : themeColors.textDefault }}
                >
                  One-Time PIN
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            
            {/* Form Fields */}
            <StyledView className="mt-6 w-full space-y-4">
              {loginMethod === 'password' ? renderPasswordForm() : renderOtpForm()}
            </StyledView>
            
            {/* Sign In Button */}
            <StyledTouchableOpacity
              className="mt-6 h-12 w-full items-center justify-center rounded-lg"
              style={{ backgroundColor: themeColors.primary }}
              accessibilityRole="button"
              accessibilityLabel="Sign In"
            >
              <StyledText className="text-base font-medium" style={{ color: themeColors.white }}>
                Sign In
              </StyledText>
            </StyledTouchableOpacity>

            {/* Footer Link */}
            <StyledView className="mt-8 mb-4 flex-row justify-center">
              <StyledText className="text-sm" style={{ color: themeColors.textMuted }}>
                Don't have an account?{' '}
              </StyledText>
              <StyledTouchableOpacity>
                <StyledText className="text-sm font-medium" style={{ color: themeColors.primary }}>
                  Create Account
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default LoginScreen;
```