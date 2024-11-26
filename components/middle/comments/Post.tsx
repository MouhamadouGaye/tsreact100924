import React, { useState, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { PostIcons } from "../../../data";
import "./Post.css";
import axios from "axios";
import { toast } from "react-toastify";

// Define types for props and related data structures
interface MediaItem {
  url: string;
  type: "image" | "video" | "unknown";
}

interface Comment {
  content: string;
  author: string;
}

interface Author {
  name?: string;
  pseudo?: string;
  profile_photo?: string;
}

interface User {
  user_id: number;
  name?: string;
  pseudo?: string;
  profile_photo?: string;
}

interface PostProps {
  content: string;
  media: MediaItem[];
  post_id: number;
  user: User;
  author: Author;
}

const Post: React.FC<PostProps> = ({ content, media, post_id, user, author }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [shown, setShown] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [thumbUp, setThumbUp] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch initial post interaction counts
  useEffect(() => {
    const fetchPostInteractions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/posts/${post_id}`
        );
        const post = response.data;

        setLikeCount(post.likes || 0);
        setDislikeCount(post.dislikes || 0);
        setShareCount(post.shares || 0);
        setThumbUp(post.thumb_ups || 0);
      } catch (error) {
        console.error("Error fetching post interactions:", error);
      }
    };

    fetchPostInteractions();
  }, [post_id]);

  // Fetch comments when the comments section is shown
  useEffect(() => {
    const fetchComments = async () => {
      if (shown) {
        try {
          const response = await axios.get(
            `http://localhost:3006/posts/${post_id}/comments`
          );
          setComments(response.data); // Assuming response contains an array of comments
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    };

    fetchComments();
  }, [shown, post_id]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3006/posts/${post_id}/comments`,
          { content: newComment, user_id: user.user_id }
        );

        const newCommentData: Comment = response.data;
        setComments([...comments, newCommentData]); // Add new comment to the list
        setNewComment(""); // Clear input field
        toast.success("Comment added successfully!");
      } catch (error) {
        console.error("Error submitting comment:", error);
        toast.error("Failed to add comment.");
      }
    } else {
      toast.warn("Comment cannot be empty.");
    }
  };

  const handleIconClick = async (iconName: string) => {
    if (isProcessing) return; // Prevent duplicate clicks

    setIsProcessing(true); // Disable interactions temporarily
    try {
      const response = await axios.put(
        `http://localhost:3006/posts/${post_id}/${iconName}`,
        { user_id: user.user_id }
      );

      const updatedPost = response.data;

      // Update state based on response
      switch (iconName) {
        case "like":
          setLikeCount(updatedPost.likes);
          break;
        case "dislike":
          setDislikeCount(updatedPost.dislikes);
          break;
        case "thumbUp":
          setThumbUp(updatedPost.thumb_ups);
          break;
        case "share":
          setShareCount(updatedPost.shares);
          break;
        case "comments":
          setShown((prevShown) => !prevShown); // Toggle comments visibility
          break;
        default:
          console.error("Unknown iconName:", iconName);
      }
      toast.success(
        `${
          iconName.charAt(0).toUpperCase() + iconName.slice(1)
        } updated successfully!`
      );
    } catch (error) {
      toast.error(
        `An error occurred: ${error.response?.data?.error || "Unknown error"}`
      );
    } finally {
      setIsProcessing(false); // Re-enable interactions
    }
  };

  const totalCount = likeCount + thumbUp;

  return (
    <div className="post-infos">
      <p className="user-paragraph">{content}</p>
      <div className="post-media">
        {media.map((file, index) =>
          file.type === "image" ? (
            <img
              key={index}
              className="posted-images"
              src={file.url}
              alt="Post"
            />
          ) : file.type === "video" ? (
            <video
              key={index}
              className="posted-videos"
              src={file.url}
              controls
            />
          ) : null
        )}
      </div>
      <div className="post-icons">
        <h5 className="likes">
          {totalCount > 0 && (
            <span>
              {totalCount}
              {PostIcons.map((icon, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "16px",
                    color: "pink",
                  }}
                >
                  {likeCount && icon.name === "like" ? icon.element : ""}
                  {thumbUp && icon.name === "thumbUp" ? icon.element : ""}
                </span>
              ))}
            </span>
          )}
        </h5>
        <br />
        {PostIcons.map((icon, index) => (
          <div
            key={index}
            className="icon"
            onClick={() => handleIconClick(icon.name)}
          >
            {icon.element}

            {icon.name === "like" && likeCount > 0 && (
              <span className="icon-count"> {likeCount}</span>
            )}
            {icon.name === "dislike" && dislikeCount > 0 && (
              <span className="icon-count"> {dislikeCount}</span>
            )}

            {icon.name === "share" && shareCount > 0 && (
              <span className="icon-count"> {shareCount}</span>
            )}
            {icon.name === "thumbUp" && thumbUp > 0 && (
              <span className="icon-count"> {thumbUp}</span>
            )}
          </div>
        ))}
        <div
          className="icon"
          onClick={() => setShown((prevShown) => !prevShown)}
          style={{ cursor: "pointer" }}
        >
          <span>
            {PostIcons.find((icon) => icon.name === "comments")?.element}
          </span>
          <span className="icon-count">
            {comments.length > 0 && comments.length}
          </span>
        </div>
      </div>

      {shown && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div className="comment" key={index}>
                <div className="comment-author">
                  <img
                    className="profile-photo"
                    src={
                      user?.profile_photo
                        ? `http://localhost:3006${user.profile_photo}`
                        : author.profile_photo || ""
                    }
                    alt="author"
                  />
                </div>
                <div className="comment-text">
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="comment-input">
            <div className="comment-author">
              <img
                className="profile-photo"
                src={
                  user?.profile_photo
                    ? `http://localhost:3006${user.profile_photo}`
                    : author.profile_photo || ""
                }
                alt="author"
              />
            </div>
            <input
              type="text"
              placeholder="Write a comment..."
              className="input-field"
              value={newComment}
              onChange={handleCommentChange}
            />
            <button className="submit-button" onClick={handleCommentSubmit}>
              <BsSend style={{ backgroundColor: "transparent" }} /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
