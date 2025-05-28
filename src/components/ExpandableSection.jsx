import React, { useState } from 'react';

const ExpandableSection = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="section">
      <div
        onClick={() => setExpanded(prev => !prev)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        <span style={{ marginRight: '0.5rem' }}>
          {expanded ? "▲" : "▼"}
        </span>
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>

      {expanded && (
        <div style={{ marginTop: '0.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
