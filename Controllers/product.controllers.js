import { Product } from "../Model/product.js";
import { User } from "../Model/user.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

const AddProduct = async (req, res) => {
  let { id } = req.user;

  await User.findOne({ _id: id })
    .select("-password")
    .then((user) => {
      if (user.role !== "admin") {
        return res.status(401).json({
          error: "You are not allowed to access",
        });
      }
    })
    .catch((err) => {
      console.log("add product's user finding error", err.message);

      return res.status(500).join({
        ERROR: "Internal error occurred",
      });
    });

  let {
    name,
    description,
    price,
    size,
    stock,
    mainCategory,
    subCategory,
    discount,
    colorName,
    hexColor,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !size ||
    !stock ||
    !colorName ||
    !hexColor ||
    !mainCategory ||
    !subCategory ||
    !discount
  ) {
    return res.status(403).json({
      error:
        "All product's Information is required (name,description,price,size,stock,colorName,hexColor,mainCategory,subCategory,discount)",
    });
  }

  let { image, coverImages } = req.files;
  if ((!image, !coverImages)) {
    return res.status(403).json({
      error: "Please upload both images and coverImages",
    });
  }

  let ImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.image) &&
    req.files.image.length > 0
  ) {
    ImageLocalPath = req.files.image[0].path;
  }
  let coverImagesLocalPath = [];
  if (req.files.coverImages.length > 6) {
    return res.status(401).json({
      error: "please upload only 6 coverImages",
    });
  }
  if (
    req.files &&
    Array.isArray(req.files.coverImages) &&
    req.files.coverImages.length > 0
  ) {
    req.files.coverImages.map((file, index) => {
      coverImagesLocalPath[index] = file.path;
    });
  }

  // uploading files on cloudinary
  const ImagePath = await uploadOnCloudinary(ImageLocalPath, "products");

  let CoverImagesArray = [];

  for (const coverImage of coverImagesLocalPath) {
    const response = await uploadOnCloudinary(coverImage, "products/cover");
    CoverImagesArray.push(response);
  }

  let discountedPrice = Math.floor(price - (discount * price) / 100);

  try {
    const product = new Product({
      name: name.toLowerCase(),
      description,
      price,
      image: ImagePath,
      coverImages: CoverImagesArray,
      discountedPrice,
      size,
      colorName,
      hexColor,
      stock,
      mainCategory,
      subCategory,
      discount,
    });

    await product.save();
    return res.status(200).json({
      message: "Product added successfully",
    });
  } catch (error) {
    console.log("error", error);
    if (error.name === "ValidationError") {
      console.error("Validation Error:", error.message);
      for (const field in error.errors) {
        if (error.errors[field].kind === "enum") {
          console.error(
            `Invalid value for field "${field}": ${error.errors[field].value}`
          );
          console.error(
            `Allowed values are: ${error.errors[
              field
            ].properties.enumValues.join(", ")}`
          );
          return res.status(403).json({
            error: `Invalid value for field "${field}": ${error.errors[field].value}`,
          });
        }
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }

    return res.status(500).json({
      error: "Internal error is occurred. Please try tater",
    });
  }
};

const AddProduct2prev = async (req, res) => {
 try {
   const { name, description, mainCategory, subCategory } = req.body;
 
if([name,description,mainCategory,subCategory].some((field)=> !field)){
  return res.status(401).json({
    'error':"All fileds are required (name,description,maincategory,subcategory)"
  })
}
let discountedPrice = Math.floor(price - (discount * price) / 100);

   const colors = req.uploadedImages.map((uploadImage, index) => {
     return {
       ...uploadImage,
       size: req.body.colors[index].size,
       discount: req.body.colors[index].discount,
       price: req.body.colors[index].price,
       discountedPrice:Math.floor(req.body.colors[index].price - (req.body.colors[index].discount * req.body.colors[index].price) / 100),
       stock: req.body.colors[index].stock,
       ratings: req.body.colors[index].ratings,
       reviews: req.body.colors[index].reviews,
       totalReviews: req.body.colors[index].totalReviews,
     };
   });
 
 
   const product = new Product({
     name,
     description,
     mainCategory,
     subCategory,
     colors,
   })
 await  product.save()
 
res.status(200).json({
  "successfully":"product is created"
})

 } catch (error) {
  console.log('error');
  res.status(500).json({ error: 'Failed to create product' });
 }

};

const AddProduct2 = async (req, res) => {
  try {
    const { name, description, mainCategory, subCategory,productDetails,otherDetails,features } = req.body;

    if ([name, description, mainCategory, subCategory,productDetails,otherDetails,features].some((field) => !field)) {
      
      return res.status(401).json({
        error: "All fields are required (name, description, mainCategory, subCategory, productDetails, otherDetails, features)",
      });
    }

    const colors = req.uploadedImages.map((uploadImage, index) => {
      const colorData = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors)[index] : req.body.colors[index];
      
      return {
        ...uploadImage,
        size: colorData.size,
        discount: colorData.discount,
        price: colorData.price,
        discountedPrice: Math.floor(colorData.price - (colorData.discount * colorData.price) / 100),
        stock: colorData.stock,
        ratings: colorData.ratings,
        reviews: colorData.reviews,
        totalReviews: colorData.totalReviews,
      };
    });

    const product = new Product({
      name,
      description,
      mainCategory,
      subCategory,
      features,
      productDetails,
      otherDetails,
      colors,
    });

    await product.save();

    res.status(200).json({
      message: "Product is created successfully",
    });

  } catch (error) {
    console.log('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};


const GetAllProducts = async (req, res) => {
  try {
    const AllProducts = await Product.find().sort({
      discountedPrice: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      AllProducts,
    });
  } catch (error) {
    console.log("get all products error", error);
    return res.status(500).json({
      error: "Inernal Error please try later",
    });
  }
};

const FilterProducts = async (req, res) => {
  let {
    discount,
    colorName,
    sizeRanges,
    price,
    limit,
    priceRanges,
    latest,
    HighToLow,
  } = req.body;
// console.log("priceRanges",priceRanges);

  let sortQuery = {};
  let findQuery = {};
  
  if (latest) {
    sortQuery.createdAt = -1;
  } 
  if (discount) {
    sortQuery["colors.discount"] = -1; 
  } else if (HighToLow) {
    sortQuery["colors.discountedPrice"] = -1; 
  } else if (latest) {
    sortQuery["createdAt"] = -1; 
  } else {
    sortQuery["colors.discountedPrice"] = 1; 
  }
  let rangeQueries;
  if (priceRanges && priceRanges.length > 0) {
     rangeQueries = priceRanges.map((range) => ({
      colors: {
        $elemMatch: {
          discountedPrice: { $gte: range.minPrice, $lte: range.maxPrice },
        },
      },
    }));
  
    findQuery = { $or: rangeQueries };
  }
  // console.log('sizeranges',sizeRanges);
  

  if (sizeRanges && sizeRanges.length > 0) {
    let sizeQueries = sizeRanges.map((range) => ({
      colors:{
        $elemMatch:{
          size:range
        }
      }
    }));
    if (priceRanges && priceRanges.length > 0) {
      findQuery = {
          $and: [
            { $or: sizeQueries },  
            { $or: rangeQueries },  
          ]
       
      };
    } else {
      findQuery = { $or: sizeQueries };
    }
  }

  if (colorName && colorName.length>0) {
    // console.log("colorName",colorName);
    
    let colorQuery=colorName.map((color)=> ({colors:{$elemMatch:{colorName:color}}}))
    if(findQuery["$and"]){
      findQuery["$and"].push({$or:colorQuery})
    }else{
      Object.assign(findQuery,{$or:colorQuery})
    }
  }
  // if (price) {
  //   findQuery.colors[discountedPrice] = discountedPrice;
  // }
 

  // console.log("findquery", findQuery);

  try {
    const AllProducts = await Product.find(findQuery)
      .sort(sortQuery)
      .limit(limit);

    return res.status(200).json({
      AllProducts,
    });
  } catch (error) {
    console.log("get filter products error", error);
    return res.status(500).json({
      error: "Inernal Error please try later",
    });
  }
};






const GetProductDetails = async (req, res) => {
  const { slug } = req.body;
  
  if (!slug) {
    return res
      .status(403)
      .json({ error: "please give slug to get products details" });
  }
  await Product.findOne({colors: {$elemMatch:{slug}} })
    .then((product) => {

      
      if (!product) {
        return res.status(401).json({ rttot: "Invalid slug" });
      } else {
        return res.status(200).json({ productDetails: product });
      }
    })
    .catch((err) => {
      console.log("product details error", err.message);
      return res.status(500).json({
        error: "Internal error occurred",
      });
    });
};
export {
  AddProduct,
  GetAllProducts,
  FilterProducts,
  GetProductDetails,
  AddProduct2,
};
