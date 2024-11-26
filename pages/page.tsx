import React from "react";
import "./Page.css";
import TopHeader from "../components/top/TopHeader";
import LeftSide from "../components/left/LeftSide";
import MiddleSide from "../components/middle/MiddleSide";
import RightSide from "../components/right/RightSide";

// Define types for the props
interface User {
  user_id: number;
  username: string;
  email: string;
  name?: string;
  pseudo?: string;
  profile_photo?: string;
  created_at: string;
}

interface Post {
  post_id: number;
  user_id: number;
  content: string;
  media?: string;
  created_at: string;
}

interface Interaction {
  id: number;
  user_id: number;
  post_id: number;
  action: string; // e.g., "like", "dislike", "thumb_up"
  created_at: string;
}

interface PageProps {
  user: User | null; // User object or null if not logged in
  posts: Post[]; // Array of posts
  interactions: Interaction[]; // Array of user interactions
  onSignOut: () => void; // Function to handle sign-out
}

const Page: React.FC<PageProps> = ({ user, posts, interactions, onSignOut }) => {
  return (
    <div className="container">
      {/* Pass user and sign-out functionality to the header */}
      <TopHeader user={user} onSignOut={onSignOut} />

      {/* Left side: Can display user-related info */}
      <LeftSide user={user} />

      {/* Middle side: Main area to display posts */}
      <MiddleSide user={user} posts={posts} interactions={interactions} />

      {/* Right side: Additional content like trending topics or suggestions */}
      <RightSide user={user} />
    </div>
  );
};

export default Page;
