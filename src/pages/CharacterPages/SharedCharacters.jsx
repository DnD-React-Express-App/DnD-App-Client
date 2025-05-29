import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import CharacterCard from '../../components/CharacterComponents/CharacterCard'; // or CharacterList if you prefer
import { useNavigate } from 'react-router-dom';
import {
    getSharedCharacters,
    saveSharedCharacter,
} from '../../services/character.service';

function SharedCharacters() {
    const { isLoading, isLoggedIn, user } = useContext(AuthContext);
    const [sharedCharacters, setSharedCharacters] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getSharedCharacters()
            .then(res => setSharedCharacters(res.data))
            .catch(err => {
                console.error('Failed to fetch shared characters:', err);
                setErrorMessage('Could not load shared characters');
            })
            .finally(() => setLoading(false));
    }, []);
    

    const handleSave = async (id) => {
        try {
            await saveSharedCharacter(id);
            alert('Character saved to your list!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error saving character.');
        }
    };


    if (!isLoggedIn) return <p>You must be logged in to view shared characters.</p>;
    if (isLoading || loading) return <p>Loading shared characters...</p>;

    return (
        <div>
            <h2>Community Characters</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}

            <div className="character-list">
                {sharedCharacters.length === 0 ? (
                    <p>No shared characters found.</p>
                ) : (
                    sharedCharacters.map(character => (
                        <div key={character._id} className="card">
                            <CharacterCard character={character} />

                            <p style={{ fontSize: '0.9rem', color: 'gray' }}>
                                Created by: {character.user?.name || 'Unknown'}
                            </p>

                            {character.user?._id !== user?._id && (
                                <button onClick={() => handleSave(character._id)}>
                                    Save to My Characters
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SharedCharacters;
