import React from 'react';
import CharacterCard from './CharacterCard';

const CharacterList = ({ characters }) => {
    if (!characters || characters.length === 0) {
        return <p>You don't have any characters yet.</p>;
    }

    return (
        <div>
            {characters.map((character) => (
                <CharacterCard key={character._id} character={character} />
            ))}
        </div>
    );
};

export default CharacterList;
