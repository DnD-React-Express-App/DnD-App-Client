function WeaponFormFields({ formData, handleChange }) {
    return (
      <>
        <label>Weapon Name:</label>
        <input
          name="weaponName"
          value={formData.weaponName}
          onChange={handleChange}
          required
        />
  
        <label>Weapon Type:</label>
        <select
          name="weaponType"
          value={formData.weaponType}
          onChange={handleChange}
          required
        >
          <option value="">Select Weapon</option>
          <option>Greataxe</option>
          <option>Greatsword</option>
          <option>Dagger</option>
          <option>Rapier</option>
          <option>Scimitar</option>
          <option>Longsword</option>
          <option>Shortsword</option>
          <option>Mace</option>
          <option>Warhammer</option>
          <option>Bow</option>
          <option>Crossbow</option>
          <option>Staff</option>
          <option>Spear</option>
          <option>Club</option>
          <option>Halberd</option>
          <option>LightHammer</option>
          <option>Sickle</option>
        </select>
      </>
    );
  }
  
  export default WeaponFormFields;
  