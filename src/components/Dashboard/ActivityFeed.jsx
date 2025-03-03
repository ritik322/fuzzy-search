import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const ActivityFeed = ({ feed }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: '20px',
        boxShadow: 3,
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: '300px', // Set a maximum height
        overflowY: 'auto', // Enable vertical scrolling
        backgroundColor: '#e6f0ff', // Blue background color
        border: '1px solid #0056b3', // Blue border
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: '#0056b3', backgroundColor: '#e6f0ff' }}><strong>Action</strong></TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#0056b3', backgroundColor: '#e6f0ff' }}><strong>Date</strong></TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#0056b3', backgroundColor: '#e6f0ff' }}><strong>Time</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feed.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography variant="body2">No recent activity available</Typography>
              </TableCell>
            </TableRow>
          ) : (
            feed.map((log) => {
              const date = new Date(log.timestamp);
              const formattedDate = date.toLocaleDateString();
              const formattedTime = date.toLocaleTimeString();

              return (
                <TableRow key={log._id}>
                  <TableCell sx={{ backgroundColor: '#e6f0ff' }}>{log.action}</TableCell>
                  <TableCell sx={{ backgroundColor: '#e6f0ff' }}>{formattedDate}</TableCell>
                  <TableCell sx={{ backgroundColor: '#e6f0ff' }}>{formattedTime}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivityFeed;
