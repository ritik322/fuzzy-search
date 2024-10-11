import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const CommonMistakesPieChart = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const data = [
    { type: 'Name Completion', count: 1 },
    { type: 'Small Mistake', count: 2 },
    { type: 'Big Mistake', count: 1 },
  ];
  return (
    <PieChart width={400} height={400}>
      <Pie data={data} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default CommonMistakesPieChart;
