import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env.mjs";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.NEXT_PUBLIC_CLOUDINARY_API_SECTRECT,
  secure: true,
});

export default cloudinary;
