import React, { useState } from "react";
import PropTypes from "prop-types";
import "@fontsource/poppins"; // Defaults to 400 weight
import "./profileStyles.css"; // Import the new stylesheet

const GitHubProfile = () => {
  const [username, setUsername] = useState(""); // Input username
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stars, setStars] = useState(0); // State to store total stars

  async function getTotalStars(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      console.log(`Total stars for ${username}: ${totalStars}`);
      return totalStars;
    } catch (error) {
      console.error(`Failed to fetch repos for ${username}:`, error);
      return 0; // Return 0 stars on error
    }
  }

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setProfileData(data);

      // Fetch total stars for the user
      const totalStars = await getTotalStars(username);
      setStars(totalStars);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const revealPercentage = Math.min((stars / 30) * 100, 100); // Max 100%

  return (
    <div className="container">
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <button onClick={fetchProfile} className="button">
          Fetch Profile
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {stars >= 1 && (
        <div className="avatarContainer">
          <img
            src={profileData.avatar_url}
            alt={`${profileData.login}'s avatar`}
            className="avatar"
            style={{
              clipPath: `inset(${100 - revealPercentage}% 0 0 0)`, // Reveal based on stars
            }}
          />
        </div>
      )}
    </div>
  );
};

GitHubProfile.propTypes = {
  username: PropTypes.string,
};

export default GitHubProfile;
