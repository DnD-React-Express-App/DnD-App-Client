import { useNavigate } from 'react-router-dom';
import { signup } from '../services/auth.service';
import UserForm from '../components/UserForm';

function Signup() {
  const navigate = useNavigate();

  const handleSignup = (formData) => {
    return signup(formData).then(res => {
      localStorage.setItem('authToken', res.data.authToken);
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
