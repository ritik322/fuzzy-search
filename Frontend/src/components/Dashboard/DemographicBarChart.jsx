import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const DemographicBarChart = ({ data }) => (
  <BarChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="ageGroup" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="mistakes" fill="#8884d8" />
  </BarChart>
);

export default DemographicBarChart;
