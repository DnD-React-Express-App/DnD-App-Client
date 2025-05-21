import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { getCharacters } from '../services/character.service';
import CharacterList from '../components/CharacterList';
import CharacterForm from '../components/CharacterForm';

function Characters() {
  const { isLoggedIn, user, isLoading } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getCharacters()
      .then((res) => setCharacters(res.data))
      .catch((err) => {
        console.error('Error fetching characters:', err);
        setErrorMessage('Failed to load characters.');
      });
  }, []);

  const handleSuccess = (newCharacter) => {
    setCharacters((prev) => [...prev, newCharacter]);
    setShowForm(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!isLoggedIn) return <p>You must be logged in to view characters.</p>;

  return (
    <div>
      <h2>{user?.name}'s Characters</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Back to List' : 'Create New Character'}
      </button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {showForm ? (
        <CharacterForm onSuccess={handleSuccess} />
      ) : (
        <CharacterList
          characters={characters}
          onDelete={(deletedId) =>
            setCharacters((prev) => prev.filter((c) => c._id !== deletedId))
          }
        />
      )}
    </div>
  );
}

export default Characters;
