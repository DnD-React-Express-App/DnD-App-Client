import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth.service';
import UserForm from '../../components/UserComponents/UserForm';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth.context';

function Signup() {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (formData) => {
    return signup(formData).then(res => {
      localStorage.setItem('authToken', res.data.authToken);
      authenticateUser();
      navigate('/profile');
    });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <UserForm onSubmit={handleSignup} />
    </div>
  );
}

export default Signup;
