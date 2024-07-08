import { View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEVICE } from "../constant/constant";

export const CameraOverlayed = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View>
      <View style={{ width: DEVICE.WIDTH, height: 0, backgroundColor: "blue" }} />

      <View>
        <View style={{ width: DEVICE.WIDTH, height: 0.1 * DEVICE.HEIGHT, backgroundColor: "blue" }} />
        <View style={{ height: bottom }} />
      </View>
    </View>
  );
};
