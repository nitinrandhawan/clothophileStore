import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

export const uploadImages = async (req, res, next) => {
  const { colors } = req.body;

  console.log("req.body", req.body);
  console.log("req.files", req.files);
  console.log("colors from req body", colors);

  // Ensure that colors array is provided
  if (!colors || colors.length === 0) {
    console.log("color is invalid");

    return res.status(401).json({
      error: "Please add every field, colors array is required",
    });
  }

  req.uploadedImages = [];

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const { colorName, hexColor, slug } = color;

    if (!colorName || !hexColor) {
      return res.status(401).json({
        error: "colorName and hexColor are required",
      });
    }

    const mainImagePathArray = req.files
      .map((file) => {
        if (file.fieldname === `colors[${i}][image]`) {
          return file.path;
        }
        return undefined;
      })
      .filter(Boolean);

    const mainImagePath = mainImagePathArray.join("");
    console.log(mainImagePath);

    if (!mainImagePath) {
      return res.status(401).json({ error: "Upload image for each color" });
    }
    console.log("mainimagepath", mainImagePath);

    // Upload the main image to Cloudinary
    const mainImageUrl = await uploadOnCloudinary(mainImagePath, "product_images");

    // Handling cover images
    const coverImagePaths = req.files
      .map((file) => {
        for (let index = 0; index < 5; index++) {
          if (file.fieldname === `colors[${i}][coverImages][${index}]`) {
            return file.path;
          }
        }
        return undefined;
      })
      .filter(Boolean);

    if (!coverImagePaths || coverImagePaths.length === 0) {
      return res
        .status(401)
        .json({ error: "Upload cover images for each color" });
    }

    // Upload cover images to Cloudinary
    const uploadedCoverImages = await Promise.all(
      coverImagePaths.map(async (coverImagePath) => {
        return await uploadOnCloudinary(coverImagePath, "product_coverimages");
      })
    );

    // Add uploaded images data to req.uploadedImages
    req.uploadedImages.push({
      colorName,
      hexColor,
      slug,
      image: mainImageUrl,
      coverImages: uploadedCoverImages.map((img) => img),
    });
  }

  next();
};
