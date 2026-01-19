import { ReactNode } from "react";
export type SpinWheelItem = {
    id: string;
    image?: any;
    label?: string;
};
export type SpinWheelProps = {
    data: SpinWheelItem[];
    size?: number;
    spinDuration?: number;
    knobComponent?: ReactNode;
    onSpinEnd?: (item: SpinWheelItem, index: number) => void;
    textColor?: string;
    textSize?: number;
    textFontWeight?: string;
    segmentBgColor?: string | string[];
    showResultText?: boolean;
    showSpinButton?: boolean;
    onSpinPress?: () => void;
};
export type SpinWheelRef = {
    spin: () => void;
};
