import React from 'react';

const ActivityFeed = ({ feed }) => {
  return (
    <div>
      <h3>Latest Activity Feed</h3>
      <ul>
        {feed.map((log) => (
          <li key={log._id}>
            <strong>{log.action}</strong> - {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
