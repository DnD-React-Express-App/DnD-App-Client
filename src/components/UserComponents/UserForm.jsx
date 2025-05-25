import React, { useEffect, useState } from 'react';

function UserForm({ initialData = {}, onSubmit, isEdit = false }) {
    const [formData, setFormData] = useState({
      email: '',
      name: '',
      password: '',
      ...initialData,
    });
  
    const [error, setError] = useState('');
  
    const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
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
  
        <button type="submit">{isEdit ? 'Update' : 'Sign Up'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    );
  }
  
  export default UserForm;
  