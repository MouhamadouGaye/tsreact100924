import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { AiOutlineFileImage } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs"; // Emoji Icon
import EmojiPicker from "emoji-picker-react"; // Import emoji picker
import "./PostModal.css";

// Define User interface
interface User {
  user_id: number;
  username: string;
  email: string;
  name?: string;
  pseudo?: string;
  profile_photo?: string;
  created_at: string;
}

// Props interface for PostModal
interface PostModalProps {
  closeModal: () => void; // Function to close the modal
  user: User | null; // User object or null if not logged in
}

const PostModal: React.FC<PostModalProps> = ({ closeModal, user }) => {
  const [content, setContent] = useState<string>(""); // Post content
  const [media, setMedia] = useState<File[]>([]); // Uploaded media files
  const [mediaPreview, setMediaPreview] = useState<string>(""); // Media preview URL
  const [loading, setLoading] = useState<boolean>(false); // Loader state
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); // Toggle emoji picker
  const emojiPickerRef = useRef<HTMLDivElement>(null); // Reference to emoji picker

  // Handle text input changes
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setMedia((prev) => [...prev, ...files]);
  };

  // Handle emoji click
  const handleEmojiClick = (event: any, emojiObject: { emoji: string }) => {
    if (emojiObject && emojiObject.emoji) {
      setContent((prevContent) => prevContent + emojiObject.emoji);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
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
    formData.append("user_id", user.user_id.toString()); // Add user ID for the post
    media.forEach((file) => formData.append("media", file)); // Append all files

    setLoading(true); // Start loading

    try {
      // Make the POST request
      const response = await axios.post(
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

      // Reset fields
      setContent(""); // Clear content input
      setMedia([]); // Clear media
      setMediaPreview(""); // Clear media preview
      closeModal(); // Close the modal after successful post
    } catch (error: any) {
      console.error("Error creating post:", error);

      if (error.response) {
        const errorMessage = error.response.data?.error || "Please try again.";
        if (error.response.status === 403) {
          if (
            error.response.data.message ===
            "Forbidden (Invalid or expired token)"
          ) {
            alert("Your session has expired. Please log in again.");
            window.location.href = "/signin"; // Optionally, redirect to the login page
          } else {
            alert(`An error occurred: ${errorMessage}`);
          }
        } else {
          alert(`An error occurred: ${errorMessage}`);
        }
      } else {
        // Network error or other issues
        alert("Network error: Unable to create post.");
      }
    } finally {
      setLoading(false); // Stop loading after the request completes (success or failure)
    }
  };

  // Close emoji picker when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-modal-button">
          X
        </button>
        <h2 className="create-post-title">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            name="content"
            value={content}
            onChange={handleInputChange}
            placeholder="What's on your mind?"
            className="post-input"
            required
          />

          <div className="form-post">
            <div className="post-modal-icon">
              <label>
                <AiOutlineFileImage size={30} style={{ cursor: "pointer" }} />
                <input
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  className="file-input"
                  multiple
                />
              </label>

              <BsEmojiSmile
                size={30}
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              />

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  style={{ position: "absolute", zIndex: 1000 }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="submit-post-button"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
        {/* Display a loading spinner when posting */}
        {loading && <div className="loader">Posting...</div>}
      </div>
    </div>
  );
};

export default PostModal;
