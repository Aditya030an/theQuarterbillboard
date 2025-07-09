import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  console.log("req.headers", req);

  console.log("authUser middleware called" , token);

  if (!token) {
    return res.status(401).json({
      message: "You are not authorized, login again",
      success: false,
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token_decode", token_decode);

    // ✅ Ensure req.body is defined before setting userId
    if (!req.body) {
      req.body = {};
    }

    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
