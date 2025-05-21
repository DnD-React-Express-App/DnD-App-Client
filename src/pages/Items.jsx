import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { getCharacters } from '../services/character.service';
import { Link } from 'react-router-dom';

function Items() {
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
    <div className="login-page">
      <h2>Welcome to the item page</h2>
      <p>This page will eventually show a full list of items.</p>
      <Link to="/items/create">Create a New Item</Link>
    </div>
  );
}

export default Items;