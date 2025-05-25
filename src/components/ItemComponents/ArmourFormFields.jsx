function ArmorFormFields({ formData, handleChange }) {
  return (
    <>
      <label>Armor Type:</label>
      <select
        name="armorType"
        value={formData.armorType}
        onChange={handleChange}
        required
      >
        <option value="">Select Armor</option>
        <option value="Padded">Padded</option>
        <option value="Leather">Leather</option>
        <option value="StuddedLeather">StuddedLeather</option>
        <option value="Hide">Hide</option>
        <option value="ChainShirt">ChainShirt</option>
        <option value="ScaleMail">ScaleMail</option>
        <option value="Breastplate">Breastplate</option>
        <option value="HalfPlate">HalfPlate</option>
        <option value="RingMail">RingMail</option>
        <option value="ChainMail">ChainMail</option>
        <option value="Splint">Splint</option>
        <option value="Plate">Plate</option>
        <option value="Shield">Shield</option>
      </select>
    </>
  );
}

export default ArmorFormFields;

  