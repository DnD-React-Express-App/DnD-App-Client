import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { getCharacters } from '../../services/character.service';
import CharacterList from '../../components/CharacterComponents/CharacterList';
import CharacterForm from '../../components/CharacterComponents/CharacterForm';

const classTabs = [
  'All', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

function Characters() {
  const { isLoggedIn, user, isLoading } = useContext(AuthContext);
  const [characters, setCharacters] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClassTabs, setActiveClassTabs] = useState([]);


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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCharacters = characters
    .filter((char) =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((char) =>
      activeClassTabs.length === 0
        ? true
        : activeClassTabs.every(selectedClass =>
            char.classes.some(c => c.name === selectedClass)
          )
    )    

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
        <>
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search characters by name..."
            style={{ margin: '1rem 0', padding: '0.5rem' }}
          />

          {/* Class Tabs */}
          <div className="tabs" style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveClassTabs([])}
              style={{
                marginRight: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeClassTabs.length === 0 ? '' : 'black',
                border: '1px solid #aaa',
                cursor: 'pointer'
              }}
            >
              All
            </button>

            {classTabs.slice(1).map((cls) => {
              const isSelected = activeClassTabs.includes(cls);
              return (
                <button
                  key={cls}
                  onClick={() => {
                    setActiveClassTabs(prev =>
                      isSelected
                        ? prev.filter(c => c !== cls)
                        : [...prev, cls]
                    );
                  }}
                  style={{
                    marginRight: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: isSelected ? 'black' : '',
                    border: '1px solid #aaa',
                    cursor: 'pointer'
                  }}
                >
                  {cls}
                </button>
              );
            })}
          </div>


          {/* Character List */}
          <CharacterList
            characters={filteredCharacters}
            onDelete={(deletedId) =>
              setCharacters((prev) => prev.filter((c) => c._id !== deletedId))
            }
          />
        </>
      )}
    </div>
  );
}

export default Characters;
