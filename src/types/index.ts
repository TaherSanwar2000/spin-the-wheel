import { ReactNode } from "react";

export type SpinWheelItem = {
    id: string;          // unique identifier
    image?: any;         // optional image source (require or URI)
    label?: string;      // optional text label
};

export type SpinWheelProps = {
    data: SpinWheelItem[];                 // REQUIRED
    size?: number;                         // default: screen width
    spinDuration?: number;                 // default: 6000
    knobComponent?: ReactNode;              // optional
    onSpinEnd?: (item: SpinWheelItem, index: number) => void;
    textColor?: string;
    textSize?: number;
    textFontWeight?: string;
    segmentBgColor?: string | string[];
    showResultText?: boolean;   // default true
    showSpinButton?: boolean;  // default true
    onSpinPress?: () => void;  // external control
};

export type SpinWheelRef = {
  spin: () => void;
};

