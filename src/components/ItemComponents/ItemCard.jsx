import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../List.css';

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(prev => !prev);

  const renderDamage = () => {
    if (!item.damageTypes || !Array.isArray(item.damageTypes)) return null;

    const damageString = item.damageTypes
      .filter(d => d.die && d.type)
      .map(d => `${d.die} ${d.type}`)
      .join(' + ');

    return <p><strong>Damage:</strong> {damageString}</p>;
  };

  return (
    <div
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={toggleExpand}
    >
      <h3 className="text-lg font-bold">
          {item.name}
      </h3>

      {/* Collapsed View */}
      {item.type === 'Weapon' && renderDamage()}
      {item.type === 'Armor' && item.armorClassBase && (
        <p><strong>Base AC:</strong> {item.armorClassBase}</p>
      )}

      {/* Expanded View */}
      {expanded && (
        <>
          <p><strong>Type:</strong> {item.type}</p>
          <p><strong>Rarity:</strong> {item.rarity}</p>

          {item.description && <p>{item.description}</p>}
          
          {item.type === 'Weapon' && item.weaponProperties?.length > 0 && (
            <>
            <p><strong>Properties:</strong> {item.weaponProperties.join(', ')}</p>
            <p><strong>Mastery:</strong> {item.weaponMastery}</p>
            </>
          )}
          {item.type === 'Armor' && item.armorType && (
            <>
            {item.dexModifierCap !== null && <p><strong>Dex Cap:</strong> {item.dexModifierCap}</p>}
            {(item.dexModifierCap && item.usesDexModifier) === null && <p><strong>Dex Cap:</strong> No cap</p>}
            <p><strong>Dex Modifier:</strong> {item.usesDexModifier ? 'Yes' : 'No'}</p>
            <p><strong>Armor Type:</strong> {item.armorType}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ItemCard;
