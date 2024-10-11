import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { AccountCircle, CalendarToday, LocationOn, Gavel, Wc, Lock } from '@mui/icons-material'; // Icons for better data representation

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
      <IconButton onClick={handleClickOpen} aria-label="view details" sx={styles.infoButton}>
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
          
          <Box sx={styles.detailsContainer}>
            {/* Name */}
            <Box sx={styles.detailItem}>
              <AccountCircle sx={styles.icon} />
              <Typography variant="h6" sx={styles.detailText}><strong>Name:</strong> {criminal.name}</Typography>
            </Box>

            {/* In Custody */}
            <Box sx={styles.detailItem}>
              <Lock sx={styles.icon} />
              <Typography variant="body1" sx={styles.detailText}><strong>In Custody:</strong> {criminal.inCustody ? 'Yes' : 'No'}</Typography>
            </Box>

            {/* Age */}
            <Box sx={styles.detailItem}>
              <CalendarToday sx={styles.icon} />
              <Typography variant="body1" sx={styles.detailText}><strong>Age:</strong> {criminal.age}</Typography>
            </Box>

            {/* Description */}
            <Box sx={styles.detailItem}>
              <Gavel sx={styles.icon} />
              <Typography variant="body1" sx={styles.detailText}><strong>Description:</strong> {criminal.description}</Typography>
            </Box>

            {/* Gender */}
            <Box sx={styles.detailItem}>
              <Wc sx={styles.icon} />
              <Typography variant="body1" sx={styles.detailText}><strong>Gender:</strong> {criminal.gender}</Typography>
            </Box>

            {/* Location */}
            <Box sx={styles.detailItem}>
              <LocationOn sx={styles.icon} />
              <Typography variant="body1" sx={styles.detailText}><strong>Location:</strong> {criminal.location}</Typography>
            </Box>

            {/* Crime */}
            <Box sx={styles.detailItem}>
              <Gavel sx={styles.icon} />
              <Typography variant="body1" sx={styles.detailText}><strong>Crime:</strong> {criminal.crime}</Typography>
            </Box>
          </Box>
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

// Updated styles for better data display
const styles = {
  infoButton: {
    color: '#1976d2',
    '&:hover': {
      color: '#004ba0', // Slightly darker shade on hover for info icon
    },
  },
  dialogTitle: {
    backgroundColor: '#004ba0',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '16px 24px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  image: {
    marginTop:"25px",
    borderRadius: '50%',
    marginBottom: '16px',
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    border: '3px solid #1976d2',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '12px',
    padding: '0 24px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '8px',
    marginBottom: '8px',
  },
  detailText: {
    color: '#333',
  },
  icon: {
    color: '#1976d2',
  },
  dialogActions: {
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: '#f5f5f5',
  },
  closeButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold',
    padding: '8px 24px',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#004ba0',
      transform: 'scale(1.05)',
    },
    borderRadius: '24px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default CriminalDetailsDialog;
