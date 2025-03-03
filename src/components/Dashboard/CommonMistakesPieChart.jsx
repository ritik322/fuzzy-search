import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Box } from '@mui/material'; // Import Material UI components for better design

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CommonMistakesPieChart = ({ data }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        padding: '20px',
        width: '400px', // Set width of the Box to match the PieChart width
        height: '320px', // Set height of the Box to match the PieChart height
        margin: 'auto', // Center the Box in the parent container
      }}
    >
      <PieChart width={400} height={300}> {/* Keep the PieChart dimensions unchanged */}
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Box>
  );
};

export default CommonMistakesPieChart;
