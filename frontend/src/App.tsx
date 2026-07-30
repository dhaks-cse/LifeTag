import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create" element={<CreateProfilePage />} />
      <Route path="/edit/:id" element={<EditProfilePage />} />
      <Route path="/profile/:id" element={<PublicProfilePage />} />
    </Routes>
  );
}

export default App;
