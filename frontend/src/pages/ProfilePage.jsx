// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User, Edit3, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
    profilePic: authUser?.profilePic || '',
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setFormData(prev => ({ ...prev, profilePic: base64Image }));
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Fields cannot be empty");
      return;
    }
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-base-300 rounded-xl p-8 space-y-8 shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="mt-2 text-base text-base-content/60">Your profile information</p>
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-base-200"
              />
              <label htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer shadow-lg
                hover:scale-105 transition-transform duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}>
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60 text-center mt-2">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo."}
            </p>
          </div>

          {/* Info section */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className='size-4' /> Full Name
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input input-bordered w-full"
                />
              ) : (
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className='size-4' /> Email Address
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input input-bordered w-full"
                />
              ) : (
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              {isEditing ? (
                <button onClick={handleSave} className="btn btn-success btn-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> Save
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm flex items-center gap-1">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;