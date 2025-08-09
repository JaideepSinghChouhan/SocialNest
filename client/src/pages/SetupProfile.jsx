import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetupProfile = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.put("/api/users/profile/update", { bio, avatar, coverImage });
      navigate("/home"); // Redirect to main feed
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Customize Your Profile</h1>

      <input
        type="text"
        placeholder="Bio (max 150 chars)"
        className="border p-2 w-full max-w-md"
        maxLength={150}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <input
        type="text"
        placeholder="Avatar Image URL"
        className="border p-2 w-full max-w-md"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />

      <input
        type="text"
        placeholder="Cover Image URL"
        className="border p-2 w-full max-w-md"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save and Continue
      </button>
    </div>
  );
};

export default SetupProfile;
