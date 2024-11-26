import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./signIn.css";

interface SignInProps {
  onSignIn: (user: UserMetadata) => void;
}

interface FormData {
  email: string;
  password: string;
}

interface UserMetadata {
  name: string;
  email: string;
  [key: string]: any; // Add additional fields as needed
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3006/api/auth/signin", // Replace with your API URL
        formData,
        { withCredentials: true } // Required for sending cookies
      );

      const token: string = response.data.token;
      const user: UserMetadata = response.data.user; // Assume the backend sends user metadata under "user"

      if (token && user) {
        // Save token and user metadata in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage(response.data.message || "Sign-in successful!");
        setIsAuthenticated(true);
        setUserMetadata(user);
        onSignIn(user); // Pass the metadata to the parent component
      } else {
        setMessage("Authentication failed, please try again.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error signing in");
    }
  };

  const handleSignOut = () => {
    // Clear authentication state and local storage when signing out
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMessage("Successfully signed out.");
    setUserMetadata(null);
  };

  return (
    <div className="auth-container">
      <h2>
        {isAuthenticated
          ? `Welcome Back, ${userMetadata?.name || "User"}!`
          : "Sign In"}
      </h2>

      {isAuthenticated ? (
        <div className="signout-section">
          <p>You are signed in.</p>
          <p>Email: {userMetadata?.email}</p> {/* Display user metadata */}
          <button onClick={handleSignOut} className="signout-btn">
            Sign Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="signin-form">
          {message && <p className="message">{message}</p>}

          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="current-email"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="btn-signin">
            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </div>
          <a href="/signup">Subscription ?</a>
        </form>
      )}
    </div>
  );
};

export default SignIn;
