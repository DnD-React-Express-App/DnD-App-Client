import '../../ItemCard.css';
import { Link } from 'react-router-dom';
import '../../List.css';

function ItemCard({ item }) {
  const renderDamage = () => {
    if (!item.damage || !Array.isArray(item.damage)) return null;

    const damageString = item.damage
      .filter(d => d.dieAmount && d.dieType && d.damageType)
      .map(d => `${d.dieAmount}${d.dieType} ${d.damageType}`)
      .join(' + ');

    return (
      <p>
        <strong>Damage:</strong> {damageString}
      </p>
    );
  };

  return (
    <div className="card">
      <h3>
        <Link to={`/items/${item._id}`}>{item.name}</Link>
      </h3>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Rarity:</strong> {item.rarity}</p>
      {item.description && <p>{item.description}</p>}
      {renderDamage()}
    </div>
  );
}

export default ItemCard;
