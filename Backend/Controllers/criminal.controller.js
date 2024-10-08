import { Criminal } from "../Models/criminal.model.js";
import uploadCloudinary from "../Utils/cloudinary.js";

const getCriminal = async(req, res) => {
  const {id} = req.body
  const criminal = await Criminal.findById({_id: id});
  if(!criminal) {res.status(400).json({message: "Criminal not found", success: false})}

  res.status(200).json({data: user,success: true})
}

const registerUser = async (req, res) => {
  const { username, email, password, post, role, policeStationId, contact } =
    req.body;

  const isCreatedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isCreatedUser) {
    throw new Error(409, "User aleardy exists");
  }

  if (
    [username, email, password, post, role, policeStationId, contact].some(
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
    contact,
  });

  const userCreated = await User.findOne({ _id: createdUser._id }).select(
    "-password"
  );
  if (!userCreated)
    throw new Error(500, "Something went wrong while registering ");
  const auth_token = userCreated.generateAccessToken();
  res
    .cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: true,
      maxAge: Process.env.ACCESS_TOKEN_EXPIRY,
    })
    .status(201)
    .json({
      statusCode: 201,
      message: "user created successfully",
      isLogin: true,
      data: userCreated,
    });
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new Error(400, "username or email is needed");
  }
  if (!password) {
    throw new Error(400, "password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new Error(404, "User not found!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new Error(401, "Incorrect user credentials");
  }

  const loggedInUser = await User.findOne({ _id: user._id }).select(
    "-password "
  );
  const auth_token = loggedInUser.generateAccessToken();
  res
    .status(200)
    .cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: true,
      maxAge: process.env.ACCESS_TOKEN_EXPIRY,
    })
    .json({
      statusCode: 200,
      message: "user logged in",
      isLogin: true,
      data: loggedInUser,
    });
};

const updateUser = async (req, res) => {
  try {
    const { email, contact, policeStationId, post } = req.body;
    const { _id } = req.user;

    const updatedData = {};

    if (email) updatedData.email = email;
    if (contact) updatedData.contact = contact;
    if (policeStationId) updatedData.policeStationId = policeStationId;
    if (post) updatedData.post = post;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.status(200).json({
      message: "User updated successfully",
      updated: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;

    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({
        message: "User deleted successfully",
        deleted: true,
        user: deletedUser,
      });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export { registerUser, loginUser, updateUser, deleteUser,getUser };
