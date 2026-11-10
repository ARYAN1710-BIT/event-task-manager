
import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) return null;

  const initial = user.username?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-cover"></div>

        <div className="profile-avatar">
          {initial}
        </div>

        <div className="profile-main">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <span className="profile-badge">EventFlow Member</span>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div className="profile-detail">
            <span>Email Address</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-detail">
            <span>User ID</span>
            <strong>{user.id}</strong>
          </div>

          {user.created_at && (
            <div className="profile-detail">
              <span>Account Created</span>
              <strong>
                {new Date(user.created_at).toLocaleDateString()}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
