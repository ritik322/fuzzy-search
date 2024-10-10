import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, TextField, Checkbox, IconButton, InputAdornment, Box, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from "axios";
import './UserTable.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
const UserTable = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useOutletContext();
  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  },[]);


  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] =useState([]);
  const [deleting, setDeleting] = useState(false);
  const [editData, setEditData] = useState({});
  const [noValidEmail, showNoValidEmail] = useState(false);
  const [noValidPhone, showNoValidPhone] = useState(false);
  const [updatingDetails, setUpdatingDetails] = useState(false);
  
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/v1/user/allUsers", {
        withCredentials: true,
      });
      console.log("response is: ", response.data.data);

      setUsers(response.data.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };


  useEffect(()=>{
    getData();
  },[])

  // Search Perform
  useEffect(() => {
    const performSearch = () => {
      if (searchTerm) {
        const fuse = new Fuse(users, {
          keys: ["name", "email", "post", "policeStationId", "contact"],
          includeScore: true,
          threshold: 0.5,
        });
  
        let result = fuse.search(searchTerm).map((result) => result.item);
        setFilteredUsers(result);
      } else {
        let result = users;
        setFilteredUsers(result);
      }
      setPage(0); // Reset page when search changes
    };
  
    performSearch();
  }, [searchTerm, users]); // Ensure both searchTerm and data are dependencies

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = filteredUsers.map(user => user._id);
      setSelectedUsers(selected);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex), 
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelected);
  };

  // const filteredUsers = users.filter(user => {
  //   return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  const isSelected = (id) => selectedUsers.indexOf(id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle Delete
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async() => {
    setDeleting(true);
    setLoading(true);
    try {
      await axios.get(`http://localhost:3000/api/v1/user/delete-user/${userToDelete._id}`, {
        withCredentials: true,
      });
      selectedUsers.filter(id=>id!=userToDelete._id)
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
    if (name === "contact") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Keep only numeric values
        if (numericValue.length <= 10) {
        setEditData((prevData) => ({ ...prevData, [name]: numericValue }));
      }
    } 
    else {
      setEditData((prevData) => ({ ...prevData, [name]: value }));
     }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
  
    if (name === "email") {
      const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const isValid = value === "" || isValidEmail.test(value);
      showNoValidEmail(!isValid);
    }else if (name === "phone") {
      const isValidPhonePattern = /^[0-9]{10}$/;
      const isValid = value === "" || isValidPhonePattern.test(value);
      showNoValidPhone(!isValid);
    }
  };

  const handleSaveChanges = async () => {
    if(!editData) return;
    if(updatingDetails){
      return;
    }
    setUpdatingDetails(true);
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const email = editData.email || "";
    const isValid = email === "" || isValidEmail.test(email);
    
    const isValidPhone = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    const phone = editData.phone || "";
    const isPhoneValid = phone === "" || isValidPhone.test(phone);

    if (!isValid) {
      setUpdatingDetails(false);
      showNoValidEmail(true); // Show error message if email is invalid
      return; // Prevent saving changes
    }

    if (!isPhoneValid) {
      setUpdatingDetails(false);
      showNoValidPhone(true); // Show error message if email is invalid
      return; // Prevent saving changes
    }
    
    try {
      let response;
      // Update HR or Company depending on the modal type
      response = await axios.post('http://localhost:3000/api/v1/user/register-user', editData, {
        withCredentials: true,
      });
      // Handle successful response
      getData(); // Fetch updated data after save
      setOpen(false);
    } catch (err) {
      // Handle backend errors
      console.log("An error Occurred: ", err);
      res.status(500).send("Error: ", err);
    } finally {
      setUpdatingDetails(false); // Reset updating state
    }
  };


  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Title */}
      <h1
        style={{
          fontSize: '2rem', // Increased font size
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#1e90ff', // Background color
          color: 'white', // Text color for better contrast
          padding: '10px', // Padding for spacing inside the element
          borderRadius: '4px', // Rounded corners for a polished look
          marginBottom: '20px' // Margin bottom to separate from search bar
        }}
      >
        User Management
      </h1>

      {/* Search Bar and Add User Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px', mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add User
        </Button>
      </Box>

      {/* Table */}
      {!loading? <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table aria-label="user table">
          <TableHead sx={{ backgroundColor: '#f1f1f1' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                  checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Photo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Police Station ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created On</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
              <TableRow key={index} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(user._id)}
                    onChange={(event) => handleCheckboxClick(event, user._id)}
                  />
                </TableCell>
                <TableCell>
                  <img src={user.avatar} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.policeStationId}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteClick(user)}>
                    <DeleteIcon />
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
      : <CircularProgress/>  
    }
    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className="edit-dialog"
        aria-labelledby='add-user-modal'
        PaperProps={{ sx: { borderRadius: "1.5rem" } }}
      >
        <div className="inside-dialog">
        <DialogTitle className="edit-dialog-title">
          Add a New User
        </DialogTitle>
        <hr className="edit-dialog-divider"/>
        <DialogContent className="edit-dialog-content">
          {(
            <>
              <div className="edit-label-input-group">
                <label className="edit-label">Username</label>
              <input
                name="username"
                value={editData.username || ""}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                className="edit-input"
              />
              </div>
              <div className="edit-label-input-group">
                <label className="edit-label">Contact</label>
              <input
                name="contact"
                value={editData.contact || ""}
                onChange={handleEditChange}
                onBlur={handleBlur}
                fullWidth
                placeholder="1234567890"
                type="phone"
                margin="normal"
                required
                className="edit-input"
              />
              </div>
                  {noValidPhone && <p className="invalid-details-text">Invalid phone number. Must be 10 digits.</p>}

              <div className="edit-label-input-group">
              <label className="edit-label">Email</label>
              <input
                name="email"
                value={editData.email || ""}
                onChange={handleEditChange}
                onBlur={handleBlur}
                fullWidth
                placeholder="user@example.com"
                type="email"
                margin="normal"
                required
                className="edit-input"
              />
              </div>
              {noValidEmail && <p className="invalid-details-text">Invalid email address.</p>}
              <div className="edit-label-input-group">
                <label className="edit-label">Police Station Id</label>
                <input
                  name="policeStationId"
                  value={editData.policeStationId || ""}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                  className="edit-input"
                />
              </div>
              <div className="edit-label-input-group">
                <label className="edit-label">Post</label>
                <input
                  name="post"
                  value={editData.post || ""}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                  className="edit-input"
                />
              </div>
              <div className="edit-label-input-group">
                <label className="edit-label">Password</label>
                <input
                  name="password"
                  value={editData.password || ""}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                  className="edit-input"
                />
              </div>
              <div className="edit-label-input-group">
                <label className="edit-label">Photo</label>
                <input
                  name="avatar"
                  value={editData.avatar || ""}
                  type='file'
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                  className="edit-input"
                />
              </div>              
            </>
          )}
        </DialogContent>
        <DialogActions className="edit-dialog-actions">
          <Button onClick={handleSaveChanges} className="edit-ok-button" disabled={updatingDetails}>
          {
          updatingDetails?
            <CircularProgress size={10} />
            :"OK"
          }
          </Button>
          <Button onClick={handleClose} className="edit-cancel-button" disabled={updatingDetails}>
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
