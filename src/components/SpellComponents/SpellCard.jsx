import React from "react";
import "../../List.css";

import { useState } from 'react';

const SpellCard = ({ spell, selected = false, onSelect = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = Array.isArray(spell.desc)
    ? spell.desc.join(" ")
    : typeof spell.desc === "string"
      ? spell.desc
      : "No description available.";


  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  const handleChange = () => {
    if (onSelect) {
      onSelect(spell);
    }
  };

  return (
    <div
      className={`card ${selected ? "selected" : ""}`}
      onClick={handleToggle}
      style={{ cursor: "pointer" }}
    >

      {onSelect && (
        <label
          className="spell-select"
          onClick={(e) => e.stopPropagation()} 
        >
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

      {isExpanded && (
        <>
          <p>Casting Time: {spell.casting_time}</p>
          <p>Range: {spell.range}</p>
          <p>Components: {spell.components?.join(", ")}</p>
          <p>Duration: {spell.duration}</p>
          <p>{spell.desc}</p>
          {spell.classes && (
            <p>Classes: {spell.classes.join(", ")}</p>
          )}
        </>
      )}
    </div>
  );
};

export default SpellCard;
