import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import { env } from "~/env.mjs";
import cloudinary from "./config";

const uploadLargeVideo = async (videoPath: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options: UploadApiOptions = {
    use_filename: false,
    //unique_filename: false,
    //overwrite: false,
    upload_preset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    public_id: new Date().getMilliseconds().toString(),
    resource_type: "video",
    // chunk_size: 30000000,
    eager: [{ streaming_profile: "full_hd", format: "m3u8" }],
    eager_async: true,
    async: true,
    //signature: "mySig",
  };

  const res = await cloudinary.uploader.upload_large(
    videoPath,
    options,
    function (error, result) {
      return result?.secure_url!;
    }
  );
  return res;
};

export default uploadLargeVideo;
