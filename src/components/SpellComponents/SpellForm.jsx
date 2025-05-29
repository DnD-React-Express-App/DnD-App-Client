import React, { useState } from 'react';

const SCHOOL_OPTIONS = [
  'Abjuration', 'Conjuration', 'Divination',
  'Enchantment', 'Evocation', 'Illusion',
  'Necromancy', 'Transmutation'
];

const DURATION_OPTIONS = [
  'Instantaneous', 'Concentration, up to 1 minute',
  'Concentration, up to 10 minutes',
  '1 minute', '10 minutes', '1 hour',
  '8 hours', '24 hours', 'Until dispelled'
];

const COMPONENT_OPTIONS = ['V', 'S', 'M'];

const ATTACK_SAVE_OPTIONS = [
  '',
  'Melee', 'Ranged', 'Spell Attack',
  'STR Save', 'DEX Save', 'CON Save',
  'INT Save', 'WIS Save', 'CHA Save'
];

const DAMAGE_DIE_OPTIONS = [
  '',
  'd4', 'd6', 'd8', 'd10', 'd12'
]

const DAMAGE_EFFECT_OPTIONS = [
  '', 
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force',
  'Lightning', 'Necrotic', 'Piercing', 'Poison',
  'Psychic', 'Radiant', 'Slashing', 'Thunder',
  'Control', 'Buff', 'Debuff', 'Utility'
];


function SpellForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    level: 0,
    school: '',
    castingTime: '',
    range: '',
    components: [],
    duration: '',
    description: '',
    attackSave: '',
    damageEffect: '',
    dieAmount: 0,
    damageDie: '',
    ...initialData,
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = e => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, range: value }));
  };

  const handleComponentChange = e => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updated = checked
        ? [...prev.components, value]
        : prev.components.filter(c => c !== value);
      return { ...prev, components: updated };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const finalData = {
      ...formData,
      level: Number(formData.level),
      range: `${formData.range} ft`,
    };

    onSubmit(finalData).catch(err => {
      const msg = err.response?.data?.message || 'Failed to save spell';
      setError(msg);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input name="name" value={formData.name} onChange={handleChange} required />

      <label>Level:</label>
      <input name="level" type="number" value={formData.level} onChange={handleChange} required />

      <label>School:</label>
      <select name="school" value={formData.school} onChange={handleChange} required>
        <option value="">-- Select School --</option>
        {SCHOOL_OPTIONS.map(school => (
          <option key={school} value={school}>{school}</option>
        ))}
      </select>

      <label>Casting Time:</label>
      <input name="castingTime" value={formData.castingTime} onChange={handleChange} />

      <label>Range (in feet):</label>
      <input name="range" type="number" value={formData.range} onChange={handleRangeChange} />

      <label>Components:</label>
      <div>
        {COMPONENT_OPTIONS.map(component => (
          <label key={component} style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              value={component}
              checked={formData.components.includes(component)}
              onChange={handleComponentChange}
            />
            {component}
          </label>
        ))}
      </div>

      <label>Attack / Save:</label>
      <select name="attackSave" value={formData.attackSave} onChange={handleChange}>
        {ATTACK_SAVE_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <label>Die Amount:</label>
      <input name="dieAmount" type="number" value={formData.dieAmount} onChange={handleChange} />

      <label>Damage Die:</label>
      <select name="damageDie" value={formData.damageDie} onChange={handleChange}>
        {DAMAGE_DIE_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <label>Damage / Effect:</label>
      <select name="damageEffect" value={formData.damageEffect} onChange={handleChange}>
        {DAMAGE_EFFECT_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <label>Duration:</label>
      <select name="duration" value={formData.duration} onChange={handleChange}>
        <option value="">-- Select Duration --</option>
        {DURATION_OPTIONS.map(duration => (
          <option key={duration} value={duration}>{duration}</option>
        ))}
      </select>

      <label>Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} rows={4} />

      <button type="submit">{isEdit ? 'Update' : 'Create'} Spell</button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default SpellForm;
