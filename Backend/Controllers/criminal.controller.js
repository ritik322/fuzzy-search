import { Criminal } from "../Models/criminal.model.js";
import uploadCloudinary from "../Utils/cloudinary.js";

const getCriminal = async(req, res) => {
  const {id} = req.params;
  const criminal = await Criminal.findById({_id: id});
  if(!criminal) {res.status(400).json({message: "Criminal not found", success: false})}

  res.status(200).json({data: criminal,success: true})
}

const getAllCriminals = async(req, res) => {
  try {
    const criminals = await Criminal.find();
    return res.json(criminals);
  } catch (error) {
    return res.status(500).json({ message: "Error" + error.toString() });
  }
}

const addCriminal = async (req, res) => {
  const { name, photo, inCustody, age, description, gender, location, crime } = req.body;

  const isCreatedCriminal = await Criminal.findOne({
    $and: [{ name }, { gender }, {age}, {location}],
  });
  if (isCreatedCriminal) {
    throw new Error(409, "Criminal aleardy exists");
  }

  if (
    [name, inCustody, description, gender, location, crime].some(
      (val) => val.trim() === ""
    )
  ) {
    throw new Error(400, "name, inCustody, description, gender, location, Crime Values are Required");
  }
  const localPathName = req.file?.path;
  if (!localPathName) throw new Error(400, "Photo is required");

  const uploadResult = await uploadCloudinary(localPathName);

  const createdCriminal = await Criminal.create({
    name,
    photo: uploadResult.url,
    inCustody,
    age,
    description,
    gender,
    location,
    crime,
  });

  const criminalCreated = await Criminal.findOne({ _id: createdCriminal._id });
  if (!criminalCreated)
    throw new Error(500, "Something went wrong while creating Criminal");
  res
    .status(201)
    .json({
      statusCode: 201,
      message: "Criminal created successfully",
      data: criminalCreated,
    });
};

const updateCriminal = async (req, res) => {
  try {
    const { name, inCustody, age, description, location, crime} = req.body;
    const {_id} = req.params;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (inCustody) updatedData.inCustody = inCustody;
    if (age) updatedData.age = age;
    if (description) updatedData.description = description;
    if (location) updatedData.description = location;
    if (crime) updatedData.description = crime;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedCriminal = await Criminal.findByIdAndUpdate(_id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedCriminal) {
      return res.status(404).json({ message: "Criminal not found" });
    }

    // Respond with the updated user data
    res.status(200).json({
      message: "Criminal updated successfully",
      updated: true,
      criminal: updatedCriminal,
    });
  } catch (error) {
    console.error("Error updating criminal:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteCriminal = async (req, res) => {
  try {
    const { _id } = req.params;

    const deletingCriminal = await Criminal.findByIdAndDelete(_id);

    if (!deletingCriminal) {
      return res.status(404).json({ message: "Criminal not found" });
    }

    res
      .status(200)
      .json({
        message: "Criminal deleted successfully",
        deleted: true,
        criminal: deletingCriminal,
      });
  } catch (error) {
    console.error("Error deleting Criminal:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteCriminals = async(req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "IDs are required" });
    }
      // Step 1: Find companies and collect their associated HR IDs
      const criminals = await Criminal.find({ _id: { $in: ids } });
      if (!criminals || criminals.length === 0) {
        return res.status(404).json({ message: "Criminals not found" });
      }

      const criminalDeleteResult = await Criminal.deleteMany({ _id: { $in: ids } });

      return res.status(200).json({
        message: "Criminals deleted",
        criminalDeleteResult: criminalDeleteResult.deletedCount,
      });
  } catch (error) {
      console.error("Error deleting Criminals:", error);
      res.status(500).json({ message: "Server error", error });
  }
}; 
export { updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals };
