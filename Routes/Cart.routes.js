import { Router } from "express";
import { AddToCart, GetCart, RemoveFromCart } from "../Controllers/cart.controllers.js";

const router=Router()
router.route("/get-cart").post(GetCart)
router.route("/add-to-cart").post(AddToCart)
router.route("/remove-from-cart").post(RemoveFromCart)

export default router