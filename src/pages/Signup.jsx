import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/auth.service';
import { AuthContext } from '../context/auth.context';

function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { storeToken, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    signup(email, password, name)
      .then((res) => {
        storeToken(res.data.authToken);
        authenticateUser();
        navigate('/characters');
      })
      .catch((err) => {
        const message =
          err.response?.data?.message || 'Something went wrong during signup.';
        setErrorMessage(message);
      });
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create Account</button>
      </form>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Signup;
