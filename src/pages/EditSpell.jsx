import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SpellContext } from '../context/spell.context';
import SpellForm from '../components/SpellForm';

const EditSpell = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spells, updateSpell, isLoading } = useContext(SpellContext);
  const [spell, setSpell] = useState(null);

  useEffect(() => {
    const found = spells.find(sp => sp._id === id);
    setSpell(found);
  }, [spells, id]);

  const handleUpdate = async (updatedData) => {
    await updateSpell(id, updatedData);
    navigate(`/spells/${id}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!spell) return <p>Spell not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Spell</h1>
      <SpellForm initialData={spell} onSubmit={handleUpdate} isEdit />
    </div>
  );
};

export default EditSpell;
