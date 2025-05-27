import React from 'react';

function EquipmentTab({
  selectedArmor,
  setSelectedArmor,
  selectedWeapon,
  setSelectedWeapon,
  armorOptions,
  weaponOptions,
}) {
  return (
    <>
      <label>Select Armor:</label>
      <select
        value={selectedArmor}
        onChange={e => setSelectedArmor(e.target.value)}
      >
        <option value="">-- Select Armor --</option>
        {armorOptions.map(armor => (
          <option key={armor._id} value={armor._id}>
            {armor.name}
          </option>
        ))}
      </select>

      <label style={{ marginTop: '1rem', display: 'block' }}>Select Weapon:</label>
      <select
        value={selectedWeapon}
        onChange={e => setSelectedWeapon(e.target.value)}
      >
        <option value="">-- Select Weapon --</option>
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
