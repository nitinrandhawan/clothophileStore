import { Router } from "express";
import { AddProduct2, FilterProducts, GetAllProducts,GetProductDetails } from "../Controllers/product.controllers.js";
import {verifyUser} from '../Middleware/verifyUser.middleware.js'
import { upload } from "../Middleware/multer.middleware.js";
import { uploadImages } from "../Middleware/uploadimage.middleware.js";
const router=Router()

router.route('/get-all-products').get(GetAllProducts)
router.route('/get-product-details').post(GetProductDetails)
router.route('/add-product').post(upload.any(),uploadImages,AddProduct2)
router.route('/filter-products').post(FilterProducts)

export default router