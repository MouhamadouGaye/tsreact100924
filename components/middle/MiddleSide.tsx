import React, { useEffect, useState } from "react";
// import MediaPost from "./media/MediaPost";
// import PostHead from "./posthead/PostHead";
// import { CgEditFade } from "react-icons/cg";

// const MiddleSide = ({ user }) => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   async function fetchData() {
//     try {
//       const response = await fetch("http://localhost:3006/posts");
//       const contentType = response.headers.get("content-type");

//       if (contentType && contentType.includes("application/json")) {
//         const data = await response.json();

//         const updatedPosts = data.map((post) => ({
//           ...post,
//           media: post.media
//             ? JSON.parse(post.media).map((media, index) => {
//                 const extension = media.split(".").pop().toLowerCase();
//                 let type;

//                 if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
//                   type = "image";
//                 } else if (["mp4", "avi", "mov", "mkv"].includes(extension)) {
//                   type = "video";
//                 } else {
//                   type = "unknown";
//                 }

//                 return {
//                   url: `http://localhost:3006${media}`,
//                   type: type,
//                   id: `${post.post_id}-${index}`,
//                 };
//               })
//             : [],
//         }));

//         setPosts(updatedPosts);
//       } else {
//         throw new Error("Unexpected response format");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleNewPost = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts]);
//   };

//   const handleDeletePost = (postId) => {
//     setPosts((prevPosts) =>
//       prevPosts.filter((post) => post.post_id !== postId)
//     );
//   };

//   if (loading) {
//     return <p>Loading posts...</p>;
//   }

//   if (error) {
//     return <p>Error loading posts: {error}</p>;
//   }

//   return (
//     <div className="middle">
//       {user && (
//         <PostHead
//           user={{
//             name: user.name || "Anonymous",
//             pseudo: user.pseudo || "Guest",
//             profile_photo: user.profile_photo
//               ? `http://localhost:3006/uploads/${user.profile_photo}`
//               : "/path/to/default/photo.jpg",
//           }}
//           onNewPost={handleNewPost} // Pass the handler
//         />
//       )}

//       {posts && posts.length > 0 ? (
//         posts.map((post) => (
//           <MediaPost
//             key={post.post_id}
//             post_id={post.post_id}
//             content={post.content}
//             media={post.media}
//             author={{
//               name: post.name || "Unknown Author",
//               pseudo: post.pseudo || "No Pseudo",
//               profile_photo: post.profile_photo
//                 ? `http://localhost:3006${post.profile_photo}`
//                 : "http://localhost:3006/1732403161387_api.png",
//             }}
//             date={
//               post.created_at
//                 ? new Date(post.created_at).toLocaleDateString()
//                 : "Unknown Date"
//             }
//             user={user} // Pass user for additional context
//             onDelete={handleDeletePost} // Pass delete handler to MediaPost
//           />
//         ))
//       ) : (
//         <p>No posts available</p>
//       )}
//     </div>
//   );
// };

// export default MiddleSide;



import React, { useEffect, useState } from "react";
import MediaPost from "./media/MediaPost";
import PostHead from "./posthead/PostHead";

// Define types for post media
interface Media {
  url: string;
  type: "image" | "video" | "unknown";
  id: string;
}

// Define types for a post
interface Post {
  post_id: number;
  content: string;
  media: Media[];
  name?: string;
  pseudo?: string;
  profile_photo?: string;
  created_at?: string;
}

// Define types for user
interface User {
  user_id: number;
  name?: string;
  pseudo?: string;
  profile_photo?: string;
}

// Define props for MiddleSide
interface MiddleSideProps {
  user: User | null;
}

const MiddleSide: React.FC<MiddleSideProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]); // State for posts
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch posts data
  async function fetchData() {
    try {
      const response = await fetch("http://localhost:3006/posts");
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        const updatedPosts: Post[] = data.map((post: any) => ({
          ...post,
          media: post.media
            ? JSON.parse(post.media).map((media: string, index: number) => {
                const extension = media.split(".").pop().toLowerCase();
                let type: "image" | "video" | "unknown";

                if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
                  type = "image";
                } else if (["mp4", "avi", "mov", "mkv"].includes(extension)) {
                  type = "video";
                } else {
                  type = "unknown";
                }

                return {
                  url: `http://localhost:3006${media}`,
                  type: type,
                  id: `${post.post_id}-${index}`,
                };
              })
            : [],
        }));

        setPosts(updatedPosts);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <div className="middle">
      {/* Display user-specific actions or information */}
      {user && (
        <PostHead
          user={{
            name: user.name || "Anonymous",
            pseudo: user.pseudo || "Guest",
            profile_photo: user.profile_photo
              ? `http://localhost:3006/uploads/${user.profile_photo}`
              : "/path/to/default/photo.jpg",
          }}
        />
      )}

      {/* Render posts */}
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <MediaPost
            key={post.post_id}
            post_id={post.post_id}
            content={post.content}
            media={post.media}
            author={{
              name: post.name || "Unknown Author",
              pseudo: post.pseudo || "No Pseudo",
              profile_photo: post.profile_photo
                ? `http://localhost:3006${post.profile_photo}`
                : "http://localhost:3006/1732403161387_api.png",
            }}
            date={
              post.created_at
                ? new Date(post.created_at).toLocaleDateString()
                : "Unknown Date"
            }
            user={user} // Pass user for additional context
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default MiddleSide;

/// ts underneath
