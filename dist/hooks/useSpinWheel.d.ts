import { Animated } from "react-native";
export declare const useSpinWheel: (dataLength: number, spinDuration: number) => {
    angle: Animated.Value;
    spin: (onEnd?: (index: number) => void) => void;
    enabled: boolean;
    winnerIndex: number | null;
    angleBySegment: number;
    angleOffset: number;
};
