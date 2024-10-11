import React from 'react';

const UpdateLogsList = ({ logs }) => {
  return (
    <div>
      <h3>Update Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            <strong>Criminal ID:</strong> {log.criminalId}, <strong>Details:</strong> {log.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateLogsList;
