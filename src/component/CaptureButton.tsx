import { Pressable, ViewStyle } from "react-native";
import React, { FunctionComponent, useEffect, useLayoutEffect, useState } from "react";
import { DEVICE } from "../constant/constant";
import { useBackgroundTimer } from "../hook";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

interface CaptureButtonProps {
  onPress: () => void;
  onLongPress: () => void;
}

export const CaptureButton: FunctionComponent<CaptureButtonProps> = ({ onPress, onLongPress }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const { timer: videoTimer, setTimer: setVideoTimer, clearTimerInterval } = useBackgroundTimer(0);

  // animation values
  const scale = useSharedValue<number>(1);
  const scaleStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // testing
  useEffect(() => {
    // scale.value = withRepeat(withTiming(scale.value * 2, { duration: 1000 }), -1, true);
  }, []);

  // handle start animation indicator
  useEffect(() => {
    if (isPressed && videoTimer > 0) {
      console.log(">>> condtition 1");
      // start button animation for vid
      if (scale.value === 1) {
        scale.value = withTiming(scale.value - 0.2, { duration: 1000 });
      }
      // // todo - how to check if its a long press or a short one ?
      // // run a timer ? if timer runs more than 3s, have another useeffect to start the video button animation
    }

    if (!isPressed) {
      // start animation to end video / pic
      console.log(">>> condtition 2");
      if (scale.value === 0.8) {
        scale.value = withTiming(scale.value + 0.2, { duration: 1000 });
      }
    }
  }, [isPressed, videoTimer]);

  // handle all actions/logics on initialize
  useLayoutEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, []);

  const captureButtonStyles: ViewStyle = {
    height: 0.1 * DEVICE.HEIGHT,
    width: 0.1 * DEVICE.HEIGHT,
    backgroundColor: "white",
    borderRadius: 40,
  };

  return (
    <Pressable
      onPress={() => {
        console.log(">>>>>> onPress runs");
      }} // onPress from props
      onLongPress={() => {
        console.log(">>>>>> onLongPress runs");
        // only run the timer when onLongPress triggers
        setVideoTimer(3);
        // onLongPress()
      }} // onLongPress from props
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Animated.View style={[captureButtonStyles, scaleStyles]} />
    </Pressable>
  );
};
