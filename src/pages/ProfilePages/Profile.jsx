import UserDetails from '../../components/UserComponents/UserDetails';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <div className="profile-page">
      <UserDetails />
      <Link to="/profile/edit">Edit Profile</Link>
    </div>
  );
}

export default Profile;