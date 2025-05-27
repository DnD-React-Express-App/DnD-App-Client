import React from 'react';

const ClassTab = ({
  form,
  classOptions,
  spellcastingClasses,
  classFeatures,
  handleClassChange,
  removeClass,
  addClass,
}) => {
  return (
    <>
      {form.classes.map((cls, index) => {
        const className = cls.name;
        return (
          <div key={index} style={{ marginBottom: '2rem' }}>
            <select
              value={className || ''}
              onChange={e => handleClassChange(index, 'name', e.target.value)}
            >
              <option value="">Select Class</option>
              {classOptions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={cls.level}
              onChange={e => handleClassChange(index, 'level', e.target.value)}
              placeholder="Class Level"
              style={{ width: '80px', marginLeft: '0.5rem' }}
            />

            {classFeatures[index]?.unlocked?.length > 0 && (
              <div>
                <strong>Unlocked Features:</strong>
                <ul>
                  {classFeatures[index].unlocked.map(feature => (
                    <li key={feature.name}>
                      <strong>{feature.name}</strong> (Level {feature.level}):{' '}
                      {feature.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {form.classes.length > 1 && (
              <button type="button" onClick={() => removeClass(index)}>
                Remove
              </button>
            )}
          </div>
        );
      })}
      <button type="button" onClick={addClass}>
        + Add Class
      </button>
    </>
  );
};

export default ClassTab;
