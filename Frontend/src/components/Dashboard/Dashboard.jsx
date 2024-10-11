import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommonMistakesPieChart from './CommonMistakesPieChart';
import DemographicBarChart from './DemographicBarChart';
import UpdateLogsList from './UpdateLogsList';
import ActivityFeed from './ActivityFeed';
import CommonMistakesPieChart2 from './CommonMistakesPieChart2';

const Dashboard = () => {
  const [actionCounts, setActionCounts] = useState([]);
  const [locationCounts, setLocationCounts] = useState([]);
  const [updateLogs, setUpdateLogs] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/criminal/counts-by-action')
      .then(response => {
        const data = response.data.map(item => ({ type: item._id, count: item.count }));
        setActionCounts(data);
      })
      .catch(error => console.error('Error fetching action counts:', error));

    axios.get('http://localhost:3000/api/v1/criminal/updates')
      .then(response => setUpdateLogs(response.data))
      .catch(error => console.error('Error fetching update logs:', error));

    axios.get('http://localhost:3000/api/v1/criminal/latest-activity')
      .then(response => setActivityFeed(response.data))
      .catch(error => console.error('Error fetching latest activity:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Criminal Records Analytics Dashboard</h1>

      <h2>Actions Overview (Creations, Updates, Deletions)</h2>
      <CommonMistakesPieChart data={actionCounts} />

      
      <UpdateLogsList logs={updateLogs} />

      <ActivityFeed feed={activityFeed} />

      <CommonMistakesPieChart2/>
    </div>
  );
};

export default Dashboard;
