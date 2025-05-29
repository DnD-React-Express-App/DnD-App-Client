import { Link } from 'react-router-dom';
import '../../List.css';

function CustomSpellCard({ spell }) {
  const renderDamage = () => {
    if (!spell.damage || !Array.isArray(spell.damage)) return null;

    const damageString = spell.damage
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
        <Link to={`/spells/${spell._id}`}>{spell.name}</Link>
      </h3>
      <p><strong>School:</strong> {spell.school}</p>
      <p><strong>Level:</strong> {spell.level}</p>
      <p><strong>Range:</strong> {spell.range}</p>
      {renderDamage()}
      {spell.description && <p>{spell.description}</p>}
    </div>
  );
}

export default CustomSpellCard;