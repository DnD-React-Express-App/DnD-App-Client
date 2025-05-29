import { useContext } from 'react';
import { AuthContext } from '../../context/auth.context';

function UserDetails() {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) return <p>Loading...</p>;
  if (!isLoggedIn) return <p>You must be logged in to view this content.</p>;

  console.log("User in context:", user);

  return (
    <div className="user-details">
      <h2>My Profile</h2>
      <img src={user.imageUrl} alt="Profile" />
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>User ID:</strong> {user?._id}</p>
    </div>
  );
}

export default UserDetails;
