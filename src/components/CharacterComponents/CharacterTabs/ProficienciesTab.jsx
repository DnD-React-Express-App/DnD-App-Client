import React from 'react';
import { getExpertiseSlots } from '../../../utils/characterUtils';

function ProficienciesTab({ proficiencies, formProficiencies, setFormProficiencies, classBasedProficiencies, formExpertise, setFormExpertise, classes = [] }) {

  const armorFromClass = classBasedProficiencies?.armor || [];
  const weaponCategories = classBasedProficiencies?.weaponCategories || [];
  const namedWeapons = classBasedProficiencies?.namedWeapons || [];


  const handleCheckboxChange = (type, item, isChecked) => {
    setFormProficiencies({
      [type]: isChecked
        ? [...formProficiencies[type], item]
        : formProficiencies[type].filter(i => i !== item),
    });
  };
  

  const handleExpertiseToggle = (item) => {
    const isSelected = formExpertise.includes(item);
    const maxSlots = getExpertiseSlots(classes);
    const newExpertise = isSelected
      ? formExpertise.filter(i => i !== item)
      : [...formExpertise, item];

    if (!isSelected && newExpertise.length > maxSlots) return; // Don't exceed max
    setFormExpertise(newExpertise);
  };

  const maxExpertiseSlots = getExpertiseSlots(classes);

  return (
    <>
      <h3>Proficiencies</h3>

      {/* Armor (read-only) */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>Armor (from class)</h4>
        {armorFromClass.length ? (
          <ul>
            {armorFromClass.map(prof => <li key={prof}>{prof}</li>)}
          </ul>
        ) : <p><em>No armor proficiencies granted by class.</em></p>}
      </div>

      {/* Weapons (read-only) */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>Weapons (from class)</h4>
        {weaponCategories.length ? (
          <ul>
            {weaponCategories.map(prof => <li key={prof}>{prof}</li>)}
          </ul>
        ) : <p><em>No weapon proficiencies granted by class.</em></p>}
      </div>

      {/* Skills and Tools (editable) */}
      {['skills', 'tools'].map(type => (
        <div key={type} style={{ marginBottom: '1rem' }}>
          <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
          {proficiencies[type].map(item => (
            <label key={item} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={formProficiencies[type]?.includes(item) || false}
                onChange={e => handleCheckboxChange(type, item, e.target.checked)}
              />
              {item}
            </label>
          ))}
        </div>
      ))}

      {/* Expertise (based on class + selected proficiencies) */}
      {maxExpertiseSlots > 0 && (
        <div>
          <h4>Expertise (Choose up to {maxExpertiseSlots})</h4>
          {[...formProficiencies.skills, ...formProficiencies.tools].map(item => (
            <label key={item} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={formExpertise.includes(item)}
                disabled={
                  !formExpertise.includes(item) && formExpertise.length >= maxExpertiseSlots
                }
                onChange={() => handleExpertiseToggle(item)}
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </>
  );
}

export default ProficienciesTab;
