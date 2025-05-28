import React from 'react';
import CharacterCard from './CharacterCard';
import '../../Character.css'

const CharacterList = ({ characters, onDelete }) => {
    if (!characters || characters.length === 0) {
        return <p>You don't have any characters yet.</p>;
    }

    return (
        <div className="list">
            {characters.map((char) => (
                <CharacterCard key={char._id} character={char} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default CharacterList;
