import mongoose from "mongoose";
import slugify from "slugify";
const productSchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    features:{
      type:[String],
      required:true
    },
    productDetails:{
      type:[String],
      required:true
    },
    otherDetails:{
      type:[String],
      required:true
    },
    mainCategory: {
      type: [String],
      required: true,
      default: "Men",
      enum: ["Men", "Women", "Kids", "Accessories"],
    },
    subCategory: {
      type: [String],
      required: true,
      enum: ["T-shirt", "Shirt", "Jeans", "Jacket", "Sweater", "Watch"],
    },
    colors: [
      {
        colorName: {
          type: String,
          required: true,
        },
        hexColor: {
          type: String,
          required: true,
        },
        slug: {
          type: String,
          unique: true,
        },
        image: {
          type: String,
          required: true,
        },
        coverImages: {
          type: [String],
          required: true,
        },
        size: {
          type: [String],
          required: true,
          enum: ["S", "M", "L", "XL", "XXL"],
        },
        discount: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discountedPrice: {
          type: Number,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        ratings: {
          type: Number,
          default: 0,
        },
        reviews: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            rating: {
              type: Number,
              required: true,
              min: 1,
              max: 5,
            },
            comment: {
              type: String,
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        totalReviews: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.colors.forEach((colorVariant) => {
    if (!colorVariant.slug) {
      colorVariant.slug =
        slugify(`${this.name}-${colorVariant.colorName}`, { lower: true }) +
        "-" +
        Date.now();
    }
  });
  next();
});

export const Product = new mongoose.model("Product", productSchema);

// import mongoose from "mongoose";
// import slugify from "slugify";
// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     discountedPrice: {
//       type: Number,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     coverImages: {
//       type: [String],
//       required: true,
//     },
//     size: {
//       type: [String],
//       required: true,
//       enum: ["S", "M", "L", "XL", "XXL"],
//     },
//     mainCategory: {
//       type: [String],
//       required: true,
//       default: "Men",
//       enum: ["Men", "Women", "Kids", "Accessories"],
//     },
//     subCategory: {
//       type: [String],
//       required: true,
//       enum: ["T-shirt", "Shirt", "Jeans", "Jacket", "Sweater", "Watch"],
//     },
//     discount: {
//       type: Number,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       required: true,
//       min: 0,
//       default: 0,
//     },
//     ratings: {
//       type: Number,
//       default: 0,
//     },
//     color: {
//       type: String,
//       required: true,
//     },
//     reviews: [
//       {
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         rating: {
//           type: Number,
//           required: true,
//           min: 1,
//           max: 5,
//         },
//         comment: {
//           type: String,
//           required: true,
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     totalReviews: {
//       type: Number,
//       default: 0,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// productSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.name, { lower: true }) + "-" + Date.now();
//   }
//   next();
// });

// export const Product = new mongoose.model("Product", productSchema);
