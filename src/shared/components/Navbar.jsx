import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/features/auth/AuthContext";
import { useTheme } from "@/shared/theme/ThemeContext";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import Avatar from "./Avatar";
import {
  IconBriefcase,
  IconUser,
  IconLayoutDashboard,
  IconLogOut,
  IconMenu,
  IconX,
  IconSun,
  IconMoon,
  IconMessageSquare,
} from "./icons";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `navbar__link${isActive ? " navbar__link--active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <span className="navbar__brand-mark">
            <IconBriefcase width={16} height={16} />
          </span>
          JobPortal
        </Link>

        {/* Desktop links */}
        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>
            Jobs
          </NavLink>

          {user && user.role !== "admin" && (
            <>
              <NavLink to="/applications" className={linkClass}>
                Applications
              </NavLink>
              <NavLink to="/messages" className={linkClass}>
                Messages
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <span className="navbar__divider" aria-hidden="true" />
              <NavLink to="/admin" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/jobs" className={linkClass}>
                Manage Jobs
              </NavLink>
              <NavLink to="/admin/jobs/create" className={linkClass}>
                Post a Job
              </NavLink>
              <NavLink to="/admin/messages" className={linkClass}>
                Messages
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="btn btn--ghost btn--icon navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>

          {user && <NotificationBell />}

          {!user ? (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">
                Login
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="navbar__user" title="Go to profile">
                <Avatar user={user} size={28} linkToProfile={false} />
                <span className="navbar__username">{user.name}</span>
              </Link>
              <button
                className="btn btn--ghost btn--sm"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <IconLogOut />
                <span className="sr-only">Logout</span>
              </button>
            </>
          )}

          <button
            className="navbar__toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`navbar__mobile-panel${mobileOpen ? " is-open" : ""}`}>
        <NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>
          Jobs
        </NavLink>

        {user && user.role !== "admin" && (
          <>
            <NavLink to="/applications" className={linkClass} onClick={() => setMobileOpen(false)}>
              Applications
            </NavLink>
            <NavLink to="/messages" className={linkClass} onClick={() => setMobileOpen(false)}>
              <IconMessageSquare /> Messages
            </NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
              <IconUser /> Profile
            </NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <NavLink to="/admin" end className={linkClass} onClick={() => setMobileOpen(false)}>
              <IconLayoutDashboard /> Dashboard
            </NavLink>
            <NavLink to="/admin/jobs" className={linkClass} onClick={() => setMobileOpen(false)}>
              Manage Jobs
            </NavLink>
            <NavLink to="/admin/jobs/create" className={linkClass} onClick={() => setMobileOpen(false)}>
              Post a Job
            </NavLink>
            <NavLink to="/admin/messages" className={linkClass} onClick={() => setMobileOpen(false)}>
              <IconMessageSquare /> Messages
            </NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
              <IconUser /> Profile
            </NavLink>
          </>
        )}

        {!user ? (
          <div style={{ display: "flex", gap: 8, padding: "10px 14px" }}>
            <Link to="/login" className="btn btn--secondary btn--sm btn--block" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="btn btn--primary btn--sm btn--block" onClick={() => setMobileOpen(false)}>
              Register
            </Link>
          </div>
        ) : (
          <button className="btn btn--ghost btn--sm" style={{ margin: "6px 14px" }} onClick={handleLogout}>
            <IconLogOut /> Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
