import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { updateUser } from '../../services/user.service';
import UserForm from '../../components/UserComponents/UserForm';

function EditProfile() {
    const { user, storeToken, authenticateUser } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleUpdate = async (formData) => {
      try {
        const res = await updateUser(user._id, formData);
        storeToken(res.data.authToken);          
        await authenticateUser();                 
        navigate('/profile');
      } catch (err) {
        console.error('Profile update failed:', err);
      }
    };
  
    return (
      <div>
        <h2>Edit Your Profile</h2>
        <UserForm
          initialData={{ email: user.email, name: user.name, imageUrl: user.imageUrl }}
          onSubmit={handleUpdate}
          isEdit={true}
        />
      </div>
    );
  }
  
  export default EditProfile;
  
