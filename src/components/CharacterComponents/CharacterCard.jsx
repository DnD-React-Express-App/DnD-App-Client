import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCharacter, toggleSharedCharacter } from '../../services/character.service';
import '../../List.css';
import { toast } from 'react-hot-toast';

const CharacterCard = ({ character, onShare, onDelete, onSave, currentUserId, savedCharacterIds }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/characters/${character._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        await deleteCharacter(character._id);
        if (onDelete) onDelete(character._id);
        toast.success('Deleted character!')
      } catch (err) {
        console.error('Error deleting character:', err);
        toast.error('Failed to delete character.');
      }
    }
  };

  const handleToggleShare = async (e) => {
    e.stopPropagation();
    const newSharedStatus = !character.shared;

    try {
      const updated = await toggleSharedCharacter(character._id, newSharedStatus);
      toast.success(updated.data.shared ? 'Character shared!' : 'Character unshared.');

      if (onShare) onShare(updated.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to share character.');
    }
  };



  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/characters/${character._id}/edit`);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (onSave) onSave(character._id);
  };

  const userIdFromCharacter = character.user
    ? typeof character.user === 'object'
      ? character.user._id
      : character.user
    : null;

  const isOwner = userIdFromCharacter === currentUserId;

  const isAlreadySaved = savedCharacterIds?.has(character._id);

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h2>{character.name}</h2>

      <div
        style={{
          width: '250px',
          height: '250px',
          overflow: 'hidden',
          borderRadius: '8px',
          margin: '0 auto',
        }}
      >
        <img
          src={character.imageUrl}
          alt="Character"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
      </div>

      <p><strong>Race:</strong> {character.race}</p>
      <p><strong>Level:</strong> {
        character.classes.reduce((total, c) => total + c.level, 0)
      }</p>
      <p><strong>Class:</strong> {character.classes.map(c => `${c.name} (${c.level})`).join(', ')}</p>

      {/* Action buttons */}
      <div className="actions" style={{ marginTop: '10px' }}>
        <button onClick={handleEdit}>Edit</button>

        {onDelete && <button onClick={handleDelete}>Delete</button>}

        {onShare && isOwner && !character.originalCharacterId && (
          <button onClick={handleToggleShare}>
            {character.shared ? 'Unshare' : 'Share to Community'}
          </button>
        )}

        {onSave && userIdFromCharacter !== currentUserId && (
          isAlreadySaved ? (
            <button disabled>Saved</button>
          ) : (
            <button onClick={handleSave}>Save to My Characters</button>
          )
        )}


      </div>

      {character.user?.name && (
        <p style={{ fontSize: '0.9rem', color: 'gray' }}>
          Created by: {character.user.name}
        </p>
      )}
    </div>
  );
};

export default CharacterCard;
