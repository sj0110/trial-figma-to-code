// src/components/PaymentSuccessful.tsx
import React, { FC, useMemo } from 'react';

// --- Types ---
interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface SolidFill {
  type: 'SOLID';
  color: RgbaColor;
  opacity?: number;
  blendMode: 'NORMAL' | 'PASS_THROUGH';
  visible: boolean;
}

interface LinearGradientStop {
  color: RgbaColor;
  position: number;
}

interface LinearGradientFill {
  type: 'GRADIENT_LINEAR';
  gradientStops: LinearGradientStop[];
  gradientTransform: number[][];
}

type Fill = SolidFill | LinearGradientFill;

interface TextStyle {
  fontFamily: { family: string; style: string };
  fontSize: number;
  fontWeight: number;
  lineHeight: { unit: 'PIXELS'; value: number };
  letterSpacing: { unit: 'PIXELS'; value: number };
}

interface DesignSystem {
  colors: Record<string, string>;
  typography: TextStyle[];
}

interface IconVector {
  id: string;
  name: string;
  type: 'VECTOR';
  x: number;
  y: number;
  width: number;
  height: number;
  strokes?: SolidFill[];
  strokeWeight?: number;
  pathData: string; // Manually added for SVG path rendering as it's missing from source JSON
}

interface IconDisplayProps {
  vectors: IconVector[];
  width: number;
  height: number;
  strokeColor?: string;
}

interface PaymentConfirmationHeaderProps {
  title: string;
  subtitle: string;
  icon: {
    vectors: IconVector[];
    width: number;
    height: number;
    circleBgColor: string;
    checkmarkStrokeColor: string;
  };
  gradient: LinearGradientFill;
}

interface TransactionDetailItemProps {
  label: string;
  value: string;
  icon: IconDisplayProps & { wrapperBgColor: string; strokeColor: string };
}

interface PaymentMethodItemProps {
  label: string;
  methodName: string;
  icon: IconDisplayProps & { wrapperBgColor: string; strokeColor: string };
}

interface SummaryItemProps {
  label: string;
  value: string;
  isAmountPaid?: boolean;
}

interface WhatsNextStepProps {
  stepNumber: number;
  description: string;
  numberBgColor: string;
  numberTextColor: string;
  descriptionTextColor: string;
}

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

export interface PaymentSuccessfulProps {
  designSystem: DesignSystem;
  header: {
    title: string;
    subtitle: string;
    icon: {
      checkIconVectors: IconVector[];
      width: number;
      height: number;
      circleBgColor: string;
      checkmarkStrokeColor: string;
    };
    gradient: LinearGradientFill;
  };
  transactionDetails: {
    title: string;
    transactionId: {
      label: string;
      value: string;
      icon: {
        vectors: IconVector[];
        width: number;
        height: number;
        wrapperBgColor: string;
        strokeColor: string;
      };
    };
    dateTime: {
      label: string;
      value: string;
      icon: {
        vectors: IconVector[];
        width: number;
        height: number;
        wrapperBgColor: string;
        strokeColor: string;
      };
    };
    paymentMethod: {
      label: string;
      methodName: string;
      icon: {
        vectors: IconVector[];
        width: number;
        height: number;
        wrapperBgColor: string;
        strokeColor: string;
      };
    };
  };
  paymentSummary: {
    title: string;
    subscriptionPlan: { label: string; value: string };
    billingPeriod: { label: string; value: string };
    amountPaid: { label: string; value: string };
  };
  whatsNext: {
    title: string;
    steps: Array<{ stepNumber: number; description: string }>;
  };
  actions: {
    primaryButton: { label: string; onClick: () => void };
    secondaryButton: { label: string; onClick: () => void };
  };
}

// Helper for converting Figma RGBA to HEX
const rgbaToHex = (rgba: RgbaColor): string => {
  const r = Math.round(rgba.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b * 255).toString(16).padStart(2, '0');
  const a = rgba.a !== 1 ? Math.round(rgba.a * 255).toString(16).padStart(2, '0') : '';
  return `#${r}${g}${b}${a}`;
};

// --- Sub-components ---

const IconWrapper: FC<IconDisplayProps & { wrapperBgColor: string; strokeColor: string }> = ({ vectors, width, height, strokeColor, wrapperBgColor }) => {
  return (
    <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width, height, backgroundColor: wrapperBgColor }}>
      <svg
        width={width * 0.5} // Icon size is half of wrapper
        height={height * 0.5}
        viewBox={`0 0 ${width * 0.5} ${height * 0.5}`} // Assuming a 20x20 viewBox for these inner icons based on 3:10129
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {vectors.map((vector, index) => (
          <path
            key={vector.id || index}
            d={vector.pathData}
            stroke={strokeColor}
            strokeWidth={vector.strokeWeight || 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
};


const PaymentConfirmationHeader: FC<PaymentConfirmationHeaderProps> = ({
  title,
  subtitle,
  icon,
  gradient,
}) => {
  const startColor = rgbaToHex(gradient.gradientStops[0].color);
  const endColor = rgbaToHex(gradient.gradientStops[1].color);
  const gradientStyle = `linear-gradient(to bottom, ${startColor}, ${endColor})`;

  const titleStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '24px', // text-2xl
    fontWeight: 500, // font-medium
    lineHeight: '32px', // leading-8
    letterSpacing: '0px',
    color: icon.circleBgColor, // White
  };

  const subtitleStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px', // text-sm
    fontWeight: 400, // font-normal
    lineHeight: '20px', // leading-5
    letterSpacing: '-0.15px',
    color: `${icon.circleBgColor}e6`, // White with ~90% opacity (0.8999... in JSON)
  };

  return (
    <div
      className="flex flex-col items-center pt-12 pb-4 gap-4"
      style={{
        background: gradientStyle,
        height: '236px', // From `3:10112`
      }}
    >
      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: icon.width, height: icon.height, backgroundColor: icon.circleBgColor }}>
        <svg
          width={icon.width * 0.6} // 47.996 (approx 48) for the inner icon 3:10115
          height={icon.height * 0.6} // 48px
          viewBox="0 0 48 48" // Matches 3:10115 size
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {icon.vectors.map((vector, index) => (
            <path
              key={vector.id || index}
              d={vector.pathData}
              stroke={icon.checkmarkStrokeColor}
              strokeWidth={vector.strokeWeight || 1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
      <p className="text-center" style={titleStyle}>
        {title}
      </p>
      <p className="text-center" style={subtitleStyle}>
        {subtitle}
      </p>
    </div>
  );
};


const TransactionDetailItem: FC<TransactionDetailItemProps> = ({ label, value, icon }) => {
  const labelStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px', // text-sm
    fontWeight: 400, // font-normal
    lineHeight: '16px', // approximated for 16px text height 3:10136
    letterSpacing: '-0.15px',
    color: rgbaToHex({ r: 0.4156862795352936, g: 0.4470588266849518, b: 0.5098039507865906, a: 1 }), // color-6
  };
  const valueStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px', // text-sm
    fontWeight: 400, // font-normal
    lineHeight: '20px', // leading-5
    letterSpacing: '-0.15px',
    color: rgbaToHex({ r: 0.062745101749897, g: 0.0941176488995552, b: 0.1568627506494522, a: 1 }), // color-2
  };

  return (
    <div className="flex items-center gap-3">
      <IconWrapper {...icon} />
      <div className="flex flex-col flex-1">
        <p style={labelStyle}>
          {label}
        </p>
        <p style={valueStyle}>
          {value}
        </p>
      </div>