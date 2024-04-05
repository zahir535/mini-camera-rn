import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useCameraPermission, useCameraDevice, Camera, CameraRuntimeError, PhotoFile } from "react-native-vision-camera";

export const CameraPage = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoFile | undefined>(undefined);

  const handleTakePic = async () => {
    console.log("handleTakePic run");
    if (camera !== null && camera.current) {
      const file: PhotoFile = await camera.current.takePhoto({});
      // interchange width and height because of wrong orientation
      const updatedFile = { ...file, height: file.width, width: file.height };
      setPhotoData(updatedFile);
    }
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

  const filePath = `file://${photoData?.path}`;

  return (
    <View>
      {device && (
        <Camera
          style={{ height: "70%" }}
          device={device}
          isActive={true}
          onError={onError}
          onInitialized={onInitialized}
          photo={true}
          ref={camera}
          video={false}
        />
      )}
      <Pressable style={{ padding: 16, width: "100%", alignItems: "center" }} onPress={handleTakePic} disabled={!isCameraInitialized}>
        <Text>Take Pic</Text>
      </Pressable>

      {photoData !== undefined ? (
        <View>
          <Image source={{ uri: filePath }} />
        </View>
      ) : null}
    </View>
  );
};
