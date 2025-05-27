import React from 'react';

function BackgroundTab({ 
  background, 
  setBackground, 
  backgroundFeatures = [], 
  backstory, 
  setBackstory 
}) {
  return (
    <>
      <label>Select Background:</label>
      <select
        value={background}
        onChange={e => setBackground(e.target.value)}
      >
        <option value="">-- Select Background --</option>
        <option value="Acolyte">Acolyte</option>
        <option value="Criminal">Criminal</option>
        <option value="Folk Hero">Folk Hero</option>
        <option value="Noble">Noble</option>
        <option value="Outlander">Outlander</option>
        <option value="Sage">Sage</option>
        <option value="Soldier">Soldier</option>
      </select>

      {backgroundFeatures.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Background Features:</strong>
          <ul>
            {backgroundFeatures.map((feature, idx) => (
              <li key={feature._id || feature.name || idx}>
                <strong>{feature.name}</strong>: {feature.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        placeholder="Enter backstory"
        value={backstory}
        onChange={e => setBackstory(e.target.value)}
        rows={5}
        style={{ width: '100%', marginTop: '1rem' }}
      />
    </>
  );
}

export default BackgroundTab;
