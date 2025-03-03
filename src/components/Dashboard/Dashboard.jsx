import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommonMistakesPieChart from './CommonMistakesPieChart';
import CommonMistakesPieChart2 from './CommonMistakesPieChart2';
import UpdateLogsList from './UpdateLogsList';
import ActivityFeed from './ActivityFeed';
import { Card, Grid, Typography, Box, Divider, CircularProgress } from '@mui/material'; // Using Material UI for better design

const Dashboard = () => {
  const [actionCounts, setActionCounts] = useState([]);
  const [updateLogs, setUpdateLogs] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actionResponse = await axios.get('http://localhost:3000/api/v1/criminal/counts-by-action');
        const actions = actionResponse.data.map(item => ({ type: item._id, count: item.count }));
        setActionCounts(actions);

        const updatesResponse = await axios.get('http://localhost:3000/api/v1/criminal/updates');
        setUpdateLogs(updatesResponse.data);

        const activityResponse = await axios.get('http://localhost:3000/api/v1/criminal/latest-activity');
        setActivityFeed(activityResponse.data);

        setLoading(false); // Loading done
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '40px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#003366' }}> {/* Dark blue color for title */}
        Criminal Records Analytics
      </Typography>

      <Grid container spacing={4}> {/* Increased spacing between cards */}
        {/* Actions Overview Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '20px', boxShadow: 3, backgroundColor: '#e6f0ff', border: '1px solid #0056b3' }}> {/* Light blue background and border */}
            <Typography variant="h6" gutterBottom sx={{ color: '#0056b3' }}>
              Actions Overview (Creations, Updates, Deletions)
            </Typography>
            <Divider />
            <CommonMistakesPieChart data={actionCounts} />
          </Card>
        </Grid>

        {/* Update Logs Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '20px', boxShadow: 3, backgroundColor: '#e6f0ff', border: '1px solid #0056b3' }}> 
            <Typography variant="h6" gutterBottom sx={{ color: '#0056b3' }}>
              Latest Updates
            </Typography>
            <Divider />
            <UpdateLogsList logs={updateLogs} />
          </Card>
        </Grid>

        {/* Activity Feed Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '20px', boxShadow: 3, backgroundColor: '#e6f0ff', border: '1px solid #0056b3' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0056b3' }}>
              Recent Activity Feed
            </Typography>
            <Divider />
            <ActivityFeed feed={activityFeed} />
          </Card>
        </Grid>

        {/* Second Pie Chart Example */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '20px', boxShadow: 3, backgroundColor: '#e6f0ff', border: '1px solid #0056b3' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0056b3' }}>
              Common Mistakes Overview
            </Typography>
            <Divider />
            <CommonMistakesPieChart2 />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
