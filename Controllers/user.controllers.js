import bcrypt from "bcrypt";
import { User } from "../Model/user.js";

import jwt from "jsonwebtoken";

const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = async (req, res) => {
  let { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(403).json({
      error: "All fields are required",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Please enter valid email address" });
  } else if (!passwordRegex.test(password)) {
    return res
      .status(403)
      .json({
        error:
          "Password that requires at least 1 uppercase, 1 lowercase letter, one number, and a minimum of 8 characters",
      });
  }

  await User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(403).json({ error: "user already exists" });
    }
  });

  await bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("bcrypt error", err.message);
      return res.status(500).json({
        error: "something occurred in interal please try later",
      });
    }
    try {
      const Newuser = new User({
        name,
        email,
        password: hash,
      });
      await Newuser.save();
    } catch (error) {
      console.log("error", error.message);

      return res.status(500).json({
        error: "failed to create user",
      });
    }
  });

  return res.status(200).json({
    successfully: "User Created Successfully",
  });
};

const SignIn = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({
      error: "All fields are required",
    });
  }

  await User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(401).json({
        error: "Firstly signup, User doesn't exists",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {

      if (!result) {
        return res.status(401).json({
          error: "Password is Incorrect",
        });
      }
     try {
      const access_token= jwt.sign({id:user._id,user: user.name},process.env.SECRET_ACCESS_TOKEN_KEY,{expiresIn:"1day"})
      const refresh_token= jwt.sign({id:user._id,user: user.name},process.env.SECRET_REFRESH_TOKEN_KEY,{expiresIn:"10day"})
      return res.status(200).json({
        message: "Logged in Successfully",
        user_id:user._id,
        name:user.name,
        email:user.email,
        access_token,
        refresh_token,
        role: user.role
      });
     } catch (error) {
      return res.status(500).json({
        "error":"An error occurred while processing your request"
      })
     }

    });
  });
};

export { SignUp, SignIn };
