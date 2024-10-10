import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import "./ImportPage.css";
// import { baseURL } from "../baseURL";
// import { AiOutlineCloud } from "react-icons/ai";
// import { CircularProgress } from "@mui/material";

const ImportPage = () => {
    console.log("on Import Page")
  const [file, setFile] = useState(null); // Store the selected file
  const [uploadStatus, setUploadStatus] = useState("");
  const [showImportButton, setShowImportButton] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const userType = localStorage.getItem("userType");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Save the selected file
      setShowImportButton(false);
    }
  };

  const handleCancel = () => {
    setFile(null); // Reset file selection
    if (inputRef.current) {
      inputRef.current.value = null; // Clear input field
    }
    setShowImportButton(true);
    setUploadStatus("");
  };

  const handleFileImport = () => {
    if(uploading) return;
    setUploading(true);
    setUploadStatus("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:3000/api/v1/criminal/add-multiple-criminals", {
        method: "POST",
        body: formData,
        headers: {
          authorization: localStorage.getItem("authToken"),
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) { 
            throw new Error(`HTTP status ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          setUploadStatus("Data successfully uploaded!");
          setUploading(false);
        })
        .catch((error) => {
          setUploadStatus("Failed to upload data: " + error.message);
          setUploading(false);
        })
    };

    reader.readAsBinaryString(file);
  };
  

  return (
    (1)?
    <div className="import-page">
      <h2 className="import-title">Import your File</h2>
      <p className="import-description">
        Upload your CSV file to quickly import and organize data across a single page or an entire set.
      </p>
      <div className="file-upload-container">
        {showImportButton && (
          <label htmlFor="fileInput" className="file-input-label">
            {/* <AiOutlineCloud className="upload-icon" /> */}
            <span>Select CSV file</span>
            <input
              id="fileInput"
              type="file"
              accept=".xls, .xlsx, .csv"
              ref={inputRef}
              className="file-input"
              onChange={handleFileChange}
            />
          </label>
        )}
        {!showImportButton && (
          <div>
            <div className="file-image-container">
              <div
                alt="CSV File"
                className="file-image"
              />
            </div>
            <div className="button-group">
              <button className="import-cancel-button" onClick={handleCancel} disabled={uploading}>
                Cancel
              </button>
              {uploading? null
            //   <CircularProgress size={10}/>
              :
              <button className="upload-button" onClick={handleFileImport} disabled={uploading}>
                Upload
              </button>}
            </div>
          </div>
        )}
        <p className="import-hint">or drop CSV here</p>
      </div>

      {file && (
        <div className="file-confirmation">
          <p className="file-name">Selected file: {file.name}</p>
        </div>
      )}

      {uploadStatus && (
        <div
          className={`upload-status ${uploadStatus.includes("Failed") ? "error" : "success"}`}
        >
          {uploadStatus}
        </div>
      )}
    </div> 
  : null)
};

export default ImportPage;