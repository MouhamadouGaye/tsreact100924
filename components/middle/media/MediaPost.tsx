// export default MediaPost;

// import React from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "./MediaPost.css";
// import Post from "../comments/Post";

// const MediaPost = ({
//   content,
//   media,
//   author,
//   date,
//   post_id,
//   user,
//   onDelete,
// }) => {
//   // Ensure media is an array
//   const token = localStorage.getItem("token");

//   const deletePost = async () => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:3006/posts/${post_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         toast.success(response.data.message); // Show success message
//         onDelete(post_id); // Notify parent to update the posts list
//       }
//     } catch (error) {
//       if (error.response) {
//         if (error.response.status === 403) {
//           toast.error("You are not authorized to delete this post.");
//         } else if (error.response.status === 404) {
//           toast.error("Post not found.");
//         } else {
//           toast.error("An error occurred while deleting the post.");
//         }
//       } else {
//         console.error("Error deleting post:", error);
//         toast.error("Unable to connect to the server.");
//       }
//     }
//   };

//   return (
//     <div className="post-template">
//       <div className="top-profile-details">
//         <img
//           className="profile-photo"
//           src={
//             author.profile_photo ||
//             "http://localhost:3006/uploads/default_profile.png"
//           }
//           alt={`${author.name}'s profile`}
//         />
//         <h4 className="profile-pseudo">@{author.pseudo || "Unknown"}</h4>

//         <div className="post-date">
//           <span
//             onClick={() => {
//               const confirmation = window.confirm(
//                 "Are you sure you want to delete this post?"
//               );
//               if (confirmation) deletePost();
//             }}
//           >
//             ●●●
//           </span>

//           {date || "Unknown Date"}
//         </div>
//       </div>

//       <Post
//         content={content}
//         media={media}
//         post_id={post_id}
//         user={user}
//         author={author}
//       />
//     </div>
//   );
// };

// export default MediaPost;










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
