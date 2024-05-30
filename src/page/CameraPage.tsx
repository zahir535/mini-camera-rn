import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  CameraRuntimeError,
  PhotoFile,
  useFrameProcessor,
  runAtTargetFps,
} from "react-native-vision-camera";
import { useSharedValue } from "react-native-worklets-core";
import { RNImageResizer } from "../integrations";
import { toBase64 } from "vision-camera-base64-v3";

import { Tensor, TensorflowModel, useTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";

function tensorToString(tensor: Tensor): string {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
}
function modelToString(model: TensorflowModel): string {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join("")}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join("")}`
  );
}

export const CameraPage = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const isScanned = useSharedValue(false);
  const base64Image = useSharedValue("");
  const takePic = useSharedValue(false);

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>("");
  // console.log(">>>>> photoUri", photoUri);
  // const [takePic, setTakePic] = useState(false);

  // from https://www.kaggle.com/models/tensorflow/efficientdet/frameworks/tfLite
  const model = useTensorflowModel(require("../assets/efficientdet.tflite"));
  const actualModel = model.state === "loaded" ? model.model : undefined;

  useEffect(() => {
    if (actualModel == null) return;
    console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`);
  }, [actualModel]);

  const { resize } = useResizePlugin();

  const handleTakePic = async () => {
    console.log("handleTakePic run");
    if (camera !== null && camera.current) {
      const file: PhotoFile = await camera.current.takePhoto({});
      // interchange width and height because of wrong orientation
      const filePath = `file://${file.path}`;
      const resizeResponse = await RNImageResizer.createResizedImage(filePath, file.width, file.height, "PNG", 100);
      setPhotoUri(resizeResponse?.uri || "");

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

  const tfliteFrameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      runAtTargetFps(1, () => {
        if (actualModel == null) {
          // model is still loading...
          return;
        }

        console.log(`Running inference on ${frame}`);
        const resized = resize(frame, {
          scale: {
            width: 320,
            height: 320,
          },
          pixelFormat: "rgb",
          dataType: "uint8",
        });
        const result = actualModel.runSync([resized]);
        const num_detections = result[3]?.[0] ?? 0;
        console.log("Result: " + num_detections);
      });
    },
    [actualModel],
  );

  // original frame processor
  // const frameProcessor = useFrameProcessor((frame) => {
  //   "worklet";

  //   runAtTargetFps(1, () => {
  //     if (!takePic.value) {
  //       console.log("SAVING FRAME...");
  //       try {
  //         const imageAsBase64 = toBase64(frame).toString();
  //         isScanned.value = true;
  //         const metadata = {
  //           height: frame.height,
  //           width: frame.width,
  //           isMirrored: frame.isMirrored,
  //           orientation: frame.orientation,
  //         };

  //         base64Image.value = `data:image/png;base64, ${imageAsBase64}`;

  //         console.log(">>>> metadata", metadata);
  //       } catch (error) {
  //         console.log("Error in saving image", JSON.stringify(error));
  //       }

  //       takePic.value = false;
  //     }

  //     // console.log(">>> frame", frame.pixelFormat);
  //   });
  // }, []);

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
          frameProcessor={tfliteFrameProcessor}
          // frameProcessor={isScanned.value === false ? frameProcessor : undefined}
        />
      )}
      {/* <Pressable style={{ padding: 16, width: "100%", alignItems: "center" }} onPress={handleTakePic} disabled={!isCameraInitialized}>
        <Text>Take Pic</Text>
      </Pressable>

      {base64Image.value !== "" ? (
        <View>
          <Image source={{ uri: base64Image.value }} style={{ height: 200, width: 200 }} />
        </View>
      ) : null}

      {photoUri !== "" ? (
        <View>
          <Image source={{ uri: photoUri }} style={{ height: 200, width: 200 }} />
        </View>
      ) : null} */}
    </View>
  );
};
