import React from 'react';
import CharacterCard from './CharacterCard';

const CharacterList = ({ characters, onDelete, onShare, onSave, currentUserId }) => {
    if (!characters || characters.length === 0) {
        return <p>You don't have any characters yet.</p>;
    }

    return (
        <div className="list">
            {characters.map((char) => (  
                <div key={char._id}>        
                    <CharacterCard
                        character={char}
                        onShare={onShare}
                        onDelete={onDelete}
                        onSave={onSave} 
                        currentUserId={currentUserId}
                    />
                </div>
            ))}
        </div>
    );
};

export default CharacterList;
