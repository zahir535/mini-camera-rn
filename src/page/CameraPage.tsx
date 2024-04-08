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
  runAsync,
} from "react-native-vision-camera";
import { useSharedValue } from "react-native-worklets-core";
import { RNImageResizer } from "../integrations";
import { toBase64 } from "vision-camera-base64-v3";
import { btoa, atob, fromByteArray } from "react-native-quick-base64";
import { polyfill as polyfillEncoding } from "react-native-polyfill-globals/src/encoding";

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

      takePic.value = !takePic.value;
      isScanned.value = false;
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

    runAtTargetFps(1, () => {
      console.log(">>> takePic", takePic.value);

      // async setup
      // runAsync(frame, async () => {
      //   "worklet";

      // });

      // m5 function
      const largeuint8ArrToString = (uint8arr, callback) => {
        var bb = new Blob([uint8arr]);
        var f = new FileReader();
        f.onload = function (e) {
          if (e !== null && e.target !== null) {
            // callback(e.target.result);
            return e.target.result;
          }
        };

        f.readAsText(bb);
      };

      // m6 function
      const Utf8ArrayToStr = (array): string => {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
          c = array[i++];
          switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
              // 0xxxxxxx
              out += String.fromCharCode(c);
              break;
            case 12:
            case 13:
              // 110x xxxx   10xx xxxx
              char2 = array[i++];
              out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
              break;
            case 14:
              // 1110 xxxx  10xx xxxx  10xx xxxx
              char2 = array[i++];
              char3 = array[i++];
              out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
              break;
          }
        }

        return out;
      };

      // m7 function
      const uint8arrayToStringMethod = (myUint8Arr) => {
        return String.fromCharCode.apply(null, myUint8Arr);
      };

      if (takePic.value) {
        // console.log("SAVING FRAME...");
        try {
          // const imageAsBase64 = toBase64(frame).toString();
          const base64Buffer: ArrayBuffer = frame.toArrayBuffer();
          console.log(">>> 1");
          const base64Uint = new Uint8Array(base64Buffer);
          console.log(">>>>>>> 2");

          // m1- TextDecoder is for browser. need to expose
          // const enc = new TextDecoder("utf-8");
          // const base64Array = enc.decode(base64Uint);

          // m2 - TextDecoder is for browser. need to expose
          // const base64Array = new TextDecoder().decode(base64Uint);
          // console.log(">>>>>>>>>> 3");

          // m3 -failed
          // const base64Array = fromByteArray(base64Uint);
          // console.log(">>>>>>>>>> 3");

          // m4
          // const base64Array = base64Uint.toString();
          // console.log(">>>>>>>>>> 3");

          // m5
          // const base64Array = largeuint8ArrToString(base64Uint, () => {});
          // console.log(">>>>>>>>>> 3");

          // m6
          // const base64Array = Utf8ArrayToStr(base64Uint);
          // console.log(">>>>>>>>>> 3");
          // base64Image.value = `data:image/png;base64, ${base64Array}`;
          // console.log(">>>>>>>>>>>>>> 4");

          // m7 - failed
          // const base64Array = uint8arrayToStringMethod(base64Uint);
          // console.log(">>>>>>>>>> 3");

          // m8
          // const base64Array = new polyfillEncoding.TextDecoder().decode(base64Uint);
          // console.log(">>>>>>>>>> 3");

          // m9
          // const buffer = Buffer.from(base64Buffer); //returned data
          // const imageAsBase64 = buffer.toString("base64");
          console.log(">>>>>>>>>> 3");

          // console.log(">>>>>>>>>> 3");

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
    });

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
