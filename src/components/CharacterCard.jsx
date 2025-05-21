import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CharacterCard.css';

const CharacterCard = ({ character }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/characters/${character._id}`);
  };

  return (
    <div className="character-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h2>{character.name}</h2>
      <p><strong>Race:</strong> {character.race}</p>
      <p><strong>Level:</strong> {character.level}</p>
      <p><strong>Class:</strong> {character.classes.map(c => `${c.name} ${c.level}`).join(', ')}</p>
      <p><strong>STR:</strong> {character.stats.strength}</p>
    </div>
  );
};

export default CharacterCard;