import { Link } from "react-router-dom";

const getInitials = (name) =>
  name
    ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

/**
 * user: { _id, name, avatar: { url } }
 * linkToProfile: set to false when this Avatar sits inside another <Link>
 * (e.g. a job card or inbox row) to avoid invalid nested <a> tags.
 */
const Avatar = ({ user, size = 36, linkToProfile = true, style = {} }) => {
  const initials = getInitials(user?.name);
  const dimension = { width: size, height: size, fontSize: Math.round(size * 0.4), ...style };

  const content = user?.avatar?.url ? (
    <img src={user.avatar.url} alt={user?.name || "User"} className="avatar-img" style={dimension} />
  ) : (
    <span className="avatar-fallback" style={dimension} aria-hidden="true">
      {initials}
    </span>
  );

  if (linkToProfile && user?._id) {
    return (
      <Link
        to={`/users/${user._id}`}
        className="avatar-link"
        aria-label={`View ${user.name || "user"}'s profile`}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Avatar;
