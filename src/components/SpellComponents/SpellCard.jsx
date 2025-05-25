import React from "react";
import '../../SpellCard.css'
import { Link } from "react-router-dom";

const SpellCard = ({ spell }) => {
  return (
    <Link to={`/spells/${spell._id}`}>
    <div className="spell-card">
      <h2>{spell.name}</h2>
      <p>Level {spell.level} {spell.school}</p>
      <p>Casting Time: {spell.castingTime}</p>
      <p>Range: {spell.range}</p>
      <p>Components: {spell.components.join(', ')}</p>
      <p>{spell.description}</p>
    </div>
    </Link>
  );
};

export default SpellCard;
