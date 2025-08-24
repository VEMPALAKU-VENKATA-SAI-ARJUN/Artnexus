// App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Moderator from "./pages/Moderator";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ModeratorRoute from "./components/ModeratorRoute";
import { useAuth } from "./context/Authcontext"; // ✅ Correct path
import MyPurchases from "./pages/MyPurchases";
import ArtworkDetails from "./pages/ArtworkDetails"; // ✅ Import missing component

const App = () => {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  const { user } = useAuth(); // ✅ Use context

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Redirect root to login or home based on user */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
        <Route path="/gallery/:id" element={<ProtectedRoute><ArtworkDetails /></ProtectedRoute>} />
        <Route path="/my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Moderator-only route */}
        <Route path="/moderator" element={<ModeratorRoute><Moderator /></ModeratorRoute>} />
      </Routes>
    </>
  );
};

export default App;
