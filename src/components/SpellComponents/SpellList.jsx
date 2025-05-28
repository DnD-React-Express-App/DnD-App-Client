import React, { useEffect, useState } from "react";
import SpellCard from "./SpellCard";
import '../../List.css'

const SpellList = () => {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [filters, setFilters] = useState({
    level: "All",
    school: "All",
    className: "All",
  });

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const res = await fetch("/data/class_spells.json");
        const data = await res.json();

        // Flatten spell data and track which classes can use each spell
        const spellMap = new Map();

        for (const [className, classSpells] of Object.entries(data)) {
          for (const spell of classSpells) {
            const key = spell.name.toLowerCase();

            if (!spellMap.has(key)) {
              spellMap.set(key, {
                ...spell,
                classes: [className],
              });
            } else {
              spellMap.get(key).classes.push(className);
            }
          }
        }

        const spellArray = Array.from(spellMap.values());
        setSpells(spellArray);
        setFilteredSpells(spellArray);
      } catch (err) {
        console.error("Failed to load spells:", err);
      }
    };

    fetchSpells();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const newFiltered = spells.filter((spell) => {
      const matchesLevel = newFilters.level === "All" || spell.level === parseInt(newFilters.level);
      const matchesSchool = newFilters.school === "All" || spell.school === newFilters.school;
      const matchesClass = newFilters.className === "All" || spell.classes.includes(newFilters.className);
      return matchesLevel && matchesSchool && matchesClass;
    });

    setFilteredSpells(newFiltered);
  };

  return (
    <div className="list">
      <div className="filters">
        <label>
          Class:
          <select name="className" value={filters.className} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Bard">Bard</option>
            <option value="Cleric">Cleric</option>
            <option value="Druid">Druid</option>
            <option value="Paladin">Paladin</option>
            <option value="Ranger">Ranger</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Warlock">Warlock</option>
            <option value="Wizard">Wizard</option>
          </select>
        </label>

        <label>
          Level:
          <select name="level" value={filters.level} onChange={handleFilterChange}>
            <option value="All">All</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i === 0 ? "Cantrip" : i}</option>
            ))}
          </select>
        </label>

        <label>
          School:
          <select name="school" value={filters.school} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Abjuration">Abjuration</option>
            <option value="Conjuration">Conjuration</option>
            <option value="Divination">Divination</option>
            <option value="Enchantment">Enchantment</option>
            <option value="Evocation">Evocation</option>
            <option value="Illusion">Illusion</option>
            <option value="Necromancy">Necromancy</option>
            <option value="Transmutation">Transmutation</option>
          </select>
        </label>
      </div>

      <div className="spell-list">
        {filteredSpells.map((spell, index) => (
          <SpellCard key={index} spell={spell} />
        ))}
      </div>
    </div>
  );
};

export default SpellList;
