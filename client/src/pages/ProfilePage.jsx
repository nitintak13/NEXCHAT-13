import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { fullName: name, bio };

    if (selectedImg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        await updateProfile({ ...payload, profilePic: reader.result });
        navigate("/");
      };
    } else {
      await updateProfile(payload);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1d2f] to-[#2c284d] text-white px-4">
      <div className="w-full max-w-3xl bg-violet-950 border border-gray-700 rounded-lg shadow-lg flex max-sm:flex-col items-center justify-between p-6 gap-6">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
          <h2 className="text-xl font-semibold">Edit Profile</h2>

          {/* Image upload */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer text-sm"
          >
            <input
              type="file"
              id="avatar"
              accept="image/png, image/jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              className="w-12 h-12 object-cover rounded-full border"
              alt="profile preview"
            />
            Upload Profile Image
          </label>

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            className="p-2 rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />

          {/* Bio input */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio..."
            rows={4}
            required
            className="p-2 rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
          ></textarea>

          {/* Save button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-violet-600 py-2 rounded-full font-medium text-lg hover:opacity-90 transition"
          >
            Save
          </button>
        </form>

        {/* Image Section */}
        <img
          src={
            selectedImg
              ? URL.createObjectURL(selectedImg)
              : authUser?.profilePic || assets.logo_icon
          }
          className="w-44 h-44 rounded-full object-cover max-sm:mt-5"
          alt="Current profile"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
