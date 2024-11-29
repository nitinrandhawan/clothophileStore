import { Router } from "express";
import { AddToCart, GetCart, RemoveFromCart,DeleteFromCart } from "../Controllers/cart.controllers.js";

const router=Router()
router.route("/get-cart").post(GetCart)
router.route("/add-to-cart").post(AddToCart)
router.route("/remove-from-cart").post(RemoveFromCart)
router.route("/delete-from-cart").post(DeleteFromCart)

export default router