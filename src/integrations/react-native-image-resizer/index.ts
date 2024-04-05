import ImageResizer, { ResizeFormat, Response } from "@bam.tech/react-native-image-resizer";

type Options = {
  mode: "contain";
  onlyScaleDown: false;
};

const defaultOptions: Options = {
  mode: "contain",
  onlyScaleDown: false,
};

const createResizedImage = async (
  uri: string,
  width: number,
  height: number,
  format: ResizeFormat,
  quality: number,
  rotation?: number,
  outputPath?: string,
  keepMeta?: boolean,
  options?: Options,
) => {
  // response.uri is the URI of the new image that can now be displayed, uploaded...
  // response.path is the path of the new image
  // response.name is the name of the new image with the extension
  // response.size is the size of the new image

  try {
    const resized: Response = await ImageResizer.createResizedImage(
      uri,
      width,
      height,
      format,
      quality,
      rotation || 0,
      outputPath,
      keepMeta || false,
      options || defaultOptions,
    );

    return resized;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(error));
    return undefined;
  }
};

export const RNImageResizer = { createResizedImage };
