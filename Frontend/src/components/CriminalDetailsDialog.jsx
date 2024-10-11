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
      <IconButton onClick={handleClickOpen} aria-label="view details" sx={{ color: 'primary.main' }}>
        <InfoIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={styles.dialogTitle}>
          Criminal Details
        </DialogTitle>

        <DialogContent sx={styles.dialogContent}>
          <img
            src={criminal.photo}
            alt={`${criminal.name}'s photo`}
            style={styles.image}
          />
          <Typography variant="h6" sx={styles.typography}><strong>Name:</strong> {criminal.name}</Typography>
          <Typography variant="body1" sx={styles.typography}><strong>In Custody:</strong> {criminal.inCustody ? 'Yes' : 'No'}</Typography>
          <Typography variant="body1" sx={styles.typography}><strong>Age:</strong> {criminal.age}</Typography>
          <Typography variant="body1" sx={styles.typography}><strong>Description:</strong> {criminal.description}</Typography>
          <Typography variant="body1" sx={styles.typography}><strong>Gender:</strong> {criminal.gender}</Typography>
          <Typography variant="body1" sx={styles.typography}><strong>Location:</strong> {criminal.location}</Typography>
          <Typography variant="body1" sx={styles.typography}><strong>Crime:</strong> {criminal.crime}</Typography>
        </DialogContent>

        <DialogActions sx={styles.dialogActions}>
          <Button onClick={handleClose} sx={styles.closeButton}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Define styles using a consistent theme-based approach
const styles = {
  dialogTitle: {
    backgroundColor: 'primary.main',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '16px 24px',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '20px 24px',
    backgroundColor: '#f5f5f5', // Light background color for content
  },
  image: {
    borderRadius: '10px',
    marginBottom: '16px',
    width: '150px',
    height: '150px',
    objectFit: 'cover', // Ensures the image covers the box without being stretched
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow to the image
  },
  typography: {
    marginBottom: '8px',
    color: '#333', // Darker text for readability
  },
  dialogActions: {
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: '#f5f5f5', // Match the content's background color
  },
  closeButton: {
    backgroundColor: '#1976d2', // Consistent with Material-UI primary color
    color: 'white',
    fontWeight: 'bold',
    padding: '8px 24px',
    '&:hover': {
      backgroundColor: '#1565c0', // Darker shade of blue on hover
    },
  },
};

export default CriminalDetailsDialog;
