import React, { useContext, useState, useMemo } from "react";
import { SpellContext } from "../context/spell.context";
import SpellCard from "./SpellCard";

const SPELL_SCHOOLS = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
  'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
];

const SpellList = () => {
  const { spells, isLoading } = useContext(SpellContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSchool, setActiveSchool] = useState('');

  const filteredSpells = useMemo(() => {
    return spells
      .filter(spell =>
        spell.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(spell =>
        activeSchool ? spell.school === activeSchool : true
      );
  }, [spells, searchTerm, activeSchool]);

  const spellsByLevel = useMemo(() => {
    const levels = {};
    filteredSpells.forEach(spell => {
      const lvl = spell.level;
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(spell);
    });
    return levels;
  }, [filteredSpells]);

  if (isLoading) return <p>Loading spells...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Spells</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search spells..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="border px-2 py-1 mb-4 w-full"
      />

      {/* School filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${!activeSchool ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSchool('')}
        >
          All
        </button>
        {SPELL_SCHOOLS.map(school => (
          <button
            key={school}
            className={`px-3 py-1 rounded ${activeSchool === school ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSchool(school)}
          >
            {school}
          </button>
        ))}
      </div>

      {/* Spells grouped by level */}
      <div className="space-y-6">
        {Object.keys(spellsByLevel).sort((a, b) => a - b).map(level => (
          <div key={level}>
            <h2 className="text-xl font-semibold mb-2">Level {level}</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {spellsByLevel[level].map(spell => (
                <SpellCard key={spell._id} spell={spell} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellList;
