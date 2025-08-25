import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");  // Clear any previous error
    setLoading(true);

    try {
      const { name, username, email, password, role } = formData;
      const { data } = await axios.post("https://artnexus-backend-60fj.onrender.com/api/auth/register", {
        name,
        username,
        email,
        password,
        role,
      });
      localStorage.setItem("user", JSON.stringify(data));  // Save user to localStorage
      alert("Signup successful!");
      navigate("/");  // Redirect to homepage
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(errorMessage);  // Set the error message to show in the UI
      console.error("Signup error:", errorMessage);
    } finally {
      setLoading(false);  // Stop loading spinner
    }
  };

  return (
    <div className="signup-page">
      <div className="topp">
        <h1>ArtNexus</h1>
        <p>
          Welcome to the ultimate platform for discovering and sharing amazing
          artwork. Join us and showcase your creativity!
        </p>
      </div>

      <div className="auth-container">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Full Name"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            aria-label="Username"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Email Address"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-label="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-label="Confirm Password"
          />

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="artist"
                checked={formData.role === "artist"}
                onChange={handleChange}
              />
              artist
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={formData.role === "buyer"}
                onChange={handleChange}
              />
              buyer
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="moderator"
                checked={formData.role === "moderator"}
                onChange={handleChange}
              />
              moderator
            </label>
          </div>

          <button type="submit" disabled={loading} aria-label="Register">
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
