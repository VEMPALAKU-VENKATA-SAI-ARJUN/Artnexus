import React, { useState } from "react";
import axios from "axios";
import "../components/styles/Auth.css"; // use the CSS you shared earlier

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    profilePicture: ""
  });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      bio: "",
      profilePicture: ""
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup ? "/api/users/register" : "/api/users/login";
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };
      const res = await axios.post(url, payload, { withCredentials: true });
      console.log(res.data);
      alert(`✅ ${isSignup ? "Signup" : "Login"} successful!`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-box ${isSignup ? "active" : ""}`}>
        <h1>ArtNexus</h1>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Bio (optional)</label>
                <input
                  type="text"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Profile Picture URL (optional)</label>
                <input
                  type="text"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                />
              </div>
              <div className="role-selection">
                <label>Select Role:</label>
                <div className="role-buttons">
                  {["user", "buyer", "moderator", "admin"].map((roleOption) => (
                    <button
                      type="button"
                      key={roleOption}
                      className={formData.role === roleOption ? "active" : ""}
                      onClick={() => setFormData({ ...formData, role: roleOption })}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <div className="toggle-link">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={toggleMode}>{isSignup ? "Login" : "Sign Up"}</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
