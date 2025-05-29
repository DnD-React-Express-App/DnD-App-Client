import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { useNavigate } from 'react-router-dom';
import CharacterList from '../../components/CharacterComponents/CharacterList';
import {
    getSharedCharacters,
    saveSharedCharacter,
    getCharacters
} from '../../services/character.service';

function SharedCharacters() {
    const { isLoading, isLoggedIn, user } = useContext(AuthContext);
    const [sharedCharacters, setSharedCharacters] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [savedCharacterIds, setSavedCharacterIds] = useState(new Set());

    useEffect(() => {
        const fetchData = async () => {
          try {
            // 1. Fetch user's saved characters
            const userChars = await getCharacters();
            const originals = userChars.data
              .filter(c => c.originalCharacterId)
              .map(c => c.originalCharacterId);
            setSavedCharacterIds(new Set(originals));
      
            // 2. Fetch shared characters
            const sharedChars = await getSharedCharacters();
            setSharedCharacters(sharedChars.data);
          } catch (err) {
            console.error('Failed to load characters:', err);
            setErrorMessage('Could not load characters.');
          } finally {
            setLoading(false); 
          }
        };
      
        fetchData();
      }, []);

      const handleSave = async (id) => {
        try {
          await saveSharedCharacter(id);
          alert('Character saved to your list!');
          setSavedCharacterIds(prev => new Set(prev).add(id)); 
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

            <CharacterList
                characters={sharedCharacters}
                onSave={handleSave}
                currentUserId={user._id}
                savedCharacterIds={savedCharacterIds}
            />

        </div>
    );
}

export default SharedCharacters;
