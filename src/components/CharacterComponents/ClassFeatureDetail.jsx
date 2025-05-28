import React, { useState } from 'react';

const ClassFeatureDetail = ({ feature }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(prev => !prev)}
      style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
    >
      <strong>{feature.name}</strong> (Lv {feature.level}){expanded ? "▲" : "▼"}
      {expanded && (
        <div style={{ marginTop: '0.25rem' }}>
          <p>{feature.description}</p>
        </div>
      )}
    </div>
  );
};

export default ClassFeatureDetail;
