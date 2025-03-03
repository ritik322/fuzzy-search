import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the logs when the component mounts
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/criminal/get-all-logs');
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format('MMMM Do YYYY, h:mm A'); // Example: "October 10th 2024, 4:19 PM"
  };

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p>Error fetching logs: {error}</p>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Logs</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Action</th>
            <th className="py-2 px-4 text-left">Criminal ID</th>
            <th className="py-2 px-4 text-left">Details</th>
            <th className="py-2 px-4 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-b">
              <td className="py-2 px-4">{log.action}</td>
              <td className="py-2 px-4">{log.criminalId}</td>
              <td className="py-2 px-4">{log.details}</td>
              <td className="py-2 px-4">{formatTimestamp(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsPage;
