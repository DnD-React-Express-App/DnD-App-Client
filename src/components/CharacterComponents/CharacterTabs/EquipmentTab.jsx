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

      <select
        value={selectedWeapon?._id || ''}
        onChange={e => {
          const selected = weaponOptions.find(weapon => weapon._id === e.target.value);
          setSelectedWeapon(selected || null);
        }}
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
