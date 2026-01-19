import { useRef, useState } from "react";
import { Animated, Easing } from "react-native";

const ONE_TURN = 360;

export const useSpinWheel = (
  dataLength: number,
  spinDuration: number
) => {
  const angle = useRef(new Animated.Value(0)).current;

  const [enabled, setEnabled] = useState(true);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const angleBySegment = ONE_TURN / dataLength;
  const angleOffset = angleBySegment / 2;

  const spin = (onEnd?: (index: number) => void) => {
    if (!enabled) return;

    const randomIndex = Math.floor(Math.random() * dataLength);

    const targetAngle =
      (ONE_TURN - ((randomIndex + 0.5) * angleBySegment) + angleOffset) %
      ONE_TURN;

    const finalAngle = ONE_TURN * 5 + targetAngle;

    setEnabled(false);
    setWinnerIndex(null);
    angle.setValue(0);

    Animated.timing(angle, {
      toValue: finalAngle,
      duration: spinDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setWinnerIndex(randomIndex);
      setEnabled(true);
      onEnd?.(randomIndex);
    });
  };

  return {
    angle,
    spin,
    enabled,
    winnerIndex,
    angleBySegment,
    angleOffset,
  };
};
