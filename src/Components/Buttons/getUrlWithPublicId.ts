// import { v2 as cloudinary } from "cloudinary";
// import { UploadApiOptions } from "cloudinary";

// export const uploadImageToCloudinary = async (imagePath: any) => {
//   cloudinary.config({
//     cloud_name: "dxz5uumy7",
//     api_key: "272626169313357",
//     api_secret: "qiUMjEzYF3_fq7j7OqcxYoVTXOk",
//     secure: true,
//   });

//   console.log(cloudinary.config());
//   // Use the uploaded file's name as the asset's public ID and
//   // allow overwriting the asset with new versions
//   const options: UploadApiOptions = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: false,
//     //upload_preset: "./Food_data2",
//     public_id: "newId",
//     //signature: "mySig",
//   };

//   try {
//     // Upload the image
//     const result = await cloudinary.uploader.upload(imagePath, options);
//     console.log(result);
//     return result.public_id;
//   } catch (error) {
//     console.error(error);
//   }
// };

// require("dotenv").config();
// const cloudinary = require("cloudinary").v2;
// console.log(cloudinary.config().cloud_name);

// export const uploadVideo = (file: File | null) => {
//   var up_options = {
//     resource_type: "video",
//     eager: [{ streaming_profile: "full_hd", format: "m3u8" }],
//     eager_async: true,
//     eager_notification_url: "http://localhost:3000/",
//     public_id: "nature",
//   };
//   cloudinary.uploader.upload(file, up_options, function (result: any) {
//     console.log(result);
//   });
// };

// export async function getVideoWithPublicIdCloudinary(
//   publicId: string
// ): Promise<string> {
//   console.log("Upload video");

//   cloudinary.config({
//     cloud_name: "dxz5uumy7",
//     api_key: "272626169313357",
//     api_secret: "qiUMjEzYF3_fq7j7OqcxYoVTXOk",
//     secure: true,
//   });

//   let url = "";
//   while (url === "") {
//     try {
//       await cloudinary.api.resource(publicId).then(async (value) => {
//         url = value.url;
//         return value.url;
//       });

//       return url;
//     } catch (error) {
//       console.error("updateImageToCloud: ", error);
//     }
//   }

//   return url;
// }

// export async function getImageWithPublicIdCloudinary(
//   publicId: string
// ): Promise<string> {
//   console.log("Upload image");

//   cloudinary.config({
//     cloud_name: "dxz5uumy7",
//     api_key: "272626169313357",
//     api_secret: "qiUMjEzYF3_fq7j7OqcxYoVTXOk",
//     secure: true,
//   });

//   let url = "";
//   while (url === "") {
//     try {
//       await cloudinary.api.resource(publicId).then(async (value) => {
//         url = value.url;
//         return value.url;
//       });

//       return url;
//     } catch (error) {
//       console.error("updateImageToCloud: ", error);
//     }
//   }

//   return url;
// }
