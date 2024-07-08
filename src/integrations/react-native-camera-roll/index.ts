import { PermissionsAndroid, Platform } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const hasAndroidPermission = async () => {
  const getCheckPermissionPromise = () => {
    const platformVersion = Number(Platform.Version);
    if (platformVersion >= 33) {
      return Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]).then(([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) => hasReadMediaImagesPermission && hasReadMediaVideoPermission);
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }

  const getRequestPermissionPromise = () => {
    const platformVersion = Number(Platform.Version);
    if (platformVersion >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
  };

  return await getRequestPermissionPromise();
};

interface savePictureProps {
  tag: string;
  type?: "photo" | "video" | "auto";
  album?: string;
}

const savePicture = async ({ tag, type, album }: savePictureProps) => {
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }

  CameraRoll.saveAsset(tag, { type, album });
};

export const RNCameraRoll = { savePicture };
