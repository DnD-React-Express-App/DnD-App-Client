import React from 'react';

function SpellTab({
  classes = [],
  spellcastingClasses = [],
  classSpellLists = {},
  fullCasters = [],
  halfCasters = [],
  getMaxSpellLevel,
  selectedSpells = {},
  handleSpellToggle,
}) {
  return (
    <>
      <h3>Spell Selection</h3>
      {classes
        .filter(cls => spellcastingClasses.includes(cls.name))
        .map((cls, index) => {
          const className = cls.name;
          const spells = classSpellLists[className] || [];

          const isFull = fullCasters.includes(className);
          const isHalf = halfCasters.includes(className);
          const casterType = isFull ? 'full' : isHalf ? 'half' : null;

          const maxLevel = casterType ? getMaxSpellLevel(casterType, cls.level) : 0;

          const filteredSpells = spells.filter(spell => spell.level <= maxLevel);

          return (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <h4>{className} (max spell level: {maxLevel})</h4>
              {filteredSpells.length > 0 ? (
                <ul>
                  {filteredSpells.map(spell => (
                    <li key={spell.name}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSpells[className]?.includes(spell.name) || false}
                          onChange={() => handleSpellToggle(className, spell.name)}
                        />
                        {spell.name} (Level {spell.level}, {spell.school})
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No available spells for {className} at level {cls.level}.</p>
              )}
            </div>
          );
        })}
    </>
  );
}

export default SpellTab;
