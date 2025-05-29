function ItemDetails({ item }) {
  const renderWeaponDamage = () => {
    if (!item.damageTypes || !Array.isArray(item.damageTypes)) return null;

    const damageString = item.damageTypes
      .filter(d => d.dieAmount && d.dieType && d.damageType)
      .map(d => `${d.dieAmount}${d.dieType} ${d.damageType}`)
      .join(' + ');

    return <p><strong>Damage:</strong> {damageString}</p>;
  };

  return (
    <div className="item-details">
      <h2>{item.name}</h2>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Rarity:</strong> {item.rarity}</p>
      {item.description && <p><strong>Description:</strong> {item.description}</p>}

      {item.type === 'Armor' && (
        <>
          <p><strong>Base AC:</strong> {item.armorClassBase}</p>
          <p><strong>Dex Modifier:</strong> {item.usesDexModifier ? 'Yes' : 'No'}</p>
          {item.dexModifierCap !== null && <p><strong>Dex Cap:</strong> {item.dexModifierCap}</p>}
          <p><strong>Properties:</strong> {item.armorProperties?.join(', ')}</p>
        </>
      )}

      {item.type === 'Weapon' && (
        <>
          <p><strong>Weapon Type:</strong> {item.weaponType}</p>
          {renderWeaponDamage()}
          <p><strong>Properties:</strong> {item.weaponProperties?.join(', ')}</p>
          <p><strong>Mastery:</strong> {item.weaponMastery}</p>
        </>
      )}

      {item.weight && <p><strong>Weight:</strong> {item.weight} lbs</p>}
    </div>
  );
}

export default ItemDetails;