import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { profileApi } from "../api/profileApi";
import { AuthContext } from "@/features/auth/AuthContext";
import toast from "react-hot-toast";
import Loader from "@/shared/components/Loader";
import Avatar from "@/shared/components/Avatar";
import {
  IconFileText,
  IconUpload,
  IconAlertCircle,
  IconCamera,
  IconX,
  IconLink,
} from "@/shared/components/icons";

const Profile = () => {
  const { token, updateUser } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    headline: "",
    bio: "",
    location: "",
    skills: [],
    links: { linkedin: "", github: "", portfolio: "" },
  });
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoadError(false);
      const res = await profileApi.getMe();
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

  const syncFormFromUser = (u) => {
    setForm({
      name: u.name || "",
      email: u.email || "",
      headline: u.headline || "",
      bio: u.bio || "",
      location: u.location || "",
      skills: u.skills || [],
      links: {
        linkedin: u.links?.linkedin || "",
        github: u.links?.github || "",
        portfolio: u.links?.portfolio || "",
      },
    });
  };

  useEffect(() => {
    if (userData) syncFormFromUser(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (key, value) => {
    setForm({ ...form, links: { ...form.links, [key]: value } });
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || form.skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }
    setForm({ ...form, skills: [...form.skills, trimmed] });
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await profileApi.update(userData.id, form);

      toast.success(res.data.message || "Profile updated");
      updateUser({ name: res.data.user?.name });
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) syncFormFromUser(userData);
  };

  const handleResumeChange = (e) => {
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
    setResumeFile(selectedFile);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Select a file first");
      return;
    }
    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);
      await profileApi.uploadResume(formData);
      toast.success("Resume uploaded");
      await fetchProfile();
      setResumeFile(null);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const res = await profileApi.uploadAvatar(formData);
      toast.success("Profile picture updated");
      updateUser({ avatar: res.data.avatar });
      await fetchProfile();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingAvatar(false);
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

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">My Profile</h1>
          <p className="page-header__subtitle">Manage your account, resume, and public profile</p>
        </div>
        <Link to={`/users/${userData.id}`} className="btn btn--secondary btn--sm">
          View public profile
        </Link>
      </div>

      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar-upload">
            <Avatar user={userData} size={72} linkToProfile={false} />
            <label className="profile-avatar-upload__btn" title="Change profile picture">
              <IconCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div>
            <div className="profile-static-row__value" style={{ fontSize: 17 }}>
              {userData.name}
            </div>
            {userData.headline && (
              <p className="text-muted" style={{ fontSize: 13.5 }}>{userData.headline}</p>
            )}
            <span className="badge badge--neutral">{userData.role}</span>
          </div>
        </div>

        <div>
          <h2 className="profile-section-title">Profile details</h2>

          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="profile-name">Name</label>
                  <input id="profile-name" className="input" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="profile-email">Email</label>
                  <input id="profile-email" className="input" name="email" value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="profile-headline">
                  Headline <span className="optional">(e.g. "Frontend Developer" or "Hiring Manager @ Acme")</span>
                </label>
                <input id="profile-headline" className="input" name="headline" value={form.headline} onChange={handleChange} maxLength={120} />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="profile-bio">Bio</label>
                <textarea id="profile-bio" className="textarea" name="bio" value={form.bio} onChange={handleChange} maxLength={600} placeholder="Tell people a bit about yourself..." />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="profile-location">Location</label>
                <input id="profile-location" className="input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bengaluru, India" />
              </div>

              <div className="form-field">
                <label className="form-label">Skills</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="e.g. React"
                  />
                  <button type="button" className="btn btn--secondary btn--sm" onClick={addSkill}>
                    Add
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {form.skills.map((skill) => (
                      <span key={skill} className="chip">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                          <IconX />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Links</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input className="input" value={form.links.linkedin} onChange={(e) => handleLinkChange("linkedin", e.target.value)} placeholder="LinkedIn URL" />
                  <input className="input" value={form.links.github} onChange={(e) => handleLinkChange("github", e.target.value)} placeholder="GitHub URL" />
                  <input className="input" value={form.links.portfolio} onChange={(e) => handleLinkChange("portfolio", e.target.value)} placeholder="Portfolio URL" />
                </div>
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
              {userData.headline && (
                <div className="profile-static-row">
                  <div>
                    <div className="profile-static-row__label">Headline</div>
                    <div className="profile-static-row__value">{userData.headline}</div>
                  </div>
                </div>
              )}
              {userData.location && (
                <div className="profile-static-row">
                  <div>
                    <div className="profile-static-row__label">Location</div>
                    <div className="profile-static-row__value">{userData.location}</div>
                  </div>
                </div>
              )}
              {userData.bio && (
                <div className="profile-static-row">
                  <div>
                    <div className="profile-static-row__label">Bio</div>
                    <div className="profile-static-row__value" style={{ fontWeight: 400 }}>{userData.bio}</div>
                  </div>
                </div>
              )}
              {userData.skills?.length > 0 && (
                <div className="profile-static-row">
                  <div style={{ width: "100%" }}>
                    <div className="profile-static-row__label">Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                      {userData.skills.map((skill) => (
                        <span key={skill} className="chip" style={{ cursor: "default" }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {(userData.links?.linkedin || userData.links?.github || userData.links?.portfolio) && (
                <div className="profile-static-row">
                  <div style={{ width: "100%" }}>
                    <div className="profile-static-row__label">Links</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                      {userData.links?.linkedin && (
                        <a href={userData.links.linkedin} target="_blank" rel="noopener noreferrer" className="profile-detail-row">
                          <IconLink /> LinkedIn
                        </a>
                      )}
                      {userData.links?.github && (
                        <a href={userData.links.github} target="_blank" rel="noopener noreferrer" className="profile-detail-row">
                          <IconLink /> GitHub
                        </a>
                      )}
                      {userData.links?.portfolio && (
                        <a href={userData.links.portfolio} target="_blank" rel="noopener noreferrer" className="profile-detail-row">
                          <IconLink /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                onChange={handleResumeChange}
                aria-label="Choose resume PDF"
              />
              <p className="form-hint mt-4">PDF only, up to 2MB</p>
            </div>
            <button
              className="btn btn--secondary btn--sm"
              onClick={handleResumeUpload}
              disabled={uploadingResume || !resumeFile}
            >
              {uploadingResume ? "Uploading..." : "Upload"}
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
