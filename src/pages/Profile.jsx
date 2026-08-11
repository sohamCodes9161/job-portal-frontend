import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import {
  IconFileText,
  IconUpload,
  IconAlertCircle,
} from "../components/icons";

const Profile = () => {
  const { token } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [file, setFile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoadError(false);
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.user);
    } catch {
      setLoadError(true);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await API.put(`/users/${userData.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Profile updated");
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: userData.name,
      email: userData.email,
    });
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a file first");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", file);

      await API.post("/users/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Resume uploaded");
      await fetchProfile();
      setFile(null);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader label="Loading profile..." />;

  if (loadError || !userData) {
    return (
      <div className="profile-page">
        <div className="alert alert--error">
          <IconAlertCircle />
          <span>We couldn't load your profile. Please refresh the page.</span>
        </div>
      </div>
    );
  }

  const initials = userData.name
    ? userData.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">My Profile</h1>
          <p className="page-header__subtitle">Manage your account details and resume</p>
        </div>
      </div>

      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar" aria-hidden="true">{initials}</div>
          <div>
            <div className="profile-static-row__value" style={{ fontSize: 17 }}>
              {userData.name}
            </div>
            <span className="badge badge--neutral">{userData.role}</span>
          </div>
        </div>

        <div>
          <h2 className="profile-section-title">Account details</h2>

          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-field">
                <label className="form-label" htmlFor="profile-name">Name</label>
                <input
                  id="profile-name"
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  className="input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="profile-static-row">
                <div>
                  <div className="profile-static-row__label">Name</div>
                  <div className="profile-static-row__value">{userData.name}</div>
                </div>
              </div>
              <div className="profile-static-row">
                <div>
                  <div className="profile-static-row__label">Email</div>
                  <div className="profile-static-row__value">{userData.email}</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <h2 className="profile-section-title">Resume</h2>

          {userData?.resume?.url ? (
            <div className="resume-preview mb-4">
              <IconFileText />
              <div className="resume-preview__info">
                <div className="resume-preview__name">Resume on file</div>
              </div>
              <a
                href={`https://docs.google.com/gview?url=${userData.resume.url}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary btn--sm"
              >
                View
              </a>
            </div>
          ) : (
            <p className="text-muted mb-4">No resume uploaded yet.</p>
          )}

          <div className="file-drop">
            <IconUpload />
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                aria-label="Choose resume PDF"
              />
              <p className="form-hint mt-4">PDF only, up to 2MB</p>
            </div>
            <button
              className="btn btn--secondary btn--sm"
              onClick={handleUpload}
              disabled={uploading || !file}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn btn--primary" onClick={() => setIsEditing(true)}>
              Edit profile
            </button>
          ) : (
            <>
              <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button className="btn btn--secondary" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
