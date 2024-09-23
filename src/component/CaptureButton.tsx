import { Pressable, ViewStyle } from "react-native";
import React, { FunctionComponent, useEffect, useLayoutEffect, useState } from "react";
import { DEVICE } from "../constant/constant";
import { useBackgroundTimer } from "../hook";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation } from "react-native-reanimated";

interface CaptureButtonProps {
  onPress: () => Promise<void>;
  onLongPress: () => Promise<void>;
  onStopVideo?: () => Promise<void>;
}

export const CaptureButton: FunctionComponent<CaptureButtonProps> = ({ onPress, onLongPress, onStopVideo }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const { timer: videoTimer, setTimer: setVideoTimer, clearTimerInterval } = useBackgroundTimer(0);

  // animation values
  const scale = useSharedValue<number>(1);
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(progress.value, [0, 1], ["#FFF8F3", "#E4003A"]),
    };
  });
  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      // transform: [{ scale: borderScale.value }],
      // borderWidth: interpolate(progress.value, [0, 100], [0, 5]),
      // borderColor: interpolateColor(progress.value, [0, 1], ["transparent", "#FFF8F3"]),
      backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", "#FFF8F3"]),
    };
  });

  // testing
  useEffect(() => {
    // scale.value = withRepeat(withTiming(scale.value * 2, { duration: 1000 }), -1, true);
  }, []);

  const handleStartAnimation = () => {
    scale.value = withTiming(0.8, { duration: 300 });
  };

  // handle start animation indicator
  useEffect(() => {
    console.log(">>>> isPressed", isPressed);
    console.log(">>>> videoTimer", videoTimer);

    // if (isPressed && videoTimer > 0) {
    //   console.log(">>> condtition 1");
    //   // start button animation for vid
    //   if (scale.value === 1) {
    //     scale.value = withTiming(0.8, { duration: 300 });
    //     // progress.value = withTiming(1, { duration: 200 });
    //   }
    //   // // todo - how to check if its a long press or a short one ?
    //   // // run a timer ? if timer runs more than 3s, have another useeffect to start the video button animation
    // }

    // if (isPressed && videoTimer === 0) {
    //   console.log(">>> condtition 1");
    //   // start button animation for pic
    //   if (scale.value === 1) {
    //     scale.value = withTiming(0.8, { duration: 300 });
    //   }
    //   // // todo - how to check if its a long press or a short one ?
    //   // // run a timer ? if timer runs more than 3s, have another useeffect to start the video button animation
    // }

    if (!isPressed) {
      // start animation to end video / pic
      console.log(">>> condtition 2");
      if (scale.value !== 1) {
        scale.value = withTiming(1, { duration: 300 });
        progress.value = withTiming(0, { duration: 200 });
        setVideoTimer(0);
        if (onStopVideo) {
          onStopVideo();
        }
      }
    }
  }, [isPressed, videoTimer]);

  // handle all actions/logics on initialize
  useLayoutEffect(() => {
    return () => {
      clearTimerInterval();
      cancelAnimation(progress);
    };
  }, []);

  const captureButtonStyles: ViewStyle = {
    height: 0.1 * DEVICE.HEIGHT,
    width: 0.1 * DEVICE.HEIGHT,
    backgroundColor: "blue",
    borderRadius: 40,
    zIndex: 3,
  };

  return (
    <Pressable
      onPress={() => {
        console.log(">>>>>> onPress runs");
        handleStartAnimation();
        setVideoTimer(0);
        onPress();
      }} // onPress from props
      onLongPress={() => {
        console.log(">>>>>> onLongPress runs");
        // only run the timer when onLongPress triggers
        handleStartAnimation();
        setVideoTimer(3);
        progress.value = withTiming(1, { duration: 200 });
        onLongPress();
      }} // onLongPress from props
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Animated.View style={[captureButtonStyles, animatedStyle]} />
      <Animated.View style={[captureButtonStyles, { position: "absolute", zIndex: 1, borderRadius: 40 }, animatedBorderStyle]} />
    </Pressable>
  );
};
