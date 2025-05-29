const weaponProperties = [
  "Finesse", "Heavy", "Light", "Loading", "Reach", "Thrown",
  "Two-Handed", "Versatile", "Ammunition", "Special"
];

const damageTypes = [
  "Slashing", "Piercing", "Bludgeoning", "Fire", "Cold",
  "Poison", "Acid", "Necrotic", "Radiant", "Thunder",
  "Lightning", "Force", "Psychic"
];

function WeaponFormFields({ formData, handleChange, setFormData }) {
  const handlePropertyChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const current = prev.weaponProperties || [];
      return {
        ...prev,
        weaponProperties: checked
          ? [...current, value]
          : current.filter(p => p !== value),
      };
    });
  };

  const handleDamageChange = (index, field, value) => {
    const updated = [...formData.damage];
    updated[index][field] = field === "dieAmount" ? Number(value) : value;
    setFormData(prev => ({
      ...prev,
      damage: updated,
    }));
  };

  const addDamageField = () => {
    setFormData(prev => ({
      ...prev,
      damage: [...(prev.damage || []), { dieAmount: 1, dieType: 'd6', damageType: '' }]
    }));
  };

  const removeDamageField = (index) => {
    setFormData(prev => {
      const updated = [...prev.damage];
      updated.splice(index, 1);
      return {
        ...prev,
        damage: updated,
      };
    });
  };

  const damagePreview = (formData.damage || [])
    .filter(d => d.dieAmount && d.dieType && d.damageType)
    .map(d => `${d.dieAmount}${d.dieType} ${d.damageType}`)
    .join(' + ');

  return (
    <>
      <label>Weapon Type:</label>
      <select
        name="weaponType"
        value={formData.weaponType || ""}
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

      <fieldset>
        <legend>Weapon Properties:</legend>
        {weaponProperties.map(prop => (
          <label key={prop} style={{ display: 'block', marginBottom: '4px' }}>
            <input
              type="checkbox"
              value={prop}
              checked={formData.weaponProperties?.includes(prop) || false}
              onChange={handlePropertyChange}
            />
            {prop}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Damage Profiles:</legend>
        {(formData.damage || []).map((entry, index) => (
          <div key={index} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
            <label>Die Amount:</label>
            <input
              type="number"
              min="1"
              value={entry.dieAmount}
              onChange={(e) => handleDamageChange(index, "dieAmount", e.target.value)}
              required
            />

            <label>Die Type:</label>
            <select
              value={entry.dieType}
              onChange={(e) => handleDamageChange(index, "dieType", e.target.value)}
              required
            >
              <option value="">Choose Die</option>
              <option value="d4">d4</option>
              <option value="d6">d6</option>
              <option value="d8">d8</option>
              <option value="d10">d10</option>
              <option value="d12">d12</option>
            </select>

            <label>Damage Type:</label>
            <select
              value={entry.damageType}
              onChange={(e) => handleDamageChange(index, "damageType", e.target.value)}
              required
            >
              <option value="">Choose Type</option>
              {damageTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => removeDamageField(index)} style={{ marginLeft: '1rem' }}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addDamageField}>+ Add Damage Type</button>

        {damagePreview && (
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#444' }}>
            <strong>Damage Preview:</strong> {damagePreview}
          </p>
        )}
      </fieldset>
    </>
  );
}

export default WeaponFormFields;
