import React, { useState, useEffect } from "react";
import SpellCard from "./SpellCard";
import classSpells from "../../../public/data/class_spells.json";

const SpellSelection = ({ selectedClass, onSelectSpells }) => {
  const [selected, setSelected] = useState([]);

  const spells = classSpells[selectedClass] || [];

  const toggleSpell = (spell) => {
    setSelected((prev) =>
      prev.some((s) => s.name === spell.name)
        ? prev.filter((s) => s.name !== spell.name)
        : [...prev, spell]
    );
  };

  useEffect(() => {
    onSelectSpells(selected.map(s => ({
      name: s.name,
      class: selectedClass
    })));
  }, [selected, selectedClass, onSelectSpells]);

  return (
    <div className="spell-selection">
      <h3>{selectedClass} Spells</h3>
      <div className="spell-list">
        {spells.map((spell) => (
          <SpellCard
            key={spell.name}
            spell={spell}
            selected={selected.some(s => s.name === spell.name)}
            onSelect={toggleSpell}
          />
        ))}
      </div>
    </div>
  );
};

export default SpellSelection;