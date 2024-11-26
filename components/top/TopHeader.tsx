import React, { useState } from "react";
import "./TopHeader.css";
import { BsSearch } from "react-icons/bs";
import { FaRegBell, FaRegEnvelope } from "react-icons/fa6";
import { BsChatRightDots, BsPlusSquareDotted } from "react-icons/bs";
import { PiSignOutBold } from "react-icons/pi";

// Define the User interface
interface User {
  user_id: number;
  username: string;
  email: string;
  name?: string;
  pseudo?: string;
  profile_photo?: string;
  created_at: string;
}

// Props interface for TopHeader
interface TopHeaderProps {
  user: User | null; // User object or null if not logged in
  onSignOut: () => void; // Function to handle user logout
}

const TopHeader: React.FC<TopHeaderProps> = ({ user, onSignOut }) => {
  // State for showing the sign-out button
  const [isShown, setIsShown] = useState<boolean>(false);

  return (
    <div className="top">
      <div className="top-header">
        {/* Left Side - Logo */}
        <div className="left-side">
          <h1 className="logo">MG'</h1>
        </div>

        {/* Middle - Search Bar */}
        <div className="middle-side">
          <input type="text" className="search-bar" placeholder="Recherche" />
          <BsSearch className="search-icon" />
        </div>

        {/* Right Side - Profile, Notifications, Messages, Menu */}
        <div className="right-side">
          <div className="icon">
            <FaRegBell />
          </div>
          <div className="icon">
            <FaRegEnvelope />
          </div>
          <div className="icon">
            <BsChatRightDots />
          </div>
          <div className="profile">
            {/* Display profile photo and name */}
            <img
              src={
                user?.profile_photo
                  ? `http://localhost:3006${user.profile_photo}`
                  : "/default-profile.png" // Fallback to default profile photo
              }
              alt="Profile"
              className="profile-pic"
            />
            <p>{user?.name || "Guest"}</p> {/* Fallback to 'Guest' */}
          </div>
          <div className="icon">
            <BsPlusSquareDotted onClick={() => setIsShown(!isShown)} />

            {isShown && (
              <div className="sign-out">
                <button onClick={onSignOut} className="sign-out-button">
                  <PiSignOutBold /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
