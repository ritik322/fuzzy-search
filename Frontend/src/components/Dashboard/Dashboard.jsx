import React from 'react';
import CommonMistakesPieChart from './CommonMistakesPieChart';
import DemographicBarChart from './DemographicBarChart';
import RecidivismLineChart from './RecidivismLineChart';

const Dashboard = () => {
    const errorData = [
        { type: 'Missing Information', count: 40 },
        { type: 'Incorrect Data Entry', count: 30 },
        { type: 'Outdated Records', count: 20 },
        { type: 'Other', count: 10 },
      ];
      
      const demographicData = [
        { ageGroup: '18-25', mistakes: 20 },
        { ageGroup: '26-35', mistakes: 35 },
        { ageGroup: '36-45', mistakes: 25 },
        { ageGroup: '46+', mistakes: 15 },
      ];
      
      const recidivismData = [
        { month: 'Jan', accuracy: 90, recidivism: 5 },
        { month: 'Feb', accuracy: 85, recidivism: 8 },
        { month: 'Mar', accuracy: 88, recidivism: 7 },
        { month: 'Apr', accuracy: 92, recidivism: 4 },
      ];
      
  return (
    <div style={{ padding: '20px' }}>
      <h1>Criminal Records Analytics Dashboard</h1>
      <h2>Common Mistakes in Criminal Records</h2>
      <CommonMistakesPieChart data={errorData} />

      <h2>Mistakes by Demographics</h2>
      <DemographicBarChart data={demographicData} />

      <h2>Recidivism Rates Over Time</h2>
      <RecidivismLineChart data={recidivismData} />
    </div>
  );
};

export default Dashboard;
