import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SpellContext } from '../../context/spell.context';
import SpellDetails from '../../components/SpellComponents/SpellDetails';

const SpellDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spells, deleteSpell, isLoading } = useContext(SpellContext);
  const [spell, setSpell] = useState(null);

  useEffect(() => {
    const found = spells.find(s => s._id === id);
    setSpell(found);
  }, [spells, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this spell?')) {
      await deleteSpell(id);
      navigate('/spells');
    }
  };

  if (isLoading) return <p>Loading spell...</p>;

  return (
    <div className="p-6">
      <SpellDetails spell={spell} onDelete={handleDelete} />
    </div>
  );
};

export default SpellDetailsPage;
