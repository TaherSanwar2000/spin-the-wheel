import { useRef, useState } from "react";
import { Animated, Easing } from "react-native";
var ONE_TURN = 360;
export var useSpinWheel = function (dataLength, spinDuration) {
    var angle = useRef(new Animated.Value(0)).current;
    var _a = useState(true), enabled = _a[0], setEnabled = _a[1];
    var _b = useState(null), winnerIndex = _b[0], setWinnerIndex = _b[1];
    var angleBySegment = ONE_TURN / dataLength;
    var angleOffset = angleBySegment / 2;
    var spin = function (onEnd) {
        if (!enabled)
            return;
        var randomIndex = Math.floor(Math.random() * dataLength);
        var targetAngle = (ONE_TURN - ((randomIndex + 0.5) * angleBySegment) + angleOffset) %
            ONE_TURN;
        var finalAngle = ONE_TURN * 5 + targetAngle;
        setEnabled(false);
        setWinnerIndex(null);
        angle.setValue(0);
        Animated.timing(angle, {
            toValue: finalAngle,
            duration: spinDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(function () {
            setWinnerIndex(randomIndex);
            setEnabled(true);
            onEnd === null || onEnd === void 0 ? void 0 : onEnd(randomIndex);
        });
    };
    return {
        angle: angle,
        spin: spin,
        enabled: enabled,
        winnerIndex: winnerIndex,
        angleBySegment: angleBySegment,
        angleOffset: angleOffset,
    };
};
