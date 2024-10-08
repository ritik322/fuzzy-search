import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

const authenticateUser = async (req, _, next) => {
  const { auth_token } = req.cookies;

  if (!auth_token) {
    throw new Error(400, "You are not authorized to performed this operation");
  }

  const decoded = jwt.verify(auth_token, process.env.SECRET_KEY);

  if (!decoded) {
    throw new Error(400, "You are not authorized to performed this operation");
  }

  const { id } = decoded;

  const user = await User.findOne({ _id: id }).select("-password");

  if (!user) {
    throw new Error(400, "user doesn't exist");
  }

  req.user = user;
  next();
};

export { authenticateUser };
