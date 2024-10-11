import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
  Checkbox,
  IconButton,
  InputAdornment,
  Box,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import Fuse from "fuse.js";
import CriminalDetailsDialog from "../CriminalDetailsDialog";
import EditIcon from "@mui/icons-material/Edit";

import "./CriminalTable.css";

const UserTable = ({ tableData }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [editData, setEditData] = useState({});
  const [noValidEmail, showNoValidEmail] = useState(false);
  const [noValidPhone, showNoValidPhone] = useState(false);
  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingCriminal, setUpdatingCriminal] = useState(false);

  const handleRowClick = (criminal) => {
    setSelectedCriminal(criminal); // Set the clicked criminal as selected
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedCriminal(null); // Clear the selected criminal after closing
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios
        .get("http://localhost:3000/api/v1/criminal/get-all-criminals", {
          withCredentials: true,
        })
        .then((res) => res.data);
      setUsers(response);
      setFilteredUsers(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tableData || tableData.length == 0) {
      getData();
    } else {
      setUsers(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    setFilteredUsers(users); // Update filtered users whenever users change
  }, [users]);

  // Search Perform
  // Ensure both searchTerm and data are dependencies

  // const filteredUsers = users.filter(user => {
  //   return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUpdatingCriminal(false);
  };

  // Handle Delete
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/criminal/delete-criminal/${userToDelete._id}`,
        {
          withCredentials: true,
        }
      );
      selectedUsers.filter((id) => id != userToDelete._id);
      getData();
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setLoading(false);
      setEditData({});
    }
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
    setEditData({});
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    if (name === "gender") {
      setEditData((prevData) => ({ ...prevData, [name]: value }));
    }

    if (name === "contact") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Only allow numbers
      if (numericValue.length <= 10) {
        setEditData((prevData) => ({ ...prevData, [name]: numericValue }));
      }
    } else {
      setEditData((prevData) => ({ ...prevData, [name]: value }));
    }
    if (name === "crime") {
      setEditData((prevState) => ({ ...prevState, [name]: value }));
    }
    if (name === "photo") {
      const file = event.target.files[0];
      setEditData((prevState) => ({ ...prevState, [name]: file }));
    } else {
      setEditData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === "email") {
      const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const isValid = value === "" || isValidEmail.test(value);
      showNoValidEmail(!isValid);
    } else if (name === "phone") {
      const isValidPhonePattern = /^[0-9]{10}$/;
      const isValid = value === "" || isValidPhonePattern.test(value);
      showNoValidPhone(!isValid);
    }
  };

  const requiredFields = [
    "name",
    "crime",
    "age",
    "location",
    "gender",
    "photo",
  ];
  const validateFields = () => {
    // Check if all required fields are present and not empty in `editData`
    for (const field of requiredFields) {
      if (!editData[field]) {
        toast.error(`Field "${field}" is required!`);
        return false;
      }
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!editData) return;
    if (updatingDetails) {
      return;
    }

    setUpdatingDetails(true);
    if (!validateFields()) {
      setUpdatingDetails(false);
      return;
    }

    try {
      // Create a FormData object
      const formData = new FormData();

      // Append all fields to the FormData object, including the file (avatar)
      for (const key in editData) {
        formData.append(key, editData[key]);
      }

      let response;
      // Update HR or Company depending on the modal type
      if (!updatingCriminal) {
        response = await axios
          .post(
            "http://localhost:3000/api/v1/criminal/add-criminal",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Set the content type to `multipart/form-data`
              },
              withCredentials: true,
            }
          )
          .then((res) => res.data);
        // Handle successful response
        if (response.success) {
          toast.success("Criminal data uploaded successfully!");
        } else {
          throw Error("Error while creating!");
        }
      } else {
        response = await axios
          .post(
            `http://localhost:3000/api/v1/criminal/update-criminal/${editData._id}`,
            editData,
            {
              withCredentials: true,
            }
          )
          .then((res) => res.data);
        // Handle successful response
      }

      getData(); // Fetch updated data after save
      setOpen(false);
    } catch (err) {
      // Handle backend errors
      toast.error("An error Occurred: ", err.message);
    } finally {
      setEditData({});
      setUpdatingDetails(false); // Reset updating state
      setUpdatingCriminal(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
      {/* Search Bar and Add User Button */}
      <Box display="flex" justifyContent="end" alignItems="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add User
        </Button>
      </Box>
      {selectedCriminal && (
        <CriminalDetailsDialog
          criminal={selectedCriminal}
          open={isDialogOpen}
          handleClose={handleCloseDialog}
        />
      )}

      {/* Table */}
      {!loading ? (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table aria-label="user table">
            <TableHead sx={{ backgroundColor: "#f1f1f1" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Crime</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Age</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(user)}
                    hover
                  >
                    <TableCell>
                      <img
                        src={user.photo}
                        alt="User"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.crime.join(", ")}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteClick(user);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setEditData(user);
                          handleOpen();
                          setUpdatingCriminal(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <CircularProgress />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className="edit-dialog"
        aria-labelledby="add-user-modal"
        PaperProps={{ sx: { borderRadius: "1.5rem" } }}
      >
        <div className="inside-dialog">
          <DialogTitle className="edit-dialog-title">
            {updatingCriminal ? "Add a New User" : "Update User"}
          </DialogTitle>
          <hr className="edit-dialog-divider" />
          <DialogContent className="edit-dialog-content">
            {
              <>
                <div className="edit-label-input-group">
                  <label className="edit-label">Name</label>
                  <input
                    name="name"
                    value={editData.name || ""}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                    className="edit-input"
                  />
                </div>
                <div className="edit-label-input-group">
                  <label className="edit-label">InCustody</label>
                  <input
                    name="inCutsody"
                    value={editData.inCustody || false}
                    onChange={(prev) => (editData.inCustody = !prev)}
                    fullWidth
                    type="checkbox"
                    margin="normal"
                    required
                  />
                </div>
                <div className="edit-label-input-group">
                  <label className="edit-label">Crime</label>
                  <select
                    name="crime"
                    value={editData.crime || ""}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                    required
                    className="edit-input"
                  >
                    <option value="Homicide">Homicide</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Burglary">Burglary</option>
                    <option value="DrugOffense">Drug Offense</option>
                    <option value="Assault">Assault</option>
                  </select>
                </div>

                <div className="edit-label-input-group">
                  <label className="edit-label">Age</label>
                  <input
                    name="age"
                    value={editData.age || ""}
                    onChange={handleEditChange}
                    fullWidth
                    type="number"
                    margin="normal"
                    required
                    className="edit-input"
                  />
                </div>
                <div className="edit-label-input-group">
                  <label className="edit-label">Location</label>
                  <input
                    name="location"
                    value={editData.location || ""}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                    className="edit-input"
                  />
                </div>
                <div className="edit-label-input-group">
                  <label className="edit-label">Description</label>
                  <input
                    name="description"
                    value={editData.description || ""}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                    className="edit-input"
                  />
                </div>
                <div className="edit-label-input-group">
                  <label className="edit-label">Gender</label>
                  <select
                    name="gender"
                    value={editData.gender || ""}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                    required
                    className="edit-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="edit-label-input-group">
                  <label className="edit-label">Photo</label>
                  <input
                    name="photo"
                    type="file"
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                    className="edit-input"
                  />
                </div>
              </>
            }
          </DialogContent>
          <DialogActions className="edit-dialog-actions">
            <Button
              onClick={handleSaveChanges}
              className="edit-ok-button"
              disabled={updatingDetails}
            >
              {updatingDetails ? <CircularProgress size={10} /> : "OK"}
            </Button>
            <Button
              onClick={handleClose}
              className="edit-cancel-button"
              disabled={updatingDetails}
            >
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
