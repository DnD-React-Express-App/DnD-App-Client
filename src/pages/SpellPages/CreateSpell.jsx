import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { SpellContext } from '../../context/spell.context';
import SpellForm from '../../components/SpellComponents/SpellForm';

function CreateSpell() {
  const navigate = useNavigate();
  const { addSpell } = useContext(SpellContext);

  const handleCreate = (newSpellData) => {
    return addSpell(newSpellData)
      .then(() => {
        navigate('/spells');
      });
  };

  return (
    <div>
      <h2>Create a New Spell</h2>
      <SpellForm onSubmit={handleCreate} />
      <Link to="/spells">Back</Link>
    </div>
  );
}

export default CreateSpell;
