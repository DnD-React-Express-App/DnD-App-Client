import React from "react";
import "../../SpellCard.css";

const SpellCard = ({ spell, selected = false, onSelect = null }) => {
  const description = Array.isArray(spell.desc)
    ? spell.desc.join(" ")
    : typeof spell.desc === "string"
    ? spell.desc
    : "No description available.";

  const handleChange = () => {
    if (onSelect) {
      onSelect(spell);
    }
  };

  return (
    <div className={`spell-card ${selected ? "selected" : ""}`}>
      {onSelect && (
        <label className="spell-select">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleChange}
          />
          Select
        </label>
      )}

      <h2>{spell.name}</h2>
      <p>
        Level {spell.level === 0 ? "Cantrip" : spell.level} {spell.school}
      </p>
      <p>Casting Time: {spell.casting_time}</p>
      <p>Range: {spell.range}</p>
      <p>Components: {spell.components?.join(", ")}</p>
      <p>Duration: {spell.duration}</p>
      <p>{description}</p>
      {spell.classes && (
        <p>Classes: {spell.classes.join(", ")}</p>
      )}
    </div>
  );
};

export default SpellCard;
