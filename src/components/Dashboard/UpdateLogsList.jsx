import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UpdateLogsList = ({ logs }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: '20px',
        maxHeight: '300px', // Set a fixed height for the TableContainer
        overflowY: 'auto', // Enable vertical scrolling
        backgroundColor: '#e6f0ff', // Blue background color
        border: '1px solid #0056b3', // Blue border
      }}
    >
      <Table aria-label="update logs table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: '#0056b3' }}><strong>Criminal ID</strong></TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#0056b3' }}><strong>Details</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>{log.criminalId}</TableCell>
              <TableCell>{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UpdateLogsList;
