import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://localhost:5005/api/characters/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharacter(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch character details');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <p>Loading character...</p>;
  if (!character) return <p>Character not found</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{character.name}</h1>
      <p><strong>Race:</strong> {character.race}</p>
      <p><strong>Total Level:</strong> {character.level}</p>

      <h2>Classes</h2>
      <ul>
        {character.classes.map((cls, i) => (
          <li key={i}>{cls.name} (Level {cls.level})</li>
        ))}
      </ul>

      <h2>Stats</h2>
      <ul>
        {Object.entries(character.stats).map(([stat, value]) => (
          <li key={stat}><strong>{stat}:</strong> {value}</li>
        ))}
      </ul>

      <h2>Backstory</h2>
      <p>{character.backstory || <em>No backstory provided</em>}</p>
    </div>
  );
};

export default CharacterDetail;
