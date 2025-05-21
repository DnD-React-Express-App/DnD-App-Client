import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { login, verify } from '../services/auth.service';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { storeToken, authenticateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const requestBody = { email, password };

        login(email, password)
            .then((res) => {
                storeToken(res.data.authToken);
                return verify();
            })
            .then((res) => {
                authenticateUser();
                navigate('/characters');
            })
            .catch((err) => {
                const message =
                    err.response?.data?.message || 'Something went wrong';
                setErrorMessage(message);
            });
    };

    return (
        <div className="login-page">
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
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

                <button type="submit">Log In</button>
            </form>

            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

export default Login;
