import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { confirmAlert, successAlert } from "@/lib/alert";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "edit", label: "Edit Profile" },
  { key: "password", label: "Password" },
];

const Profile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");

  /** ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const initialFormRef = useRef({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  /** ================= AVATAR ================= */
  const [avatarSaved, setAvatarSaved] = useState(null); // foto final
  const [avatarPreview, setAvatarPreview] = useState(null); // preview edit

  /** ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /** ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim()) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** ================= CHANGE DETECTOR ================= */
  const isChanged =
    form.name !== initialFormRef.current.name ||
    form.email !== initialFormRef.current.email ||
    form.phone !== initialFormRef.current.phone ||
    !!avatarPreview;

  /** ================= ACTION ================= */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmed = await confirmAlert({
      title: "Edit Profile?",
      text: "Yakin ingin menyimpan perubahan?",
      confirmText: "Ya",
    });

    if (!confirmed) return;

    // commit avatar
    if (avatarPreview) {
      setAvatarSaved(avatarPreview);
      setAvatarPreview(null);
    }

    // update baseline
    initialFormRef.current = { ...form };

    successAlert("Berhasil", "Profile berhasil diperbarui");
  };

  const handleCancelEdit = () => {
    setForm({ ...initialFormRef.current });
    setAvatarPreview(null);
    setErrors({});
  };

  /** ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 border-b">
          <Avatar className="h-20 w-20">
            {avatarSaved ? (
              <img
                src={avatarSaved}
                alt="Avatar"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {user?.role === "SUPERADMIN" ? "Super Admin" : "Event Admin"}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition
                ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-2 text-sm">
              <p><b>Full Name:</b> {user?.name}</p>
              <p><b>Email:</b> {user?.email}</p>
              <p><b>Phone:</b> {form.phone || "-"}</p>
              <p><b>Role:</b> {user?.role}</p>
              <p><b>Status:</b> Active</p>
            </div>
          )}

          {activeTab === "edit" && (
            <form className="max-w-md space-y-4" onSubmit={handleSaveProfile}>
              {/* Avatar edit */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-slate-300">
                      {form.name?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button type="button" variant="outline" onClick={handlePhotoClick}>
                    Change Photo
                  </Button>
                </div>
              </div>

              <Input
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />

              <Input
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />

              <Input
                name="phone"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
              />

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={!isChanged}>
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form className="max-w-md space-y-4">
              <Input type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Input type="password" placeholder="Confirm New Password" />
              <Button>Update Password</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
