import React from 'react';

function ProficienciesTab({ proficiencies, formProficiencies, setFormProficiencies }) {
  const handleCheckboxChange = (type, item, checked) => {
    setFormProficiencies(prev => ({
      ...prev,
      [type]: checked
        ? [...(prev[type] || []), item]
        : (prev[type] || []).filter(i => i !== item),
    }));
  };

  return (
    <>
      <h3>Proficiencies</h3>
      {Object.entries(proficiencies).map(([type, list]) => (
        <div key={type} style={{ marginBottom: '1rem' }}>
          <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
          {list.map(item => (
            <label key={item} style={{ display: 'block' }}>
              <input
                type="checkbox"
                value={item}
                checked={formProficiencies[type]?.includes(item) || false}
                onChange={e => handleCheckboxChange(type, item, e.target.checked)}
              />
              {item}
            </label>
          ))}
        </div>
      ))}
    </>
  );
}

export default ProficienciesTab;
