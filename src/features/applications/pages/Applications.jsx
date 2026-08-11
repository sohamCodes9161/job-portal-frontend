import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applicationsApi } from "../api/applicationsApi";
import ApplicationSkeleton from "../components/ApplicationSkeleton";
import EmptyState from "@/shared/components/EmptyState";
import Avatar from "@/shared/components/Avatar";
import { IconAlertCircle, IconInbox } from "@/shared/components/icons";

const FILTERS = ["all", "pending", "reviewed", "accepted", "rejected"];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await applicationsApi.getMine();
        setApplications(res.data.applications || []);
      } catch (err) {
        setError("We couldn't load your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">My Applications</h1>
          <p className="page-header__subtitle">
            Track the status of every job you've applied to
          </p>
        </div>
      </div>

      <div className="filter-bar" role="tablist" aria-label="Filter applications by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            role="tab"
            aria-selected={filter === f}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert--error mb-4">
          <IconAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="applications-list">
        {loading ? (
          [...Array(4)].map((_, i) => <ApplicationSkeleton key={i} />)
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            icon={<IconInbox />}
            title="No applications here"
            description={
              filter === "all"
                ? "You haven't applied to any jobs yet. Start browsing to find your next role."
                : `You have no applications with status "${filter}".`
            }
            action={
              filter === "all" && (
                <Link to="/" className="btn btn--primary btn--sm">
                  Browse jobs
                </Link>
              )
            }
          />
        ) : (
          filteredApplications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-card__info application-card__info--with-avatar">
                {app.job?.createdBy?.name ? (
                  <Avatar user={app.job.createdBy} size={40} />
                ) : null}
                <div>
                  <h3>{app.job?.title}</h3>
                  <p>{app.job?.company}</p>
                </div>
              </div>

              <div className="application-card__meta">
                <span className={`badge badge--${app.status}`}>{app.status}</span>
                <span className="application-card__date">
                  Applied {new Date(app.createdAt).toLocaleDateString()}
                </span>
                <Link to={`/jobs/${app.job?._id}`} className="btn btn--secondary btn--sm">
                  View job
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;
