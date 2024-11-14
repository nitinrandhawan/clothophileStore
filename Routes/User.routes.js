
import { Router } from "express";
import { SignIn, SignUp } from "../Controllers/user.controllers.js";

 const router=Router()

router.route('/sign-in').post(SignIn)
router.route('/sign-up').post(SignUp)

export default router