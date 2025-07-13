import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      message: "You are not authorized, login again",
      success: false,
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRATE);
    // console.log("token_decode", token_decode);

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
