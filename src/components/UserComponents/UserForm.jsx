import React, { useEffect, useState } from 'react';
import { uploadImage } from '../../services/upload.service'; // Make sure path is correct

function UserForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    imageUrl: '',
    ...initialData,
  });

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch (err) {
      console.error('Image upload failed', err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData).catch(err => {
      const msg = err.response?.data?.message || 'Failed to submit';
      setError(msg);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Email:</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {!isEdit && (
        <>
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </>
      )}

      <label>Profile Image:</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>Uploading image...</p>}
      {formData.imageUrl && (
        <img
          src={formData.imageUrl}
          alt="Profile Preview"
          style={{ maxWidth: '100px', marginTop: '10px' }}
        />
      )}

      <button type="submit">{isEdit ? 'Update' : 'Sign Up'}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default UserForm;
