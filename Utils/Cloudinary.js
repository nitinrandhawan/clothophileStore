import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudinary = async (localfilepath, folder) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API__SECRET_KEY,
  });
  try {
    if (!localfilepath) {
      console.log("You forgot to give localfilepath on cloudinary");
      return null;
    }
    const response = await cloudinary.uploader.upload(localfilepath, {
      folder: folder,
    });
    if (fs.existsSync(localfilepath)) {
        fs.unlinkSync(localfilepath);
      }
    return response.url;
  } catch (error) {
    fs.unlinkSync(localfilepath);
    console.log("cloudinary uploading error", error);
    return null;
  }
};
