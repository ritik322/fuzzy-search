import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, TextField, Checkbox, IconButton, InputAdornment, Box, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

const UserTable = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([
    { name: 'Ahre Steward', username: 'ahresteward', email: 'ahre@example.com', contact: '1234567890', policeStationId: 'PS001', photo: 'https://via.placeholder.com/40', createdOn: '2023-09-28' },
    { name: 'John Doe', username: 'johndoe', email: 'john@example.com', contact: '9876543210', policeStationId: 'PS002', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Jenny Diel', username: 'jennydiel', email: 'jenny@example.com', contact: '9845683904', policeStationId: 'PS003', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Arun Kumar', username: 'arunkumar', email: 'arun@example.com', contact: '9737293847', policeStationId: 'PS004', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Shweta Sharma', username: 'shwetasharma', email: 'shweta@example.com', contact: '9936253427', policeStationId: 'PS005', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
    { name: 'Dinesh Gupta', username: 'dineshgupta', email: 'dinesh@example.com', contact: '9835278365', policeStationId: 'PS006', photo: 'https://via.placeholder.com/40', createdOn: '2024-01-15' },
  ]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = users.map(user => user.username);
      setSelectedUsers(selected);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckboxClick = (username) => {
    const selectedIndex = selectedUsers.indexOf(username);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, username);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedUsers.slice(0, selectedIndex), selectedUsers.slice(selectedIndex + 1));
    }

    setSelectedUsers(newSelected);
  };

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Delete
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setUsers(users.filter(u => u.username !== userToDelete.username));
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
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
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table aria-label="user table">
          <TableHead sx={{ backgroundColor: '#f1f1f1' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Photo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
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
                    checked={selectedUsers.indexOf(user.username) !== -1}
                    onChange={() => handleCheckboxClick(user.username)}
                  />
                </TableCell>
                <TableCell>
                  <img src={user.photo} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.policeStationId}</TableCell>
                <TableCell>{user.createdOn}</TableCell>
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

      {/* Modal for Adding Users */}
      <Modal open={open} onClose={handleClose} aria-labelledby="add-user-modal">
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <h2
      id="add-user-modal"
      style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}
    >
      Create a New User
    </h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const newUser = {
          name: e.target.name.value,
          username: e.target.username.value,
          email: e.target.email.value,
          contact: e.target.contact.value,
          policeStationId: e.target.policeStationId.value,
          photo: 'https://via.placeholder.com/40',
          createdOn: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        handleClose();
      }}
    >
      <TextField
        label="Name"
        name="name"
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Username"
        name="username"
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Contact"
        name="contact"
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Police Station ID"
        name="policeStationId"
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" type="submit">
          Add User
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </form>
  </Box>
</Modal>

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
