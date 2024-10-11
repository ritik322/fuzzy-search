import { Criminal } from "../Models/criminal.model.js";
import uploadCloudinary from "../Utils/cloudinary.js";
import multer from "multer"
import csvParser from "csv-parser"
import xlsx from "xlsx" // For Excel files
import fs from "fs"
import { Parser as json2csv } from 'json2csv'; 
import path from "path";
import { spawn } from 'child_process';
import { Log } from "../Models/log.model.js";
import crypto from "crypto";

// Use a fixed key for encryption/decryption (keep it secret)
const key = crypto.scryptSync("your-password", "salt", 32); // Use a secure password and salt
const algorithm = 'aes-256-cbc';

// Encrypt function that returns both the encrypted text and the iv used
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}

function decrypt(encryptedText, iv) {
    if (!iv) {
        throw new Error("Missing IV for decryption");
    }
    
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

const getAllLogs = async (req, res) => {
  try {
      const logs = await Log.find().sort({ timestamp: -1 });
      
      // Decrypt the 'details' field for each log
      const decryptedLogs = logs.map(log => {
          try {
              const decryptedDetails = decrypt(log.details, log.iv); // Pass both encrypted text and iv
              return { ...log._doc, details: decryptedDetails }; // Spread the rest of the log data
          } catch (error) {
              console.error("Error decrypting log details:", error.message);
              return { ...log._doc, details: "Error decrypting details" };
          }
      });

      res.status(200).json(decryptedLogs);
  } catch (error) {
      res.status(500).json({ message: "Error fetching logs: " + error });
  }
};


// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

const getCriminal = async(req, res) => {
  const {id} = req.params;
  const criminal = await Criminal.findById({_id: id});
  if(!criminal) {res.status(400).json({message: "Criminal not found", success: false})}

  res.status(200).json({data: criminal,success: true})
}

const getAllCriminals = async (req, res) => {
  try {
    // Fetch only criminals with reviewStatus as "cleared"
    const criminals = await Criminal.find({ reviewStatus: "cleared" });
    return res.json(criminals);
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.toString() });
  }
};

const getAllReviewingCriminals = async (req, res) => {
  try {
    // Fetch only criminals with reviewStatus as "cleared"
    const criminals = await Criminal.find({ reviewStatus: "under review" });
    return res.json(criminals);
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.toString() });
  }
};

const addCriminal = async (req, res) => {
  try {
    const { name, inCustody, age, description, gender, location,crime } = req.body;
    console.log(crime)
    const isCreatedCriminal = await Criminal.findOne({
      $and: [{ name }, { gender }, {age}, {location}],
    });
    if (isCreatedCriminal) {
      throw new Error("Criminal aleardy exists");
    }
  
    if (
      [name, inCustody, description, gender, location].some(
        (val) => val === ""
      )
    ) {
      throw new Error("All fields are Required");
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
      crime,
      description,
      gender,
      location,
    });
    const encryptedString = encrypt(`Criminal ${createdCriminal.name} was created.`)
    await Log.create({
      action: "create",
      criminalId: createdCriminal._id,
      details: encryptedString.encryptedData,
      iv: encryptedString.iv,
    });
  
    const criminalCreated = await Criminal.findOne({ _id: createdCriminal._id });
    if (!criminalCreated)
      throw new Error("Something went wrong while creating Criminal");
    res
      .status(201)
      .json({
        statusCode: 201,
        message: "Criminal created successfully",
        success: true,
        data: criminalCreated,
      });
  } catch (error) {
    console.log("Couldn't create Criminal: ", error.message);
    res.status(400).json({message: "something went wrong"});
  }
};

const updateCriminal = async (req, res) => {
  try {
    console.log("hello");
    console.log(req.body);
    console.log(req.files);
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
    const encryptedString = encrypt(`Criminal ${updatedCriminal.name} was updated.`);
    await Log.create({
      action: "update",
      criminalId: updatedCriminal._id,
      details: encryptedString.encryptedData,
      iv: encryptedString.iv
    });

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

const updateReviewStatusToCleared = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the criminal record by ID and update the reviewStatus to "cleared"
    const updatedCriminal = await Criminal.findByIdAndUpdate(
      { _id: id },
      { reviewStatus: "cleared" }, // Set reviewStatus to "cleared"
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedCriminal) {
      return res.status(404).json({ message: "Criminal not found" });
    }

    const encryptedString = encrypt(`Criminal ${updatedCriminal.name}'s review status was updated to "cleared".`)
    // Optionally, log the action
    await Log.create({
      action: "update",
      criminalId: updatedCriminal._id,
      details: encryptedString.encryptedData,
      iv: encryptedString.iv
    });

    // Respond with the updated data
    res.status(200).json({
      message: "Criminal review status updated to 'cleared' successfully",
      updated: true,
      criminal: updatedCriminal,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
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

    const encryptedString = encrypt(`Criminal ${deletingCriminal.name} was deleted.`);
    await Log.create({
      action: "delete",
      criminalId: deletingCriminal._id,
      details: encryptedString.encryptedData,
      iv: encryptedString.iv
    });

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
      const criminalsToDelete = await Criminal.find({ _id: { $in: ids } });
      for(deletingCriminal in criminalsToDelete){
        const encryptedString = encrypt(`Criminal ${deletingCriminal.name} was deleted.`)
        await Log.create({
          action: "delete",
          criminalId: deletingCriminal._id,
          details: encryptedString.encryptedData,
          iv: encryptedString.iv
        });
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

const addMultipleCriminals = async (req, res) => {
  const file = req.file; // CSV or Excel file
  if (!file) throw new Error(400, 'File is required');
  
  let criminalsData = [];

  // Parse the uploaded file based on its type (CSV or Excel)
  if (file.mimetype === 'text/csv') {
    console.log("Condition 1");
    criminalsData = await parseCSV(file.path);
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    console.log("Condition 2");
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
    console.log('start');
    // Normalize the keys if necessary
    const { name, age, description, gender, location, crime } = data;
    const inCustody = data.inCustody.trim();

    // Check for existing criminal
    const isCreatedCriminal = await Criminal.findOne({
      $and: [{ name }, { gender }, { age }, { location }],
    });

    if (isCreatedCriminal) {
      console.log(`Criminal ${name} already exists. Skipping...`);
      continue;
    }

    const criminals = await Criminal.find();
    console.log("criminals: ", criminals);

    // Wrap the Python spawn process in a Promise
    const runPythonScript = (name, criminals) => {
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./scripts/script2.py', name, JSON.stringify(criminals)]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error(`Error: ${data}`);
          reject(new Error(`Error in Python script: ${data}`));
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(JSON.parse(result)); // Parse the result from Python
          } else {
            reject(new Error('Python script failed'));
          }
        });
      });
    };

    // Await the result from the Python script
    let criminalsWithScores;
    try {
      criminalsWithScores = await runPythonScript(name, criminals);
      console.log("Done");
      console.log(criminalsWithScores); // Send the results back to the frontend
    } catch (error) {
      return res.status(500).send('Error processing the name');
    }

    // Check for similar records based on score and matching fields
    let similar_record;
    console.log("here");
    for (const criminal_data of criminalsWithScores) {
      console.log("Here 2");
      console.log("criminal_data: ", criminal_data);
      if ((criminal_data.criminal_data.score > 80) && (criminal_data.criminal_data.age == age || criminal_data.criminal_data.location == location)) {
        console.log("Condtion True");
        similar_record = criminal_data.criminal_data;
        break;
      }
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
      reviewStatus: (similar_record ? "under review" : "cleared"),
      matchPercentage: (similar_record ? similar_record.score : null),
      matchedRecord: (similar_record ? similar_record._id : null)
    });

    const encryptedString = encrypt(`Criminal ${createdCriminal.name} was created via bulk upload.`)
    await Log.create({
      action: "create",
      criminalId: createdCriminal._id,
      details: encryptedString.encryptedData,
      iv: encryptedString.iv
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

const getCountsByAction = async (req, res) => {
  try {
    const actionCounts = await Log.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(actionCounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching action counts: " + error });
  }
};

const getCrimesByLocation = async (req, res) => {
  try {
    const crimesByLocation = await Criminal.aggregate([
      {
        $group: {
          _id: "$location", // Group by location
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(crimesByLocation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crime counts by location: " + error });
  }
};

const getUpdateLogs = async (req, res) => {
  try {
    const logs = await Log.find({ action: "update" }, { criminalId: 1, details: 1, iv:1 });
    const decryptedLogs = logs.map(log => {
      try {
          const decryptedDetails = decrypt(log.details, log.iv); // Pass both encrypted text and iv
          return { ...log._doc, details: decryptedDetails }; // Spread the rest of the log data
      } catch (error) {
          console.error("Error decrypting log details:", error.message);
          return { ...log._doc, details: "Error decrypting details" };
      }
  });

    res.status(200).json(decryptedLogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching update logs: " + error });
  }
};

const getLatestActivityFeed = async (req, res) => {
  try {
    const latestLogs = await Log.find().sort({ timestamp: -1 }).limit(10); // Fetch the 10 latest logs
    const decryptedLogs = latestLogs.map(log => {
      try {
          const decryptedDetails = decrypt(log.details, log.iv); // Pass both encrypted text and iv
          return { ...log._doc, details: decryptedDetails }; // Spread the rest of the log data
      } catch (error) {
          console.error("Error decrypting log details:", error.message);
          return { ...log._doc, details: "Error decrypting details" };
      }
  });
    res.status(200).json(decryptedLogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching latest activity: " + error });
  }
};



export {getCountsByAction, getCrimesByLocation, getUpdateLogs, getLatestActivityFeed, updateReviewStatusToCleared, getAllLogs, exportCriminalData, addMultipleCriminals, updateCriminal, addCriminal, deleteCriminal, deleteCriminals, getCriminal, getAllCriminals, getAllReviewingCriminals };
