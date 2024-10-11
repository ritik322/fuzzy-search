import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Box } from '@mui/material'; // Import Material UI Box for centering

const CommonMistakesPieChart = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const data = [
    { type: 'Name Completion', count: 1 },
    { type: 'Small Mistake', count: 2 },
    { type: 'Big Mistake', count: 1 },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        maxHeight: '320px', // Set maximum height
      }}
    >
      <PieChart width={300} height={300}> {/* Reduced size */}
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={90} // Reduced outer radius for a smaller chart
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Box>
  );
};

export default CommonMistakesPieChart;
