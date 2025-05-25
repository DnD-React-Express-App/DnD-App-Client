import React from 'react';
import { Link } from 'react-router-dom';

const SpellDetails = ({ spell, onDelete }) => {
  if (!spell) return <p>Spell not found.</p>;

  return (
    <div className="border rounded-xl p-6 shadow-md">
      <h1 className="text-3xl font-bold mb-2">{spell.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <p><strong>Level:</strong> {spell.level}</p>
        <p><strong>School:</strong> {spell.school}</p>
        <p><strong>Casting Time:</strong> {spell.castingTime}</p>
        <p><strong>Range:</strong> {spell.range}</p>
        <p><strong>Duration:</strong> {spell.duration}</p>
        <p><strong>Components:</strong> {spell.components?.join(', ')}</p>
        <p><strong>Attack/Save:</strong> {spell.attackSave}</p>
        <p><strong>Damage/Effect:</strong> {spell.damageEffect}</p>
      </div>

      <p className="mt-4">{spell.description}</p>

      <div className="mt-6 flex gap-4">
        <Link to={`/spells/edit/${spell._id}`} className="text-blue-600 underline">Edit</Link>
        <button onClick={onDelete} className="text-red-600 underline">Delete</button>
        <Link to="/spells" className="text-gray-600 underline">Back to list</Link>
      </div>
    </div>
  );
};

export default SpellDetails;
