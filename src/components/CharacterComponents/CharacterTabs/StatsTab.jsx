import React from 'react';

const StatsTab = ({ form, handleStatChange }) => {
  return (
    <>
      {Object.keys(form.stats).map(stat => (
        <div key={stat}>
          <label>{stat}</label>
          <input
            type="number"
            value={form.stats[stat]}
            onChange={e => handleStatChange(stat, e.target.value)}
          />
        </div>
      ))}
    </>
  );
};

export default StatsTab;