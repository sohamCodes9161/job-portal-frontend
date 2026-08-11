import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { profileApi } from "../api/profileApi";
import Loader from "@/shared/components/Loader";
import Avatar from "@/shared/components/Avatar";
import EmptyState from "@/shared/components/EmptyState";
import {
  IconMapPin,
  IconCalendar,
  IconLink,
  IconAlertCircle,
} from "@/shared/components/icons";

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await profileApi.getPublicProfile(id);
        setUser(res.data.user);
      } catch (err) {
        setError("This profile couldn't be found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader label="Loading profile..." />;

  if (error || !user) {
    return (
      <div className="profile-page">
        <EmptyState
          icon={<IconAlertCircle />}
          title="Profile not found"
          description={error || "This user may no longer exist."}
        />
      </div>
    );
  }

  const links = [
    { key: "linkedin", label: "LinkedIn", value: user.links?.linkedin },
    { key: "github", label: "GitHub", value: user.links?.github },
    { key: "portfolio", label: "Portfolio", value: user.links?.portfolio },
  ].filter((l) => l.value);

  return (
    <div className="profile-page">
      <div className="card profile-card">
        <div className="profile-header">
          <Avatar user={user} size={64} linkToProfile={false} />
          <div>
            <div className="profile-static-row__value" style={{ fontSize: 18 }}>
              {user.name}
            </div>
            {user.headline && <p className="text-muted" style={{ fontSize: 13.5 }}>{user.headline}</p>}
            <span className="badge badge--neutral" style={{ marginTop: 6 }}>
              {user.role === "admin" ? "Recruiter" : "Job Seeker"}
            </span>
          </div>
        </div>

        {user.bio && (
          <div>
            <h2 className="profile-section-title">About</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              {user.bio}
            </p>
          </div>
        )}

        {user.skills?.length > 0 && (
          <div>
            <h2 className="profile-section-title">Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {user.skills.map((skill) => (
                <span key={skill} className="chip" style={{ cursor: "default" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="profile-section-title">Details</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {user.location && (
              <div className="profile-detail-row">
                <IconMapPin width={16} height={16} />
                <span>{user.location}</span>
              </div>
            )}
            <div className="profile-detail-row">
              <IconCalendar width={16} height={16} />
              <span>Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
            </div>
            {links.map((l) => (
              <div className="profile-detail-row" key={l.key}>
                <IconLink />
                <a href={l.value} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
