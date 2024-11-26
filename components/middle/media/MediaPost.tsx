import React from "react";
import "./MediaPost.css";
import Post from "../comments/Post";

// Define types for author and media
interface Author {
  name?: string;
  pseudo?: string;
  profile_photo?: string;
}

interface MediaItem {
  url: string;
  type: "image" | "video" | "unknown";
  id: string;
}

// Define props for the component
interface MediaPostProps {
  content: string;
  media: MediaItem[];
  author: Author;
  date: string;
  post_id: number;
  user: {
    user_id: number;
    name?: string;
    pseudo?: string;
    profile_photo?: string;
  } | null;
}

const MediaPost: React.FC<MediaPostProps> = ({
  content,
  media,
  author,
  date,
  post_id,
  user,
}) => {
  return (
    <div className="post-template">
      <div className="top-profile-details">
        {/* Display author's profile details */}
        <img
          className="profile-photo"
          src={
            author.profile_photo ||
            "http://localhost:3006/uploads/1732403161387_api.png"
          } // Use author's profile photo or fallback
          alt={`${author.name || "Author"}'s profile`}
        />
        <h4 className="profile-pseudo">@{author.pseudo || "Unknown"}</h4>
        <p className="post-date">{date || "Unknown Date"}</p>
      </div>

      {/* Render post content and media */}
      <Post
        content={content}
        media={media}
        post_id={post_id}
        user={user}
        author={author}
      />
    </div>
  );
};

export default MediaPost;
