import { User } from "../Models/user.model.js";
import uploadCloudinary from "../Utils/cloudinary.js";

const registerUser = async (req, res) => {
  const { username, email, password, post,role, policeStationId } = req.body;

  const isCreatedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isCreatedUser) {
    throw new Error(409, "User aleardy exists");
  }

  if (
    [username, email, password, post,role, policeStationId].some(
      (val) => val.trim() === ""
    )
  ) {
    throw new Error(400, "All fields are required");
  }
  const localPathName = req.file?.path;
  if (!localPathName) throw new Error(400, "Avatar is required");

  const uploadResult = await uploadCloudinary(localPathName);

  const createdUser = await User.create({
    username,
    avatar: uploadResult.url,
    email,
    password,
    post,
    role,
    policeStationId,
  });

  const userCreated = await User.findOne({ _id: createdUser._id }).select(
    "-password"
  );
  if (!userCreated)
    throw new Error(500, "Something went wrong while registering ");
  const auth_token = userCreated.generateAccessToken();
  res
    .cookie("auth_token", auth_token)
    .status(201)
    .json({"statusCode": 200, message: "user created successfully", data: userCreated });
};

export {registerUser}
