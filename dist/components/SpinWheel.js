import React, { forwardRef, useImperativeHandle, } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet, Dimensions, Text as RNText, } from 'react-native';
import Svg, { G, Path, Image as SvgImage, Text } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { useSpinWheel } from '../hooks/useSpinWheel';
// Add this inline component:
var DefaultKnob = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 50 : _b, _c = _a.height, height = _c === void 0 ? 50 : _c;
    return (React.createElement(Svg, { width: width, height: height, viewBox: "-1 -1 514.069 514.069" },
        React.createElement(G, { transform: "translate(1 1)" },
            React.createElement(Path, { d: "M255.035 502.421 L459.835 33.087 L255.035 169.621 L58.768 41.621 Z", fill: "#FFE100" }),
            React.createElement(Path, { d: "M7.568 7.487 L255.035 502.421 L58.768 41.621 L255.035 169.621 Z", fill: "#FFFFFF" }),
            React.createElement(Path, { d: "M458.128 36.501 L255.035 502.421 L502.501 7.487 Z", fill: "#FFA800" }),
            React.createElement(Path, { d: "M255.035,510.954c-3.413,0-5.973-1.707-7.68-5.12L-0.112,10.901c-1.707-3.413-0.853-6.827,1.707-9.387\r\n        c3.413-2.56,7.68-3.413,10.24-0.853l130.56,85.333c4.267,2.56,5.12,7.68,2.56,11.947c-2.56,4.267-7.68,5.12-11.947,2.56\r\n        L28.901,32.234l226.133,451.413l225.28-451.413L259.301,177.301c-2.56,1.707-6.827,1.707-9.387,0l-68.267-44.373\r\n        c-4.267-2.56-5.12-7.68-2.56-11.947c2.56-4.267,7.68-5.12,11.947-2.56l64,41.813l243.2-159.573\r\n        c3.413-1.707,7.68-1.707,10.24,0.853s3.413,5.973,1.707,9.387L262.715,505.834C261.008,509.247,258.448,510.954,255.035,510.954z", fill: "#000000" }),
            React.createElement(Path, { d: "M169.701,109.887c0-5.12-3.413-8.533-8.533-8.533c-5.12,0-8.533,3.413-8.533,8.533\r\n        c0,5.12,3.413,8.533,8.533,8.533C166.288,118.421,169.701,115.007,169.701,109.887", fill: "#000000" }))));
};
var width = Dimensions.get('window').width;
var ONE_TURN = 360;
var SpinWheel = forwardRef(function (_a, ref) {
    var data = _a.data, _b = _a.size, size = _b === void 0 ? width * 0.9 : _b, _c = _a.spinDuration, spinDuration = _c === void 0 ? 6000 : _c, knobComponent = _a.knobComponent, onSpinEnd = _a.onSpinEnd, textColor = _a.textColor, textFontWeight = _a.textFontWeight, textSize = _a.textSize, segmentBgColor = _a.segmentBgColor, _d = _a.showResultText, showResultText = _d === void 0 ? true : _d, _e = _a.showSpinButton, showSpinButton = _e === void 0 ? true : _e, onSpinPress = _a.onSpinPress;
    if (!data || data.length === 0) {
        throw new Error('SpinWheel: data prop is required');
    }
    var _f = useSpinWheel(data.length, spinDuration), angle = _f.angle, spin = _f.spin, enabled = _f.enabled, winnerIndex = _f.winnerIndex, angleBySegment = _f.angleBySegment, angleOffset = _f.angleOffset;
    var arcs = d3Shape.pie().value(function () { return 1; })(data);
    var arcGenerator = d3Shape
        .arc()
        .outerRadius(size / 2)
        .innerRadius(40)
        .padAngle(0.02);
    var renderKnob = function () {
        var knobSize = 50;
        var segmentProgress = Animated.modulo(Animated.divide(Animated.modulo(Animated.subtract(angle, angleOffset), ONE_TURN), new Animated.Value(angleBySegment)), 1);
        return (React.createElement(Animated.View, { style: {
                width: knobSize,
                height: knobSize * 2,
                justifyContent: 'flex-end',
                zIndex: 10,
                transform: [
                    {
                        rotate: segmentProgress.interpolate({
                            inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                            outputRange: [
                                '0deg',
                                '0deg',
                                '35deg',
                                '-35deg',
                                '0deg',
                                '0deg',
                            ],
                        }),
                    },
                ],
            } }, knobComponent !== null && knobComponent !== void 0 ? knobComponent : React.createElement(DefaultKnob, { width: knobSize, height: knobSize })));
    };
    var handleSpin = function () {
        spin(function (i) { return onSpinEnd === null || onSpinEnd === void 0 ? void 0 : onSpinEnd(data[i], i); });
        onSpinPress === null || onSpinPress === void 0 ? void 0 : onSpinPress(); // optional external callback
    };
    useImperativeHandle(ref, function () { return ({
        spin: handleSpin,
    }); });
    return (React.createElement(View, { style: styles.container },
        renderKnob(),
        React.createElement(Animated.View, { style: {
                transform: [
                    {
                        rotate: angle.interpolate({
                            inputRange: [-360, 0, 360],
                            outputRange: ['-360deg', '0deg', '360deg'],
                        }),
                    },
                ],
            } },
            React.createElement(Svg, { width: size, height: size },
                React.createElement(G, { x: size / 2, y: size / 2, rotation: -angleOffset }, arcs.map(function (arc, index) {
                    var _a = arcGenerator.centroid(arc), x = _a[0], y = _a[1];
                    // Determine background color
                    var fillColor = '#d3d3b8'; // default
                    if (segmentBgColor) {
                        fillColor = Array.isArray(segmentBgColor)
                            ? segmentBgColor[index % segmentBgColor.length]
                            : segmentBgColor;
                    }
                    return (React.createElement(G, { key: index },
                        React.createElement(Path, { d: arcGenerator(arc), fill: fillColor }),
                        data[index].image ? (React.createElement(SvgImage, { href: data[index].image, x: x - 30, y: y - 30, width: 60, height: 60 })) : data[index].label ? (React.createElement(Text, { x: x, y: y, fill: textColor !== null && textColor !== void 0 ? textColor : '#000', fontSize: textSize !== null && textSize !== void 0 ? textSize : 16, fontWeight: textFontWeight !== null && textFontWeight !== void 0 ? textFontWeight : '600', textAnchor: "middle" }, data[index].label)) : null));
                })))),
        showResultText && (React.createElement(RNText, { style: styles.result }, winnerIndex !== null
            ? "Selected: ".concat(data[winnerIndex].id)
            : 'Spin the wheel')),
        showSpinButton && (React.createElement(TouchableOpacity, { style: [styles.button, !enabled && { opacity: 0.5 }], onPress: handleSpin, disabled: !enabled },
            React.createElement(RNText, { style: styles.buttonText }, "Spin")))));
});
export default SpinWheel;
var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 20,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#FFD200',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    result: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
    },
});
