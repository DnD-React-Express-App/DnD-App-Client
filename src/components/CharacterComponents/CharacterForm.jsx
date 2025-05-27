import React, { useState, useEffect, useContext } from 'react';
import { ItemContext } from '../../context/item.context';
import { createCharacter, updateCharacter } from '../../services/character.service';
import proficiencies from '../../../public/data/proficiencies.json';
import ClassTab from './CharacterTabs/ClassTab';
import SpeciesTab from './CharacterTabs/SpeciesTab';
import StatsTab from './CharacterTabs/StatsTab';
import BackgroundTab from './CharacterTabs/BackgroundTab';
import SpellTab from './CharacterTabs/SpellTab';
import EquipmentTab from './CharacterTabs/EquipmentTab';
import ProficienciesTab from './CharacterTabs/ProficienciesTab';

const spellcastingClasses = [
  'Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Paladin', 'Ranger', 'Warlock'
];

const fullCasters = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Warlock'];
const halfCasters = ['Paladin', 'Ranger'];

const CharacterForm = ({ onSuccess, initialData = {} }) => {
  const { items } = useContext(ItemContext);

  const [currentTab, setCurrentTab] = useState('Basics');
  const [armorOptions, setArmorOptions] = useState([]);
  const [weaponOptions, setWeaponOptions] = useState([]);
  const [selectedArmor, setSelectedArmor] = useState(null);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [speciesFeatures, setSpeciesFeatures] = useState([]);
  const [allClassFeatures, setAllClassFeatures] = useState({});
  const [classFeatures, setClassFeatures] = useState({});
  const [backgroundFeatures, setBackgroundFeatures] = useState([]);
  const [classSpellLists, setClassSpellLists] = useState({});
  const [selectedSpells, setSelectedSpells] = useState({});

  const [form, setForm] = useState({
    name: '',
    race: '',
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    classes: [{ name: '', level: 1 }],
    level: 1,
    background: '',
    backstory: '',
    proficiencies: {
      skills: [],
      armor: [],
      weapons: [],
      tools: []
    },
    ...initialData,
  });

  const classOptions = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
    'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
  ];

  const raceOptions = [
    'Human', 'Elf', 'Half-Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Dragonborn',
    'Tiefling', 'Aasimar', 'Genasi', 'Goliath', 'Tabaxi', 'Triton', 'Firbolg',
    'Kenku', 'Lizardfolk', 'Goblin', 'Orc', 'Bugbear'
  ];

  useEffect(() => {
    if (items.length) {
      setArmorOptions(items.filter(item => item.type === 'Armor'));
      setWeaponOptions(items.filter(item => item.type === 'Weapon'));
    }
  }, [items]);

  useEffect(() => {
    if (initialData && initialData._id) {
      setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/classes.json');
        const data = await res.json();
        setAllClassFeatures(data);
      } catch (err) {
        console.error('Failed to load class features:', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/class_spells.json');
        const data = await res.json();
        setClassSpellLists(data);
      } catch (err) {
        console.error('Failed to load class spell lists:', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!form.background) {
        setBackgroundFeatures([]);
        return;
      }
      try {
        const res = await fetch('/data/backgrounds.json');
        const data = await res.json();
        setBackgroundFeatures(data[form.background]?.features || []);
      } catch (err) {
        console.error('Failed to load background features:', err);
        setBackgroundFeatures([]);
      }
    })();
  }, [form.background]);

  const getMaxSpellLevel = (casterType, classLevel) => {
    if (classLevel < 1) return 0;

    if (casterType === 'full') {
      if (classLevel >= 17) return 9;
      if (classLevel >= 15) return 8;
      if (classLevel >= 13) return 7;
      if (classLevel >= 11) return 6;
      if (classLevel >= 9) return 5;
      if (classLevel >= 7) return 4;
      if (classLevel >= 5) return 3;
      if (classLevel >= 3) return 2;
      return 1;
    }

    if (casterType === 'half') {
      if (classLevel >= 17) return 5;
      if (classLevel >= 13) return 4;
      if (classLevel >= 9) return 3;
      if (classLevel >= 5) return 2;
      if (classLevel >= 2) return 1;
    }

    return 0;
  };

  const handleRaceChange = async (e) => {
    const selectedRace = e.target.value;
    setForm(prev => ({ ...prev, race: selectedRace }));

    if (!selectedRace) {
      setSpeciesFeatures([]);
      return;
    }

    try {
      const res = await fetch('/data/species.json');
      const speciesData = await res.json();
      setSpeciesFeatures(speciesData[selectedRace]?.abilities || []);
    } catch (err) {
      console.error('Failed to load species data:', err);
      setSpeciesFeatures([]);
    }
  };

  const handleStatChange = (stat, value) => {
    setForm(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: Number(value)
      }
    }));
  };

  const handleClassChange = (index, field, value) => {
    const updatedClasses = form.classes.map((cls, i) => {
      if (i === index) {
        return {
          ...cls,
          [field]: field === 'level' ? Number(value) : value
        };
      }
      return cls;
    });

    setForm(prev => ({ ...prev, classes: updatedClasses }));

    const selectedClass = field === 'name' ? value : updatedClasses[index].name;
    const selectedLevel = field === 'level' ? Number(value) : updatedClasses[index].level;

    if (!selectedClass || !allClassFeatures[selectedClass]) return;

    const allFeatures = allClassFeatures[selectedClass].features || [];
    const unlocked = allFeatures.filter(f => f.level <= selectedLevel);
    const upcoming = allFeatures.filter(f => f.level > selectedLevel);

    setClassFeatures(prev => ({
      ...prev,
      [index]: { unlocked, upcoming }
    }));
  };

  const handleSpellToggle = (className, spellName) => {
    setSelectedSpells(prev => {
      const current = prev[className] || [];
      return {
        ...prev,
        [className]: current.includes(spellName)
          ? current.filter(sp => sp !== spellName)
          : [...current, spellName],
      };
    });
  };

  const addClass = () => {
    setForm(prev => ({
      ...prev,
      classes: [...prev.classes, { name: '', level: 1 }]
    }));
  };

  const removeClass = (index) => {
    setForm(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        items: [selectedArmor, selectedWeapon].filter(Boolean),
        spells: selectedSpells,
      };

      let res;
      if (form._id) {
        res = await updateCharacter(form._id, payload);
      } else {
        res = await createCharacter(payload);
      }

      if (onSuccess) onSuccess(res.data);
      alert(`Character ${form._id ? 'updated' : 'created'}!`);
    } catch (err) {
      console.error(err);
      alert(`Error ${form._id ? 'updating' : 'creating'} character`);
    }
  };

  return (
    <div>
      <div className="tabs">
        {[
          'Class', 'Species', 'Stats', 'Background', 'Proficiencies', 'Equipment',
          ...(form.classes.some(cls => spellcastingClasses.includes(cls.name)) ? ['Spells'] : [])
        ].map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={currentTab === tab ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentTab === 'Class' && (
          <ClassTab
            form={form}
            classOptions={classOptions}
            spellcastingClasses={spellcastingClasses}
            classFeatures={classFeatures}
            handleClassChange={handleClassChange}
            removeClass={removeClass}
            addClass={addClass}
          />
        )}

        {currentTab === 'Spells' && (
          <SpellTab
            classes={form.classes}
            spellcastingClasses={spellcastingClasses}
            classSpellLists={classSpellLists}
            fullCasters={fullCasters}
            halfCasters={halfCasters}
            getMaxSpellLevel={getMaxSpellLevel}
            selectedSpells={selectedSpells}
            handleSpellToggle={handleSpellToggle}
          />
        )}

        {currentTab === 'Species' && (
          <SpeciesTab
            form={form}
            setForm={setForm}
            raceOptions={raceOptions}
            speciesFeatures={speciesFeatures}
            handleRaceChange={handleRaceChange}
          />
        )}

        {currentTab === 'Stats' && (
          <StatsTab form={form} handleStatChange={handleStatChange} />
        )}

        {currentTab === 'Background' && (
          <BackgroundTab
            background={form.background}
            setBackground={value => setForm({ ...form, background: value })}
            backgroundFeatures={backgroundFeatures}
            backstory={form.backstory}
            setBackstory={value => setForm({ ...form, backstory: value })}
          />
        )}

        {currentTab === 'Proficiencies' && (
          <ProficienciesTab
            proficiencies={proficiencies}
            formProficiencies={form.proficiencies}
            setFormProficiencies={newProficiencies =>
              setForm(prev => ({ ...prev, proficiencies: newProficiencies }))
            }
          />
        )}

        {currentTab === 'Equipment' && (
          <EquipmentTab
            selectedArmor={selectedArmor}
            setSelectedArmor={setSelectedArmor}
            selectedWeapon={selectedWeapon}
            setSelectedWeapon={setSelectedWeapon}
            armorOptions={armorOptions}
            weaponOptions={weaponOptions}
          />
        )}

        <button type="submit">Save Character</button>
      </form>
    </div>
  );
};

export default CharacterForm;
