import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCharacterById } from '../../services/character.service';
import CharacterForm from '../../components/CharacterComponents/CharacterForm';

const EditCharacter = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCharacterById(id)
      .then((res) => setCharacter(res.data))
      .catch((err) => console.error('Error loading character', err));
  }, [id]);

  const handleSuccess = (updatedCharacter) => {
    navigate(`/characters/${updatedCharacter._id}`);
  };

  if (!character) return <p>Loading character...</p>;

  return <CharacterForm initialData={character} onSuccess={handleSuccess} />;
};

export default EditCharacter;