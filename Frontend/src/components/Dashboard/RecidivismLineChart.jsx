import { recomposeColor } from '@mui/material';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const RecidivismLineChart = ({ data }) => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
    <Line type="monotone" dataKey="recidivism" stroke="#82ca9d" />
  </LineChart>
);

export default RecidivismLineChart;