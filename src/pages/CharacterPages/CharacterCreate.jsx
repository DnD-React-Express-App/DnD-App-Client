import React from 'react';
import CharacterForm from '../../components/CharacterComponents/CharacterForm';
import { useNavigate } from 'react-router-dom';

const CharacterCreate = () => {
  const navigate = useNavigate();

  const handleSuccess = (createdCharacter) => {
    navigate('/characters');
  };

  return (
    <div>
      <h1>Create New Character</h1>
      <CharacterForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CharacterCreate;