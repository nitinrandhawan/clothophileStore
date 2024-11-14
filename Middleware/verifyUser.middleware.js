import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized access, token missing",
      });
    }

    jwt.verify(
      token,
      process.env.SECRET_ACCESS_TOKEN_KEY,
      (err, decodedToken) => {
        if (err) {
          console.log("JWT Verification Error:", err.message);
          return res.status(401).json({ "error": "Invalid or malformed token please login again" });
        }
        req.user = decodedToken;
        next();
      }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
