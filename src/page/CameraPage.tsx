import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  CameraRuntimeError,
  PhotoFile,
  useFrameProcessor,
  runAtTargetFps,
} from "react-native-vision-camera";
import { RNImageResizer } from "../integrations";
import { DEVICE } from "../constant/constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageButton } from "../component/ImageButton";

export const CameraPage = () => {
  const { bottom } = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);

  const [, setIsCameraInitialized] = useState(false);
  const [, setPhotoUri] = useState<string>("");

  const handleTakePic = async () => {
    console.log("handleTakePic run");
    if (camera !== null && camera.current) {
      const file: PhotoFile = await camera.current.takePhoto({});
      // interchange width and height because of wrong orientation
      const filePath = `file://${file.path}`;
      const resizeResponse = await RNImageResizer.createResizedImage(filePath, file.width, file.height, "PNG", 100);
      setPhotoUri(resizeResponse?.uri || "");
    }
  };

  const handleOpenGallery = () => {
    console.log("handleOpenGallery run");
  };

  useEffect(() => {
    if (hasPermission === false) {
      requestPermission();
    }
  }, []);

  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    // eslint-disable-next-line no-console
    console.error(">>>>>CAMERA ON ERROR", error);
  }, []);

  const onInitialized = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log(">>>>>CAMERA INITIALIZED!");
    setIsCameraInitialized(true);
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";

    runAtTargetFps(1, () => {
      if (frame) {
        console.log(">>>> frameProcessor");
      }
    });
  }, []);

  const black60 = "rgba(0,0,0,0.6)";

  return (
    <View>
      {device && (
        <Camera
          style={{ height: "100%" }}
          device={device}
          isActive={true}
          onError={onError}
          onInitialized={onInitialized}
          photo={true}
          ref={camera}
          video={false}
          // frameProcessor={isScanned.value === false ? frameProcessor : undefined}
        />
      )}

      {!device && <View style={{ height: "100%", backgroundColor: "lightgreen" }} />}

      <View style={{ height: DEVICE.HEIGHT, width: DEVICE.WIDTH, position: "absolute", justifyContent: "space-between" }}>
        <View style={{ width: DEVICE.WIDTH, height: 0, backgroundColor: "blue" }} />

        <View>
          <View
            style={{
              width: DEVICE.WIDTH,
              height: 0.15 * DEVICE.HEIGHT,
              backgroundColor: black60,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <ImageButton onPress={handleOpenGallery} isMultiLayered={true} />
            <Pressable
              onPress={handleTakePic}
              style={{ height: 0.1 * DEVICE.HEIGHT, width: 0.1 * DEVICE.HEIGHT, backgroundColor: "white", borderRadius: 40 }}
            />
            <View style={{ height: 0.08 * DEVICE.HEIGHT, width: 0.08 * DEVICE.HEIGHT, backgroundColor: "transparent", borderRadius: 4 }} />
          </View>
          <View style={{ height: bottom, backgroundColor: black60 }} />
        </View>
      </View>
    </View>
  );
};
