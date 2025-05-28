import React from 'react';

function EquipmentTab({
  selectedArmor,
  setSelectedArmor,
  selectedWeapons,
  setSelectedWeapons,
  armorOptions,
  weaponOptions,
}) {
  return (
    <>
      <label>Select Armor:</label>
      <select
        value={selectedArmor?._id || ''}
        onChange={e => {
          const selected = armorOptions.find(armor => armor._id === e.target.value);
          setSelectedArmor(selected || null);
        }}
      >
        <option value="">-- Select Armor --</option>
        {armorOptions.map(armor => (
          <option key={armor._id} value={armor._id}>
            {armor.name}
          </option>
        ))}
      </select>

      <label style={{ marginTop: '1rem', display: 'block' }}>Select Weapons:</label>
      <select
        multiple
        value={selectedWeapons.map(w => w._id)}
        onChange={e => {
          const selectedIds = Array.from(e.target.selectedOptions).map(option => option.value);
          const selected = weaponOptions.filter(w => selectedIds.includes(w._id));
          setSelectedWeapons(selected);
        }}
      >
        {weaponOptions.map(weapon => (
          <option key={weapon._id} value={weapon._id}>
            {weapon.name}
          </option>
        ))}
      </select>

    </>
  );
}

export default EquipmentTab;
