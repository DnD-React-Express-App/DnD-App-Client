import fetch from 'node-fetch';
import fs from 'fs';

async function fetchClassSpells() {
  const spellsUrl = 'https://www.dnd5eapi.co/api/spells';
  const classSpells = {};

  const spellListRes = await fetch(spellsUrl);
  if (!spellListRes.ok) {
    console.error('Failed to fetch spell list');
    return;
  }
  const spellListData = await spellListRes.json();
  const spells = spellListData.results;

  console.log(`Found ${spells.length} spells`);

  for (const spell of spells) {
    console.log(`Fetching spell: ${spell.name}`);

    const spellDetailRes = await fetch(`https://www.dnd5eapi.co${spell.url}`);
    if (!spellDetailRes.ok) {
      console.warn(`⚠️ Failed to fetch spell details for ${spell.name}`);
      continue;
    }

    const spellData = await spellDetailRes.json();

    const simplifiedSpell = {
      name: spellData.name,
      level: spellData.level,
      school: spellData.school?.name || '',
      desc: Array.isArray(spellData.desc) ? spellData.desc.join(' ') : spellData.desc,
      range: spellData.range,
      duration: spellData.duration,
      casting_time: spellData.casting_time,
      components: spellData.components,
      concentration: spellData.concentration,
      ritual: spellData.ritual
    };

    if (Array.isArray(spellData.classes)) {
      for (const cls of spellData.classes) {
        const className = cls.name;
        if (!classSpells[className]) {
          classSpells[className] = [];
        }
        classSpells[className].push(simplifiedSpell);
      }
    }

  }

  fs.writeFileSync('class_spells.json', JSON.stringify(classSpells, null, 2));
  console.log('✅ Class spells saved to class_spells.json');
}

fetchClassSpells().catch(console.error);
