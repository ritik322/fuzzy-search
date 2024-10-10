import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const CriminalDetailsDialog = ({ criminal }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} aria-label="view details">
        <InfoIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', textAlign: 'center' }}>Criminal Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
          <Typography variant="body1"><strong>Name:</strong> {criminal.name}</Typography>
          <img src={criminal.photo} alt={`${criminal.name}'s photo`} style={{ borderRadius: '5%', marginBottom: '16px' }} width="100" height="100" />
          <Typography variant="body1"><strong>In Custody:</strong> {criminal.inCustody ? 'Yes' : 'No'}</Typography>
          <Typography variant="body1"><strong>Age:</strong> {criminal.age}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {criminal.description}</Typography>
          <Typography variant="body1"><strong>Gender:</strong> {criminal.gender}</Typography>
          <Typography variant="body1"><strong>Location:</strong> {criminal.location}</Typography>
          <Typography variant="body1"><strong>Crime:</strong> {criminal.crime}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ backgroundColor: 'blue', color: 'white', '&:hover': { backgroundColor: 'darkblue' } }}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CriminalDetailsDialog;