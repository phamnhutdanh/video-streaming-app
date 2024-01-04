import { UploadApiOptions } from "cloudinary";
import { env } from "~/env.mjs";
import cloudinary from "./config";

const uploadVideo = async (videoPath: string) => {
  const options: UploadApiOptions = {
    use_filename: false,
    upload_preset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    public_id: new Date().getMilliseconds().toString(),
    resource_type: "video",
    eager: [{ streaming_profile: "full_hd", format: "m3u8" }],
  };

  const res = await cloudinary.uploader.upload(
    videoPath,
    options,
    function (error, result) {
      return result?.secure_url!;
    }
  );
  return res;
};

export default uploadVideo;
