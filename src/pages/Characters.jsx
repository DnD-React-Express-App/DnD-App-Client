import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { getCharacters } from '../services/character.service';

function Characters() {
  const { isLoggedIn, user, isLoading } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getCharacters()
      .then((res) => setCharacters(res.data))
      .catch((err) => {
        console.error('Error fetching characters:', err);
        setErrorMessage('Failed to load characters.');
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!isLoggedIn) return <p>You must be logged in to view characters.</p>;

  return (
    <div>
      <h2>{user?.name}'s Characters</h2>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {characters.length > 0 ? (
        <ul>
          {characters.map((char) => (
            <li key={char._id}>
              <strong>{char.name}</strong> — Level{' '}
              {char.classes.reduce((acc, c) => acc + c.level, 0)}{' '}
              ({char.classes.map((c) => `${c.level} ${c.name}`).join(', ')})
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any characters yet.</p>
      )}
    </div>
  );
}

export default Characters;
