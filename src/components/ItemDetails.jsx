function ItemDetails({ item }) {
    return (
      <div className="item-details">
        <h2>{item.name}</h2>
        <p><strong>Type:</strong> {item.type}</p>
        <p><strong>Rarity:</strong> {item.rarity}</p>
        {item.description && <p><strong>Description:</strong> {item.description}</p>}
  
        {item.type === 'Armor' && (
          <>
            <p><strong>Armor Name:</strong> {item.armorName}</p>
            <p><strong>Base AC:</strong> {item.armorClassBase}</p>
            <p><strong>Dex Modifier:</strong> {item.usesDexModifier ? 'Yes' : 'No'}</p>
            {item.dexModifierCap !== null && <p><strong>Dex Cap:</strong> {item.dexModifierCap}</p>}
            <p><strong>Properties:</strong> {item.armorProperties?.join(', ')}</p>
          </>
        )}
  
        {item.type === 'Weapon' && (
          <>
            <p><strong>Weapon Name:</strong> {item.weaponName}</p>
            <p><strong>Weapon Type:</strong> {item.weaponType}</p>
            <p><strong>Damage:</strong> {item.damageTypes?.map(d => `${d.die} ${d.type}`).join(', ')}</p>
            <p><strong>Properties:</strong> {item.weaponProperties?.join(', ')}</p>
            <p><strong>Mastery:</strong> {item.weaponMastery}</p>
          </>
        )}
  
        {item.weight && <p><strong>Weight:</strong> {item.weight} lbs</p>}
      </div>
    );
  }
  
  export default ItemDetails;
  