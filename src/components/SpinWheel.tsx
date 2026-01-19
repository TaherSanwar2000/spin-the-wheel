import React, {forwardRef,useImperativeHandle,} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text as RNText,
} from 'react-native';
import Svg, { G, Path, Image as SvgImage, Text } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { useSpinWheel } from '../hooks/useSpinWheel';
import { SpinWheelProps, SpinWheelRef } from '../types';
import DefaultKnob from '../assets/downArrow.svg';

const { width } = Dimensions.get('window');
const ONE_TURN = 360;

const SpinWheel = forwardRef<SpinWheelRef, SpinWheelProps>(
  (
    {
      data,
      size = width * 0.9,
      spinDuration = 6000,
      knobComponent,
      onSpinEnd,
      textColor,
      textFontWeight,
      textSize,
      segmentBgColor,
      showResultText = true,
      showSpinButton = true,
      onSpinPress,
    },
    ref,
  ) => {

  if (!data || data.length === 0) {
    throw new Error('SpinWheel: data prop is required');
  }

  const { angle, spin, enabled, winnerIndex, angleBySegment, angleOffset } =
    useSpinWheel(data.length, spinDuration);

  const arcs = d3Shape.pie().value(() => 1)(data);
  const arcGenerator = d3Shape
    .arc()
    .outerRadius(size / 2)
    .innerRadius(40)
    .padAngle(0.02);

  const renderKnob = () => {
    const knobSize = 50;

    const segmentProgress = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(angle, angleOffset), ONE_TURN),
        new Animated.Value(angleBySegment),
      ),
      1,
    );

    return (
      <Animated.View
        style={{
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
        }}
      >
        {knobComponent ?? <DefaultKnob width={knobSize} height={knobSize} />}
      </Animated.View>
    );
  };

  const handleSpin = () => {
    spin(i => onSpinEnd?.(data[i], i));
    onSpinPress?.(); // optional external callback
  };
  useImperativeHandle(ref, () => ({
  spin: handleSpin,
}));


  return (
    <View style={styles.container}>
      {renderKnob()}

      <Animated.View
        style={{
          transform: [
            {
              rotate: angle.interpolate({
                inputRange: [-360, 0, 360],
                outputRange: ['-360deg', '0deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <Svg width={size} height={size}>
          <G x={size / 2} y={size / 2} rotation={-angleOffset}>
            {arcs.map((arc: any, index: any) => {
              const [x, y] = arcGenerator.centroid(arc);

              // Determine background color
              let fillColor = '#d3d3b8'; // default
              if (segmentBgColor) {
                fillColor = Array.isArray(segmentBgColor)
                  ? segmentBgColor[index % segmentBgColor.length]
                  : segmentBgColor;
              }

              return (
                <G key={index}>
                  <Path d={arcGenerator(arc)!} fill={fillColor} />
                  {data[index].image ? (
                    <SvgImage
                      href={data[index].image}
                      x={x - 30}
                      y={y - 30}
                      width={60}
                      height={60}
                    />
                  ) : data[index].label ? (
                    <Text
                      x={x}
                      y={y}
                      fill={textColor ?? '#000'}
                      fontSize={textSize ?? 16}
                      fontWeight={textFontWeight ?? '600'}
                      textAnchor="middle"
                    >
                      {data[index].label}
                    </Text>
                  ) : null}
                </G>
              );
            })}
          </G>
        </Svg>
      </Animated.View>

      {showResultText && (
        <RNText style={styles.result}>
          {winnerIndex !== null
            ? `Selected: ${data[winnerIndex].id}`
            : 'Spin the wheel'}
        </RNText>
      )}

      {showSpinButton && (
        <TouchableOpacity
          style={[styles.button, !enabled && { opacity: 0.5 }]}
          onPress={handleSpin}
          disabled={!enabled}
        >
          <RNText style={styles.buttonText}>Spin</RNText>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default SpinWheel;

const styles = StyleSheet.create({
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
