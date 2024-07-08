import { View, Pressable, ViewStyle } from "react-native";
import React, { FunctionComponent, useLayoutEffect, useState } from "react";
import { DEVICE } from "../constant/constant";

interface ImageButtonProps {
  onPress: () => void;
  isMultiLayered?: boolean;
}

interface LayeredPositionProps {
  x: number;
  y: number;
}

export const ImageButton: FunctionComponent<ImageButtonProps> = ({ onPress, isMultiLayered }) => {
  const [parentRef, setParentRef] = useState<View | null>(null);
  const [, setLayeredPosition] = useState<LayeredPositionProps>({ x: 0, y: 0 });

  const initMultiLayeredPosition = () => {
    if (parentRef !== null) {
      parentRef.measure((x, y, width, height, pageX, pageY) => {
        // console.log(">>>>> pageX", pageX);
        // console.log(">>>>> pageY", pageY);
        // console.log(">>>>> width", width);
        // console.log(">>>>> height", height);
        // console.log(">>>>> x", x);
        // console.log(">>>>> y", y);
        setLayeredPosition({ x: pageX, y: pageY });
      });
    }
  };

  useLayoutEffect(() => {
    initMultiLayeredPosition();
  }, []);

  const borderStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: "black",
  };

  return (
    <Pressable
      ref={setParentRef}
      onPress={onPress}
      style={{
        height: 0.08 * DEVICE.HEIGHT,
        width: 0.08 * DEVICE.HEIGHT,
        // backgroundColor: "white",
      }}>
      <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}>
        <View
          style={{
            width: isMultiLayered ? "85%" : "100%",
            height: isMultiLayered ? "85%" : "100%",
            backgroundColor: "blue",
            zIndex: 5,
            ...borderStyle,
          }}
        />
        {isMultiLayered && (
          <View
            style={{
              width: "85%",
              height: "85%",
              backgroundColor: "red",
              position: "absolute",
              zIndex: 2,
              right: 10,
              top: 5,
              transform: [{ rotate: "-20deg" }],
              ...borderStyle,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};
