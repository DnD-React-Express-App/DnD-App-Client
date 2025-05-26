import React from "react";
import "../../SpellCard.css";

const SpellCard = ({ spell }) => {
  const description = Array.isArray(spell.desc)
    ? spell.desc.join(" ")
    : spell.desc || "No description available.";

  return (
    <div className="spell-card">
      <h2>{spell.name}</h2>
      <p>Level {spell.level === 0 ? "Cantrip" : spell.level} {spell.school}</p>
      <p>Casting Time: {spell.casting_time}</p>
      <p>Range: {spell.range}</p>
      <p>Components: {spell.components?.join(", ")}</p>
      <p>Duration: {spell.duration}</p>
      <p>{description}</p>
      {spell.classes && <p>Classes: {spell.classes.join(", ")}</p>}
    </div>
  );
};

export default SpellCard;