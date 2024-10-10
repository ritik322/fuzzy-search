import { Criminal } from "../Models/criminal.model.js";
import uploadCloudinary from "../Utils/cloudinary.js";
import multer from "multer"
import csvParser from "csv-parser"
import xlsx from "xlsx" // For Excel files
import fs from "fs"
import { Parser as json2csv } from 'json2csv'; 
import path from "path";

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

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
  try {
    const { name, inCustody, age, description, gender, location } = req.body;
    console.log("name: ", name, ", inCustody: ", inCustody, ", age: ", age, ", description: ", description, ", gender: ", gender, "location: ", location);
    const isCreatedCriminal = await Criminal.findOne({
      $and: [{ name }, { gender }, {age}, {location}],
    });
    if (isCreatedCriminal) {
      throw new Error(409, "Criminal aleardy exists");
    }
  
    if (
      [name, inCustody, description, gender, location].some(
        (val) => val === ""
      )
    ) {
      throw new Error(400, "All fields are Required");
    }
    const localPathName = req.file?.path;
    
    let uploadResult;
    if(localPathName){
      uploadResult = await uploadCloudinary(localPathName);
    }
  
    const createdCriminal = await Criminal.create({
      name,
      photo: uploadResult?.url || "",
      inCustody,
      age,
      description,
      gender,
      location,
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
  } catch (error) {
    console.log("Couldn't create Criminal: ", error);
    res.status(500).send("Something Went Wrong");
  }
};

const updateCriminal = async (req, res) => {
  try {
    const { name, inCustody, age, description, location, crime} = req.body;
    const {id} = req.params;
    const updatedData = {};
    
    if (name) updatedData.name = name;
    if (inCustody) updatedData.inCustody = inCustody;
    if (age) updatedData.age = age;
    if (description) updatedData.description = description;
    if (location) updatedData.location = location;
    if (crime) updatedData.crime = crime;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedCriminal = await Criminal.findByIdAndUpdate({_id:id}, updatedData, {
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
    const { id } = req.params;

    const deletingCriminal = await Criminal.findByIdAndDelete({_id: id});

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
    console.log(ids);
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
// CSV Parser (Alternatively, handle Excel with xlsx)
const parseCSV = async (filePath) => {
  const criminals = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Normalize keys
        const normalizedRow = {};
        for (const key in row) {
          // Trim whitespace and convert to lowercase
          const trimmedKey = key.trim(); // Convert to lowercase for consistency
          normalizedRow[trimmedKey] = row[key]; // Assign value to normalized key
        }
        criminals.push(normalizedRow); // Add normalized row to criminals array
      })
      .on('end', () => resolve(criminals))
      .on('error', reject);
  });
};

// Route to upload file with multiple criminals
const addMultipleCriminals = async (req, res) => {
  const file = req.file; // CSV or Excel file
  if (!file) throw new Error(400, 'File is required');
  
  let criminalsData = [];

  // Parse the uploaded file based on its type (CSV or Excel)
  if (file.mimetype === 'text/csv') {
    console.log("Condition 1")
    criminalsData = await parseCSV(file.path);
  } else if (
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    console.log("Condition 2")
    const workbook = xlsx.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    criminalsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  } else {
    throw new Error(400, 'Unsupported file format');
  }
  
  console.log(criminalsData);

  // Loop over each entry and add criminal
  const addedCriminals = [];
  for (const data of criminalsData) {
    console.log("data is: ", data);
    
    // Normalize the keys if necessary
    const { name, age, description, gender, location, crime } = data;
    const inCustody = data.inCustody.trim();
    // Log the values
    console.log(name, ", ", inCustody, ", ", age, ", ", description, ", ", gender, ", ", location, ", ", crime);
    
    // Check for existing criminal
    const isCreatedCriminal = await Criminal.findOne({
      $and: [{ name }, { gender }, { age }, { location }],
    });

    if (isCreatedCriminal) {
      console.log(`Criminal ${name} already exists. Skipping...`);
      continue;
    }

    if ([name, inCustody, description, gender, location, crime].some(val => !val || val === "")) {
      console.log(`Invalid data for ${name}. Skipping...`);
      continue;
    }

    // If photo is provided, upload it to Cloudinary
    let uploadResult = null;
    const photo = req.file?.path;
    if (photo) {
      uploadResult = await uploadCloudinary(photo); // Assume `photo` is a local path
    }

    // Create criminal
    const createdCriminal = await Criminal.create({
      name,
      photo: uploadResult ? uploadResult.url : '',
      inCustody,
      age,
      description,
      gender,
      location,
      crime,
    });

    addedCriminals.push(createdCriminal);
  }

  res.status(201).json({
    statusCode: 201,
    message: `${addedCriminals.length} criminals created successfully`,
    data: addedCriminals,
  });

  // Cleanup uploaded file after processing
};

// Route to export data
const exportCriminalData = async (req, res) => {
  const format = req.query.format || 'csv'; // Get the export format from query param, default to CSV

  try {
    // Fetch criminal data from the database
    const criminals = await Criminal.find();

    if (!criminals || criminals.length === 0) {
      return res.status(404).json({ message: 'No criminal records found' });
    }

    // Format the data into a flat array of objects
    const data = criminals.map(criminal => ({
      name: criminal.name,
      age: criminal.age,
      gender: criminal.gender,
      location: criminal.location,
      crime: criminal.crime,
      inCustody: criminal.inCustody,
      description: criminal.description,
      photo: criminal.photo,
    }));

    if (format === 'csv') {
      // Export as CSV
      const fields = ['name', 'age', 'gender', 'location', 'crime', 'inCustody', 'description', 'photo'];
      const json2csvParser = new json2csv({ fields });
      const csv = json2csvParser.parse(data);

      res.header('Content-Type', 'text/csv');
      res.attachment('criminals.csv');
      return res.send(csv);
    } else if (format === 'xlsx') {
      // Export as Excel
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Criminals');

      const filePath = path.join(process.cwd(), 'exports', 'criminals.xlsx'); // Use process.cwd() for absolute path
      xlsx.writeFile(workbook, filePath);

      res.download(filePath, 'criminals.xlsx', (err) => {
        if (err) throw err;
        // Delete file after sending it to the user
        fs.unlinkSync(filePath);
      });
    } else {
      return res.status(400).json({ message: 'Unsupported format. Use ?format=csv or ?format=xlsx' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
};

export { exportCriminalData, addMultipleCriminals, updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals };
