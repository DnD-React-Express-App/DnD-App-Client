import React from 'react';
import '../CharacterCard.css'

const CharacterCard = ({ character }) => {
    return (
        <div className="character-card">
            <h2>{character.name}</h2>
            <p><strong>Race:</strong> {character.race}</p>
            <p><strong>Level:</strong> {character.level}</p>
            <p><strong>Class:</strong> {character.classes.map(c => `${c.name} ${c.level}`).join(', ')}</p>
            <p><strong>STR:</strong> {character.stats.strength}</p>
        </div>
    );
};

export default CharacterCard;