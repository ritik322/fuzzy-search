import { User } from "../Models/user.model.js";
import uploadCloudinary from "../Utils/cloudinary.js";

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id }).select("-password");
  if (!user) {
    res.status(400).json({ message: "user not found", success: false });
  }
  res.status(200).json({ data: user, success: true });
};

const getAllUser = async (req, res) => {
  const users = await User.find({});
  if (!users)
    res.status(400).json({ message: "no user exist", success: false });

  res
    .status(200)
    .json({ message: "all users retrieved", success: true, data: users });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, post, policeStationId, contact } =
    req.body;
  const isCreatedUser = await User.findOne({ username: username });
  if (isCreatedUser) {
    throw new Error("User aleardy exists");
  }

  if (
    [username, email, password, post, policeStationId, contact].some(
      (val) => val === ""
    )
  ) {
    throw new Error("All fields are required");
  }
  const localPathName = req.file?.path;
  let uploadResult;
  if (localPathName) {
    uploadResult = await uploadCloudinary(localPathName);
  }

  const createdUser = await User.create({
    username,
    avatar: uploadResult?.url || "",
    email,
    password,
    post,
    policeStationId,
    contact,
  });

  const userCreated = await User.findOne({ _id: createdUser._id }).select(
    "-password"
  );
  if (!userCreated)
    throw new Error("Something went wrong while registering ");
  const auth_token = userCreated.generateAccessToken();
  res
    .cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: true,
      maxAge: process.env.ACCESS_TOKEN_EXPIRY,
    })
    .status(201)
    .json({
      statusCode: 201,
      message: "user created successfully",
      isLogin: true,
      data: userCreated,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Error while Registering"})
  }
  
};

const loginUser = async (req, res) => {
  try {
    
    const { username, password } = req.body;

    if (!username) {
      throw new Error("username or email is needed");
    }
    if (!password) {
      throw new Error("password is required");
    }

    const user = await User.findOne({
      $or: [{ username }],
    });
    if (!user) {
      throw new Error("User not found!");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new Error("Incorrect user credentials");
    }

    const loggedInUser = await User.findOne({ _id: user._id }).select(
      "-password "
    );
    const auth_token = loggedInUser.generateAccessToken();
    res
      .status(200)
      .cookie("auth_token", auth_token, {
        httpOnly: true,
        maxAge: process.env.ACCESS_TOKEN_EXPIRY,
      })
      .json({
        statusCode: 200,
        message: "user logged in",
        isLogin: true,
        data: loggedInUser,
      });
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
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
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deleted: true,
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const logoutUser = async (req, res) => {
  const { auth_token } = req.cookies;

  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  res
    .status(200)
    .clearCookie("auth_token", { httpOnly: true, secure: true })
    .json({ message: "Logout successfull", success: true });
};

export {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  logoutUser,
};
