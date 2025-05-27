import React from 'react';

const SpeciesTab = ({ form, setForm, raceOptions, speciesFeatures, handleRaceChange }) => {
  return (
    <>
      <input
        placeholder="Character Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <select value={form.race} onChange={handleRaceChange}>
        <option value="">Select Race</option>
        {raceOptions.map(r => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {speciesFeatures.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Racial Features:</strong>
          <ul>
            {speciesFeatures.map(feature => (
              <li key={feature._id}>
                <strong>{feature.name}</strong>: {feature.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SpeciesTab;
