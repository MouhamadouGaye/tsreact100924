import React, { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { AiOutlineFileImage } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";
import "./PostHead.css";

// Define types for user
interface User {
  user_id: number;
  name?: string;
  pseudo?: string;
  profile_photo?: string;
}

// Define props for the component
interface CreatePostProps {
  user: User | null;
}

const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
  const [content, setContent] = useState<string>(""); // Post content
  const [media, setMedia] = useState<File | null>(null); // Selected media file
  const [mediaPreview, setMediaPreview] = useState<string>(""); // Preview for the selected media
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); // Emoji picker visibility state
  const emojiPickerRef = useRef<HTMLDivElement | null>(null); // Ref for emoji picker

  // Handle emoji selection
  const onEmojiClick = (event: EmojiClickData) => {
    const selectedEmoji = event.emoji;
    if (selectedEmoji) {
      setContent((prevContent) => prevContent + selectedEmoji);
      setShowEmojiPicker(false);
    } else {
      console.warn("Emoji object is undefined or does not contain an emoji.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is authenticated
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", String(user.user_id)); // Add user ID for the post
    if (media) {
      formData.append("media", media); // Add media if available
    }

    try {
      // Make the POST request
      await axios.post(
        "http://localhost:3006/posts", // Endpoint for creating posts
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
            Authorization: `Bearer ${token}`, // Bearer token for authorization
          },
        }
      );

      // Handle successful post creation
      alert("Post created successfully!");
      setContent(""); // Clear content input
      setMedia(null); // Clear media
      setMediaPreview(""); // Clear media preview
    } catch (error: any) {
      console.error("Error creating post:", error);

      // Handle error response from the backend
      if (error.response) {
        const responseError = error.response.data.message || "An error occurred.";
        if (error.response.status === 403 && responseError.includes("Invalid or expired token")) {
          alert("Your session has expired. Please log in again.");
          window.location.href = "/signin"; // Redirect to login
        } else {
          alert(`An error occurred: ${responseError}`);
        }
      } else {
        alert("Network error: Unable to create post.");
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMedia(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview("");
    }
  };

  // Close emoji picker when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            className="post-head-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
        <div className="media-emoji-container" style={{ position: "relative" }}>
          <div className="left-btn">
            <div className="btn file-btn">
              <label>
                <AiOutlineFileImage size={25} style={{ cursor: "pointer" }} />
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {media && (
              <div style={{ marginTop: "10px" }}>
                {mediaPreview ? (
                  <img
                    src={mediaPreview}
                    alt="Selected media"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                ) : (
                  <p>Selected file: {media.name}</p>
                )}
              </div>
            )}

            <div className="emoji btn">
              <BsEmojiSmile
                size={25}
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />

              {showEmojiPicker && (
                <div className="emoji-picker btn" ref={emojiPickerRef}>
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    height={400}
                    width={300}
                  />
                </div>
              )}
            </div>
          </div>

          <button className="btn-head-post btn" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
