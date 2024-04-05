import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useCameraPermission, useCameraDevice, Camera, CameraRuntimeError, PhotoFile, useFrameProcessor } from "react-native-vision-camera";
import { useSharedValue } from "react-native-worklets-core";
import { RNImageResizer } from "../integrations";
import { toBase64 } from "vision-camera-base64-v3";
import { btoa, atob, fromByteArray } from "react-native-quick-base64";

export const CameraPage = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const isScanned = useSharedValue(false);
  const base64Image = useSharedValue("");
  const takePic = useSharedValue(false);

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>("");
  console.log(">>>>> photoUri", photoUri);

  // const [takePic, setTakePic] = useState(false);

  const handleTakePic = async () => {
    console.log("handleTakePic run");
    if (camera !== null && camera.current) {
      // const file: PhotoFile = await camera.current.takePhoto({});
      // // interchange width and height because of wrong orientation
      // const filePath = `file://${file.path}`;
      // const resizeResponse = await RNImageResizer.createResizedImage(filePath, file.width, file.height, "PNG", 100);
      // setPhotoUri(resizeResponse?.uri || "");

      takePic.value = true;
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

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";

    console.log(">>> takePic", takePic.value);

    if (takePic.value) {
      // console.log("SAVING FRAME...");
      try {
        // const imageAsBase64 = toBase64(frame).toString();
        const base64Buffer: ArrayBuffer = frame.toArrayBuffer();
        console.log(">>>>>>>>>>>>>> 1");
        const base64Uint = new Uint8Array(base64Buffer);
        console.log(">>>>>>>>>>>>>> 2");

        const enc = new TextDecoder("utf-8");
        const base64Array = enc.decode(base64Uint);
        // const base64Array = fromByteArray(base64Uint);
        // console.log(">>>>>>>>>>>>>> 3");
        // const imageAsBase64 = btoa(base64Array);
        // console.log(">>>>>>>>>>>>>> 4");

        // isScanned.value = true;
        // const metadata = {
        //   height: frame.height,
        //   width: frame.width,
        //   isMirrored: frame.isMirrored,
        //   orientation: frame.orientation,
        // };

        // console.log("imageAsBase64", imageAsBase64);

        // base64Image.value = `data:image/png;base64, ${imageAsBase64}`;

        // console.log(">>>> metadata", metadata);

        // takePic.value = false;
      } catch (error) {
        console.log("Error in saving image", JSON.stringify(error));
      }
    }

    // console.log(">>> frame", frame.pixelFormat);
  }, []);

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
          frameProcessor={frameProcessor}
          // frameProcessor={isScanned.value === false ? frameProcessor : undefined}
        />
      )}
      <Pressable style={{ padding: 16, width: "100%", alignItems: "center" }} onPress={handleTakePic} disabled={!isCameraInitialized}>
        <Text>Take Pic</Text>
      </Pressable>

      {base64Image.value !== "" ? (
        <View>
          <Image source={{ uri: base64Image.value }} style={{ height: 200, width: 200 }} />
        </View>
      ) : null}

      {/* {photoUri !== "" ? (
        <View>
          <Image source={{ uri: photoUri }} style={{ height: 200, width: 200 }} />
        </View>
      ) : null} */}
    </View>
  );
};
