import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  CameraRuntimeError,
  PhotoFile,
  useFrameProcessor,
  runAtTargetFps,
  RecordVideoOptions,
  VideoFile,
  CameraCaptureError,
} from "react-native-vision-camera";
import { RNCameraRoll, RNImageResizer } from "../integrations";
import { DEVICE } from "../constant/constant";
import { ImageButton } from "../component/ImageButton";

export const CameraPage = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);

  const [, setIsCameraInitialized] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const handleTakePic = async () => {
    if (camera !== null && camera.current) {
      const file: PhotoFile = await camera.current.takeSnapshot({ quality: 100 });
      // const file: PhotoFile = await camera.current. takePhoto({});
      const filePath = `file://${file.path}`;
      const resizeResponse = await RNImageResizer.createResizedImage(filePath, file.width, file.height, "PNG", 100);
      if (resizeResponse?.uri) {
        const res = await RNCameraRoll.savePicture({ tag: resizeResponse?.uri, type: "photo", album: "miniCameraRn pictures" });
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> res", JSON.stringify(res));
      }
    }
  };

  const onFinishRecording = async (video: VideoFile) => {
    console.log("onFinishRecording");
    // todo save to gallery
    const videoFile = video.path;
    const res = await RNCameraRoll.savePicture({ tag: videoFile, type: "video", album: "miniCameraRn pictures" });
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> res", JSON.stringify(res));
    setIsVideo(false);
  };

  const onErrorRecording = async (error: CameraCaptureError) => {
    console.log("onErrorRecording");
    // todo handling error
    console.log(">>>> error", JSON.stringify(error));
    Alert.alert("Error in taking video.");
    setIsVideo(false);
  };

  const handleStartVideo = async () => {
    setIsVideo(true);
    if (camera !== null && camera.current) {
      const videoOptions: RecordVideoOptions = {
        fileType: "mp4",
        videoCodec: "h265",
        onRecordingError: onErrorRecording,
        onRecordingFinished: onFinishRecording,
      };
      await camera.current.startRecording(videoOptions);
    }
  };

  const handleStopVideo = async () => {
    console.log("handleStopVideo");
    if (camera !== null && camera.current) {
      await camera.current.stopRecording();
    }
  };

  const handleOpenGallery = () => {
    console.log("handleOpenGallery run");
  };

  const handleInitPermission = async () => {
    if (hasPermission === false) {
      await requestPermission();
    }

    await RNCameraRoll.requestPermission();
  };

  useEffect(() => {
    handleInitPermission();
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
          video={true}
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
              height: 0.3 * DEVICE.HEIGHT,
              backgroundColor: black60,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <ImageButton onPress={handleOpenGallery} isMultiLayered={true} />
            <Pressable
              onPress={isVideo ? handleStopVideo : handleTakePic}
              onLongPress={handleStartVideo}
              style={{ height: 0.1 * DEVICE.HEIGHT, width: 0.1 * DEVICE.HEIGHT, backgroundColor: "white", borderRadius: 40 }}
            />
            <View style={{ height: 0.08 * DEVICE.HEIGHT, width: 0.08 * DEVICE.HEIGHT, backgroundColor: "transparent", borderRadius: 4 }} />
          </View>
        </View>
      </View>
    </View>
  );
};
