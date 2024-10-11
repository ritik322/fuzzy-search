import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const DemographicBarChart = ({ data }) => {
  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="location" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#82ca9d" />
    </BarChart>
  );
};

export default DemographicBarChart;
